import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ParticipantsList() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        
        // Fetch event details
        const eventResponse = await axios.get(`http://localhost:4000/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setEvent(eventResponse.data);

        // Fetch participants
        const participantsResponse = await axios.get(`http://localhost:4000/api/events/${eventId}/participants`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setParticipants(participantsResponse.data);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load participants data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId]);

  const handleDeleteParticipant = async (participantId) => {
    if (!window.confirm('Are you sure you want to remove this participant?')) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/api/participants/${participantId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setParticipants(participants.filter(p => p._id !== participantId));
      alert('Participant removed successfully');
    } catch (err) {
      console.error('Error deleting participant:', err);
      alert('Failed to remove participant');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Registration Date'],
      ...participants.map(p => [
        p.name,
        p.email,
        p.phone || '',
        new Date(p.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event?.name || 'event'}_participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) return <div className="container"><p>Loading participants...</p></div>;
  if (error) return <div className="container"><p style={{color: 'red'}}>{error}</p></div>;

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Participants for: {event?.name}</h2>
        <button onClick={() => navigate(`/events/${eventId}`)} className="btn">
          Back to Event
        </button>
      </div>

      {event && (
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p><strong>Event Date:</strong> {new Date(event.dateFrom).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Total Participants:</strong> {participants.length}</p>
        </div>
      )}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button onClick={exportToCSV} className="btn" disabled={participants.length === 0}>
          Export to CSV
        </button>
        <span style={{ color: '#666' }}>
          {participants.length} participant{participants.length !== 1 ? 's' : ''} registered
        </span>
      </div>

      {participants.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <p>No participants registered yet.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white', borderRadius: '8px', overflow: 'hidden' }}>
            <thead>
              <tr style={{ backgroundColor: '#f63b3b', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Phone</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Registration Date</th>
                <th style={{ padding: '12px', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {participants.map((participant, index) => (
                <tr key={participant._id} style={{ 
                  borderBottom: '1px solid #dee2e6',
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa'
                }}>
                  <td style={{ padding: '12px' }}>{participant.name}</td>
                  <td style={{ padding: '12px' }}>{participant.email}</td>
                  <td style={{ padding: '12px' }}>{participant.phone || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    {new Date(participant.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button 
                      onClick={() => handleDeleteParticipant(participant._id)}
                      style={{ 
                        backgroundColor: '#dc3545', 
                        color: 'white', 
                        border: 'none', 
                        padding: '5px 10px', 
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ParticipantsList;