import mongoose from "mongoose";

const UserLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
  action: String,
  ip: String,
  device: String,
  at: Date,
  location: {
    city: String,
    region: String,
    country: String,
    lat: Number,
    lon: Number,
  }
});

export default mongoose.model("UserLog", UserLogSchema);
