const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: false,
    trim: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Optional, in case anonymous registration is allowed
  }
}, {
  timestamps: true
});

// Prevent duplicate registrations
participantSchema.index({ email: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Participant', participantSchema);