import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import MentorHome from "./mentor/MentorHome";
import MentorSessions from "../pages/mentor/MentorSession";
import MentorProfile from "../pages/mentor/MentorProfile";
import MentorAvailability from "../pages/mentor/AddAvailability";

const MentorDashboard = () => {
  return (
    <>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<MentorHome />} />
          <Route path="home" element={<MentorHome />} />
          <Route path="sessions" element={<MentorSessions />} />
          <Route path="profile" element={<MentorProfile />} />
          <Route path="availability" element={<MentorAvailability />} />
        </Routes>
      </div>
    </>
  );
};

export default MentorDashboard;
