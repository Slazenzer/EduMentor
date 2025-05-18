import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";

const AdminCreateSession = () => {
  const [mentors, setMentors] = useState([]);
  const [form, setForm] = useState({
    mentorId: "",
    menteeName: "",
    date: "",
    duration: "",
    topic: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const formRef = useRef(null);
  const token = localStorage.getItem("token");

  // Animate form on mount
  useEffect(() => {
    gsap.from(formRef.current, {
      y: 50,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  // Fetch all mentors
  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/mentors", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMentors(res.data);
      } catch (err) {
        console.error("Error fetching mentors:", err);
      }
    };

    fetchMentors();
  }, [token]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!form.mentorId || !form.date || !form.duration) {
      setMessage("Mentor, date, and duration are required.");
      setLoading(false);
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/admin/sessions",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Session created successfully!");
      setForm({
        mentorId: "",
        menteeName: "",
        date: "",
        duration: "",
        topic: "",
        notes: "",
      });
    } catch (err) {
      console.error("Error creating session:", err);
      setMessage("❌ Failed to create session.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={formRef}
      className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100"
    >
      <h2 className="text-3xl font-bold mb-6 text-gray-800">📅 Create New Mentorship Session</h2>

      {message && (
        <div className="mb-4 px-4 py-3 bg-blue-50 text-blue-700 rounded shadow-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Mentor Selection */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">👩‍🏫 Select Mentor *</label>
          <select
            name="mentorId"
            value={form.mentorId}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="">-- Choose Mentor --</option>
            {mentors.map((mentor) => (
              <option key={mentor._id} value={mentor._id}>
                {mentor.name} ({mentor.email})
              </option>
            ))}
          </select>
        </div>

        {/* Mentee Name */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">🙋 Mentee Name</label>
          <input
            type="text"
            name="menteeName"
            value={form.menteeName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">📆 Date *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">⏱ Duration (in minutes) *</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Topic */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">📝 Topic</label>
          <input
            type="text"
            name="topic"
            value={form.topic}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">📄 Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
        >
          {loading ? "Creating..." : "🚀 Create Session"}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateSession;
