import express from 'express';
import bcryptjs from 'bcryptjs';
import axios from 'axios';

import { generateToken, extractToken, verifyToken } from '../utils/token.js';
import User from '../models/User.js';

const router = express.Router();

if (!process.env.MSG91_AUTH_KEY || !process.env.MSG91_TEMPLATE_ID) {
  throw new Error('MSG91 env not configured');
}

// ─── MSG91 helpers ────────────────────────────────────────────────────────────

const sendOTPviaMSG91 = (mobile) =>
  axios.post(
    'https://control.msg91.com/api/v5/otp',
    {},
    {
      params: {
        mobile,
        authkey: process.env.MSG91_AUTH_KEY,
        template_id: process.env.MSG91_TEMPLATE_ID,
      },
      headers: { 'Content-Type': 'application/json' },
    }
  );

const verifyOTPviaMSG91 = (mobile, otp) =>
  axios.get('https://control.msg91.com/api/v5/otp/verify', {
    params: { mobile, otp },
    headers: { authkey: process.env.MSG91_AUTH_KEY },
  });

const retryOTPviaMSG91 = (mobile) =>
  axios.get('https://control.msg91.com/api/v5/otp/retry', {
    params: {
      mobile,
      authkey: process.env.MSG91_AUTH_KEY,
      retrytype: 'text',
    },
  });

// ─── Normalise phone to E.164 (MSG91 wants country-code prefix, no "+") ───────

const normaliseMobile = (phone) => {
  // Strip everything except digits
  const digits = phone.replace(/\D/g, '');

  // 10 digits → assume India
  if (digits.length === 10) return `91${digits}`;

  // Already has country code
  return digits;
};

// ─── Routes ───────────────────────────────────────────────────────────────────

router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    // Require password + at least one identifier
    if ((!email && !phone) || !password)
      return res.status(400).json({ message: 'Email or phone, and password are required' });

    // Only include defined identifiers in the query
    const identifiers = [];
    if (email) identifiers.push({ email });
    if (phone) identifiers.push({ phone });

    const user = await User.findOne({ $or: identifiers });

    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: 'Invalid credentials' });

    if (!user.isVerified) {
      return res.status(403).json({ unverified: true, phone: user.phone });
    }

    const token = generateToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
        phoneVerified: user.isVerified,
      },
    });
    
    console.log(res);

  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone)
      return res.status(400).json({ message: 'All fields are required' });

    if (!/^\+\d{10,15}$/.test(phone))
      return res.status(400).json({ message: 'Invalid phone format (+91XXXXXXXXXX)' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ message: 'Email already registered' });

    const hashed = await bcryptjs.hash(password, 10);

    const newUser = new User({ name, email, password: hashed, phone });
    await newUser.save();

    res.status(201).json({
      message: 'Signup successful. Please verify your phone via OTP.',
    });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: 'Phone is required' });

    const mobile = normaliseMobile(phone);

    if (!/^\d{10,15}$/.test(mobile))
      return res.status(400).json({ message: 'Invalid phone format' });

    const user = await User.findOne({ phone: { $regex: mobile.slice(-10) } });
    if (!user)
      return res.status(404).json({ message: 'User not found. Please signup first.' });

    // ⛔ 30-second cooldown
    if (user.otpSentAt && Date.now() - user.otpSentAt < 30 * 1000)
      return res.status(429).json({ message: 'Wait before requesting another OTP' });

    // MSG91 generates & sends the OTP — no local storage needed
    const { data } = await sendOTPviaMSG91(mobile);

    if (data.type !== 'success')
      return res.status(502).json({ message: 'Failed to send OTP', detail: data });

    user.otpSentAt = Date.now();
    await user.save();

    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error('Send OTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    let { phone, otp } = req.body;

    if (!phone || !otp)
      return res.status(400).json({ message: 'Phone and OTP required' });

    const mobile = normaliseMobile(phone);

    // Ask MSG91 to verify
    const { data } = await verifyOTPviaMSG91(mobile, otp);

    if (data.type !== 'success')
      return res.status(400).json({ message: 'Invalid or expired OTP', detail: data });

    const user = await User.findOne({ phone: { $regex: mobile.slice(-10) } });
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    user.isVerified = true;
    await user.save();

    const token = generateToken(user);

    res.json({
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    console.error('Verify OTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST /auth/retry-otp
router.post('/retry-otp', async (req, res) => {
  try {
    let { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: 'Phone is required' });

    const mobile = normaliseMobile(phone);

    const { data } = await retryOTPviaMSG91(mobile);

    if (data.type !== 'success')
      return res.status(502).json({ message: 'Failed to retry OTP', detail: data });

    res.json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Retry OTP error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /auth/verify  (token check)
router.get('/verify', async (req, res) => {
  try {
    const token = extractToken(req.headers.authorization);

    if (!token)
      return res.status(401).json({ message: 'No token provided' });

    const decoded = verifyToken(token);

    if (!decoded)
      return res.status(401).json({ message: 'Invalid token' });

    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin,
      },
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

export default router;