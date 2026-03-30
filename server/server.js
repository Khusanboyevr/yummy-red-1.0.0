import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import menuRoutes from './routes/menuRoutes.js';
import jwt from 'jsonwebtoken';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Routes
app.use('/api/menu', menuRoutes);

// Simple Login Route
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ user: username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ success: true, token });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// =====================================================
// Menyu ma'lumotlarini src/data/menuData.js ga yozish
// Admin paneldagi "Loyihaga Saqlash" tugmasi ushbu
// endpoint-ni chaqiradi va fayl avtomatik yangilanadi
// =====================================================
app.post('/api/save-static-menu', (req, res) => {
  // JWT token tekshirish
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ success: false, message: 'Token kerak' });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return res.status(403).json({ success: false, message: 'Token noto\'g\'ri' });
  }

  const { menuData } = req.body;
  if (!menuData || !Array.isArray(menuData)) {
    return res.status(400).json({ success: false, message: 'menuData massiv bo\'lishi kerak' });
  }

  const fileContent = `// =====================================================
// MUHIM: Bu fayl admin panel orqali avtomatik yaratilgan.
// Oxirgi yangilanish: ${new Date().toISOString()}
// Jami taomlar soni: ${menuData.length}
// =====================================================

export const staticMenuData = ${JSON.stringify(menuData, null, 2)};
`;

  const targetPath = path.join(__dirname, '../src/data/menuData.js');

  try {
    fs.writeFileSync(targetPath, fileContent, 'utf8');
    console.log(`✅ menuData.js yangilandi: ${menuData.length} ta taom`);
    res.json({ success: true, message: `${menuData.length} ta taom muvaffaqiyatli saqlandi` });
  } catch (err) {
    console.error('menuData.js yozishda xatolik:', err);
    res.status(500).json({ success: false, message: 'Fayl yozishda xatolik: ' + err.message });
  }
});

// DB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
