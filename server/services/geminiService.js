const { GoogleGenerativeAI } = require('@google/generative-ai');
const Decision = require('../models/Decision');
const Goal = require('../models/Goal');
const Note = require('../models/Note');
const MoodLog = require('../models/MoodLog');
const { extractMoodFromText } = require('./analyticsService');

// Initialize Gemini with API key
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('❌ GEMINI_API_KEY not found in environment variables!');
  throw new Error('GEMINI_API_KEY environment variable is required');
}
console.log('✅ Gemini API Key loaded:', `${apiKey.substring(0, 10)}...`);

const genAI = new GoogleGenerativeAI(apiKey);

// Current supported model names (as of August 2026)
// Gemini 1.5.x and 2.0.x are retired/being retired — do NOT use them
const SUPPORTED_MODELS = [
  'gemini-2.5-flash',       // Best balance of speed/intelligence, GA
  'gemini-2.5-flash-lite',  // Cheaper/faster fallback, GA
  'gemini-2.5-pro'          // Heaviest fallback, GA
];

let cachedModel = null;
let cachedModelName = null;

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
 * Initialize and verify a Gemini model
 * This actually tests the model with a real API call to catch auth/model errors early
 */
async function initializeModel() {
  if (cachedModel && cachedModelName) {
    console.log(`✅ Using cached model: ${cachedModelName}`);
    return { model: cachedModel, modelName: cachedModelName };
  }

  console.log('🔄 Initializing Gemini model...');
  
  for (const modelName of SUPPORTED_MODELS) {
    try {
      console.log(`   Trying model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      
      // CRITICAL: Test the model with a real API call to verify it works
      // This catches bad model names, auth errors, and quota issues immediately
      console.log(`   Testing ${modelName} with real API call...`);
      const testResult = await model.generateContent('Test');
      const response = await testResult.response;
      const text = response.text();
      
      if (!text) {
        throw new Error('Model returned empty response');
      }
      
      console.log(`✅ Model verified and working: ${modelName}`);
      
      // Cache the working model
      cachedModel = model;
      cachedModelName = modelName;
      
      return { model, modelName };
    } catch (err) {
      console.error(`❌ Model ${modelName} failed:`, err.message);
      
      // Provide helpful error messages
      if (err.message.includes('401') || err.message.includes('Unauthorized')) {
        console.error('   → This looks like an API key issue or model deprecation');
      } else if (err.message.includes('404') || err.message.includes('Not Found')) {
        console.error('   → This model name is not available');
      } else if (err.message.includes('quota') || err.message.includes('limit')) {
        console.error('   → API quota exceeded');
      }
    }
  }
  
  // If we get here, all models failed
  throw new Error(
    `Failed to initialize any Gemini model. Tried: ${SUPPORTED_MODELS.join(', ')}. ` +
    'Check your API key, network connection, and that Gemini API is enabled in your Google Cloud project.'
  );
}

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
    console.error('Text search error:', error);
    return [];
  }
}

/**
 * Format context for AI
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
  try {
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
    
    // Initialize model (with real API verification)
    const { model, modelName } = await initializeModel();
    console.log(`📤 Sending message to Gemini (model: ${modelName})...`);
    
    // Build conversation history for Gemini
    const historyForGemini = conversationHistory.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));
    
    // Create chat session with history and system instruction
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: SYSTEM_PROMPT }]
        },
        {
          role: 'model',
          parts: [{ text: 'Understood. I will act as your personal decision counselor and accountability partner, helping you make better decisions based on your goals, past decisions, and context.' }]
        },
        ...historyForGemini
      ],
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
    
    console.log('✅ Received response from Gemini');
    
    // Try to detect if this was a decision-making conversation
    await tryExtractAndSaveDecision(userId, userMessage, assistantMessage);
    
    return assistantMessage;
  } catch (error) {
    console.error('❌ Error in getChatResponse:', error);
    console.error('   Error message:', error.message);
    console.error('   Error stack:', error.stack);
    
    // Clear cached model on error so next request tries again
    cachedModel = null;
    cachedModelName = null;
    
    // Return helpful error messages
    if (error.message.includes('API key')) {
      throw new Error('Gemini API key error. Please check your API key configuration.');
    } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      throw new Error('Gemini API authentication failed. Your API key may be invalid, expired, or the model may be deprecated. Please check your API key and try again.');
    } else if (error.message.includes('quota') || error.message.includes('limit')) {
      throw new Error('API quota exceeded. Please try again later.');
    } else if (error.message.includes('404') || error.message.includes('Not Found')) {
      throw new Error('The requested Gemini model is not available. Please contact support.');
    }
    
    throw new Error(`AI service error: ${error.message}`);
  }
}

/**
 * Extract and save decision if detected
 */
async function tryExtractAndSaveDecision(userId, userMessage, assistantMessage) {
  const decisionKeywords = [
    'prioritize', 'schedule', 'plan', 'decide', 'choose',
    'action plan', 'should i', 'what should', 'time block'
  ];
  
  const isDecisionConversation = decisionKeywords.some(keyword => 
    userMessage.toLowerCase().includes(keyword) || 
    assistantMessage.toLowerCase().includes(keyword)
  );
  
  if (isDecisionConversation && assistantMessage.length > 100) {
    const decision = new Decision({
      userId,
      situationSummary: userMessage.substring(0, 500),
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
