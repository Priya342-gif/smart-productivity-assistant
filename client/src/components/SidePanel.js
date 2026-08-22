import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GoalsSection from './GoalsSection';
import NotesSection from './NotesSection';
import FocusTimer from './FocusTimer';
import StudyStats from './StudyStats';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function SidePanel({ user, onClose }) {
  const [activeTab, setActiveTab] = useState('goals');
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    loadGoals();
  }, [user]);

  const loadGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${user._id}`);
      setGoals(response.data.goals);
    } catch (err) {
      console.error('Error loading goals:', err);
    }
  };

  const getTabIcon = (tab) => {
    switch(tab) {
      case 'goals': return '🎯';
      case 'notes': return '📝';
      case 'timer': return '⏱️';
      case 'stats': return '📊';
      default: return '';
    }
  };

  const getTabTitle = (tab) => {
    switch(tab) {
      case 'goals': return 'Goals';
      case 'notes': return 'Notes';
      case 'timer': return 'Focus Timer';
      case 'stats': return 'Study Stats';
      default: return '';
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-warm-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-warm-gray-800">
          {getTabIcon(activeTab)} {getTabTitle(activeTab)}
        </h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-warm-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-6 h-6 text-warm-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Tab selector */}
      <div className="border-b border-warm-gray-200 px-4 py-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('goals')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'goals'
              ? 'bg-warm-gray-800 text-white'
              : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
          }`}
        >
          Goals
        </button>
        <button
          onClick={() => setActiveTab('timer')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'timer'
              ? 'bg-warm-gray-800 text-white'
              : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
          }`}
        >
          Timer
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'stats'
              ? 'bg-warm-gray-800 text-white'
              : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
          }`}
        >
          Stats
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-3 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
            activeTab === 'notes'
              ? 'bg-warm-gray-800 text-white'
              : 'bg-warm-gray-100 text-warm-gray-700 hover:bg-warm-gray-200'
          }`}
        >
          Notes
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'goals' && <GoalsSection user={user} />}
        {activeTab === 'notes' && <NotesSection user={user} />}
        {activeTab === 'timer' && <FocusTimer user={user} goals={goals} />}
        {activeTab === 'stats' && <StudyStats user={user} />}
      </div>
    </div>
  );
}

export default SidePanel;
