import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";

const MentorSession = () => {
  const [sessions, setSessions] = useState([]);
  const sessionContainerRef = useRef(null);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5000/api/mentor/sessions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSessions(response.data || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      setSessions([]);
    }
  };

  const markAsCompleted = async (sessionId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/mentor/sessions/${sessionId}/complete`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSessions();
    } catch (error) {
      console.error("Error marking session as completed:", error);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  useEffect(() => {
    if (sessions.length > 0 && sessionContainerRef.current) {
      const cards =
        sessionContainerRef.current.querySelectorAll(".session-card");
      gsap.from(cards, {
        y: 40,
        duration: 0.6,
        stagger: 0.15,
        ease: "power2.out",
      });
    }
  }, [sessions]);

  return (
    <div className="p-6 max-w-7xl mx-auto" ref={sessionContainerRef}>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">
        Scheduled Sessions
      </h2>

      {sessions.length === 0 ? (
        <p className="text-gray-500 text-lg">No sessions scheduled yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div
              key={session._id}
              className="session-card bg-white shadow-md rounded-xl p-5 flex flex-col justify-between h-full border border-gray-100"
            >
              <div className="flex flex-col gap-2 mb-4">
                {/* Session info as before */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {session.topic || "Untitled Session"}
                  </h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full font-medium ${
                      session.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {session.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600">
                  <strong>Mentee:</strong> {session.menteeName || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Date:</strong>{" "}
                  {new Date(session.date).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Duration:</strong> {session.duration} min
                </p>
              </div>

              {session.status === "pending" ? (
                <button
                  onClick={() => markAsCompleted(session._id)}
                  className="mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg text-sm transition"
                >
                  Mark as Completed
                </button>
              ) : (
                <div className="mt-auto w-full bg-green-100 text-green-800 text-center font-medium py-2 px-3 rounded-lg text-sm">
                  Eligible for Payout
                </div>
              )}

              {/* Receipt section, only if session is completed and receipt available */}
              {session.status === "completed" && session.receiptUrl && (
                <div className="mt-4 p-3 border border-green-300 rounded-md bg-green-50">
                  <h4 className="font-semibold mb-2 text-green-700">
                    Receipt:
                  </h4>
                  {/* Example: link to view/download */}
                  <a
                    href={session.receiptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline"
                  >
                    View / Download Receipt
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorSession;
