import React, { useState } from "react";
import axios from "axios";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddAvailability = () => {
  const [selectedDays, setSelectedDays] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleDayToggle = (day) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const getNextDateForDay = (dayName) => {
    const dayIndex = daysOfWeek.indexOf(dayName); // Monday = 0
    const today = new Date();
    const todayIndex = today.getDay(); // Sunday = 0, Saturday = 6

    // Adjust so Monday = 0
    const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1;

    let diff = dayIndex - adjustedTodayIndex;
    if (diff < 0) diff += 7;

    const resultDate = new Date();
    resultDate.setDate(today.getDate() + diff);

    return resultDate.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDays.length === 0 || !startTime || !endTime) {
      setMessage("Please select at least one day and both time fields.");
      return;
    }

    setLoading(true);
    setMessage("");
    const token = localStorage.getItem("token");
    const timeSlot = `${startTime}-${endTime}`;

    try {
      for (const day of selectedDays) {
        const date = getNextDateForDay(day); // Convert to "YYYY-MM-DD"

        const res = await axios.post(
          "http://localhost:5000/api/mentor/availability",
          {
            date: date,
            timeSlots: [timeSlot],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`Availability for ${day} (${date}) added:`, res.data);
      }

      setMessage("Availability added successfully!");
      setSelectedDays([]);
      setStartTime("");
      setEndTime("");
    } catch (error) {
      console.error("Error submitting availability:", error);
      setMessage("Failed to submit availability.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 shadow-xl rounded-xl bg-white mt-10">
      <h2 className="text-2xl font-bold text-center mb-4">Add Availability</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Select Days:</label>
          <div className="flex flex-wrap gap-2">
            {daysOfWeek.map((day) => (
              <button
                type="button"
                key={day}
                className={`px-3 py-1 rounded-full border ${
                  selectedDays.includes(day)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
                onClick={() => handleDayToggle(day)}
              >
                {day}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block font-semibold mb-1">Start Time:</label>
          <input
            type="time"
            className="w-full border px-3 py-2 rounded"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">End Time:</label>
          <input
            type="time"
            className="w-full border px-3 py-2 rounded"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        {message && (
          <div className="text-sm text-center text-red-500 font-medium">
            {message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Saving..." : "Save Availability"}
        </button>
      </form>
    </div>
  );
};

export default AddAvailability;
