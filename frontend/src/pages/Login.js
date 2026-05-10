import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      if (res.data.specialization) {
        localStorage.setItem("specialization", res.data.specialization);
      } else {
        localStorage.removeItem("specialization");
      }

      alert("Login successful");

      if (res.data.role === "admin") {
        navigate("/admin");
      } else if (res.data.role === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/patient");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page">
        <div className="glass-card auth-card">
          <h2 className="auth-title">Welcome Back 👋</h2>
          <p className="auth-subtitle">Login to book and manage hospital slots</p>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                name="email"
                placeholder="Enter Email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <input
                type="password"
                name="password"
                placeholder="Enter Password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{width: '100%', marginTop: '10px'}}>
              Login
            </button>
          </form>

          <p style={{marginTop: '25px', color: 'var(--text-muted)'}}>
            Don't have an account? <Link to="/register" className="auth-link">Register</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;