import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import VoiceInput from './VoiceInput';
import VoiceOutput from './VoiceOutput';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function ChatInterface({ user }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/chat/history/${user._id}`);
      setMessages(response.data.messages);
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message immediately
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }]);

    setLoading(true);

    try {
      const response = await axios.post(`${API_URL}/chat/message`, {
        userId: user._id,
        message: userMessage
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response,
        timestamp: response.data.timestamp
      }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceTranscript = (transcript) => {
    setInput(transcript);
    // Auto-send after voice input (optional)
    setTimeout(() => {
      if (transcript.trim()) {
        setInput(transcript);
        // You can auto-send here if desired
      }
    }, 100);
  };

  return (
    <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="text-6xl mb-4">🎯</div>
              <h2 className="text-2xl font-semibold text-warm-gray-800 mb-2">
                Welcome to Life OS
              </h2>
              <p className="text-warm-gray-600">
                I'm your personal decision counselor. Tell me what's on your mind, 
                share your tasks, or describe a situation you need help with.
              </p>
              <div className="mt-6 space-y-2 text-sm text-warm-gray-500">
                <p>💡 Try: "I have 3 tasks, exam tomorrow, project pending"</p>
                <p>🎯 Try: "I want to start exercising daily"</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-warm-gray-800 text-white'
                      : 'bg-white border border-warm-gray-200 text-warm-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-1 whitespace-pre-wrap">{msg.content}</div>
                    {msg.role === 'assistant' && (
                      <VoiceOutput text={msg.content} />
                    )}
                  </div>
                  <div
                    className={`text-xs mt-2 ${
                      msg.role === 'user' ? 'text-warm-gray-300' : 'text-warm-gray-500'
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-warm-gray-200 rounded-2xl px-4 py-3">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-warm-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-warm-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-warm-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input area */}
      <div className="border-t border-warm-gray-200 bg-white px-4 py-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          <VoiceInput 
            onTranscript={handleVoiceTranscript}
            isDisabled={loading}
          />
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="What's on your mind?"
            rows={1}
            className="flex-1 px-4 py-3 border border-warm-gray-300 rounded-xl focus:ring-2 focus:ring-warm-gray-500 focus:border-transparent outline-none resize-none"
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="px-6 py-3 bg-warm-gray-800 text-white rounded-xl font-medium hover:bg-warm-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
