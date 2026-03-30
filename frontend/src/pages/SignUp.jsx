import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import "../index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { useAuth } from "../context/AuthContext";
import { getDefaultRouteByRole } from "../utils/roleRoutes";

function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const roles = [
    { label: "User", value: "user", icon: "🛒" },
    { label: "Delivery", value: "delivery", icon: "🏍️" },
  ];

  const handleSignUp = async () => {
    try {
      const apiRole = role === "delivery" ? "rider" : "customer";
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name, email, password, phone, address, role: apiRole },
        { withCredentials: true },
      );
      console.log("Success:", result.data);
      setUser(result.data.user);
      const nextRoute = getDefaultRouteByRole(result.data?.user?.role || role);
      navigate(nextRoute);
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="container">
      <div className="headings">
        <h1>DawaMinute</h1>
        <p>Create your account to get started with quick medicine deliveries</p>

        {/* Full Name */}
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter Your Full Name"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        {/* Mobile */}
        <div className="form-group">
          <label>Mobile</label>
          <input
            type="text"
            placeholder="Enter Your Mobile Number"
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            placeholder="Enter Your Address"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
            <button
              className="eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>
        </div>

        {/* ── Role Selection ── */}
        <div className="form-group">
          <label>Role</label>
          <div className="role-buttons">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                className={`role-btn ${role === r.value ? "role-active" : ""}`}
                onClick={() => setRole(r.value)}
              >
                {r.icon} {r.label}
              </button>
            ))}
            <button
              type="button"
              className="role-btn role-btn-admin"
              onClick={() => navigate("/admin/login")}
            >
              🛠️ Admin
            </button>
          </div>
        </div>

        {/* Sign Up Button */}
        <button className="btn" onClick={handleSignUp}>
          Sign Up
        </button>

        {/* Already have account */}
        <p className="option" onClick={() => navigate("/signin")}>
          Already have an account? <span className="span">Sign In</span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
