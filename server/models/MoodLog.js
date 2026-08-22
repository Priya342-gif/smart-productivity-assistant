const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  mood: {
    type: String,
    enum: ['energized', 'focused', 'neutral', 'tired', 'stressed', 'anxious', 'happy', 'sad'],
    required: true
  },
  energyLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  context: {
    type: String,  // extracted from conversation or user input
    default: ''
  },
  tags: [{
    type: String  // e.g., "morning", "after-exercise", "before-exam"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  }
});

// Index for time-based queries
moodLogSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('MoodLog', moodLogSchema);
