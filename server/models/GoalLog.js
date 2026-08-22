const mongoose = require('mongoose');

const goalLogSchema = new mongoose.Schema({
  goalId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: String, // Store as YYYY-MM-DD for easy querying
    required: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
goalLogSchema.index({ goalId: 1, date: 1 });
goalLogSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('GoalLog', goalLogSchema);
