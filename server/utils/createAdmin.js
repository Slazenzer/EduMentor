import User from "../models/user.js";
import bcrypt from "bcryptjs";

export const createAdminIfNotExists = async () => {
  const existingAdmin = await User.findOne({ email: "admin@example.com" });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin"
    });
    await adminUser.save();
    console.log("✅ Admin user created with email: admin@example.com");
  }
};
