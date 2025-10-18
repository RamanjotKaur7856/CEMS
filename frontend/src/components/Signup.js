import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student", // default must match backend enum
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1️⃣ Signup API
      const signupRes = await fetch("http://localhost:4000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const signupData = await signupRes.json();

      if (!signupRes.ok) {
        return alert(signupData.message || "Signup failed!");
      }

      // 2️⃣ Auto-login after signup
      const loginRes = await fetch("http://localhost:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        return alert(loginData.message || "Login after signup failed!");
      }

      // 3️⃣ Save token and user info
      localStorage.setItem("token", loginData.token);
      localStorage.setItem("role", loginData.user.role);
      localStorage.setItem("name", loginData.user.name);

      // 4️⃣ Update Navbar
      setUser({ name: loginData.user.name, role: loginData.user.role });

      // 5️⃣ Redirect to homepage
      navigate("/");
    } catch (err) {
      console.error("Signup/Login error:", err);
      alert("Network or server error");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "2rem auto", padding: "2rem", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="student">Student</option>
          <option value="organizer">Organizer</option>
        </select>
        <button type="submit">Signup & Login</button>
      </form>
    </div>
  );
};

export default Signup;
