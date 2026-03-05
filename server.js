import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';
import mongoose from 'mongoose';

const app = express();
const PORT = 5000;
const JWT_SECRET = 'your_jwt_secret_key_change_this_in_production';
const MONGO_URI = 'mongodb://localhost:27017/medical-project';

// Middleware
app.use(cors());
app.use(express.json());

// Define schemas and models BEFORE MongoDB connection
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false }
});

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true }
});

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: String, required: true },
  category: { type: String, required: true },
  rank: { type: Number, required: true },
  phone: { type: String, default: '' },          // ← add
  matchedColleges: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Prediction = mongoose.model('Prediction', predictionSchema);

// MongoDB connection
mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB');
    // ensure demo admin user exists
    const demoEmail = 'admin@example.com';
    const existing = await User.findOne({ email: demoEmail });
    if (!existing) {
      const hashed = await bcryptjs.hash('demo123', 10);
      await new User({ name: 'Admin User', email: demoEmail, password: hashed, phone: '+1 (800) 123-4567', isAdmin: true }).save();
      console.log('✅ Demo admin user created (email: admin@example.com / pass: demo123)');
    } else {
      console.log('✅ Demo admin user already exists');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// helpers
const generateToken = (user) =>
  jwt.sign({ id: user._id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d'
  });

// routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid email or password' });

    const valid = await bcryptjs.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (err) {
    console.error('Login error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/signup', async (req, res) => {
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
    res.status(201).json({ token, user: { id: newUser._id, name: newUser.name, email: newUser.email, phone: newUser.phone, isAdmin: newUser.isAdmin } });
  } catch (err) {
    console.error('Signup error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out' });
});

app.post('/api/predictions', async (req, res) => {
  try {
    let userId = null;
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, JWT_SECRET);
        userId = decoded.id;
      } catch (err) { /* invalid token, continue */ }
    }

    const { course, category, rank, phone, matchedColleges } = req.body;  // ← add phone
    if (!course || !category || rank == null)
      return res.status(400).json({ message: 'Missing prediction parameters' });

    const query = { course, category, rank };
    if (userId) query.user = userId;

    const existing = await Prediction.findOne(query);

    if (existing) {
      existing.matchedColleges = Array.isArray(matchedColleges) ? matchedColleges : [];
      existing.phone     = phone || existing.phone;   // ← update if provided
      existing.createdAt = new Date();
      await existing.save();
      return res.status(200).json({ message: 'Prediction updated' });
    }

    await new Prediction({
      user: userId,
      course,
      category,
      rank,
      phone: phone || '',                             // ← persist on create
      matchedColleges: Array.isArray(matchedColleges) ? matchedColleges : [],
    }).save();

    res.status(201).json({ message: 'Prediction saved' });
  } catch (err) {
    console.error('Saving prediction error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// helper: authenticate admin
const requireAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) return res.status(403).json({ message: 'Not authorized' });
    req.admin = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// admin endpoints
app.get('/api/admin/predictions', requireAdmin, async (req, res) => {
  try {
    const preds = await Prediction.find().populate('user', 'name email phone');  // ← add phone
    res.json({ count: preds.length, predictions: preds });
  } catch (err) {
    console.error('Admin predictions error', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// allow admin to change own password (or any admin if desired)
app.post('/api/admin/change-password', requireAdmin, async (req, res) => {
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

app.get('/api/auth/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ user: { id: user._id, name: user.name, email: user.email, phone: user.phone, isAdmin: user.isAdmin } });
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Demo admin account: admin@example.com / demo123 (login and change password)`);
});
