import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import EventDetails from './components/EventDetails';
import ParticipantForm from './components/ParticipantForm';
import ParticipantsList from './components/ParticipantsList';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminPanel from './components/AdminPanel';
import './App.css';

// Protected Route for Organizers
const OrganizerRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "organizer") return <Navigate to="/" replace />;
  return children;
};

// Protected Route for Admin
const AdminRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "admin") return <Navigate to="/" replace />;
  return children;
};

function App() {
  // Initialize user from localStorage
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    return token && role && name ? { name, role } : null;
  });

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventList user={user} />} />

        {/* Create Event only for organizer */}
        <Route
          path="/create"
          element={
            <OrganizerRoute user={user}>
              <EventForm />
            </OrganizerRoute>
          }
        />

        {/* Event Details accessible by all users */}
        <Route path="/events/:id" element={<EventDetails user={user} />} />

        {/* Edit Event - only for organizers/admins */}
        <Route 
          path="/events/update/:id" 
          element={
            user && (user.role === "organizer" || user.role === "admin") ? (
              <EventForm isEdit={true} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* View Participants - only for organizers/admins */}
        <Route 
          path="/participants/:eventId" 
          element={
            user && (user.role === "organizer" || user.role === "admin") ? (
              <ParticipantsList />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Registration only for students */}
        <Route
          path="/register/:eventId"
          element={
            !user ? (
              <Navigate to="/login" replace />
            ) : user.role === "student" ? (
              <ParticipantForm />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />

        {/* Admin Panel - only for admins */}
        <Route
          path="/admin"
          element={
            <AdminRoute user={user}>
              <AdminPanel />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;