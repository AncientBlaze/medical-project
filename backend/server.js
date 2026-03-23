import express from 'express';
import cors from 'cors';
import { connectDB } from './config/database.js';
import { PORT } from './config/constants.js';
import authRoutes from './routes/auth.js';
import predictionsRoutes from './routes/predictions.js';
import adminRoutes from './routes/admin.js';
import doctorsRoutes from './routes/doctors.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
await connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
  console.log(`Demo admin account: admin@example.com / demo123 (login and change password)`);
});
