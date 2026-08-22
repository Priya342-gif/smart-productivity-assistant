import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function StudyStats({ user }) {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    loadStats();
  }, [user]);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/focus/stats/${user._id}/10`);
      setStats(response.data.stats);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-warm-gray-500">Loading stats...</div>;
  }

  const totalStudyTime = stats.reduce((sum, day) => sum + day.totalMinutes, 0);
  const avgPerDay = stats.length > 0 ? (totalStudyTime / stats.length).toFixed(0) : 0;
  const maxMinutes = Math.max(...stats.map(day => day.totalMinutes), 1);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-warm-gray-800 mb-4">📊 Study Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-orange-600">
            {(totalStudyTime / 60).toFixed(1)}h
          </div>
          <div className="text-sm text-warm-gray-600 mt-1">Total (10 days)</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-blue-600">{avgPerDay}m</div>
          <div className="text-sm text-warm-gray-600 mt-1">Avg per day</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <div className="text-3xl font-bold text-green-600">
            {stats.filter(day => day.totalMinutes > 0).length}
          </div>
          <div className="text-sm text-warm-gray-600 mt-1">Active days</div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-warm-gray-800 mb-3">Daily Focus Time</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {stats.map((day, index) => {
            const height = (day.totalMinutes / maxMinutes) * 100;
            const date = new Date(day.date);
            const isToday = date.toDateString() === new Date().toDateString();

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center cursor-pointer"
                onClick={() => setSelectedDay(selectedDay?.date === day.date ? null : day)}
              >
                <div
                  className={`w-full rounded-t-lg transition-all hover:opacity-80 ${
                    isToday ? 'bg-orange-500' : 'bg-orange-300'
                  } ${selectedDay?.date === day.date ? 'ring-2 ring-orange-600' : ''}`}
                  style={{ height: `${height}%`, minHeight: day.totalMinutes > 0 ? '8px' : '0' }}
                  title={`${day.totalHours} hours`}
                />
                <div className="text-xs text-warm-gray-600 mt-2 text-center">
                  {date.getDate()}
                  <br />
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDay && (
        <div className="bg-warm-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold text-warm-gray-800 mb-3">
            {new Date(selectedDay.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h4>
          
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div>
              <span className="text-sm text-warm-gray-600">Total Time:</span>
              <div className="text-lg font-semibold text-warm-gray-800">
                {selectedDay.totalHours} hours
              </div>
            </div>
            <div>
              <span className="text-sm text-warm-gray-600">Sessions:</span>
              <div className="text-lg font-semibold text-warm-gray-800">
                {selectedDay.sessions} ({selectedDay.completedSessions} completed)
              </div>
            </div>
          </div>

          {/* By Goal Breakdown */}
          {Object.keys(selectedDay.byGoal).length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-warm-gray-700 mb-2">Time by Goal:</h5>
              {Object.entries(selectedDay.byGoal).map(([goalTitle, minutes]) => (
                <div key={goalTitle} className="flex justify-between items-center mb-1">
                  <span className="text-sm text-warm-gray-700">{goalTitle}</span>
                  <span className="text-sm font-medium text-orange-600">
                    {(minutes / 60).toFixed(1)}h
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {stats.length === 0 && (
        <div className="text-center py-8 text-warm-gray-500">
          <div className="text-4xl mb-2">📚</div>
          <p>Start your first focus session to see stats!</p>
        </div>
      )}
    </div>
  );
}

export default StudyStats;
