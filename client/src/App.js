import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import SidePanel from './components/SidePanel';
import AuthModal from './components/AuthModal';
import SmartSuggestions from './components/SmartSuggestions';
import DailyCheckIn from './components/DailyCheckIn';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const [user, setUser] = useState(null);
  const [showPanel, setShowPanel] = useState(false);
  const [showAuth, setShowAuth] = useState(true);
  const [checkInType, setCheckInType] = useState(null);

  useEffect(() => {
    // Check localStorage for existing user
    const savedUser = localStorage.getItem('lifeOS_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setShowAuth(false);
    }
  }, []);

  useEffect(() => {
    // Determine check-in type based on time of day
    if (user) {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 12) {
        setCheckInType('morning');
      } else if (hour >= 20 || hour < 6) {
        setCheckInType('evening');
      }
    }
  }, [user]);

  const handleAuth = (userData) => {
    setUser(userData);
    localStorage.setItem('lifeOS_user', JSON.stringify(userData));
    setShowAuth(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lifeOS_user');
    setShowAuth(true);
  };

  const handleCheckInSubmit = async (response, type) => {
    try {
      // Send check-in response as a message to the chat
      await axios.post(`${API_URL}/chat/message`, {
        userId: user._id,
        message: `[${type === 'morning' ? 'Morning Check-in' : 'Evening Reflection'}]: ${response}`
      });
    } catch (err) {
      console.error('Error submitting check-in:', err);
    }
  };

  if (showAuth) {
    return <AuthModal onAuth={handleAuth} />;
  }

  return (
    <div className="h-screen bg-gradient-to-br from-purple-50 via-orange-50 to-blue-50 flex flex-col overflow-hidden">
      {/* Daily Check-in Modal */}
      {checkInType && (
        <DailyCheckIn 
          onSubmit={handleCheckInSubmit}
          promptType={checkInType}
        />
      )}
      
      {/* Header */}
      <div className="glass-effect border-b border-white/20 px-6 py-4 flex items-center justify-between shadow-lg">
        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <span className="text-3xl">🚀</span>
          Life OS
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium shadow-md">
            Hi, {user?.name} ✨
          </span>
          <button
            onClick={() => setShowPanel(!showPanel)}
            className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            title="Goals & Tools"
          >
            <span className="text-2xl">🎯</span>
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-xl hover:bg-white/50 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex relative overflow-hidden">
        <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm">
          {/* Smart Suggestions Banner */}
          <SmartSuggestions user={user} />
          
          <ChatInterface user={user} />
        </div>
        
        {/* Side Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-96 glass-effect border-l border-white/30 shadow-2xl transform transition-transform duration-300 ease-in-out z-10 ${
            showPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <SidePanel user={user} onClose={() => setShowPanel(false)} />
        </div>
      </div>
    </div>
  );
}

export default App;
