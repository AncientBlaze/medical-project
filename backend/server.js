import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import path from 'path';
import { connectDB } from './config/database.js';
import { PORT } from './config/constants.js';
import authRoutes from './routes/auth.js';
import predictionsRoutes from './routes/predictions.js';
import adminRoutes from './routes/admin.js';
import doctorsRoutes from './routes/doctors.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.resolve('uploads')));

await connectDB();


// Routes
// app.use('/api/leads', )

app.use('/api/auth', authRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/doctors', doctorsRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});