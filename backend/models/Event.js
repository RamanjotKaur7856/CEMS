const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Tech', 'Sports', 'Cultural', 'Workshop', 'Other']
  },
  dateFrom: {
    type: Date,
    required: true
  },
  dateTo: {
    type: Date
  },
  time: {
    type: String
  },
  banner: { 
    type: String // file path or URL
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
