import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";

const MentorHome = () => {
  const [availability, setAvailability] = useState([]);
  const [selectedEdit, setSelectedEdit] = useState(null);
  const [sessionRequests, setSessionRequests] = useState([]);
  const [earnings, setEarnings] = useState(0);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const token = localStorage.getItem("token");

  const handleAcceptRequest = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/mentor/sessions/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData(); // refresh the data after accept
    } catch (error) {
      console.error("Failed to accept session request:", error);
    }
  };
  
  const handleRejectRequest = async (requestId) => {
    try {
      await axios.put(`http://localhost:5000/api/mentor/sessions/${requestId}/reject`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchAllData(); // refresh the data after reject
    } catch (error) {
      console.error("Failed to reject session request:", error);
    }
  };

  const fetchAllData = async () => {
    try {
      const [availRes, sessionRes] = await Promise.all([
        axios.get("http://localhost:5000/api/mentor/availability", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5000/api/mentor/sessions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setAvailability(availRes.data);
      setSessionRequests(sessionRes.data);
    } catch (error) {
      console.error("Error loading mentor data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.from(containerRef.current.children, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
      });
    }
  }, [loading]);

  const handleDeleteAvailability = async (id) => {
    if (!window.confirm("Delete this availability?")) return;
    try {
      await axios.delete(
        `http://localhost:5000/api/mentor/availability/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAvailability((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Failed to delete availability:", error);
    }
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/mentor/availability/${selectedEdit._id}`,
        {
          date: selectedEdit.date,
          timeSlots: selectedEdit.timeSlots,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSelectedEdit(null);
      fetchAllData();
    } catch (error) {
      console.error("Failed to edit availability:", error);
    }
  };

  if (loading)
    return (
      <p className="p-6 text-gray-500 animate-pulse">
        Loading mentor dashboard...
      </p>
    );

  return (
    <div ref={containerRef} className="p-6 space-y-12 max-w-5xl mx-auto">
      {/* Availability Section */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-blue-700">
          Your Availability
        </h2>
        {availability.length === 0 ? (
          <p className="text-gray-500">No availability set.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border shadow-sm rounded-md overflow-hidden">
              <thead className="bg-blue-50 text-blue-700">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time Slots</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {availability.map((slot) => (
                  <tr key={slot._id} className="border-t hover:bg-blue-50">
                    <td className="p-3">
                      {new Date(slot.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">{slot.timeSlots.join(", ")}</td>
                    <td className="p-3 space-x-3">
                      <button
                        className="text-blue-600 hover:underline"
                        onClick={() => setSelectedEdit(slot)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => handleDeleteAvailability(slot._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Edit Modal */}
      {selectedEdit && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md scale-100 transition-all duration-300">
            <h3 className="text-xl font-bold mb-4 text-blue-700">
              Edit Availability
            </h3>
            <input
              type="date"
              value={new Date(selectedEdit.date).toISOString().substr(0, 10)}
              onChange={(e) =>
                setSelectedEdit({ ...selectedEdit, date: e.target.value })
              }
              className="w-full border p-2 mb-3 rounded"
            />
            <input
              type="text"
              placeholder="Time Slots (comma separated)"
              value={selectedEdit.timeSlots.join(", ")}
              onChange={(e) =>
                setSelectedEdit({
                  ...selectedEdit,
                  timeSlots: e.target.value.split(",").map((t) => t.trim()),
                })
              }
              className="w-full border p-2 mb-4 rounded"
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setSelectedEdit(null)}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Session Requests Section */}
      <section>
        <h2 className="text-3xl font-bold mb-4 text-blue-700">
          Session Requests
        </h2>
        {sessionRequests.length === 0 ? (
          <p className="text-gray-500">No session requests yet.</p>
        ) : (
          <ul className="space-y-4">
            {sessionRequests.map((req) => (
              <li
                key={req._id}
                className="p-4 bg-blue-50 border border-blue-100 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
              >
                <p>
                  <span className="font-medium">Student:</span>{" "}
                  {req.studentName}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(req.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Time:</span> {req.timeSlot}
                </p>

                {/* Accept / Reject buttons */}
                <div className="flex space-x-3 mt-2">
                  <button
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    onClick={() => handleAcceptRequest(req._id)}
                  >
                    Accept
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    onClick={() => handleRejectRequest(req._id)}
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
};

export default MentorHome;
