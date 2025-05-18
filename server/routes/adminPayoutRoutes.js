// server/routes/adminPayoutRoutes.js
import express from "express";
import adminMiddleware from "../middleWare/authMiddleware.js";
import {
  getAllPayoutRequests,
  updatePayoutRequestStatus,
} from "../controllers/adminPayoutController.js";

const router = express.Router();

router.get("/", adminMiddleware, getAllPayoutRequests);
router.put("/:id", adminMiddleware, updatePayoutRequestStatus);

export default router;
