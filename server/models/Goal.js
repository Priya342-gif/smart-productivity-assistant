const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalFocusTime: {
    type: Number,  // total minutes spent on this goal
    default: 0
  },
  lastFocusSession: {
    type: Date,
    default: null
  },
  focusGoalMinutes: {
    type: Number,  // daily goal in minutes (optional)
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', goalSchema);
