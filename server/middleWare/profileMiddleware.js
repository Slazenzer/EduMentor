export const profileAuthMiddleware = (req, res, next) => {
    // Here you can add any extra checks for profile access
    // For example, check if user role is mentor or admin allowed to access profile
  
    if (req.user.role !== "mentor") {
      return res.status(403).json({ message: "Access denied: Mentor only" });
    }
  
    // You can also add more custom logic here, e.g. check if profile is active, etc.
  
    next();
  };
  