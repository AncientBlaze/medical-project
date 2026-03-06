import express from 'express';
import bcryptjs from 'bcryptjs';
import { generateToken, extractToken, verifyToken } from '../utils/token.js';
import User from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcryptjs.hash(password, 10);
    const newUser = new User({ name, email, password: hashed, phone: phone || '' });
    await newUser.save();

    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        isAdmin: newUser.isAdmin
      }
    });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

router.get('/verify', async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = verifyToken(token);
    if (!decoded) return res.status(401).json({ message: 'Invalid token' });
    
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin
      }
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token', error: err });
  }
});

export default router;
