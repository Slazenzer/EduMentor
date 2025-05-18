// server/models/PayoutRequest.js
import mongoose from "mongoose";

const payoutRequestSchema = new mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.PayoutRequest || mongoose.model("PayoutRequest", payoutRequestSchema);
