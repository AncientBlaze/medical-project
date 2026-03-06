import mongoose from 'mongoose';

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  course: { type: String, required: true },
  category: { type: String, required: true },
  rank: { type: Number, required: true },
  phone: { type: String, default: '' },
  matchedColleges: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

const Prediction = mongoose.model('Prediction', predictionSchema);

export default Prediction;
