import express from 'express';
import bcryptjs from 'bcryptjs';
import axios from 'axios';

import User from '../models/User.js';

const router = express.Router();

// ── normaliseMobile (same logic as auth.js) ───────────────────────────────────

const normaliseMobile = (phone) => {
  const digits = phone.replace(/\D/g, '');
  return digits.length === 10 ? `91${digits}` : digits;
};

// ── MSG91 helpers ─────────────────────────────────────────────────────────────

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

// ── POST /auth/forgot-password ────────────────────────────────────────────────
// Body: { phone }
// Finds the user by phone and sends an OTP via MSG91

router.post('/forgot-password', async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone)
      return res.status(400).json({ message: 'Phone is required' });

    const mobile = normaliseMobile(phone);

    if (!/^\d{10,15}$/.test(mobile))
      return res.status(400).json({ message: 'Invalid phone format' });

    const user = await User.findOne({ phone: { $regex: mobile.slice(-10) } });

    // Don't reveal whether the number exists
    if (!user)
      return res.status(200).json({ message: 'If that number is registered, an OTP has been sent.' });

    // 30-second cooldown (same as /send-otp)
    if (user.otpSentAt && Date.now() - user.otpSentAt < 30 * 1000)
      return res.status(429).json({ message: 'Wait before requesting another OTP' });

    const { data } = await sendOTPviaMSG91(mobile);

    if (data.type !== 'success')
      return res.status(502).json({ message: 'Failed to send OTP', detail: data });

    user.otpSentAt = Date.now();
    await user.save();

    return res.status(200).json({ message: 'If that number is registered, an OTP has been sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ── POST /auth/reset-password ─────────────────────────────────────────────────
// Body: { phone, otp, newPassword }
// Verifies OTP via MSG91 then updates the user's password

router.post('/reset-password', async (req, res) => {
  try {
    const { phone, otp, newPassword } = req.body;

    if (!phone || !otp || !newPassword)
      return res.status(400).json({ message: 'Phone, OTP, and new password are required' });

    if (newPassword.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters' });

    const mobile = normaliseMobile(phone);

    // Verify OTP with MSG91
    const { data } = await verifyOTPviaMSG91(mobile, otp);

    if (data.type !== 'success')
      return res.status(400).json({ message: 'Invalid or expired OTP', detail: data });

    const user = await User.findOne({ phone: { $regex: mobile.slice(-10) } });

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Hash and save new password
    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: 'Password reset successful. You can now log in.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;