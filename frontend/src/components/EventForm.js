import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

function EventForm({ isEdit = false }) {
  const navigate = useNavigate();
  const { id } = useParams(); // for edit mode
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    location: '',
    category: 'Tech',
    dateFrom: '',
    dateTo: '',
    time: '',
    banner: null, // file input
  });

  // Load existing event data if in edit mode
  useEffect(() => {
    if (isEdit && id) {
      const fetchEvent = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(`http://localhost:4000/api/events/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const event = response.data;
          setForm({
            name: event.name || '',
            description: event.description || '',
            location: event.location || '',
            category: event.category || 'Tech',
            dateFrom: event.dateFrom ? event.dateFrom.split('T')[0] : '',
            dateTo: event.dateTo ? event.dateTo.split('T')[0] : '',
            time: event.time || '',
            banner: null, // Don't set existing banner for file input
          });
        } catch (err) {
          console.error('Error fetching event:', err);
          alert('Failed to load event data');
          navigate('/events');
        }
      };
      fetchEvent();
    }
  }, [isEdit, id, navigate]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] }); // store file object
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('location', form.location);
      formData.append('category', form.category);
      formData.append('dateFrom', form.dateFrom);
      formData.append('dateTo', form.dateTo);
      formData.append('time', form.time);
      if (form.banner) formData.append('banner', form.banner);

      if (isEdit && id) {
        // Update existing event
        console.log('Updating event with ID:', id);
        console.log('Form data:', Object.fromEntries(formData));
        
        const response = await axios.put(`http://localhost:4000/api/events/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Update response:', response.data);
        alert('Event updated successfully!');
        navigate(`/events/${id}`);
      } else {
        // Create new event
        await axios.post('http://localhost:4000/api/events', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
        alert('Event created successfully!');
        navigate('/events');
      }
    } catch (err) {
      console.error('Error saving event:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      let errorMessage = 'Failed to save event';
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>{isEdit ? 'Update Event' : 'Create Event'}</h2>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          type="text"
          name="name"
          placeholder="Event Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Event Description"
          value={form.description}
          onChange={handleChange}
          required
          style={{ minHeight: '100px' }}
        />

        <input
          type="text"
          name="location"
          placeholder="Event Location"
          value={form.location}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select name="category" value={form.category} onChange={handleChange}>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Cultural">Cultural</option>
          <option value="Workshop">Workshop</option>
          <option value="Other">Other</option>
        </select>

        <label>Event Dates:</label>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label>From:</label>
          <input
            type="date"
            name="dateFrom"
            value={form.dateFrom}
            onChange={handleChange}
            required
          />
          <label>To:</label>
          <input
            type="date"
            name="dateTo"
            value={form.dateTo}
            onChange={handleChange}
          />
        </div>
        
        <label>Time:</label>
        <input
          type="time"
          name="time"
          value={form.time}
          onChange={handleChange}
        />

        <label>Event Banner:</label>
        <input
          type="file"
          name="banner"
          accept="image/*"
          onChange={handleChange}
        />
        {isEdit && <small style={{ color: '#666' }}>Leave empty to keep existing banner</small>}

        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button type="submit" className="btn" disabled={loading}>
            {loading ? 'Saving...' : (isEdit ? 'Update Event' : 'Create Event')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate(isEdit ? `/events/${id}` : '/events')} 
            className="btn"
            style={{ backgroundColor: '#6c757d' }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default EventForm;