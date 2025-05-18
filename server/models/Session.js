// server/models/Session.js
import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Mentor
    required: true,
  },
  menteeName: String,
  date: { type: Date, required: true },
  duration: { type: Number, required: true }, // in minutes or hours
  topic: String,
  notes: String,
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", sessionSchema);
