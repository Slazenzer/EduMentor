import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  timeSlots: [{ type: String, required: true }] // e.g. ["09:00-10:00", "14:00-15:00"]
}, {
  timestamps: true
});

const Availability = mongoose.model("Availability", availabilitySchema);
export default Availability;
