import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const PayoutPage = () => {
  const [payouts, setPayouts] = useState([]);
  const tableRef = useRef(null);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/payout-requests", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await res.json();
        setPayouts(data);
      } catch (error) {
        console.error("Error fetching payouts:", error);
      }
    };

    fetchPayouts();
  }, []);

  useEffect(() => {
    if (tableRef.current) {
      gsap.from(tableRef.current, {
        y: 30,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [payouts]);

  const markAsPaid = async (id) => {
    try {
      const res = await fetch(`/api/admin/payout-requests/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: "approved" }),
      });

      const result = await res.json();
      if (res.ok) {
        setPayouts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: "paid" } : p))
        );
      } else {
        alert(result.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Error updating payout status:", err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Mentor Payouts
      </h2>

      <div
        ref={tableRef}
        className="overflow-x-auto rounded-md border border-gray-300"
      >
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-indigo-100">
            <tr>
              <th className="px-4 py-2 text-left">Mentor</th>
              <th className="px-4 py-2 text-left">Sessions</th>
              <th className="px-4 py-2 text-left">Total Hours</th>
              <th className="px-4 py-2 text-left">Amount (₹)</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {payouts.map((payout) => (
              <tr key={payout.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{payout.mentorName}</td>
                <td className="px-4 py-2">{payout.sessionCount || "-"}</td>
                <td className="px-4 py-2">{payout.totalHours || "-"}</td>
                <td className="px-4 py-2 font-medium">{payout.amount}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-sm font-semibold ${
                      payout.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {payout.status}
                  </span>
                </td>
                <td className="px-4 py-2 space-x-2">
                  {payout.status === "unpaid" && (
                    <button
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded"
                      onClick={() => markAsPaid(payout.id)}
                    >
                      Mark as Paid
                    </button>
                  )}
                  <button className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded">
                    Download
                  </button>
                </td>
              </tr>
            ))}

            {payouts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-500">
                  No payout data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PayoutPage;
