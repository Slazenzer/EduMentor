// server/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import sessionRoutes from './routes/sessionRoutes.js';
import { createAdminIfNotExists } from "./utils/createAdmin.js"; // <-- added
import mentorRoutes from "./routes/mentorRoutes.js";
import adminSessionRoutes from "./routes/adminSessionRoutes.js";
import adminMentorRoutes from "./routes/adminMentorRoutes.js"
import adminPayoutRoutes from "./routes/adminPayoutRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const startServer = async () => {
  await connectDB(); // connect to DB
  await createAdminIfNotExists(); // <-- create admin if not exists

  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use("/api/auth", authRoutes);
  app.use("/api/sessions", sessionRoutes);

  app.get("/", (req, res) => res.send("API Running"));
  app.use("/api/mentor", mentorRoutes);
  app.use("/api/admin/mentors", adminMentorRoutes);
  app.use("/api/admin/payout-requests", adminPayoutRoutes);
  app.use("/api/admin/sessions", adminSessionRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/uploads", express.static(path.join(__dirname, "uploads")));




  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer();
