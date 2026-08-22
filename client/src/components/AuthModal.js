import React, { useState } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function AuthModal({ onAuth }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/users/auth`, {
        name,
        email
      });
      
      onAuth(response.data.user);
    } catch (err) {
      setError('Failed to authenticate. Please try again.');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 animate-gradient flex items-center justify-center p-4">
      <div className="glass-effect rounded-3xl shadow-2xl p-10 max-w-md w-full animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 animate-float">🚀</div>
          <h1 className="text-5xl font-bold gradient-text mb-3">Life OS</h1>
          <p className="text-gray-600 text-lg">Your personal AI-powered productivity companion</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
              placeholder="your@email.com"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-2 border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm animate-slide-up">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn-gradient text-white py-4 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shine"
          >
            {loading ? 'Loading...' : 'Get Started 🚀'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-6">
          Simple auth · Your data stays secure in MongoDB
        </p>
      </div>
    </div>
  );
}

export default AuthModal;
