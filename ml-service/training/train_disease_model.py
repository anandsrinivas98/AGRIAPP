"""
train_disease_model.py
----------------------
Fine-tunes EfficientNet-B0 on the PlantVillage 38-class dataset and saves the
resulting state-dict to disk.

Usage:
    python train_disease_model.py \\
        --data-path /path/to/PlantVillage \\
        [--epochs 15] \\
        [--batch-size 32] \\
        [--output-path ml-service/models/disease_model.pth]

Requirements: 2.1, 2.2, 2.11, 5.2, 5.3
"""

import argparse
import logging
import sys
import warnings
from pathlib import Path

import torch
import torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms

# ---------------------------------------------------------------------------
# Determinism  (Req 5.3)
# ---------------------------------------------------------------------------
torch.manual_seed(42)
torch.backends.cudnn.deterministic = True

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
IMAGENET_MEAN = [0.485, 0.456, 0.406]
IMAGENET_STD = [0.229, 0.224, 0.225]
NUM_CLASSES = 38
PHASE1_EPOCHS = 5  # classifier-only warm-up
ACCURACY_WARN_THRESHOLD = 0.80


# ---------------------------------------------------------------------------
# Transforms
# ---------------------------------------------------------------------------
def get_train_transform() -> transforms.Compose:
    """Augmented transform for the training split."""
    return transforms.Compose(
        [
            transforms.RandomResizedCrop(224),
            transforms.RandomHorizontalFlip(),
            transforms.ColorJitter(
                brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1
            ),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ]
    )


def get_val_test_transform() -> transforms.Compose:
    """Deterministic transform for the val/test splits."""
    return transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize(mean=IMAGENET_MEAN, std=IMAGENET_STD),
        ]
    )


# ---------------------------------------------------------------------------
# Dataset helpers
# ---------------------------------------------------------------------------
def build_datasets(data_path: Path):
    """
    Load an ImageFolder dataset and perform an 80/10/10 train/val/test split.

    Returns
    -------
    (train_ds, val_ds, test_ds, class_names)
    """
    # Load once with the val/test transform as the base; we'll wrap train later.
    base_ds = datasets.ImageFolder(root=str(data_path))
    class_names = base_ds.classes

    total = len(base_ds)
    train_n = int(0.80 * total)
    val_n = int(0.10 * total)
    test_n = total - train_n - val_n  # absorbs any rounding remainder

    generator = torch.Generator().manual_seed(42)
    train_ds, val_ds, test_ds = random_split(
        base_ds, [train_n, val_n, test_n], generator=generator
    )

    # Apply per-split transforms via wrapper datasets
    train_ds = _TransformSubset(train_ds, get_train_transform())
    val_ds = _TransformSubset(val_ds, get_val_test_transform())
    test_ds = _TransformSubset(test_ds, get_val_test_transform())

    return train_ds, val_ds, test_ds, class_names


class _TransformSubset(torch.utils.data.Dataset):
    """Wraps a Subset and applies a transform on the fly."""

    def __init__(self, subset, transform):
        self.subset = subset
        self.transform = transform

    def __len__(self):
        return len(self.subset)

    def __getitem__(self, idx):
        img, label = self.subset[idx]
        if self.transform:
            img = self.transform(img)
        return img, label


# ---------------------------------------------------------------------------
# Model
# ---------------------------------------------------------------------------
def build_model(device: torch.device) -> nn.Module:
    """
    Load EfficientNet-B0 with ImageNet weights, freeze all layers, then
    replace the final Linear layer with a 38-class head.
    """
    model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1)

    # Freeze all parameters  (Req 2.1 — Phase 1 trains only the new head)
    for param in model.parameters():
        param.requires_grad = False

    # Replace the classifier head  (Req 2.2)
    in_features = model.classifier[1].in_features  # 1280 for EfficientNet-B0
    model.classifier[1] = nn.Linear(in_features, NUM_CLASSES)

    model = model.to(device)
    return model


# ---------------------------------------------------------------------------
# Training loop helpers
# ---------------------------------------------------------------------------
def _run_epoch(model, loader, criterion, optimizer, device, train: bool):
    """Run one epoch; return (avg_loss, accuracy)."""
    model.train(train)
    running_loss = 0.0
    correct = 0
    total = 0

    context = torch.enable_grad() if train else torch.no_grad()
    with context:
        for inputs, labels in loader:
            inputs, labels = inputs.to(device), labels.to(device)

            if train:
                optimizer.zero_grad()

            outputs = model(inputs)
            loss = criterion(outputs, labels)

            if train:
                loss.backward()
                optimizer.step()

            running_loss += loss.item() * inputs.size(0)
            preds = outputs.argmax(dim=1)
            correct += (preds == labels).sum().item()
            total += inputs.size(0)

    avg_loss = running_loss / total if total > 0 else 0.0
    accuracy = correct / total if total > 0 else 0.0
    return avg_loss, accuracy


