import { Router } from 'express';
import { auth } from '../middleware/auth';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

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