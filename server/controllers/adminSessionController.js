// controllers/adminSessionController.js
import generateReceiptPDF from "../utils/generateReceiptPDF.js";

import Session from "../models/Session.js";

export const createSession = async (req, res) => {
  try {
    const { mentorId, menteeName, date, duration, topic, notes } = req.body;

    if (!mentorId || !date || !duration) {
      return res.status(400).json({ message: "Mentor ID, date, and duration are required" });
    }

    const session = new Session({
      mentor: mentorId,
      menteeName,
      date: new Date(date),
      duration,
      topic,
      notes,
      status: "pending",
    });

    await session.save();

    res.status(201).json({ message: "Session created successfully", session });
  } catch (error) {
    console.error("Create session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find().populate("mentor", "name email");
    res.json({sessions});
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateSessionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const session = await Session.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ message: "Session updated", session });
  } catch (error) {
    console.error("Update session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const deleteSession = async (req, res) => {
  try {
    const sessionId = req.params.id;
    const deleted = await Session.findByIdAndDelete(sessionId);

    if (!deleted) {
      return res.status(404).json({ message: "Session not found" });
    }


    res.json({ message: "Session deleted successfully" });
  } catch (error) {
    console.error("Delete session error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const generateReceipt = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("mentor", "name");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    if (session.status !== "completed") {
      return res.status(400).json({ message: "Only completed sessions can have receipts" });
    }

    const pdfBuffer = await generateReceiptPDF(session);

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="Receipt-${session._id}.pdf"`,
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error("Generate receipt error:", error);
    res.status(500).json({ message: "Server error generating receipt" });
  }
};