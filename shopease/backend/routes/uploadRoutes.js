import express from 'express';
import upload from '../utils/upload.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @desc    Upload a product image
 * @route   POST /api/upload
 * @access  Private/Admin
 */
router.post('/', protect, admin, (req, res) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file' });
    }

    res.json({
      imageUrl: `/uploads/${req.file.filename}`,
    });
  });
});

export default router;
