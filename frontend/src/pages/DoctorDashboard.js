import Navbar from "../components/Navbar";
import CreateSlot from "../components/CreateSlot";
import SlotList from "../components/SlotList";
import DoctorBookingList from "../components/DoctorBookingList";

function DoctorDashboard() {
  const specialization = localStorage.getItem("specialization");

  return (
    <div className="page-container">
      <Navbar />

      <div style={{maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem'}}>
        <div className="hero-section hero-secondary">
          <h1 style={{fontSize: '2.5rem', marginBottom: '0.5rem', position: 'relative', zIndex: 1}}>👨‍⚕️ Doctor Dashboard</h1>
          <p style={{fontSize: '1.1rem', opacity: 0.9, position: 'relative', zIndex: 1}}>
            Manage your slots and view patient bookings.
            {specialization && <span style={{marginLeft: '10px', background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '20px', fontSize: '0.9rem'}}>★ {specialization}</span>}
          </p>
        </div>

        <div className="dashboard-grid" style={{marginBottom: '2rem'}}>
          <div className="glass-card" style={{border: '2px solid var(--primary)'}}>
            <h2 className="section-title">
              <span style={{fontSize: '1.5rem'}}>➕</span> Create New Slot
            </h2>
            <CreateSlot />
          </div>
        </div>

        <div className="dashboard-grid two-cols">
          <div className="glass-card">
            <h2 className="section-title">
              <span style={{fontSize: '1.5rem'}}>🕒</span> My Slots
            </h2>
            <SlotList />
          </div>

          <div className="glass-card">
            <h2 className="section-title">
              <span style={{fontSize: '1.5rem'}}>📋</span> Patient Bookings
            </h2>
            <DoctorBookingList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;