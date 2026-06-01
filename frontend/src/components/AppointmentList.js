import { useEffect, useState } from "react";
import axios from "axios";

function AppointmentList() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("/api/bookings");
      const userId = localStorage.getItem("userId");

      const myBookings = res.data.filter(
        (booking) => booking.user?._id === userId && booking.slot
      );

      setBookings(myBookings);
    } catch (error) {
      alert("Failed to load booking history");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmCancel) return;

    try {
      await axios.delete(`/api/bookings/${bookingId}`);
      alert("Booking cancelled successfully");
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };

  return (
    <div>
      <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem'}}>
        <button onClick={fetchBookings} className="btn" style={{background: '#edf2f9', color: 'var(--text-main)', border: '1px solid #dcdfe6', display: 'inline-flex', alignItems: 'center', gap: '6px'}}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="sync-icon" style={{ transition: 'transform 0.4s ease' }}>
            <path d="M21.5 2v6h-6" />
            <path d="M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
          Refresh
        </button>
      </div>

      {bookings.length === 0 ? (
        <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
          <p>No bookings yet</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} className="list-item">
            <div className="list-item-info">
              <h4>
                <span className={`status-badge ${booking.status === 'confirmed' ? 'status-booked' : 'status-pending'}`}>
                  {booking.status}
                </span>
              </h4>
              <p style={{marginTop: '0.5rem'}}>
                <span style={{fontWeight: 500, color: 'var(--text-main)'}}>Start:</span>{" "}
                {booking.slot?.startTime
                  ? new Date(booking.slot.startTime).toLocaleString()
                  : "Slot deleted"}
              </p>
              <p>
                <span style={{fontWeight: 500, color: 'var(--text-main)'}}>End:</span>{" "}
                {booking.slot?.endTime
                  ? new Date(booking.slot.endTime).toLocaleString()
                  : "Slot deleted"}
              </p>
            </div>

            <div>
              <button
                onClick={() => handleCancelBooking(booking._id)}
                className="btn btn-danger"
                style={{padding: '0.5rem 1rem', fontSize: '0.9rem'}}
              >
                Cancel
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default AppointmentList;