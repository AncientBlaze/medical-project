import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category: { type: String, required: true },
  rank: { type: Number, required: true },
  quota: { type: String, enum: ['allIndia', 'state'], default: 'allIndia' },
  state: { type: String, default: '' },
  course: { type: String, default: '' },
  phone: { type: String, default: '' },
  matchedColleges: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
