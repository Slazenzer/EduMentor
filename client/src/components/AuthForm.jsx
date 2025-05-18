// src/components/AuthForm.jsx
import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const AuthForm = ({ onSubmit, buttonLabel }) => {
  const formRef = useRef();
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "mentor" });

  useEffect(() => {
    gsap.from(formRef.current, { y: -100, opacity: 0, duration: 1 });
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="auth-form">
      {buttonLabel === "Register" && (
        <>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <select name="role" onChange={handleChange}>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
        </>
      )}
      <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
      <button type="submit">{buttonLabel}</button>
    </form>
  );
};

export default AuthForm;
