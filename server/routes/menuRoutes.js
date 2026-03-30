import express from 'express';
import MenuItem from '../models/MenuItem.js';
import multer from 'multer';
import path from 'path';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await MenuItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new item
router.post('/', authMiddleware, upload.single('imageFile'), async (req, res) => {
  const { name, price, category, imageUrl, variants } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : imageUrl;

  let parsedVariants = [];
  if (variants) {
    try {
      parsedVariants = typeof variants === 'string' ? JSON.parse(variants) : variants;
    } catch (e) {
      console.error('Variants parsing error:', e);
    }
  }

  const item = new MenuItem({
    name,
    price,
    category,
    image,
    variants: parsedVariants
  });

  try {
    const newItem = await item.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('SAVE ERROR:', err.message, err.errors);
    res.status(400).json({ message: err.message, errors: err.errors });
  }
});

// PUT update item
router.put('/:id', authMiddleware, upload.single('imageFile'), async (req, res) => {
  try {
    const { name, price, category, imageUrl, variants } = req.body;
    const updateData = { name, price, category };
    
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    } else if (imageUrl) {
      updateData.image = imageUrl;
    }

    if (variants) {
      try {
        updateData.variants = typeof variants === 'string' ? JSON.parse(variants) : variants;
      } catch (e) {
        console.error('Variants parsing error:', e);
      }
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE item
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await MenuItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
