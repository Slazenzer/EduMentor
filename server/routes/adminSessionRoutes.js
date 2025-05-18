import express from "express";
import adminMiddleware from "../middleWare/authMiddleware.js";  // fix spelling if needed
import { verifyToken, } from "../middleWare/authMiddleware.js";

import {
  createSession,
  deleteSession,
  getAllSessions,
  updateSessionStatus,
  generateReceipt,
} from "../controllers/adminSessionController.js";

const router = express.Router();

router.post("/",verifyToken, adminMiddleware, createSession);  // Add this line
router.get("/", verifyToken, adminMiddleware, getAllSessions);
router.put("/:id", verifyToken, adminMiddleware, updateSessionStatus);
router.delete("/:id",verifyToken, adminMiddleware, deleteSession);
// routes/adminSessionRoutes.js
router.get("/:id/receipt", verifyToken, adminMiddleware, generateReceipt);

export default router;
