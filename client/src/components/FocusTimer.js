import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function FocusTimer({ user, goals }) {
  const [session, setSession] = useState(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [customMinutes, setCustomMinutes] = useState(25);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sessionType, setSessionType] = useState('focus'); // 'focus' or 'break'
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [notes, setNotes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const intervalRef = useRef(null);

  // Load ongoing session on mount
  useEffect(() => {
    loadOngoingSession();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, isPaused]);

  const loadOngoingSession = async () => {
    try {
      const response = await axios.get(`${API_URL}/focus/ongoing/${user._id}`);
      if (response.data.session) {
        const ongoingSession = response.data.session;
        setSession(ongoingSession);
        setSessionType(ongoingSession.sessionType);
        setSelectedGoalId(ongoingSession.goalId || '');
        
        // Calculate time left
        const elapsed = Math.floor((Date.now() - new Date(ongoingSession.startTime)) / 1000);
        const duration = customMinutes * 60;
        const remaining = Math.max(0, duration - elapsed);
        setTimeLeft(remaining);
        setIsRunning(true);
      }
    } catch (err) {
      console.error('Error loading ongoing session:', err);
    }
  };

  const handleStart = async () => {
    try {
      const response = await axios.post(`${API_URL}/focus/start`, {
        userId: user._id,
        goalId: selectedGoalId || null,
        sessionType
      });

      setSession(response.data.session);
      setIsRunning(true);
      setIsPaused(false);
      setTimeLeft(customMinutes * 60);
      setShowCustomInput(false);
      
      // Play start sound
      playSound('start');
    } catch (err) {
      console.error('Error starting session:', err);
      alert(err.response?.data?.error || 'Failed to start session');
    }
  };

  const handlePause = async () => {
    try {
      await axios.post(`${API_URL}/focus/pause/${session._id}`);
      setIsPaused(true);
    } catch (err) {
      console.error('Error pausing session:', err);
    }
  };

  const handleResume = async () => {
    try {
      await axios.post(`${API_URL}/focus/resume/${session._id}`);
      setIsPaused(false);
    } catch (err) {
      console.error('Error resuming session:', err);
    }
  };

  const handleStop = async (completed = false) => {
    try {
      await axios.post(`${API_URL}/focus/end/${session._id}`, {
        completed,
        notes
      });

      resetTimer();
      playSound('end');
    } catch (err) {
      console.error('Error stopping session:', err);
    }
  };

  const handleTimerComplete = async () => {
    if (!session) return;

    playSound('complete');
    
    // End current session as completed
    await handleStop(true);

    // Auto-switch between focus and break
    if (sessionType === 'focus') {
      setSessionType('break');
      setTimeLeft(5 * 60); // 5 minute break
      setCustomMinutes(5);
      alert('🎉 Focus session complete! Time for a break!');
    } else {
      setSessionType('focus');
      setTimeLeft(25 * 60); // Default back to 25
      setCustomMinutes(25);
      alert('✨ Break is over! Ready for another focus session?');
    }
  };

  const resetTimer = () => {
    setSession(null);
    setIsRunning(false);
    setIsPaused(false);
    setTimeLeft(customMinutes * 60);
    setSessionType('focus');
    setNotes('');
  };

  const playSound = (type) => {
    // Browser Audio API for notification sounds
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'complete') {
      oscillator.frequency.value = 880;
      gainNode.gain.value = 0.3;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } else if (type === 'start') {
      oscillator.frequency.value = 440;
      gainNode.gain.value = 0.2;
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const totalDuration = customMinutes * 60;
  const progress = ((totalDuration - timeLeft) / totalDuration) * 100;

  const presetDurations = [15, 25, 30, 45, 60, 90];

  return (
    <div className="p-6 bg-gradient-to-br from-orange-50 via-white to-purple-50 rounded-lg shadow-2xl animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold gradient-text mb-2 animate-float">
          {sessionType === 'focus' ? '🎯 Focus Session' : '☕ Break Time'}
        </h2>
        <p className="text-sm text-gray-600">
          {sessionType === 'focus' ? 'Stay focused on your task' : 'Relax and recharge'}
        </p>
      </div>

      {/* Timer Display */}
      <div className="relative mb-8 flex justify-center">
        <div className="relative">
          <svg className="transform -rotate-90 w-64 h-64">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 120}`}
              strokeDashoffset={`${2 * Math.PI * 120 * (1 - progress / 100)}`}
              className="timer-circle"
              strokeLinecap="round"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={sessionType === 'focus' ? '#f97316' : '#10b981'} />
                <stop offset="100%" stopColor={sessionType === 'focus' ? '#ea580c' : '#059669'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold text-gray-800 mb-2">
              {formatTime(timeLeft)}
            </span>
            <span className="text-sm text-gray-500">{customMinutes} minutes</span>
          </div>
        </div>
      </div>

      {/* Custom Duration Selector (when not running) */}
      {!isRunning && sessionType === 'focus' && (
        <div className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              ⏱️ Choose Duration
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {presetDurations.map(duration => (
                <button
                  key={duration}
                  onClick={() => {
                    setCustomMinutes(duration);
                    setTimeLeft(duration * 60);
                  }}
                  className={`py-3 px-4 rounded-xl font-medium transition-all ${
                    customMinutes === duration
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {duration}m
                </button>
              ))}
            </div>
            
            {/* Custom input */}
            <div className="flex gap-2">
              <input
                type="number"
                value={customMinutes}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setCustomMinutes(Math.max(1, Math.min(180, val))); // 1-180 min
                  setTimeLeft(val * 60);
                }}
                min="1"
                max="180"
                className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-center font-semibold"
                placeholder="Custom minutes"
              />
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                className="px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-medium"
              >
                ⚙️
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Set anywhere from 1 to 180 minutes
            </p>
          </div>
        </div>
      )}

      {/* Goal Selection */}
      {!isRunning && sessionType === 'focus' && (
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            🎯 Link to Goal (Optional)
          </label>
          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
          >
            <option value="">General Study Session</option>
            {goals.map(goal => (
              <option key={goal._id} value={goal._id}>{goal.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-3 justify-center mb-4">
        {!isRunning ? (
          <button
            onClick={handleStart}
            className="px-10 py-4 btn-gradient text-white rounded-2xl font-bold text-lg hover:shadow-2xl transition-all flex items-center gap-3 shine"
          >
            <span className="text-2xl">▶</span>
            <span>Start {sessionType === 'focus' ? 'Focus' : 'Break'}</span>
          </button>
        ) : (
          <>
            {isPaused ? (
              <button
                onClick={handleResume}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
              >
                ▶ Resume
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
              >
                ⏸ Pause
              </button>
            )}
            <button
              onClick={() => handleStop(false)}
              className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl font-bold hover:shadow-xl transition-all"
            >
              ⏹ Stop
            </button>
          </>
        )}
      </div>

      {/* Session Notes */}
      {isRunning && (
        <div className="mt-4 animate-slide-up">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="What are you working on? (optional)"
            rows={3}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none text-sm"
          />
        </div>
      )}

      {/* Progress Stats */}
      {isRunning && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-orange-100 to-orange-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(progress)}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Complete</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-purple-50 p-4 rounded-xl text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round((totalDuration - timeLeft) / 60)}m
            </div>
            <div className="text-xs text-gray-600 mt-1">Elapsed</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FocusTimer;
