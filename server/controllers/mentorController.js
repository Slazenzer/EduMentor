import User from "../models/user.js";
import PayoutRequest from "../models/PayoutRequest.js";
import Session from "../models/Session.js";

// GET /mentor/profile
export const getProfile = async (req, res) => {
  try {
    const mentor = await User.findById(req.user.id).select("-password");
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const { _id, name, email, role, bio, profileImage } = mentor;
    res.json({ _id, name, email, role, bio, profileImage });
  } catch (error) {
    console.error("Get mentor profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Accept a session request
export const acceptSessionRequest = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "pending") {
      return res.status(400).json({ message: "Session request is not pending" });
    }

    session.status = "accepted";
    await session.save();

    res.json({ message: "Session request accepted", session });
  } catch (error) {
    console.error("Accept session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject a session request
export const rejectSessionRequest = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const session = await Session.findById(sessionId);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "pending") {
      return res.status(400).json({ message: "Session request is not pending" });
    }

    session.status = "rejected";
    await session.save();

    res.json({ message: "Session request rejected", session });
  } catch (error) {
    console.error("Reject session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// PUT /mentor/profile
// mentorController.js
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user.id is set from your auth middleware

    const updateData = {
      name: req.body.name,
      bio: req.body.bio,
    };

    if (req.file) {
      updateData.profileImage = "/" + req.file.path.replace(/\\/g, "/"); // replace backslashes on Windows
    }

    // Update only if user role is mentor
    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, role: "mentor" },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error in updateProfile:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const createPayoutRequest = async (req, res) => {
  try {
    const mentorId = req.user._id;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }

    const newRequest = new PayoutRequest({
      mentor: mentorId,
      amount,
    });

    await newRequest.save();
    res.status(201).json({ message: "Payout request submitted", request: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getMentorPayoutHistory = async (req, res) => {
  try {
    const mentorId = req.user._id;

    const payoutRequests = await PayoutRequest.find({ mentor: mentorId }).sort({ requestDate: -1 });

    res.json({ history: payoutRequests });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
