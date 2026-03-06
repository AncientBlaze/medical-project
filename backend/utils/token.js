import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/constants.js';

export const generateToken = (user) =>
  jwt.sign(
    { id: user._id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    console.error('Invalid token', err);
    return null;
  }
};

export const extractToken = (authHeader) => {
  return authHeader?.split(' ')[1] || null;
};
