import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';
import User from '../models/User.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Not authorized' });

    req.admin = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token', error: err });
  }
};
