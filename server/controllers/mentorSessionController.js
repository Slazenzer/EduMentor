// controllers/mentorSessionController.js
import Session from "../models/Session.js";


// GET /api/mentor/sessions
export const getMentorSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ mentor: req.user.id }).sort({ date: -1 });
    res.json(sessions);
  } catch (err) {
    console.error("Error fetching sessions:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /api/mentor/sessions/:id/complete
export const completeSession = async (req, res) => {
  try {
    const session = await Session.findOne({ _id: req.params.id, mentor: req.user.id });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    session.status = "completed";
    await session.save();

    res.json({ message: "Session marked as completed", session });
  } catch (err) {
    console.error("Error completing session:", err);
    res.status(500).json({ message: "Server error" });
  }
};
