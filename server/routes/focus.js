const express = require('express');
const router = express.Router();
const {
  startFocusSession,
  endFocusSession,
  getOngoingSession,
  getDailyStats,
  getMultiDayStats,
  pauseSession,
  resumeSession
} = require('../services/focusService');

// Start a focus session
router.post('/start', async (req, res) => {
  try {
    const { userId, goalId, sessionType } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    // Check if there's already an ongoing session
    const ongoing = await getOngoingSession(userId);
    if (ongoing) {
      return res.status(400).json({ 
        error: 'You already have an ongoing session',
        session: ongoing
      });
    }
    
    const session = await startFocusSession(userId, goalId, sessionType);
    res.json({ session });
  } catch (error) {
    console.error('Error starting focus session:', error);
    res.status(500).json({ error: 'Failed to start focus session' });
  }
});

// End a focus session
router.post('/end/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { completed, notes } = req.body;
    
    const session = await endFocusSession(sessionId, completed, notes);
    res.json({ session });
  } catch (error) {
    console.error('Error ending focus session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Pause a session
router.post('/pause/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await pauseSession(sessionId);
    res.json({ session });
  } catch (error) {
    console.error('Error pausing session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Resume a session
router.post('/resume/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const session = await resumeSession(sessionId);
    res.json({ session });
  } catch (error) {
    console.error('Error resuming session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get ongoing session
router.get('/ongoing/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const session = await getOngoingSession(userId);
    res.json({ session });
  } catch (error) {
    console.error('Error getting ongoing session:', error);
    res.status(500).json({ error: 'Failed to get ongoing session' });
  }
});

// Get daily stats
router.get('/stats/daily/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { date } = req.query;
    
    const statsDate = date ? new Date(date) : new Date();
    const stats = await getDailyStats(userId, statsDate);
    
    res.json({ stats });
  } catch (error) {
    console.error('Error getting daily stats:', error);
    res.status(500).json({ error: 'Failed to get daily stats' });
  }
});

// Get multi-day stats
router.get('/stats/:userId/:days', async (req, res) => {
  try {
    const { userId, days } = req.params;
    const numDays = parseInt(days) || 10;
    
    const stats = await getMultiDayStats(userId, numDays);
    res.json({ stats });
  } catch (error) {
    console.error('Error getting multi-day stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

module.exports = router;
