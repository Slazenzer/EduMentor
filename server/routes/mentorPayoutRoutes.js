// server/routes/mentorPayoutRoutes.js
import express from "express";
import { verifyToken, authorizeMentor } from "../middleWare/authMiddleware.js";
import { getMentorPayoutHistory } from "../controllers/mentorPayoutController.js";
import { createPayoutRequest } from "../controllers/mentorController.js";

const router = express.Router();

router.post("/", verifyToken, authorizeMentor, createPayoutRequest);

// POST - Create a new payout request
router.post("/request", verifyToken, authorizeMentor, createPayoutRequest);

// GET - View own payout history
router.get("/history", verifyToken, authorizeMentor, getMentorPayoutHistory);

export default router;





