import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';
import Prediction from '../models/Prediction.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        return res.status(401).json({ message: 'Invalid token', error: err.message });
      }
    }

    const { course, category, rank, phone, matchedColleges } = req.body;
    if (!course || !category || rank == null)
      return res.status(400).json({ message: 'Missing prediction parameters' });

    const query = { course, category, rank };
    if (userId) query.user = userId;

    const existing = await Prediction.findOne(query);

    if (existing) {
      existing.matchedColleges = Array.isArray(matchedColleges) ? matchedColleges : [];
      existing.phone = phone || existing.phone;
      existing.createdAt = new Date();
      await existing.save();
      return res.status(200).json({ message: 'Prediction updated' });
    }

    await new Prediction({
      user: userId,
      course,
      category,
      rank,
      phone: phone || '',
      matchedColleges: Array.isArray(matchedColleges) ? matchedColleges : []
    }).save();

    res.status(201).json({ message: 'Prediction saved' });
  } catch (err) {
    console.error('Saving prediction error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
