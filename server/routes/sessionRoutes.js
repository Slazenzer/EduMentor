// backend/routes/sessionRoutes.js
import express from 'express';
import Session from '../models/Session.js';

const router = express.Router();

// POST: Add a session
router.post('/add', async (req, res) => {
  try {
    const session = new Session(req.body);
    await session.save();
    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: List all sessions
router.get('/all', async (req, res) => {
  try {
    const sessions = await Session.find().sort({ date: -1 });
    res.status(200).json(sessions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
