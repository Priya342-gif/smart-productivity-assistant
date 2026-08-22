const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get or create user (simple auth for MVP)
router.post('/auth', async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ error: 'name and email are required' });
    }
    
    // Find existing user or create new one
    let user = await User.findOne({ email });
    
    if (!user) {
      user = new User({ name, email });
      await user.save();
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error authenticating user:', error);
    res.status(500).json({ error: 'Failed to authenticate user' });
  }
});

// Get user by ID
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

module.exports = router;
