import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function GoalsSection({ user }) {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({ title: '', reason: '' });

  useEffect(() => {
    if (user) {
      loadGoals();
    }
  }, [user]);

  const loadGoals = async () => {
    try {
      const response = await axios.get(`${API_URL}/goals/${user._id}`);
      setGoals(response.data.goals);
    } catch (err) {
      console.error('Error loading goals:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.title.trim() || !newGoal.reason.trim()) return;

    console.log('Adding goal with userId:', user._id, 'user object:', user);

    try {
      const response = await axios.post(`${API_URL}/goals`, {
        userId: user._id,
        title: newGoal.title.trim(),
        reason: newGoal.reason.trim()
      });

      setGoals(prev => [...prev, response.data.goal]);
      setNewGoal({ title: '', reason: '' });
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding goal:', err);
      console.error('Error response:', err.response?.data);
      alert(`Failed to add goal: ${err.response?.data?.error || err.message}`);
    }
  };

  const handleToggleGoal = async (goalId, currentStreak) => {
    try {
      const response = await axios.post(`${API_URL}/goals/${goalId}/toggle`, {
        userId: user._id
      });

      setGoals(prev => prev.map(goal =>
        goal._id === goalId
          ? { ...goal, completedToday: response.data.completedToday, streak: response.data.streak }
          : goal
      ));

      // Check for milestone celebrations
      const newStreak = response.data.streak;
      if (response.data.completedToday && (newStreak === 7 || newStreak === 30 || newStreak % 50 === 0)) {
        celebrateMilestone(newStreak);
      }
    } catch (err) {
      console.error('Error toggling goal:', err);
    }
  };

  const celebrateMilestone = (streak) => {
    const messages = {
      7: '🎉 7-day streak! You\'re building real consistency!',
      30: '🔥 30 days! This is becoming a habit!',
      50: '⭐ 50 days! You\'re unstoppable!',
      100: '🏆 100 DAYS! Legendary discipline!'
    };

    const message = messages[streak] || `🌟 ${streak}-day streak! Keep going!`;
    
    // Simple toast notification
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const handleDeleteGoal = async (goalId) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;

    try {
      await axios.delete(`${API_URL}/goals/${goalId}`, {
        data: { userId: user._id }
      });

      setGoals(prev => prev.filter(goal => goal._id !== goalId));
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-warm-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Add Goal Button */}
      {!showAddForm && (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full mb-4 py-3 border-2 border-dashed border-warm-gray-300 rounded-lg text-warm-gray-600 hover:border-warm-gray-400 hover:text-warm-gray-700 transition-colors font-medium"
        >
          + Add New Goal
        </button>
      )}

      {/* Add Goal Form */}
      {showAddForm && (
        <form onSubmit={handleAddGoal} className="mb-4 p-4 bg-warm-gray-50 rounded-lg space-y-3">
          <input
            type="text"
            value={newGoal.title}
            onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Goal title"
            className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-warm-gray-500 focus:border-transparent outline-none"
            autoFocus
          />
          <textarea
            value={newGoal.reason}
            onChange={(e) => setNewGoal(prev => ({ ...prev, reason: e.target.value }))}
            placeholder="Why does this goal matter to you?"
            rows={3}
            className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-warm-gray-500 focus:border-transparent outline-none resize-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 py-2 bg-warm-gray-800 text-white rounded-lg font-medium hover:bg-warm-gray-700 transition-colors"
            >
              Add Goal
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setNewGoal({ title: '', reason: '' });
              }}
              className="px-4 py-2 bg-warm-gray-200 text-warm-gray-700 rounded-lg font-medium hover:bg-warm-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Goals List */}
      {goals.length === 0 ? (
        <div className="text-center py-12 text-warm-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p>No goals yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {goals.map(goal => (
            <div
              key={goal._id}
              className="bg-white border border-warm-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => handleToggleGoal(goal._id, goal.streak)}
                  className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    goal.completedToday
                      ? 'bg-green-500 border-green-500'
                      : 'border-warm-gray-300 hover:border-warm-gray-400'
                  }`}
                >
                  {goal.completedToday && (
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-warm-gray-800">{goal.title}</h3>
                  <p className="text-sm text-warm-gray-600 mt-1">{goal.reason}</p>
                  
                  {goal.streak > 0 && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-lg">🔥</span>
                      <span className="text-sm font-semibold text-orange-600">
                        {goal.streak} day streak
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-warm-gray-500 mt-2">
                    Started {new Date(goal.createdAt).toLocaleDateString()}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteGoal(goal._id)}
                  className="flex-shrink-0 p-1 text-warm-gray-400 hover:text-red-600 transition-colors"
                  title="Delete goal"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GoalsSection;
