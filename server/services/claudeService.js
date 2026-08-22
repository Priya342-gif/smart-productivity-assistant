/**
 * Get chatbot response using Google Gemini
 */
async function getChatResponse(userId, userMessage, conversationHistory = []) {
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
  
  // Initialize Gemini model
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