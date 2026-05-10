import { useEffect, useState } from "react";
import axios from "axios";

function DoctorBookingList() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings");
      const doctorId = localStorage.getItem("userId");

      const doctorBookings = res.data.filter(
        (booking) => booking.slot?.doctor?._id === doctorId
      );

      setBookings(doctorBookings);
    } catch (error) {
      alert("Failed to load bookings");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
        <button onClick={fetchBookings} className="btn" style={{background: '#edf2f9', color: 'var(--text-main)', border: '1px solid #dcdfe6'}}>
          🔄 Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
          <p>No bookings found</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="list-item">
            <div className="list-item-info">
              <h4 style={{fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--primary)'}}>
                {booking.user?.name}
              </h4>
              <p>
                <span style={{fontWeight: 500}}>Email:</span> {booking.user?.email}
              </p>
              <p>
                <span style={{fontWeight: 500}}>Start:</span>{" "}
                {new Date(booking.slot?.startTime).toLocaleString()}
              </p>
              <p>
                <span style={{fontWeight: 500}}>End:</span>{" "}
                {new Date(booking.slot?.endTime).toLocaleString()}
              </p>
            </div>

            <div style={{textAlign: 'right'}}>
              <span className={`status-badge ${booking.status === 'confirmed' ? 'status-booked' : 'status-pending'}`}>
                {booking.status}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default DoctorBookingList;