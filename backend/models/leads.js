import mongoose from "mongoose";

const LeadsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["abroad", "admission"],
      required: true,
    },

    // Abroad fields
    university: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "abroad";
      },
    },

    country: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "abroad";
      },
    },

    // Admission fields
    college: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "admission";
      },
    },

    state: {
      type: String,
      trim: true,
      required: function () {
        return this.type === "admission";
      },
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional but useful in real world
    status: {
      type: String,
      enum: ["new", "contacted", "converted", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true, // adds createdAt + updatedAt 🔥
  }
);


// ✅ COMPOUND UNIQUE INDEX (BEST PRACTICE)
LeadsSchema.index({ email: 1, phone: 1 }, { unique: true });


// Optional: prevent model overwrite in dev (nodemon issue)
const LeadsModel =
  mongoose.models.leads || mongoose.model("leads", LeadsSchema);

export default LeadsModel;