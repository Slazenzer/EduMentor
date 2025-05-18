import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import axios from "axios";
import Navbar from "../components/Navbar";

const Register = () => {
  const cardRef = useRef(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
    );
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
        await axios.post("http://localhost:5000/api/auth/register", form);
        alert("Registered! Now login.");
        console.log(handleRegister)
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
   <>
   <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600 px-4">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Name"
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Email"
            required
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            type="password"
            placeholder="Password"
            required
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default Register;
