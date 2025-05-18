import React, { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import axios from "axios";

const AdminSessions = () => {
  const [sessions, setSessions] = useState([]);
  const containerRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchSessions();
    gsap.from(containerRef.current, {
      duration: 0.8,
      y: 50,
      ease: "power3.out",
    });
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/sessions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("🔍 Full response from /api/admin:", res.data);
      setSessions(res.data.sessions || res.data); // fallback
    } catch (error) {
      console.error(
        " Error fetching sessions:",
        error.response?.data || error.message
      );
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSessions();
    } catch (error) {
      console.error(
        "Error updating status:",
        error.response?.data || error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/sessions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSessions();
    } catch (error) {
      console.error(
        "Error deleting session:",
        error.response?.data || error.message
      );
    }
  };

  const handleGenerateReceipt = async (sessionId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/admin/sessions/${sessionId}/receipt`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // required for file download
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Receipt-${sessionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(
        "Receipt generation failed:",
        error.response?.data || error.message
      );
      alert("Failed to generate receipt. Please try again.");
    }
  };

  return (
    <div
      ref={containerRef}
      className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Admin - Manage Sessions
      </h2>

      <div className="overflow-x-auto rounded-md border border-gray-300">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              {[
                "Mentor",
                "Mentee",
                "Date",
                "Duration",
                "Topic",
                "Status",
                "Actions",
                "Receipt",
              ].map((header) => (
                <th
                  key={header}
                  className="px-4 py-3 text-left text-sm font-semibold text-indigo-800 uppercase tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {Array.isArray(sessions) && sessions.length > 0 ? (
              sessions.map((session) => (
                <tr
                  key={session._id}
                  className="hover:bg-indigo-50 transition-colors"
                >
                  <td className="px-4 py-3 font-semibold text-gray-900">
                    {session.mentor?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.menteeName || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {new Date(session.date).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.duration} min
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {session.topic || "-"}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={session.status}
                      onChange={(e) =>
                        handleStatusChange(session._id, e.target.value)
                      }
                      className="border border-indigo-300 rounded px-2 py-1 text-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(session._id)}
                      className="bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {session.status === "completed" ? (
                      <button
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-1 rounded transition"
                        onClick={() => handleGenerateReceipt(session._id)}
                        disabled={session.status !== "completed"}
                      >
                        Generate Receipt
                      </button>
                    ) : (
                      <span className="text-gray-400 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 font-medium"
                >
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSessions;
