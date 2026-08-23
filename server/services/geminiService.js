const { GoogleGenerativeAI } = require('@google/generative-ai');
const Decision = require('../models/Decision');
const Goal = require('../models/Goal');
const Note = require('../models/Note');
const MoodLog = require('../models/MoodLog');
const { extractMoodFromText } = require('./analyticsService');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const SYSTEM_PROMPT = `You are a personal decision counselor and accountability partner for Life OS. Your role is to help users make better decisions, prioritize tasks, and stay accountable to their goals.

CORE BEHAVIORS:
1. ALWAYS check the user's context (goals, past decisions, notes) before responding
2. ALWAYS show trade-offs when suggesting a plan (e.g., "Prioritizing X means Y gets delayed")
3. ALWAYS include TIME-BLOCKED schedules in your action plans
4. NEVER be preachy or give generic advice - ground everything in the user's actual data
5. Ask "why" when learning about new goals - motivation matters

TONE:
- Warm, direct, non-judgmental - like a therapist crossed with a sharp friend
- Celebrate wins genuinely, reframe failures gently
- Never guilt-trip - if streaks break, suggest smaller/easier versions
- Be curious about patterns, not critical

CONFLICT DETECTION:
- If a new task conflicts with existing plans, flag it proactively
- Ask which should take priority, don't silently overwrite

DECISION MEMORY:
- When you make a decision with reasoning, note it
- When similar situations arise, reference past decisions naturally

MILESTONES:
- Acknowledge 7-day, 30-day, and longer streaks with specific warm messages
- Tie short-term wins back to long-term goals when relevant

Remember: This is a personal tool, not enterprise software. Users trust you to remember everything and give honest, contextual advice.`;


/**
 * Get relevant context for the chatbot
 */
