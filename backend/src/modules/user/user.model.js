import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "officer", "analyst", "police"],
      default: "police",
    },

    mobile: String,
    rank: String,
    badgeNumber: String,
    station: String,
    department: String,
    policeId: String,
    bloodGroup: String,
    emergencyContact: String,
    address: String,
    gender: String,
    dob: Date,
    joiningDate: Date,
  },
  { timestamps: true, collection: "users" }
);

export default mongoose.model("User", UserSchema);