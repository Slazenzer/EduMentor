import Availability from "../models/Availability.js";

// POST /api/mentor/availability
export const setAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const { date, timeSlots } = req.body;

    if (!date || !timeSlots || !Array.isArray(timeSlots) || timeSlots.length === 0) {
      return res.status(400).json({ message: "Date and time slots are required" });
    }

    // Check if availability for this mentor & date exists
    let availability = await Availability.findOne({ mentor: mentorId, date: new Date(date) });

    if (availability) {
      // Update timeSlots if exists
      availability.timeSlots = timeSlots;
    } else {
      // Create new availability
      availability = new Availability({
        mentor: mentorId,
        date: new Date(date),
        timeSlots,
      });
    }

    await availability.save();
    res.json({ message: "Availability set successfully", availability });
  } catch (error) {
    console.error("Set availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/mentor/availability
export const getAvailability = async (req, res) => {
  try {
    const mentorId = req.user.id;
    const availabilities = await Availability.find({ mentor: mentorId }).sort({ date: 1 });

    res.json(availabilities);
  } catch (error) {
    console.error("Get availability error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
