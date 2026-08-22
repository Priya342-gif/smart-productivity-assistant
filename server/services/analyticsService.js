const Goal = require('../models/Goal');
const GoalLog = require('../models/GoalLog');
const MoodLog = require('../models/MoodLog');
const FocusSession = require('../models/FocusSession');
const { calculateStreak } = require('./streakService');

/**
 * Analyze goal completion patterns
 */
async function analyzeGoalPatterns(userId) {
  const goals = await Goal.find({ userId, isActive: true });
  const suggestions = [];
  
  for (const goal of goals) {
    // Check last 7 days of logs
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentLogs = await GoalLog.find({
      goalId: goal._id,
      userId,
      date: { $gte: sevenDaysAgo.toISOString().split('T')[0] }
    });
    
    const completedDays = recentLogs.filter(log => log.completed).length;
    const streak = await calculateStreak(goal._id, userId);
    
    // Generate suggestions based on patterns
    if (completedDays === 0 && recentLogs.length >= 3) {
      suggestions.push({
        type: 'struggling',
        goalId: goal._id,
        goalTitle: goal.title,
        message: `You haven't completed "${goal.title}" in the last 7 days. Would you like to adjust this goal or break it into smaller steps?`,
        severity: 'high'
      });
    } else if (completedDays <= 2 && recentLogs.length >= 5) {
      suggestions.push({
        type: 'low_completion',
        goalId: goal._id,
        goalTitle: goal.title,
        message: `"${goal.title}" is being completed less often. Consider making it easier or more specific.`,
        severity: 'medium'
      });
    } else if (streak >= 7 && streak < 30) {
      suggestions.push({
        type: 'encouragement',
        goalId: goal._id,
        goalTitle: goal.title,
        message: `Great job on your ${streak}-day streak for "${goal.title}"! Keep it up!`,
        severity: 'positive'
      });
    }
  }
  
  return suggestions;
}

/**
 * Analyze mood and energy patterns
 */
async function analyzeMoodPatterns(userId, days = 14) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const moodLogs = await MoodLog.find({
    userId,
    createdAt: { $gte: startDate }
  }).sort({ createdAt: 1 });
  
  if (moodLogs.length === 0) {
    return { insights: [], avgEnergy: 0 };
  }
  
  // Calculate average energy
  const avgEnergy = moodLogs.reduce((sum, log) => sum + log.energyLevel, 0) / moodLogs.length;
  
  // Detect patterns
  const insights = [];
  
  // Low energy trend
  const recentLogs = moodLogs.slice(-5);
  const recentAvg = recentLogs.reduce((sum, log) => sum + log.energyLevel, 0) / recentLogs.length;
  
  if (recentAvg < 4) {
    insights.push({
      type: 'low_energy',
      message: 'Your energy levels have been low recently. Consider taking a break or adjusting your goals.',
      severity: 'medium'
    });
  } else if (recentAvg >= 7) {
    insights.push({
      type: 'high_energy',
      message: 'Your energy levels are great! This might be a good time to tackle challenging goals.',
      severity: 'positive'
    });
  }
  
  // Stress detection
  const stressedCount = moodLogs.filter(log => log.mood === 'stressed' || log.mood === 'anxious').length;
  if (stressedCount > moodLogs.length * 0.3) {
    insights.push({
      type: 'stress',
      message: 'You\'ve been stressed lately. Remember to take breaks and practice self-care.',
      severity: 'high'
    });
  }
  
  return {
    avgEnergy: avgEnergy.toFixed(1),
    insights,
    moodDistribution: getMoodDistribution(moodLogs)
  };
}

function getMoodDistribution(moodLogs) {
  const distribution = {};
  moodLogs.forEach(log => {
    distribution[log.mood] = (distribution[log.mood] || 0) + 1;
  });
  return distribution;
}

/**
 * Extract mood/energy from conversation text
 */
function extractMoodFromText(text) {
  const lowerText = text.toLowerCase();
  
  // Energy indicators
  const highEnergyWords = ['energized', 'motivated', 'excited', 'great', 'awesome', 'fantastic'];
  const lowEnergyWords = ['tired', 'exhausted', 'drained', 'sleepy', 'fatigue'];
  
  // Mood indicators
  const stressWords = ['stressed', 'anxious', 'worried', 'overwhelmed', 'pressure'];
  const happyWords = ['happy', 'joyful', 'glad', 'pleased', 'satisfied'];
  const sadWords = ['sad', 'depressed', 'down', 'upset', 'disappointed'];
  
  let mood = 'neutral';
  let energy = 5;
  
  // Detect mood
  if (stressWords.some(word => lowerText.includes(word))) mood = 'stressed';
  else if (sadWords.some(word => lowerText.includes(word))) mood = 'sad';
  else if (happyWords.some(word => lowerText.includes(word))) mood = 'happy';
  
  // Detect energy
  if (highEnergyWords.some(word => lowerText.includes(word))) energy = 8;
  else if (lowEnergyWords.some(word => lowerText.includes(word))) energy = 3;
  
  return { mood, energy };
}

/**
 * Get comprehensive insights for user
 */
async function getComprehensiveInsights(userId) {
  const [goalSuggestions, moodAnalysis] = await Promise.all([
    analyzeGoalPatterns(userId),
    analyzeMoodPatterns(userId)
  ]);
  
  return {
    goalSuggestions,
    moodAnalysis,
    generatedAt: new Date()
  };
}

module.exports = {
  analyzeGoalPatterns,
  analyzeMoodPatterns,
  extractMoodFromText,
  getComprehensiveInsights
};
