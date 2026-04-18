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
      enum: ["abroad", "admission", "prediction"],
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

    // Prediction fields
    rank: {
      type: Number,
      required: function () {
        return this.type === "prediction";
      },
    },

    category: {
      type: String,
      enum: ["General", "OBC", "OBC-NCL", "SC", "ST", "EWS", null],
      required: function () {
        return this.type === "prediction";
      },
    },

    quota: {
      type: String,
      enum: ["allIndia", "state", null],
    },

    matchedColleges: {
      type: [String],
      default: undefined, // avoids storing empty [] on non-prediction leads
    },

    source: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "converted", "rejected"],
      default: "new",
    },
  },
  {
    timestamps: true,
  }
);

LeadsSchema.index({ email: 1, phone: 1, type: 1 }, { unique: true });

const LeadsModel =
  mongoose.models.leads || mongoose.model("leads", LeadsSchema);

export default LeadsModel;