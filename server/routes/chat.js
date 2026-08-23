const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { getChatResponse } = require('../services/groqService');

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
    
    console.log('📥 Received chat message:', { userId, message: message?.substring(0, 50) });
    
    if (!userId || !message) {
      console.error('❌ Missing userId or message');
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
    
    console.log('🤖 Getting bot response...');
    
    // Get bot response
    const botResponse = await getChatResponse(userId, message, recentMessages.slice(0, -1));
    
    console.log('✅ Got bot response, saving to database...');
    
    // Add assistant message
    conversation.messages.push({
      role: 'assistant',
      content: botResponse,
      timestamp: new Date()
    });
    
    conversation.updatedAt = new Date();
    await conversation.save();
    
    console.log('✅ Response sent to client');
    
    res.json({ 
      response: botResponse,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('❌ Error processing message:', error);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
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