# ---------------------------------------------------------------------------
# Main training function
# ---------------------------------------------------------------------------
def train(
    data_path: Path,
    epochs: int,
    batch_size: int,
    output_path: Path,
) -> float:
    """
    Full two-phase fine-tuning.

    Phase 1 — classifier only, AdamW lr=1e-3, for PHASE1_EPOCHS epochs.
    Phase 2 — all layers unfrozen, AdamW lr=1e-4, for remaining epochs.

    Returns the test accuracy.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    logger.info("Using device: %s", device)

    # ------------------------------------------------------------------ data
    logger.info("Loading dataset from: %s", data_path)
    train_ds, val_ds, test_ds, class_names = build_datasets(data_path)
    logger.info(
        "Split sizes — train: %d  val: %d  test: %d  classes: %d",
        len(train_ds),
        len(val_ds),
        len(test_ds),
        len(class_names),
    )

    num_workers = 0  # 0 is safer on Windows; increase on Linux if needed
    train_loader = DataLoader(
        train_ds, batch_size=batch_size, shuffle=True, num_workers=num_workers
    )
    val_loader = DataLoader(
        val_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers
    )
    test_loader = DataLoader(
        test_ds, batch_size=batch_size, shuffle=False, num_workers=num_workers
    )

    # ----------------------------------------------------------------- model
    model = build_model(device)
    criterion = nn.CrossEntropyLoss()

    # ----------------------------------------------------------- Phase 1
    phase1_epochs = min(PHASE1_EPOCHS, epochs)
    logger.info("=== Phase 1: fine-tuning classifier only (%d epochs) ===", phase1_epochs)

    optimizer = torch.optim.AdamW(model.classifier.parameters(), lr=1e-3)

    for epoch in range(1, phase1_epochs + 1):
        train_loss, train_acc = _run_epoch(
            model, train_loader, criterion, optimizer, device, train=True
        )
        val_loss, val_acc = _run_epoch(
            model, val_loader, criterion, optimizer, device, train=False
        )
        logger.info(
            "Phase 1 | Epoch %d/%d  train_loss=%.4f  train_acc=%.4f  "
            "val_loss=%.4f  val_acc=%.4f",
            epoch,
            phase1_epochs,
            train_loss,
            train_acc,
            val_loss,
            val_acc,
        )

    # ----------------------------------------------------------- Phase 2
    remaining_epochs = epochs - phase1_epochs
    if remaining_epochs > 0:
        logger.info(
            "=== Phase 2: full fine-tuning all layers (%d epochs) ===",
            remaining_epochs,
        )
        # Unfreeze all parameters
        for param in model.parameters():
            param.requires_grad = True

        optimizer = torch.optim.AdamW(model.parameters(), lr=1e-4)

        for epoch in range(1, remaining_epochs + 1):
            train_loss, train_acc = _run_epoch(
                model, train_loader, criterion, optimizer, device, train=True
            )
            val_loss, val_acc = _run_epoch(
                model, val_loader, criterion, optimizer, device, train=False
            )
            logger.info(
                "Phase 2 | Epoch %d/%d  train_loss=%.4f  train_acc=%.4f  "
                "val_loss=%.4f  val_acc=%.4f",
                epoch,
                remaining_epochs,
                train_loss,
                train_acc,
                val_loss,
                val_acc,
            )

    # --------------------------------------------------------- Evaluate
    logger.info("=== Evaluating on test set ===")
    _, test_acc = _run_epoch(
        model, test_loader, criterion, optimizer, device, train=False
    )
    logger.info("Test accuracy: %.4f (%.2f%%)", test_acc, test_acc * 100)

    if test_acc < ACCURACY_WARN_THRESHOLD:
        warnings.warn(
            f"Test accuracy {test_acc:.4f} is below the recommended threshold of "
            f"{ACCURACY_WARN_THRESHOLD:.2f}. Consider training for more epochs or "
            "using a larger dataset.",
            UserWarning,
            stacklevel=2,
        )

    # ------------------------------------------------------------ Save
    output_path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), output_path)
    logger.info("Model state-dict saved to: %s", output_path)

    return test_acc


# ---------------------------------------------------------------------------
# CLI entry-point
# ---------------------------------------------------------------------------
def parse_args(argv=None):
    _default_output = (
        Path(__file__).resolve().parent.parent / "models" / "disease_model.pth"
    )

    parser = argparse.ArgumentParser(
        description="Fine-tune EfficientNet-B0 on PlantVillage for disease detection."
    )
    parser.add_argument(
        "--data-path",
        type=Path,
        required=True,
        help="Root directory of the PlantVillage dataset (ImageFolder structure).",
    )
    parser.add_argument(
        "--epochs",
        type=int,
        default=15,
        help="Total number of training epochs (default: 15).",
    )
    parser.add_argument(
        "--batch-size",
        type=int,
        default=32,
        help="Mini-batch size for training and evaluation (default: 32).",
    )
    parser.add_argument(
        "--output-path",
        type=Path,
        default=_default_output,
        help=f"Path to write the trained state-dict .pth file (default: {_default_output}).",
    )
    return parser.parse_args(argv)


def main(argv=None):
    args = parse_args(argv)

    if not args.data_path.exists():
        logger.error("Data path does not exist: %s", args.data_path)
        sys.exit(1)

    if args.epochs < 1:
        logger.error("--epochs must be at least 1, got %d", args.epochs)
        sys.exit(1)

    if args.batch_size < 1:
        logger.error("--batch-size must be at least 1, got %d", args.batch_size)
        sys.exit(1)

    logger.info(
        "Starting training — epochs=%d  batch_size=%d  output=%s",
        args.epochs,
        args.batch_size,
        args.output_path,
    )

    train(
        data_path=args.data_path,
        epochs=args.epochs,
        batch_size=args.batch_size,
        output_path=args.output_path,
    )


if __name__ == "__main__":
    main()
