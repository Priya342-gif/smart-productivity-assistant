import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function SmartSuggestions({ user }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(new Set());

  useEffect(() => {
    loadInsights();
    // Refresh insights every 30 minutes
    const interval = setInterval(loadInsights, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [user]);

  const loadInsights = async () => {
    try {
      const response = await axios.get(`${API_URL}/analytics/insights/${user._id}`);
      setInsights(response.data.insights);
    } catch (err) {
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const dismissSuggestion = (index) => {
    setDismissed(prev => new Set([...prev, index]));
  };

  if (loading || !insights) return null;

  const allSuggestions = [
    ...(insights.goalSuggestions || []),
    ...(insights.moodAnalysis?.insights || [])
  ].filter((_, index) => !dismissed.has(index));

  if (allSuggestions.length === 0) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'border-red-300 bg-red-50';
      case 'medium': return 'border-yellow-300 bg-yellow-50';
      case 'positive': return 'border-green-300 bg-green-50';
      default: return 'border-blue-300 bg-blue-50';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high': return '⚠️';
      case 'medium': return '💡';
      case 'positive': return '🌟';
      default: return '💭';
    }
  };

  return (
    <div className="px-4 py-3 space-y-3">
      {allSuggestions.map((suggestion, index) => (
        <div
          key={index}
          className={`border-l-4 rounded-lg p-4 ${getSeverityColor(suggestion.severity)} relative`}
        >
          <button
            onClick={() => dismissSuggestion(index)}
            className="absolute top-2 right-2 p-1 hover:bg-white rounded-full transition-colors"
          >
            <svg className="w-4 h-4 text-warm-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="flex items-start gap-3">
            <span className="text-2xl">{getSeverityIcon(suggestion.severity)}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-warm-gray-800">{suggestion.message}</p>
              {suggestion.goalTitle && (
                <p className="text-xs text-warm-gray-600 mt-1">Goal: {suggestion.goalTitle}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SmartSuggestions;
