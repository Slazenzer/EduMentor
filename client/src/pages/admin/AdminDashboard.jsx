import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sessions from "./SessionManager";
import Payouts from "./PayoutPage";
import AuditLogs from "./AuditLogs";
import Chat from "./Chat";
import Simulation from "./SimulationMode";
import Navbar from "../../components/Navbar";
import AdminCreateSession from "./AdminCreateSession";

const AdminDashboard = () => {
  return (
    <>
    <Navbar/>
    <div className="flex">
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Navigate to="Sessions" />} />
          <Route path="/create-session" element={<AdminCreateSession />} />
          <Route path="sessions" element={<Sessions />} />
          <Route path="payouts" element={<Payouts />} />
          <Route path="audit-logs" element={<AuditLogs />} />
          <Route path="chat" element={<Chat />} />
          <Route path="simulation" element={<Simulation />} />
        </Routes>
      </div>
    </div>
    </>
  );
};

export default AdminDashboard;
