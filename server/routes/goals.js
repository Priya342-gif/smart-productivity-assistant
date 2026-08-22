const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { 
  calculateStreak, 
  getStreaksForGoals,
  isCompletedToday,
  markGoalDone,
  unmarkGoalDone
} = require('../services/streakService');

// Get all goals for user with streaks
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const goals = await Goal.find({ userId, isActive: true }).lean();
    
    // Calculate streaks for all goals
    const goalIds = goals.map(g => g._id);
    const streaks = await getStreaksForGoals(goalIds, userId);
    
    // Check completion status for today
    const completionPromises = goals.map(goal => 
      isCompletedToday(goal._id, userId)
    );
    const completions = await Promise.all(completionPromises);
    
    // Merge data
    const goalsWithStreaks = goals.map((goal, index) => ({
      ...goal,
      streak: streaks[goal._id.toString()] || 0,
      completedToday: completions[index]
    }));
    
    res.json({ goals: goalsWithStreaks });
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
});

// Create new goal
router.post('/', async (req, res) => {
  try {
    const { userId, title, reason } = req.body;
    
    if (!userId || !title || !reason) {
      return res.status(400).json({ 
        error: 'userId, title, and reason are required' 
      });
    }
    
    const goal = new Goal({
      userId,
      title,
      reason,
      isActive: true
    });
    
    await goal.save();
    
    res.json({ 
      goal: {
        ...goal.toObject(),
        streak: 0,
        completedToday: false
      }
    });
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

// Toggle goal completion for today
router.post('/:goalId/toggle', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }
    
    const completedToday = await isCompletedToday(goalId, userId);
    
    let result;
    if (completedToday) {
      result = await unmarkGoalDone(goalId, userId);
    } else {
      result = await markGoalDone(goalId, userId);
    }
    
    res.json({ 
      completedToday: !completedToday,
      streak: result.streak
    });
  } catch (error) {
    console.error('Error toggling goal:', error);
    res.status(500).json({ error: 'Failed to toggle goal' });
  }
});

// Delete goal (soft delete - set inactive)
router.delete('/:goalId', async (req, res) => {
  try {
    const { goalId } = req.params;
    const { userId } = req.body;
    
    await Goal.findOneAndUpdate(
      { _id: goalId, userId },
      { isActive: false }
    );
    
    res.json({ message: 'Goal deleted' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
});

module.exports = router;
