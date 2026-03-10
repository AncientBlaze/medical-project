import express from 'express';
import bcryptjs from 'bcryptjs';
import { requireAdmin } from '../middleware/auth.js';
import Prediction from '../models/Prediction.js';

const router = express.Router();

router.get('/predictions', requireAdmin, async (req, res) => {
  try {
    const predictions = await Prediction.find()
      .populate('user', 'name email phone')
      .select('user category rank quota state course phone matchedColleges createdAt')
      .sort({ createdAt: -1 });
    res.json({ 
      count: predictions.length, 
      predictions: predictions.map(p => ({
        _id: p._id,
        user: p.user,
        category: p.category,
        rank: p.rank,
        quota: p.quota,
        state: p.state,
        course: p.course,
        phone: p.phone,
        matchedColleges: p.matchedColleges,
        createdAt: p.createdAt
      }))
    });
  } catch (err) {
    console.error('Admin predictions error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/change-password', requireAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords required' });
    }

    const admin = req.admin;
    const valid = await bcryptjs.compare(currentPassword, admin.password);
    if (!valid) return res.status(401).json({ message: 'Current password incorrect' });

    const hashed = await bcryptjs.hash(newPassword, 10);
    admin.password = hashed;
    await admin.save();
    res.json({ message: 'Password updated' });
  } catch (err) {
    console.error('Change password error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
