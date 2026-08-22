const FocusSession = require('../models/FocusSession');
const Goal = require('../models/Goal');

/**
 * Start a new focus session
 */
async function startFocusSession(userId, goalId, sessionType = 'focus') {
  const session = new FocusSession({
    userId,
    goalId: goalId || null,
    startTime: new Date(),
    sessionType,
    completed: false
  });
  
  await session.save();
  return session;
}

/**
 * End a focus session
 */
async function endFocusSession(sessionId, completed = true, notes = '') {
  const session = await FocusSession.findById(sessionId);
  
  if (!session) {
    throw new Error('Session not found');
  }
  
  if (session.endTime) {
    throw new Error('Session already ended');
  }
  
  session.endTime = new Date();
  session.completed = completed;
  session.notes = notes;
  
  await session.save();
  
  // Update goal's total focus time if linked to a goal
  if (session.goalId && session.sessionType === 'focus') {
    await Goal.findByIdAndUpdate(session.goalId, {
      $inc: { totalFocusTime: session.duration },
      lastFocusSession: session.endTime
    });
  }
  
  return session;
}

/**
 * Get ongoing session for user
 */
async function getOngoingSession(userId) {
  const session = await FocusSession.findOne({
    userId,
    endTime: null
  }).sort({ startTime: -1 });
  
  return session;
}

/**
 * Get daily statistics
 */
async function getDailyStats(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const sessions = await FocusSession.find({
    userId,
    startTime: { $gte: startOfDay, $lte: endOfDay },
    sessionType: 'focus',
    endTime: { $ne: null }
  }).populate('goalId', 'title');
  
  const totalMinutes = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const completedSessions = sessions.filter(s => s.completed).length;
  const totalSessions = sessions.length;
  
  // Group by goal
  const byGoal = {};
  sessions.forEach(session => {
    if (session.goalId) {
      const goalTitle = session.goalId.title;
      if (!byGoal[goalTitle]) {
        byGoal[goalTitle] = 0;
      }
      byGoal[goalTitle] += session.duration || 0;
    }
  });
  
  return {
    date: date,
    totalMinutes,
    totalHours: (totalMinutes / 60).toFixed(1),
    sessions: totalSessions,
    completedSessions,
    byGoal,
    sessionList: sessions
  };
}

/**
 * Get stats for last N days
 */
async function getMultiDayStats(userId, days = 10) {
  const stats = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayStats = await getDailyStats(userId, date);
    stats.push(dayStats);
  }
  
  return stats;
}

/**
 * Pause a session (track paused duration)
 */
async function pauseSession(sessionId) {
  const session = await FocusSession.findById(sessionId);
  if (!session) throw new Error('Session not found');
  
  // Store pause start time in a temporary field
  session.pauseStartTime = new Date();
  await session.save();
  
  return session;
}

/**
 * Resume a paused session
 */
async function resumeSession(sessionId) {
  const session = await FocusSession.findById(sessionId);
  if (!session) throw new Error('Session not found');
  
  if (session.pauseStartTime) {
    const pauseDuration = (new Date() - session.pauseStartTime) / 60000; // minutes
    session.pausedDuration += Math.round(pauseDuration);
    session.pauseStartTime = null;
    await session.save();
  }
  
  return session;
}

module.exports = {
  startFocusSession,
  endFocusSession,
  getOngoingSession,
  getDailyStats,
  getMultiDayStats,
  pauseSession,
  resumeSession
};
