const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Participant = require('../models/Participant');
const { authMiddleware } = require('../middleware/authMiddleware');
const path = require('path');
const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // must match the folder you created
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage: storage });




// GET all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('createdBy', 'name email').sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// CREATE new event (protected - organizer only)
router.post('/', authMiddleware, upload.single('banner'), async (req, res) => {
  try {
    const { name, description, location, category, dateFrom, dateTo, time } = req.body;
    
    // Check if user is organizer
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ error: 'Only organizers can create events' });
    }

    const eventData = {
      name,
      description,
      location,
      category,
      dateFrom,
      dateTo,
      time,
      createdBy: req.user._id
    };

    // Add banner path if file was uploaded
    if (req.file) {
      eventData.banner = req.file.path;
    }

    const event = new Event(eventData);
    await event.save();
    
    // Populate the createdBy field for response
    await event.populate('createdBy', 'name email');
    
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// UPDATE event (protected - organizer who created it)
router.put('/:id', authMiddleware, upload.single('banner'), async (req, res) => {
  try {
    console.log('Update request for event ID:', req.params.id);
    console.log('Request body:', req.body);
    console.log('User role:', req.user.role);
    console.log('User ID:', req.user._id);

    const event = await Event.findById(req.params.id);
    
    if (!event) {
      console.log('Event not found');
      return res.status(404).json({ error: 'Event not found' });
    }

    console.log('Event found, created by:', event.createdBy);
    console.log('Current user:', req.user._id);

    // Check if user is the creator or admin
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      console.log('Authorization failed');
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      location: req.body.location,
      category: req.body.category,
      dateFrom: req.body.dateFrom,
      dateTo: req.body.dateTo,
      time: req.body.time
    };
    
    // Add banner path if new file was uploaded
    if (req.file) {
      updateData.banner = req.file.path;
      console.log('New banner uploaded:', req.file.path);
    }

    console.log('Update data:', updateData);

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id, 
      updateData, 
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    console.log('Event updated successfully');
    res.json(updatedEvent);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: error.message });
  }
});

// DELETE event (protected - organizer who created it or admin)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the creator or admin
    if (req.user.role !== 'admin' && event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    
    // Also delete all participants for this event
    await Participant.deleteMany({ eventId: req.params.id });
    
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET participants for an event (protected)
router.get('/:id/participants', authMiddleware, async (req, res) => {
  try {
    // Check if user has permission (admin, organizer, or creator of event)
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const participants = await Participant.find({ eventId: req.params.id });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;