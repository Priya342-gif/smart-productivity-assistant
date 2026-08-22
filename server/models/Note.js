const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['quick', 'reflection', 'task-linked'],
    default: 'quick'
  },
  linkedGoalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
noteSchema.index({ text: 'text' });

module.exports = mongoose.model('Note', noteSchema);
