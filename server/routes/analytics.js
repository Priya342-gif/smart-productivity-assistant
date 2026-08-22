const express = require('express');
const router = express.Router();
const MoodLog = require('../models/MoodLog');
const {
  analyzeGoalPatterns,
  analyzeMoodPatterns,
  getComprehensiveInsights,
  extractMoodFromText
} = require('../services/analyticsService');

// Log mood manually
router.post('/mood', async (req, res) => {
  try {
    const { userId, mood, energyLevel, context, tags } = req.body;
    
    if (!userId || !mood || !energyLevel) {
      return res.status(400).json({ error: 'userId, mood, and energyLevel are required' });
    }
    
    const moodLog = new MoodLog({
      userId,
      mood,
      energyLevel,
      context: context || '',
      tags: tags || []
    });
    
    await moodLog.save();
    res.json({ moodLog });
  } catch (error) {
    console.error('Error logging mood:', error);
    res.status(500).json({ error: 'Failed to log mood' });
  }
});

// Extract and log mood from text
router.post('/mood/extract', async (req, res) => {
  try {
    const { userId, text } = req.body;
    
    if (!userId || !text) {
      return res.status(400).json({ error: 'userId and text are required' });
    }
    
    const { mood, energy } = extractMoodFromText(text);
    
    const moodLog = new MoodLog({
      userId,
      mood,
      energyLevel: energy,
      context: text.substring(0, 500)
    });
    
    await moodLog.save();
    res.json({ moodLog, extracted: { mood, energy } });
  } catch (error) {
    console.error('Error extracting mood:', error);
    res.status(500).json({ error: 'Failed to extract mood' });
  }
});

// Get mood history
router.get('/mood/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days } = req.query;
    
    const daysAgo = parseInt(days) || 14;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);
    
    const moodLogs = await MoodLog.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });
    
    res.json({ moodLogs });
  } catch (error) {
    console.error('Error getting mood history:', error);
    res.status(500).json({ error: 'Failed to get mood history' });
  }
});

// Get goal suggestions
router.get('/suggestions/goals/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const suggestions = await analyzeGoalPatterns(userId);
    res.json({ suggestions });
  } catch (error) {
    console.error('Error getting goal suggestions:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

// Get mood analysis
router.get('/analysis/mood/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { days } = req.query;
    
    const analysis = await analyzeMoodPatterns(userId, parseInt(days) || 14);
    res.json({ analysis });
  } catch (error) {
    console.error('Error analyzing mood:', error);
    res.status(500).json({ error: 'Failed to analyze mood' });
  }
});

// Get comprehensive insights
router.get('/insights/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const insights = await getComprehensiveInsights(userId);
    res.json({ insights });
  } catch (error) {
    console.error('Error getting insights:', error);
    res.status(500).json({ error: 'Failed to get insights' });
  }
});

module.exports = router;
