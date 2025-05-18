import express from "express";
import { verifyToken, authorizeMentor } from "../middleWare/authMiddleware.js";
import { getProfile, updateProfile } from "../controllers/mentorController.js";
import { setAvailability, getAvailability } from "../controllers/availabilityController.js";
import { getMentorSessions, completeSession } from "../controllers/mentorSessionController.js";
import { createPayoutRequest, getMentorPayoutHistory } from "../controllers/mentorController.js";
import { acceptSessionRequest, rejectSessionRequest } from "../controllers/mentorController.js";
import upload from "../middleWare/uploadMiddleware.js"; 

const router = express.Router();

router.get("/profile", verifyToken, authorizeMentor, getProfile);

// ✅ update route to use Multer for single file (field name = 'profileImage')
router.put("/profile", verifyToken, authorizeMentor, upload.single("profileImage"), updateProfile);

router.post("/availability", verifyToken, setAvailability);
router.get("/availability", verifyToken, getAvailability);

router.get("/sessions", verifyToken, authorizeMentor, getMentorSessions);
router.put("/sessions/:id/complete", verifyToken, authorizeMentor, completeSession);

router.post("/payout-request", verifyToken, authorizeMentor, createPayoutRequest);
router.get("/payout-history", verifyToken, authorizeMentor, getMentorPayoutHistory);


router.put("/sessions/:id/accept", verifyToken, authorizeMentor, acceptSessionRequest);
router.put("/sessions/:id/reject", verifyToken, authorizeMentor, rejectSessionRequest);


export default router;
