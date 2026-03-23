import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    title: { type: String, required: true },        // e.g. "MBBS, MD"
    specialisations: [{ type: String }],                    // array of tags
    about: { type: String, required: true },
    photo: { type: String, default: null },
    experience: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Doctor', doctorSchema);