async function getUserContext(userId) {
  // Get active goals
  const goals = await Goal.find({ userId, isActive: true }).lean();
  
  // Get recent decisions (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentDecisions = await Decision.find({ 
    userId, 
    createdAt: { $gte: thirtyDaysAgo } 
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  
  // Get recent notes (last 14 days)
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const recentNotes = await Note.find({ 
    userId, 
    createdAt: { $gte: fourteenDaysAgo } 
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  
  // Get recent mood logs (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentMoods = await MoodLog.find({
    userId,
    createdAt: { $gte: sevenDaysAgo }
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  
  return { goals, recentDecisions, recentNotes, recentMoods };
}

/**
 * Search for similar past decisions
 */
async function findSimilarDecisions(userId, query) {
  try {
    const decisions = await Decision.find(
      { 
        userId,
        $text: { $search: query } 
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(3)
      .lean();
    
    return decisions;
  } catch (error) {
    // If text search fails, return empty array
    console.error('Text search error:', error);
    return [];
  }
}

/**
 * Format context for Claude
 */
function formatContextForClaude(context) {
  let contextText = '\n=== USER CONTEXT ===\n';
  
  // Goals
  if (context.goals && context.goals.length > 0) {
    contextText += '\nACTIVE GOALS:\n';
    context.goals.forEach((goal, i) => {
      contextText += `${i + 1}. ${goal.title}\n   Why: ${goal.reason}\n   Started: ${goal.createdAt.toLocaleDateString()}\n`;
      if (goal.totalFocusTime > 0) {
        contextText += `   Total Focus Time: ${(goal.totalFocusTime / 60).toFixed(1)} hours\n`;
      }
    });
  } else {
    contextText += '\nNo active goals set yet.\n';
  }
  
  // Recent mood & energy
  if (context.recentMoods && context.recentMoods.length > 0) {
    const latestMood = context.recentMoods[0];
    const avgEnergy = context.recentMoods.reduce((sum, m) => sum + m.energyLevel, 0) / context.recentMoods.length;
    contextText += `\nRECENT MOOD & ENERGY:\n`;
    contextText += `Latest mood: ${latestMood.mood} (Energy: ${latestMood.energyLevel}/10)\n`;
    contextText += `Recent average energy: ${avgEnergy.toFixed(1)}/10\n`;
    
    // Check for stress patterns
    const stressedCount = context.recentMoods.filter(m => m.mood === 'stressed' || m.mood === 'anxious').length;
    if (stressedCount > context.recentMoods.length * 0.3) {
      contextText += `⚠️ User has been stressed/anxious recently - be extra supportive and gentle.\n`;
    }
  }
  
  // Recent decisions
  if (context.recentDecisions && context.recentDecisions.length > 0) {
    contextText += '\nRECENT DECISIONS (last 30 days):\n';
    context.recentDecisions.forEach((decision, i) => {
      contextText += `${i + 1}. ${decision.situationSummary}\n   Action: ${decision.chosenAction}\n   Reasoning: ${decision.reasoning}\n`;
      if (decision.outcomeFeedback) {
        contextText += `   Outcome: ${decision.outcomeFeedback}\n`;
      }
      contextText += `   Date: ${decision.createdAt.toLocaleDateString()}\n\n`;
    });
  }
  
  // Recent notes
  if (context.recentNotes && context.recentNotes.length > 0) {
    contextText += '\nRECENT NOTES & REFLECTIONS (last 14 days):\n';
    context.recentNotes.forEach((note, i) => {
      contextText += `${i + 1}. [${note.type}] ${note.text}\n   Date: ${note.createdAt.toLocaleDateString()}\n`;
    });
  }
  
  contextText += '\n=== END CONTEXT ===\n';
  return contextText;
}

/**
 * Get chatbot response using Google Gemini
 */
async function getChatResponse(userId, userMessage, conversationHistory = []) {
  // Extract and log mood from user message
  try {
    const { mood, energy } = extractMoodFromText(userMessage);
    const moodLog = new MoodLog({
      userId,
      mood,
      energyLevel: energy,
      context: userMessage.substring(0, 500)
    });
    await moodLog.save();
  } catch (err) {
    console.error('Error logging mood:', err);
    // Continue even if mood logging fails
  }
  
  // Get user context
  const context = await getUserContext(userId);
  
  // Search for similar past decisions
  const similarDecisions = await findSimilarDecisions(userId, userMessage);
  if (similarDecisions.length > 0) {
    context.similarDecisions = similarDecisions;
  }
  
  // Format context
  const contextText = formatContextForClaude(context);
  
  // Build conversation history for Gemini
  const historyForGemini = conversationHistory.map(msg => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));
  
  // Initialize Gemini model (using free tier model)
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_PROMPT
  });
  
  // Create chat session with history
  const chat = model.startChat({
    history: historyForGemini,
    generationConfig: {
      maxOutputTokens: 2000,
      temperature: 0.7,
    },
  });
  
  // Send message with context
  const fullMessage = contextText + '\n' + userMessage;
  const result = await chat.sendMessage(fullMessage);
  const response = await result.response;
  const assistantMessage = response.text();
  
  // Try to detect if this was a decision-making conversation
  // and save it (simplified heuristic for MVP)
  await tryExtractAndSaveDecision(userId, userMessage, assistantMessage);
  
  return assistantMessage;
}

/**
 * Extract and save decision if detected
 * This is a simple heuristic - can be improved with better parsing
 */
async function tryExtractAndSaveDecision(userId, userMessage, assistantMessage) {
  // Check if the conversation looks like decision-making
  const decisionKeywords = [
    'prioritize', 'schedule', 'plan', 'decide', 'choose',
    'action plan', 'should i', 'what should', 'time block'
  ];
  
  const isDecisionConversation = decisionKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword) || 
    assistantMessage.toLowerCase().includes(keyword)
  );
  
  if (isDecisionConversation && assistantMessage.length > 100) {
    // Extract reasoning (simplified - look for explanations)
    const decision = new Decision({
      userId,
      situationSummary: userMessage.substring(0, 500), // Truncate if too long
      chosenAction: assistantMessage.substring(0, 500),
      reasoning: assistantMessage.substring(0, 1000)
    });
    
    await decision.save();
  }
}

module.exports = {
  getChatResponse,
  getUserContext,
  findSimilarDecisions
};
