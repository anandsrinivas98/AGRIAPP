"""
Image processing utilities for disease detection
"""

import numpy as np
from PIL import Image
import io
import logging

logger = logging.getLogger(__name__)


class ImageProcessor:
    """Handles image preprocessing for ML models"""
    
    def __init__(self, target_size=(224, 224)):
        """
        Initialize image processor
        
        Args:
            target_size: Target size for image resizing
        """
        self.target_size = target_size
        logger.info(f"ImageProcessor initialized with target size: {target_size}")
    
    async def process_image(self, image_data: bytes) -> np.ndarray:
        """
        Process image data for model input
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            Processed image as numpy array
        """
        try:
            # Open image
            image = Image.open(io.BytesIO(image_data))
            
            # Convert to RGB if necessary
            if image.mode != 'RGB':
                image = image.convert('RGB')
            
            # Resize
            image = image.resize(self.target_size)
            
            # Convert to numpy array
            img_array = np.array(image)
            
            # Normalize
            img_array = img_array / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            return img_array
            
        except Exception as e:
            logger.error(f"Error processing image: {str(e)}")
            raise
    
    def validate_image(self, image_data: bytes) -> bool:
        """
        Validate if the data is a valid image
        
        Args:
            image_data: Raw image bytes
            
        Returns:
            True if valid, False otherwise
        """
        try:
            Image.open(io.BytesIO(image_data))
            return True
        except Exception:
            return False
