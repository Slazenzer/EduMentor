import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";

const DashboardRouter = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (role === "admin") {
      navigate("/admin/sessions", { replace: true });
    } else if (role === "mentor") {
      navigate("/mentor/dashboard", { replace: true });
    } else {
      navigate("/", { replace: true }); // fallback
    }
  }, [role, navigate]);

  return null; // nothing to render
};

export default DashboardRouter;
