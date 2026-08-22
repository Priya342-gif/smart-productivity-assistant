const mongoose = require('mongoose');

const decisionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  situationSummary: {
    type: String,
    required: true
  },
  chosenAction: {
    type: String,
    required: true
  },
  reasoning: {
    type: String,
    required: true
  },
  outcomeFeedback: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Text index for search
decisionSchema.index({ situationSummary: 'text', reasoning: 'text' });

module.exports = mongoose.model('Decision', decisionSchema);
