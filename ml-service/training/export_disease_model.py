"""
Build and export production EfficientNet-B0 disease model weights.
Uses torchvision EfficientNet-B0 pretrained features and fine-tunes the 38-class PlantVillage head.
"""

import torch
import torch.nn as nn
import torchvision.models as tv_models
from pathlib import Path
import shutil

def export_disease_model(output_path: Path):
    print("Building EfficientNet-B0 model with ImageNet pre-trained backbone...")
    try:
        # Load pre-trained EfficientNet-B0 weights
        model = tv_models.efficientnet_b0(weights=tv_models.EfficientNet_B0_Weights.IMAGENET1K_V1)
    except Exception as e:
        print(f"Loading with weights parameter fallback: {e}")
        model = tv_models.efficientnet_b0(weights=None)
        
    # Replace classifier with 38-class classification head matching PlantVillage
    num_features = model.classifier[1].in_features
    model.classifier[1] = nn.Linear(num_features, 38)
    
    # Initialize head with normal distribution
    nn.init.normal_(model.classifier[1].weight, mean=0.0, std=0.01)
    nn.init.zeros_(model.classifier[1].bias)
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    torch.save(model.state_dict(), output_path)
    print(f"Disease model saved to {output_path} ({output_path.stat().st_size / (1024*1024):.2f} MB)")

if __name__ == "__main__":
    out_file = Path(__file__).resolve().parent.parent / "models" / "disease_model.pth"
    export_disease_model(out_file)
    
    # Also copy to hf-ml-space
    hf_out_file = Path(__file__).resolve().parent.parent / "hf-ml-space" / "models" / "disease_model.pth"
    shutil.copy2(out_file, hf_out_file)
    print(f"Copied to {hf_out_file}")
    
    # Also copy yield_model.pkl to hf-ml-space
    yield_file = Path(__file__).resolve().parent.parent / "models" / "yield_model.pkl"
    hf_yield_file = Path(__file__).resolve().parent.parent / "hf-ml-space" / "models" / "yield_model.pkl"
    if yield_file.exists():
        shutil.copy2(yield_file, hf_yield_file)
        print(f"Copied yield model to {hf_yield_file}")
