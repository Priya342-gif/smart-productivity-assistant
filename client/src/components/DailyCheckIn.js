import React, { useState, useEffect } from 'react';

function DailyCheckIn({ onSubmit, promptType }) {
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    // Check if we should show the check-in
    const lastCheckIn = localStorage.getItem(`lastCheckIn_${promptType}`);
    const today = new Date().toDateString();
    
    if (lastCheckIn !== today) {
      // Show check-in after a delay
      const timer = setTimeout(() => {
        setShow(true);
      }, promptType === 'morning' ? 2000 : 5000); // 2s for morning, 5s for evening
      
      return () => clearTimeout(timer);
    }
  }, [promptType]);

  const handleSubmit = () => {
    if (response.trim()) {
      onSubmit(response, promptType);
      localStorage.setItem(`lastCheckIn_${promptType}`, new Date().toDateString());
      setShow(false);
      setResponse('');
    }
  };

  const handleSkip = () => {
    localStorage.setItem(`lastCheckIn_${promptType}`, new Date().toDateString());
    setShow(false);
  };

  if (!show) return null;

  const prompts = {
    morning: {
      title: '☀️ Good Morning!',
      question: 'What are your 3 main priorities for today?',
      placeholder: 'List your top 3 goals for today...'
    },
    evening: {
      title: '🌙 Evening Reflection',
      question: 'How did today go? What went well?',
      placeholder: 'Reflect on your day...'
    }
  };

  const prompt = prompts[promptType] || prompts.morning;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-fade-in">
        <h3 className="text-2xl font-bold text-warm-gray-800 mb-2">{prompt.title}</h3>
        <p className="text-warm-gray-600 mb-4">{prompt.question}</p>
        
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          placeholder={prompt.placeholder}
          rows={4}
          className="w-full px-4 py-3 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none mb-4"
          autoFocus
        />
        
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={!response.trim()}
            className="flex-1 py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Share with AI
          </button>
          <button
            onClick={handleSkip}
            className="px-6 py-3 bg-warm-gray-200 text-warm-gray-700 rounded-lg font-medium hover:bg-warm-gray-300 transition-colors"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}

export default DailyCheckIn;
