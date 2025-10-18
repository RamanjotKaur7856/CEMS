const express = require('express');
const Event = require('../models/Event');
const User = require('../models/User');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

/* -------------------- EVENT MANAGEMENT -------------------- */

// Create Event
router.post('/events', adminAuth, async (req, res) => {
  try {
    const newEvent = new Event(req.body);
    await newEvent.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get All Events
router.get('/events', adminAuth, async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Event by ID
router.get('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Event
router.put('/events/:id', adminAuth, async (req, res) => {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete Event
router.delete('/events/:id', adminAuth, async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* -------------------- USER MANAGEMENT -------------------- */

// View All Participants (normal users only)
router.get('/participants', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// View Participants of a Specific Event
router.get('/events/:id/participants', adminAuth, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('participants', '-password');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event.participants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Promote User to Admin
router.put('/users/:id/promote', adminAuth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User promoted to admin', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Demote Admin back to User
router.put('/users/:id/demote', adminAuth, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { role: 'user' },
      { new: true }
    ).select('-password');
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'Admin demoted to user', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
