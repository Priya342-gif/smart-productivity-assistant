const GoalLog = require('../models/GoalLog');

/**
 * Calculate current streak for a goal
 * Counts consecutive completed days backwards from today
 * Includes 1-day grace period (can be toggled)
 */
async function calculateStreak(goalId, userId, allowGracePeriod = true) {
  const logs = await GoalLog.find({ 
    goalId, 
    userId,
    completed: true 
  })
    .sort({ date: -1 })
    .lean();

  if (logs.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = formatDate(today);

  let streak = 0;
  let currentDate = new Date(today);
  let gracePeriodUsed = false;

  // Check if today is completed
  const todayLog = logs.find(log => log.date === todayStr);
  if (!todayLog) {
    // If today isn't done, start checking from yesterday
    currentDate.setDate(currentDate.getDate() - 1);
  }

  // Build a Set of completed dates for O(1) lookup
  const completedDates = new Set(logs.map(log => log.date));

  // Count backwards from current date
  while (true) {
    const dateStr = formatDate(currentDate);
    
    if (completedDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
      gracePeriodUsed = false; // Reset grace period if we find a completed day
    } else {
      // Day was missed
      if (allowGracePeriod && !gracePeriodUsed) {
        // Use grace period once
        gracePeriodUsed = true;
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      } else {
        // Streak broken
        break;
      }
    }
  }

  return streak;
}

/**
 * Get streaks for multiple goals at once
 */
async function getStreaksForGoals(goalIds, userId, allowGracePeriod = true) {
  const streakPromises = goalIds.map(goalId => 
    calculateStreak(goalId, userId, allowGracePeriod)
  );
  const streaks = await Promise.all(streakPromises);
  
  const streakMap = {};
  goalIds.forEach((goalId, index) => {
    streakMap[goalId.toString()] = streaks[index];
  });
  
  return streakMap;
}

/**
 * Check if goal was completed today
 */
async function isCompletedToday(goalId, userId) {
  const todayStr = formatDate(new Date());
  const log = await GoalLog.findOne({ 
    goalId, 
    userId, 
    date: todayStr,
    completed: true 
  });
  return !!log;
}

/**
 * Mark goal as done for today
 */
async function markGoalDone(goalId, userId) {
  const todayStr = formatDate(new Date());
  
  // Check if already marked
  let log = await GoalLog.findOne({ goalId, userId, date: todayStr });
  
  if (log) {
    log.completed = true;
  } else {
    log = new GoalLog({
      goalId,
      userId,
      date: todayStr,
      completed: true
    });
  }
  
  await log.save();
  const streak = await calculateStreak(goalId, userId);
  
  return { log, streak };
}

/**
 * Unmark goal for today
 */
async function unmarkGoalDone(goalId, userId) {
  const todayStr = formatDate(new Date());
  await GoalLog.deleteOne({ goalId, userId, date: todayStr });
  const streak = await calculateStreak(goalId, userId);
  return { streak };
}

// Helper to format date as YYYY-MM-DD
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

module.exports = {
  calculateStreak,
  getStreaksForGoals,
  isCompletedToday,
  markGoalDone,
  unmarkGoalDone,
  formatDate
};
