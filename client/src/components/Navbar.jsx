import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");

  // State for dropdown open/close
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Navigate based on role when clicking logo
  const handleLogoClick = () => {
    if (role === "admin") navigate("/admin/sessions");
    else if (role === "mentor") navigate("/mentor/Home");
    else navigate("/");
  };

  return (
    <nav className="bg-indigo-600 text-white px-6 py-4 flex justify-between items-center shadow-lg">
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={handleLogoClick}
      >
        EduMentor
      </div>

      <ul className="flex space-x-6 items-center">
        {user ? (
          <>
            {role === "admin" && (
              <>
                <li>
                  <Link to="/admin/sessions" className="hover:text-indigo-300">
                    Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/create-session"
                    className="hover:text-indigo-300"
                  >
                    Create Session
                  </Link>
                </li>
                <li>
                  <Link to="/admin/payouts" className="hover:text-indigo-300">
                    Payouts
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/audit-logs"
                    className="hover:text-indigo-300"
                  >
                    Audit Logs
                  </Link>
                </li>
                <li>
                  <Link to="/admin/chat" className="hover:text-indigo-300">
                    Chat
                  </Link>
                </li>
                <li>
                  <Link
                    to="/admin/simulation"
                    className="hover:text-indigo-300"
                  >
                    Test Mode
                  </Link>
                </li>
              </>
            )}

            {role === "mentor" && (
              <>
                <li>
                  <Link to="/mentor/home" className="hover:text-indigo-300">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/mentor/sessions" className="hover:text-indigo-300">
                    Sessions
                  </Link>
                </li>
                <li>
                  <Link
                    to="/mentor/availability"
                    className="hover:text-indigo-300"
                  >
                    Availability
                  </Link>
                </li>
                <li>
                  <Link to="/mentor/chat" className="hover:text-indigo-300">
                    Chat
                  </Link>
                </li>
              </>
            )}

            {/* Profile Image + Dropdown */}
            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <img
                  src={user?.profileImage || "/default-profile.png"}
                  alt="Profile"
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
                <span>{user?.name}</span>
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${
                    dropdownOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  ></path>
                </svg>
              </button>

              {dropdownOpen && (
                <ul className="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
                  <li>
                    <Link
                      to={
                        role === "admin" ? "/admin/profile" : "/mentor/profile"
                      }
                      className="block px-4 py-2 hover:bg-indigo-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-100"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="hover:text-indigo-300">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:text-indigo-300">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
