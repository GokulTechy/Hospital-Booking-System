import Navbar from "../components/Navbar";
import SlotList from "../components/SlotList";
import AppointmentList from "../components/AppointmentList";

function PatientDashboard() {
  return (
    <div className="page-container">
      <Navbar />

      <div style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem'}}>
        <div className="hero-section hero-primary">
          <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem', position: 'relative', zIndex: 1}}>🧑 Patient Dashboard</h1>
          <p style={{fontSize: '1.1rem', opacity: 0.9, position: 'relative', zIndex: 1}}>Find specialists, book slots, and manage your appointments.</p>
        </div>

        <div className="dashboard-grid two-cols">
          <div className="glass-card">
            <h2 className="section-title">
              <span style={{fontSize: '1.5rem'}}>📅</span> Available Doctor Slots
            </h2>
            <SlotList />
          </div>

          <div className="glass-card">
            <h2 className="section-title">
              <span style={{fontSize: '1.5rem'}}>📝</span> My Booking History
            </h2>
            <AppointmentList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;