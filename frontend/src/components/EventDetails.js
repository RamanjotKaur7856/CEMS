import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function EventDetails({ user }) {
  const { id } = useParams(); // Change from eventId to id to match route
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const [participants, setParticipants] = useState([]);

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        // Fix the API endpoint to match your backend
        const response = await axios.get(`http://localhost:4000/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  // Handle delete event
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`http://localhost:4000/api/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("Event deleted successfully!");
        navigate("/events");
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete event");
      }
    }
  };

  // Handle update event
  const handleUpdate = () => {
    navigate(`/events/update/${id}`);
  };

  // Handle view participants
  const handleViewParticipantsPage = () => {
    navigate(`/participants/${id}`);
  };

  // Fetch participants
  const handleViewParticipants = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:4000/api/events/${id}/participants`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setParticipants(response.data);
      setShowParticipants(true);
    } catch (err) {
      console.error("Participants error:", err);
      alert("Failed to load participants");
    }
  };

  if (loading) return <div className="container"><p>Loading event details...</p></div>;
  if (error) return <div className="container"><p style={{color: 'red'}}>{error}</p></div>;
  if (!event) return <div className="container"><p>Event not found</p></div>;

  return (
    <div className="container">
      <div className="event-card">
        {/* Event Banner */}
        {event.banner && (
          <img
  src={
    event.banner
      ? `http://localhost:4000/${event.banner}`
      : "https://source.unsplash.com/900x300/?college,event"
  }
  alt="Event Banner"
  style={{
    width: "100%",
    maxHeight: "300px",
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "20px"
  }}
/>
        )}
        
        <h2>{event.name}</h2>
        
        {/* Event Details */}
        <div style={{ marginBottom: "20px" }}>
          <p><strong>Description:</strong> {event.description}</p>
          <p><strong>Date:</strong> {new Date(event.dateFrom).toLocaleDateString()} 
            {event.dateTo && ` - ${new Date(event.dateTo).toLocaleDateString()}`}
          </p>
          {event.time && <p><strong>Time:</strong> {event.time}</p>}
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category}</p>
          {event.createdBy && <p><strong>Organized by:</strong> {event.createdBy.name}</p>}
        </div>

        {/* Action Buttons */}
        <div className="actions" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {/* Admin/Organizer actions */}
          {user && (user.role === "admin" || user.role === "organizer") && (
            <>
              <button onClick={handleUpdate} className="btn">Edit Event</button>
              <button onClick={handleDelete} className="btn" style={{ backgroundColor: "#dc3545" }}>
                Delete Event
              </button>
              <button onClick={handleViewParticipantsPage} className="btn" style={{ backgroundColor: "#17a2b8" }}>
                View All Participants
              </button>
              <button onClick={handleViewParticipants} className="btn" style={{ backgroundColor: "#28a745" }}>
                Quick View Participants
              </button>
            </>
          )}

          {/* Student actions */}
          {user && user.role === "student" && (
            <button 
              onClick={() => navigate(`/register/${id}`)} 
              className="btn"
              style={{ backgroundColor: "#28a745" }}
            >
              Register for Event
            </button>
          )}

          {/* Back to events */}
          <button 
            onClick={() => navigate("/events")} 
            className="btn"
            style={{ backgroundColor: "#6c757d" }}
          >
            Back to Events
          </button>
        </div>

        {/* Show participants list */}
        {showParticipants && (
          <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
            <h3>Registered Participants:</h3>
            {participants.length > 0 ? (
              <ul style={{ listStyle: "none", padding: 0 }}>
                {participants.map((participant, index) => (
                  <li key={index} style={{ 
                    padding: "10px", 
                    borderBottom: "1px solid #dee2e6",
                    display: "flex",
                    justifyContent: "space-between"
                  }}>
                    <span><strong>{participant.name}</strong></span>
                    <span>{participant.email}</span>
                    {participant.phone && <span>{participant.phone}</span>}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No participants registered yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetails;