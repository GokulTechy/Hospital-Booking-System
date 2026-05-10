import { useEffect, useState } from "react";
import axios from "axios";

function SlotList() {
  const [slots, setSlots] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedSpecialist, setSelectedSpecialist] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");

  const role = localStorage.getItem("role");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const slotsRes = await axios.get("/api/slots");
      const bookingsRes = await axios.get("/api/bookings");

      setSlots(slotsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      alert("Failed to load slots");
    }
  };

  const handleBooking = async (slotId) => {
    try {
      if (!userId || userId === "undefined") {
        alert("Please login again.");
        return;
      }

      await axios.post("/api/bookings", {
        userId,
        slotId
      });

      alert("Slot booked!");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Booking failed");
    }
  };

  const handleDeleteSlot = async (slotId) => {
    try {
      await axios.delete(`/api/slots/${slotId}`);
      alert("Slot deleted!");
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const myBookedSlotIds = bookings
    .filter((booking) => booking.user?._id === userId)
    .map((booking) => booking.slot?._id);

  const filteredSlots = slots.filter((slot) => {
    if (role === "doctor") {
      const slotDoctorId =
        typeof slot.doctor === "object" ? slot.doctor?._id : slot.doctor;

      return String(slotDoctorId) === String(userId);
    }

    const matchSpecialist = selectedSpecialist
      ? slot.specialization === selectedSpecialist
      : true;

    const matchAvailability =
      availabilityFilter === "available"
        ? slot.isBlocked === false
        : availabilityFilter === "myBooked"
        ? myBookedSlotIds.includes(slot._id)
        : true;

    return matchSpecialist && matchAvailability;
  });

  return (
    <div>
      {role === "patient" && (
        <div style={{display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap'}}>
          <select
            value={selectedSpecialist}
            onChange={(e) => setSelectedSpecialist(e.target.value)}
            className="form-input"
            style={{flex: 1, minWidth: '150px'}}
          >
            <option value="">All Specialists</option>
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Dentist">Dentist</option>
            <option value="Orthopedic">Orthopedic</option>
            <option value="General Physician">General Physician</option>
          </select>

          <select
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            className="form-input"
            style={{flex: 1, minWidth: '150px'}}
          >
            <option value="">All Slots</option>
            <option value="available">Available Slots</option>
            <option value="myBooked">My Booked Slots</option>
          </select>
        </div>
      )}

      {filteredSlots.length === 0 ? (
        <div style={{textAlign: 'center', padding: '2rem', color: 'var(--text-muted)'}}>
          <p>No slots found</p>
        </div>
      ) : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {filteredSlots.map((slot) => (
            <div key={slot._id} className="list-item">
              <div className="list-item-info">
                <h4>{slot.specialization || "Not specified"}</h4>
                <p style={{marginBottom: '0.25rem', color: 'var(--primary)'}}>
                  <span style={{fontWeight: 500, color: 'var(--text-main)'}}>Doctor:</span>{" "}
                  {typeof slot.doctor === "object"
                    ? slot.doctor?.name || "Doctor"
                    : "Doctor"}
                </p>
                <p>
                  <span style={{fontWeight: 500, color: 'var(--text-main)'}}>Time:</span>{" "}
                  {new Date(slot.startTime).toLocaleString()} - {new Date(slot.endTime).toLocaleTimeString()}
                </p>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem'}}>
                <span
                  className={`status-badge ${slot.isBlocked ? "status-booked" : "status-available"}`}
                >
                  {slot.isBlocked ? "Booked" : "Available"}
                </span>

                {role === "patient" && (
                  <button
                    onClick={() => handleBooking(slot._id)}
                    disabled={slot.isBlocked}
                    className="btn btn-primary"
                    style={{
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.85rem',
                      opacity: slot.isBlocked ? 0.5 : 1,
                      cursor: slot.isBlocked ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {slot.isBlocked ? "Booked" : "Book Slot"}
                  </button>
                )}

                {role === "doctor" && (
                  <button
                    onClick={() => handleDeleteSlot(slot._id)}
                    disabled={slot.isBlocked}
                    className="btn btn-danger"
                    style={{
                      padding: '0.4rem 0.8rem', 
                      fontSize: '0.85rem',
                      opacity: slot.isBlocked ? 0.5 : 1,
                      cursor: slot.isBlocked ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {slot.isBlocked ? "Cannot Delete Booked Slot" : "Delete Slot"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SlotList;