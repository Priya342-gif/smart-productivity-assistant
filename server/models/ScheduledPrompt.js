const mongoose = require('mongoose');

const scheduledPromptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  promptType: {
    type: String,
    enum: ['morning', 'evening', 'custom'],
    required: true
  },
  time: {
    type: String,  // Format: "09:00" (24-hour)
    required: true
  },
  message: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  lastTriggered: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

scheduledPromptSchema.index({ userId: 1, enabled: 1 });

module.exports = mongoose.model('ScheduledPrompt', scheduledPromptSchema);
