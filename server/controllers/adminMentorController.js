import User from "../models/user.js";

export const getAllMentors = async (req, res) => {
  try {
    const mentors = await User.find({ role: "mentor" }).select("-password");

    res.status(200).json(mentors);
  } catch (error) {
    console.error("Get mentors error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
