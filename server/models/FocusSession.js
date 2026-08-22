const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: false  // Can be a general study session without specific goal
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: false  // null if session is ongoing
  },
  duration: {
    type: Number,  // in minutes
    required: false
  },
  sessionType: {
    type: String,
    enum: ['focus', 'break'],
    default: 'focus'
  },
  completed: {
    type: Boolean,
    default: false  // true if finished naturally, false if stopped early
  },
  notes: {
    type: String,
    default: ''
  },
  pausedDuration: {
    type: Number,  // total paused time in minutes
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient queries
focusSessionSchema.index({ userId: 1, createdAt: -1 });
focusSessionSchema.index({ userId: 1, goalId: 1 });

// Calculate duration before saving
focusSessionSchema.pre('save', function(next) {
  if (this.endTime && this.startTime) {
    const diffMs = this.endTime - this.startTime;
    this.duration = Math.round(diffMs / 60000) - this.pausedDuration; // convert to minutes
  }
  next();
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);
