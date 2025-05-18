// server/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "mentor"], default: "mentor" },
  profileImage: { type: String },
  bio: { type: String },
  phone: { type: String },
});

// ✅ Fix: Use existing model if already compiled
export default mongoose.models.User || mongoose.model("User", userSchema);
