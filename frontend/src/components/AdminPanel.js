// frontend/src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [events, setEvents] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [newEvent, setNewEvent] = useState({ title: "", description: "", date: "" });

  // Fetch all events
  const fetchEvents = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/events");
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch participants for a given event
  const fetchParticipants = async (eventId) => {
    try {
      const res = await axios.get(`http://localhost:4000/api/admin/participants/${eventId}`);
      setParticipants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new event
  const addEvent = async () => {
    try {
      await axios.post("http://localhost:4000/api/admin/events", newEvent);
      setNewEvent({ title: "", description: "", date: "" });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  // Update event
  const updateEvent = async (id, updatedEvent) => {
    try {
      await axios.put(`http://localhost:4000/api/admin/events/${id}`, updatedEvent);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  // Delete event
  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/admin/events/${id}`);
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>

      {/* Add Event */}
      <h2>Add New Event</h2>
      <input
        type="text"
        placeholder="Title"
        value={newEvent.title}
        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
      />
      <input
        type="text"
        placeholder="Description"
        value={newEvent.description}
        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
      />
      <input
        type="date"
        value={newEvent.date}
        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
      />
      <button onClick={addEvent}>Add Event</button>

      {/* List Events */}
      <h2>All Events</h2>
      <ul>
        {events.map((event) => (
          <li key={event._id}>
            <strong>{event.title}</strong> - {event.description} - {event.date}
            <button onClick={() => deleteEvent(event._id)}>Delete</button>
            <button
              onClick={() =>
                updateEvent(event._id, {
                  title: prompt("Enter new title", event.title),
                  description: prompt("Enter new description", event.description),
                  date: prompt("Enter new date", event.date),
                })
              }
            >
              Update
            </button>
            <button onClick={() => fetchParticipants(event._id)}>View Participants</button>
          </li>
        ))}
      </ul>

      {/* Show Participants */}
      <h2>Registered Participants</h2>
      <ul>
        {participants.map((user, index) => (
          <li key={index}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPanel;
