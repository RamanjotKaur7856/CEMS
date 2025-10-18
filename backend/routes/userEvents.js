const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/authMiddleware');
const Participant = require('../models/Participant');

// Register for event (already exists)
router.post('/register/:eventId', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can register' });
    }

    const participantExists = await Participant.findOne({
      eventId: req.params.eventId,
      email: user.email,
    });

    if (participantExists) {
      return res.status(400).json({ message: 'Already registered' });
    }

    const participant = new Participant({
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      eventId: req.params.eventId,
    });

    await participant.save();
    res.json({ message: 'Successfully registered!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// **New route: get participants for an event**
router.get('/participants/:eventId', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    // Only organizer can fetch participants
    if (user.role !== 'organizer') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const participants = await Participant.find({ eventId: req.params.eventId });
    res.json(participants);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch participants' });
  }
});

module.exports = router;
