import mongoose from "mongoose";

const { Schema } = mongoose;

const CrimeSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "Robbery",
        "Murder",
        "Theft",
        "Assault",
        "Fraud",
        "Cybercrime",
        "Drug Trafficking",
        "Other",
      ],
      index: true,
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },

    location: {
      city: { type: String, required: true, index: true },
      state: { type: String, required: true, index: true },
    },

    description: { type: String, default: "" },

    status: {
      type: String,
      enum: ["Pending", "Investigating", "Solved", "Closed"],
      default: "Pending",
      index: true,
    },
  },
  {
    timestamps: true, // ✅ replaces createdAt
    collection: "crimes",
  }
);

// 🔥 Indexes for performance
CrimeSchema.index({ type: 1, date: -1 });
CrimeSchema.index({ "location.city": 1, date: -1 });

export default mongoose.model("Crime", CrimeSchema);