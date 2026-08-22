const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { getChatResponse } = require('../services/geminiService');

// Get conversation history
router.get('/history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await Conversation.findOne({ userId })
      .sort({ updatedAt: -1 });
    
    res.json({ 
      messages: conversation ? conversation.messages : [] 
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation history' });
  }
});

// Send message and get response
router.post('/message', async (req, res) => {
  try {
    const { userId, message } = req.body;
    
    if (!userId || !message) {
      return res.status(400).json({ error: 'userId and message are required' });
    }
    
    // Get or create conversation
    let conversation = await Conversation.findOne({ userId });
    if (!conversation) {
      conversation = new Conversation({ userId, messages: [] });
    }
    
    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });
    
    // Get conversation history for context (last 10 messages)
    const recentMessages = conversation.messages.slice(-10).map(msg => ({
      role: msg.role,
      content: msg.content
    }));
    
    // Get bot response
    const botResponse = await getChatResponse(userId, message, recentMessages.slice(0, -1));
    
    // Add assistant message
    conversation.messages.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date()
    });
    
    conversation.updatedAt = new Date();
    await conversation.save();
    
    res.json({ 
      response: botResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

// Clear conversation
router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    await Conversation.deleteMany({ userId });
    res.json({ message: 'Conversation cleared' });
  } catch (error) {
    console.error('Error clearing conversation:', error);
    res.status(500).json({ error: 'Failed to clear conversation' });
  }
});

module.exports = router;
