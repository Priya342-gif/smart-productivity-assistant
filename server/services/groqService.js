const Groq = require('groq-sdk');
const Decision = require('../models/Decision');
const Goal = require('../models/Goal');
const Note = require('../models/Note');
const MoodLog = require('../models/MoodLog');
const { extractMoodFromText } = require('./analyticsService');

// Initialize Groq with API key
const apiKey = process.env.GROQ_API_KEY;
if (!apiKey) {
  console.error('❌ GROQ_API_KEY not found in environment variables!');
  throw new Error('GROQ_API_KEY environment variable is required');
}
console.log('✅ Groq API Key loaded:', `${apiKey.substring(0, 15)}...`);

const groq = new Groq({ apiKey });

// Available Groq models (2026 current models that actually work)
const AVAILABLE_MODELS = [
  'qwen/qwen3.6-27b',            // Works! Good quality
  'qwen/qwen3.5-32b',            // Alternative Qwen model
  'openai/gpt-oss-120b',         // Try without suffix
  'openai/gpt-oss-20b'           // Try without suffix
];

const DEFAULT_MODEL = AVAILABLE_MODELS[0]; // Using working Qwen model

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
  const goals = await Goal.find({ userId, isActive: true }).lean();
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentDecisions = await Decision.find({ 
    userId, 
    createdAt: { $gte: thirtyDaysAgo } 
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();
  
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  const recentNotes = await Note.find({ 
    userId, 
    createdAt: { $gte: fourteenDaysAgo } 
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();
  
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
function formatContext(context) {
  let contextText = '\n=== USER CONTEXT ===\n';
  
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
 * Get chatbot response using Groq
 */
async function getChatResponse(userId, userMessage, conversationHistory = []) {
  try {
    console.log('📥 Processing chat request...');
    
    // Extract and log mood
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
    const similarDecisions = await findSimilarDecisions(userId, userMessage);
    if (similarDecisions.length > 0) {
      context.similarDecisions = similarDecisions;
    }
    
    const contextText = formatContext(context);
    
    // Build messages for Groq
    const messages = [
      {
        role: 'system',
        content: SYSTEM_PROMPT
      }
    ];
    
    // Add conversation history
    conversationHistory.forEach(msg => {
      messages.push({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content
      });
    });
    
    // Add current message with context
    messages.push({
      role: 'user',
      content: contextText + '\n' + userMessage
    });
    
    console.log(`📤 Sending to Groq (model: ${DEFAULT_MODEL})...`);
    
    // Call Groq API with fallback to other models if first fails
    let completion;
    let lastError;
    
    for (const model of AVAILABLE_MODELS) {
      try {
        console.log(`Trying model: ${model}...`);
        completion = await groq.chat.completions.create({
          messages,
          model: model,
          temperature: 0.7,
          max_tokens: 2000,
          top_p: 1,
          stream: false
        });
        console.log(`✅ Success with model: ${model}`);
        break; // Success, exit loop
      } catch (err) {
        console.log(`❌ Model ${model} failed:`, err.message);
        lastError = err;
        // Try next model
        continue;
      }
    }
    
    if (!completion) {
      throw lastError || new Error('All models failed');
    }
    
    const assistantMessage = completion.choices[0]?.message?.content || 'Sorry, I encountered an error.';
    
    // Remove <think> tags and their content (Qwen model shows reasoning)
    const cleanMessage = assistantMessage.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    
    console.log('✅ Received response from Groq');
    
    // Try to save as decision if relevant
    await tryExtractAndSaveDecision(userId, userMessage, cleanMessage);
    
    return cleanMessage;
  } catch (error) {
    console.error('❌ Error in getChatResponse:', error);
    console.error('   Error message:', error.message);
    
    if (error.message.includes('API key')) {
      throw new Error('Groq API key error. Please check your API key configuration.');
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('API quota exceeded. Please try again in a moment.');
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
