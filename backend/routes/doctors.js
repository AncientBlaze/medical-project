import express from 'express';
import multer  from 'multer';
import path    from 'path';
import fs      from 'fs';
import Doctor  from '../models/Doctor.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// ── Multer ────────────────────────────────────────────────────────────────────
const UPLOAD_DIR = '/var/www/uploads/doctors';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!fs.existsSync(UPLOAD_DIR)) {
      fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    }
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    cb(null, `doctor_${Date.now()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error('Only JPEG/PNG/WEBP allowed'));
  },
});

// ── Public ────────────────────────────────────────────────────────────────────

router.get('/', async (req, res) => {
  try {
    const doctors = await Doctor.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, doctors });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor || !doctor.isActive)
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, doctor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

router.post('/', requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    const { name, title, specialisations, about, experience, rating } = req.body;
    const photo = req.file ? `/uploads/doctors/${req.file.filename}` : null;
    const doctor = await Doctor.create({
      name, title,
      specialisations: JSON.parse(specialisations || '[]'),
      about, experience, rating, photo,
    });
    res.status(201).json({ success: true, doctor });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.put('/:id', requireAdmin, upload.single('photo'), async (req, res) => {
  try {
    const {
      name,
      title,
      specialisations,
      about,
      experience,
      rating,
      isActive
    } = req.body;

    const update = {};

    if (name !== undefined) update.name = name;
    if (title !== undefined) update.title = title;
    if (about !== undefined) update.about = about;
    if (experience !== undefined) update.experience = experience;
    if (rating !== undefined) update.rating = rating;

    if (specialisations !== undefined) {
      update.specialisations = JSON.parse(specialisations);
    }

    if (isActive !== undefined) {
      update.isActive = isActive === 'true';
    }

    if (req.file) {
      update.photo = `/uploads/doctors/${req.file.filename}`;
    }

    const doctor = await Doctor.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true }
    );

    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }

    res.json({ success: true, doctor });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    await Doctor.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Doctor deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default router;