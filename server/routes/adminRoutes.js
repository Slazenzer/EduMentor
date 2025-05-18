// server/routes/adminRoutes.js
import express from "express";
import { getAllPayoutRequests, updatePayoutRequestStatus } from "../controllers/adminPayoutController.js";
import adminMiddleware from "../middleWare/authMiddleware.js";

const router = express.Router();

// View all payout requests
router.get("/payout-requests", adminMiddleware, getAllPayoutRequests);

// Update payout request status
router.put("/payout-requests/:id", adminMiddleware, updatePayoutRequestStatus);

export default router;
