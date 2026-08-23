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
    // Keyboard shortcut to toggle panel (Ctrl+B or Cmd+B)
    const handleKeyPress = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        console.log('Keyboard shortcut pressed! Toggling panel');
        setShowPanel(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
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
      <div className="glass-effect border-b border-white/20 px-6 py-4 flex items-center justify-between shadow-lg relative z-50">
        <h1 className="text-2xl font-bold gradient-text flex items-center gap-2">
          <span className="text-3xl">🚀</span>
          Life OS
        </h1>
        <div className="flex items-center gap-4 relative z-50">
          <span className="text-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full font-medium shadow-md">
            Hi, {user?.name} ✨
          </span>
          
          {/* Panel Toggle Button - Multiple ways to open */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Panel button clicked! Current state:', showPanel);
                setShowPanel(!showPanel);
              }}
              className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer relative"
              style={{ zIndex: 9999, position: 'relative' }}
              title="Open Goals & Tools Panel"
              type="button"
            >
              <span className="text-2xl block" style={{ pointerEvents: 'none' }}>🎯</span>
            </button>
          </div>
          
          {/* Text link as backup */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowPanel(!showPanel);
            }}
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 underline cursor-pointer"
            type="button"
            style={{ zIndex: 9999 }}
          >
            {showPanel ? 'Close Panel' : 'Open Panel'}
          </button>
          
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-800 font-medium px-4 py-2 rounded-xl hover:bg-white/50 transition-all cursor-pointer"
            type="button"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex relative overflow-hidden">
        <div className="flex-1 flex flex-col bg-white/30 backdrop-blur-sm">
          {/* Debug indicator */}
          {showPanel && (
            <div className="fixed top-20 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs z-50">
              Panel: OPEN
            </div>
          )}
          
          {/* Smart Suggestions Banner */}
          <SmartSuggestions user={user} />
          
          <ChatInterface user={user} />
        </div>
        
        {/* Side Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-96 glass-effect border-l border-white/30 shadow-2xl transform transition-transform duration-300 ease-in-out ${
            showPanel ? 'translate-x-0' : 'translate-x-full'
          }`}
          style={{ zIndex: 100 }}
        >
          <SidePanel user={user} onClose={() => setShowPanel(false)} />
        </div>
      </div>
    </div>
  );
}

export default App;
