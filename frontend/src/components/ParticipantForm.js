import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ParticipantForm() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:4000/api/user/register/${eventId}`,
        form,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Successfully registered!');
      navigate(`/events/${eventId}`); // go back to event details
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container">
      <h2>Register for Event</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} required />
        <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default ParticipantForm;
