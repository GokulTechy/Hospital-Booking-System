import { useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function CreateSlot() {
  const [slotData, setSlotData] = useState({
    startTime: null,
    endTime: null
  });

  const handleDateChange = (date, name) => {
    setSlotData({
      ...slotData,
      [name]: date
    });
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();

    const { startTime, endTime } = slotData;

    if (!startTime || !endTime) {
      alert("Please select start and end time");
      return;
    }

    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start < now) {
      alert("You cannot create slot in the past");
      return;
    }

    if (end <= start) {
      alert("End time must be after start time");
      return;
    }

    try {
      const doctorId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
      const specialization = localStorage.getItem("specialization");

      if (role !== "doctor") {
        alert("Only doctors can create slots");
        return;
      }

      if (!doctorId || doctorId === "undefined") {
        alert("Doctor not logged in properly. Please login again.");
        return;
      }

      if (!specialization || specialization === "undefined") {
        alert("Doctor specialization missing. Please login again.");
        return;
      }

      const payload = {
        doctor: doctorId,
        specialization,
        startTime: start.toISOString(),
        endTime: end.toISOString()
      };

      await axios.post("/api/slots/create", payload);

      alert("Slot created successfully!");

      setSlotData({
        startTime: null,
        endTime: null
      });

      window.location.reload();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to create slot"
      );
    }
  };

  return (
    <div>
      <div style={{marginBottom: '1.5rem'}}>
        <p style={{color: 'var(--text-muted)', fontSize: '0.95rem'}}>
          Select a valid future time range for patient consultation.
        </p>
      </div>

      <form onSubmit={handleCreateSlot}>
        <div className="form-group" style={{display: 'flex', gap: '1rem', flexWrap: 'wrap'}}>
          <div style={{flex: 1, minWidth: '200px'}}>
            <label className="form-label">Start Time</label>
            <DatePicker
              selected={slotData.startTime}
              onChange={(date) => handleDateChange(date, "startTime")}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-input"
              placeholderText="Select start time"
              minDate={new Date()}
              portalId="root-portal"
            />
          </div>

          <div style={{flex: 1, minWidth: '200px'}}>
            <label className="form-label">End Time</label>
            <DatePicker
              selected={slotData.endTime}
              onChange={(date) => handleDateChange(date, "endTime")}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="form-input"
              placeholderText="Select end time"
              minDate={slotData.startTime || new Date()}
              portalId="root-portal"
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>
          + Create Slot
        </button>
      </form>
    </div>
  );
}

export default CreateSlot;