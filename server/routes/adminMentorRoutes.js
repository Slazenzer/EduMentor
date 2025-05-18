import express from "express";
import adminMiddleware from "../middleWare/authMiddleware.js";
import { getAllMentors } from "../controllers/adminMentorController.js";

const router = express.Router();

router.get("/", adminMiddleware, getAllMentors);

export default router;
