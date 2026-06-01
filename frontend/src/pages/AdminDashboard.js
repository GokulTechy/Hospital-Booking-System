import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function AdminDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [doctorsRes, patientsRes, appointmentsRes] = await Promise.all([
        axios.get("/api/admin/doctors"),
        axios.get("/api/admin/patients"),
        axios.get("/api/admin/appointments")
      ]);
      setDoctors(doctorsRes.data);
      setPatients(patientsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error("Failed to fetch dashboard data", error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await axios.put(`/api/admin/doctors/${id}/toggle`);
      fetchData();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this doctor?")) {
      try {
        await axios.delete(`/api/admin/doctors/${id}`);
        fetchData();
      } catch (error) {
        alert("Failed to delete doctor");
      }
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const todaysAppointments = appointments.filter(a => {
    if (a.slot && a.slot.startTime) {
      return a.slot.startTime.startsWith(today);
    }
    return false;
  });

  return (
    <div className="page-container">
      <Navbar />

      <div className="hero-section hero-primary" style={{marginBottom: '2rem'}}>
        <h1 className="hero-title"> Admin Dashboard</h1>
        <p className="hero-subtitle">Manage doctors, monitor patients, and track system appointments.</p>
      </div>

      {/* Tabs / Sub-nav */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          className={`btn ${activeTab === 'overview' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'overview' ? 'white' : '', color: activeTab !== 'overview' ? 'var(--text-main)' : '' }}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`btn ${activeTab === 'doctors' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'doctors' ? 'white' : '', color: activeTab !== 'doctors' ? 'var(--text-main)' : '' }}
          onClick={() => setActiveTab('doctors')}
        >
          Doctors List
        </button>
        <button 
          className={`btn ${activeTab === 'patients' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'patients' ? 'white' : '', color: activeTab !== 'patients' ? 'var(--text-main)' : '' }}
          onClick={() => setActiveTab('patients')}
        >
          Patients List
        </button>
        <button 
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`} 
          style={{ background: activeTab !== 'appointments' ? 'white' : '', color: activeTab !== 'appointments' ? 'var(--text-main)' : '' }}
          onClick={() => setActiveTab('appointments')}
        >
           Appointments
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="dashboard-grid two-cols">
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Total Patients</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)' }}>{patients.length}</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Total Doctors</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--secondary)' }}>{doctors.length}</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Total Appointments</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--warning)' }}>{appointments.length}</p>
          </div>
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Appointments Today</h3>
            <p style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success)' }}>{todaysAppointments.length}</p>
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === 'doctors' && (
        <div className="glass-card">
          <h3 className="section-title"> Registered Doctors</h3>
          {doctors.length === 0 ? (
            <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No doctors found in the system.</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {doctors.map(doctor => (
                <div key={doctor._id} className="list-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                  <div className="list-item-info">
                    <h4>{doctor.name}</h4>
                    <p style={{color: 'var(--primary)', fontWeight: '500'}}>{doctor.specialization}</p>
                    <p>{doctor.email}</p>
                  </div>

                  <div style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
                    <span className={`status-badge ${doctor.isActive ? 'status-available' : 'status-booked'}`}>
                      {doctor.isActive ? "Working" : "Not Working"}
                    </span>

                    <button 
                      onClick={() => handleToggleStatus(doctor._id)}
                      className="btn btn-secondary"
                      style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}
                    >
                      Toggle Status
                    </button>

                    <button 
                      onClick={() => handleDelete(doctor._id)}
                      className="btn btn-danger"
                      style={{padding: '0.4rem 0.8rem', fontSize: '0.85rem'}}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === 'patients' && (
        <div className="glass-card">
          <h3 className="section-title"> Registered Patients</h3>
          {patients.length === 0 ? (
            <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No patients found in the system.</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {patients.map(patient => (
                <div key={patient._id} className="list-item">
                  <div className="list-item-info">
                    <h4>{patient.name}</h4>
                    <p>{patient.email}</p>
                  </div>
                  <div>
                    <span className="status-badge status-pending">Patient</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="glass-card">
          <h3 className="section-title"> All Appointments</h3>
          {appointments.length === 0 ? (
            <p style={{textAlign: 'center', color: 'var(--text-muted)'}}>No appointments found in the system.</p>
          ) : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {appointments.map(apt => (
                <div key={apt._id} className="list-item" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
                  <div className="list-item-info">
                    <h4>Patient: {apt.user ? apt.user.name : 'Unknown Patient'}</h4>
                    <p>Doctor: {apt.slot && apt.slot.doctor ? apt.slot.doctor.name : 'Unknown Doctor'}</p>
                    <p>Time: {apt.slot ? new Date(apt.slot.startTime).toLocaleString() : 'Unknown Time'}</p>
                  </div>
                  <div>
                    <span className={`status-badge ${apt.status === 'BOOKED' ? 'status-booked' : 'status-available'}`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
