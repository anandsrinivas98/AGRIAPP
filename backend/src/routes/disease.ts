import { Router } from 'express';
import { auth } from '../middleware/auth';
import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const router = Router();

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeName = `${crypto.randomUUID()}${ext}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if (allowedMimes.includes(file.mimetype) && allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, and WebP images are allowed.'));
    }
  },
});

/**
 * @swagger
 * /api/detect/disease:
 *   post:
 *     summary: Detect plant disease from image
 *     tags: [Disease Detection]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               cropType:
 *                 type: string
 *     responses:
 *       200:
 *         description: Disease detection result
 */
router.post('/disease', auth, upload.single('image'), async (req, res): Promise<void> => {
  try {
    const { cropType } = req.body;
    const imagePath = req.file?.path;
    
    if (!imagePath) {
      res.status(400).json({ success: false, message: 'Image is required' });
      return;
    }
    
    // Mock disease detection
    const mockDiseases = [
      { name: 'Leaf Blight', severity: 'MEDIUM', confidence: 0.82 },
      { name: 'Powdery Mildew', severity: 'LOW', confidence: 0.65 },
      { name: 'Healthy', severity: 'NONE', confidence: 0.91 }
    ];
    
    const detectedDisease = mockDiseases[Math.floor(Math.random() * mockDiseases.length)];
    
    res.json({
      success: true,
      data: {
        diseaseName: detectedDisease.name,
        severity: detectedDisease.severity,
        confidence: detectedDisease.confidence,
        treatment: {
          immediate: ['Remove affected leaves', 'Improve air circulation'],
          preventive: ['Regular monitoring', 'Proper spacing'],
          chemical: detectedDisease.severity !== 'NONE' ? ['Fungicide application'] : []
        },
        imagePath
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;