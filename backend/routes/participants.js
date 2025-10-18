const express = require('express');
const router = express.Router();
const Participant = require('../models/Participant');
const { authMiddleware } = require('../middleware/authMiddleware');

// DELETE a participant (protected - organizer/admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    // Check if user has permission
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    await Participant.findByIdAndDelete(req.params.id);
    res.json({ message: 'Participant removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET all participants for an event (protected)
router.get('/event/:eventId', authMiddleware, async (req, res) => {
  try {
    if (req.user.role === 'student') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const participants = await Participant.find({ eventId: req.params.eventId }).sort({ createdAt: -1 });
    res.json(participants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;