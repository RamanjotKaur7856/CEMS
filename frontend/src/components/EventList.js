import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function EventList({ user }) {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
  axios
    .get("http://localhost:4000/api/events")
    .then((res) => setEvents(res.data))
    .catch((err) => console.error(err));
}, []);
  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this event?")) return;
  //   try {
  //     const token = localStorage.getItem("token");
  //     await axios.delete(`http://localhost:4000/api/events/${id}`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     setEvents(events.filter((e) => e._id !== id));
  //   } catch (err) {
  //     alert("Failed to delete event");
  //     console.error(err);
  //   }
  // };

  const handleRegister = (id) => {
    if (!user) {
      alert("You must be logged in to register.");
      navigate("/login");
      return;
    }
    if (user.role !== "student") return;
    navigate(`/register/${id}`);
  };

  // Filter events based on search + type
  const filteredEvents = events.filter(
  (event) =>
    (event.name || "").toLowerCase().includes(search.toLowerCase()) &&
    (filterType === "" || event.category === filterType)
);

  return (
    <div className="container">
      <h2>Events</h2>

      {/* Search + Filter Row */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search by event name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {filteredEvents.length === 0 && <p>No events found.</p>}

      {filteredEvents.map((event) => (
        <div key={event._id} className="event-card">
          <img
  src={
    event.banner
      ? `http://localhost:4000/${event.banner}`
      : "https://source.unsplash.com/900x300/?college,event"
  }
  alt="Event Banner"
  style={{ width: "100%", borderRadius: "8px", marginBottom: "16px", maxHeight: 200, objectFit: "cover" }}
/>
          <h3>{event.name}</h3>
          <p style={{ color: "#f63b3b", fontWeight: 500 }}>
  {new Date(event.dateFrom).toLocaleDateString()}
  {event.dateTo ? ` - ${new Date(event.dateTo).toLocaleDateString()}` : ""}
  {event.time ? `, ${event.time}` : ""}
</p>
          <p>
            <b>Location:</b> {event.location}
          </p>
          <p>
            <b>Type:</b> {event.category}
          </p>
          <p>{event.description}</p>

          <div className="actions">
            {/* Student actions */}
            {user?.role === "student" && (
              <>
                <button onClick={() => handleRegister(event._id)}>
                  Register
                </button>
                <button onClick={() => alert("Marked Interested")}>
                  Mark Interested
                </button>
                <button onClick={() => alert("Marked Attending")}>
                  Mark Attending
                </button>
              </>
            )}

            {/* Organizer actions */}
            {user?.role === "organizer" && (
              <>
                {/* <Link to={`/edit/${event._id}`} className="btn">
                  Edit
                </Link>
                <button onClick={() => handleDelete(event._id)}>Delete</button> */}
                <Link to={`/participants/${event._id}`} className="btn">
                  Participants
                </Link>
              </>
            )}

            {/* Event Details accessible to all */}
            <Link to={`/events/${event._id}`} className="btn">
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default EventList;
