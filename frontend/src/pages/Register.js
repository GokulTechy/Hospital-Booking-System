import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { name, email, password, role, specialization } = formData;

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    if (role === "doctor" && !specialization) {
      alert("Please select doctor specialization");
      return;
    }

    try {
      const res = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        role,
        specialization
      });

      alert(res.data.message || "Registered successfully!");
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-page register-bg">
        <div className="glass-card auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Register as patient, doctor, or admin</p>

          <form onSubmit={handleRegister}>
            <div className="form-group">
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
              />
            </div>

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

            <div className="form-group">
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="admin">Admin / Hospital Management</option>
              </select>
            </div>

            {formData.role === "doctor" && (
              <div className="form-group">
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="form-input"
                >
                  <option value="">Select Specialization</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dentist">Dentist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="General Physician">General Physician</option>
                </select>
              </div>
            )}

            <button type="submit" className="btn btn-secondary" style={{width: '100%', marginTop: '10px'}}>
              Register
            </button>
          </form>

            <p style={{marginTop: '25px', color: 'var(--text-muted)'}}>
            Already have an account? <Link to="/" className="auth-link">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;