// middelWare/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";


export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "No token, authorization denied" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id); // ✅ fetch full user

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach full user
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token is not valid" });
  }
};

// const adminMiddleware = (req, res, next) => {
//   console.log("Inside adminMiddleware, req.user:", req.user);
//   if (req.user && req.user.role === 'admin') {
//     next();
//   } else {
//     res.status(403).json({ message: 'Access denied. Admins only.' });
//   }
// };
//export default adminMiddleware;

const adminMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Admins only" });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
    console.log(err);
  }
};

export default adminMiddleware;

export const authorizeMentor = (req, res, next) => {
  if (req.user.role !== "mentor") {
    return res.status(403).json({ message: "Access denied: Mentor only" });
  }
  next();
};
