// server/controllers/adminPayoutController.js
import PayoutRequest from "../models/PayoutRequest.js";

export const getAllPayoutRequests = async (req, res) => {
  try {
    const requests = await PayoutRequest.find()
      .populate("mentor", "name email") // fetch mentor name/email if needed
      .sort({ requestDate: -1 });

    res.json(requests);
  } catch (error) {
    console.error("Error fetching payout requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePayoutRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const request = await PayoutRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: "Payout request not found" });
    }

    request.status = status;
    await request.save();

    res.json({ message: `Payout request ${status} successfully`, request });
  } catch (error) {
    console.error("Error updating payout request:", error);
    res.status(500).json({ message: "Server error" });
  }
};
