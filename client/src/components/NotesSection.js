import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function NotesSection({ user }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [noteType, setNoteType] = useState('quick');

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      const response = await axios.get(`${API_URL}/notes/${user._id}`);
      setNotes(response.data.notes);
    } catch (err) {
      console.error('Error loading notes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    try {
      const response = await axios.post(`${API_URL}/notes`, {
        userId: user._id,
        text: newNote.trim(),
        type: noteType
      });

      setNotes(prev => [response.data.note, ...prev]);
      setNewNote('');
    } catch (err) {
      console.error('Error adding note:', err);
      alert('Failed to add note. Please try again.');
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (!window.confirm('Delete this note?')) return;

    try {
      await axios.delete(`${API_URL}/notes/${noteId}`, {
        data: { userId: user._id }
      });

      setNotes(prev => prev.filter(note => note._id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
    }
  };

  const getNoteIcon = (type) => {
    switch (type) {
      case 'reflection': return '💭';
      case 'task-linked': return '🔗';
      default: return '📝';
    }
  };

  if (loading) {
    return <div className="p-4 text-center text-warm-gray-500">Loading...</div>;
  }

  return (
    <div className="p-4">
      {/* Add Note Form */}
      <form onSubmit={handleAddNote} className="mb-4 space-y-3">
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          placeholder="Write a quick note or reflection..."
          rows={3}
          className="w-full px-3 py-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-warm-gray-500 focus:border-transparent outline-none resize-none"
        />
        
        <div className="flex items-center gap-2">
          <select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            className="px-3 py-2 border border-warm-gray-300 rounded-lg focus:ring-2 focus:ring-warm-gray-500 focus:border-transparent outline-none text-sm"
          >
            <option value="quick">Quick Note</option>
            <option value="reflection">Reflection</option>
            <option value="task-linked">Task-Linked</option>
          </select>
          
          <button
            type="submit"
            disabled={!newNote.trim()}
            className="flex-1 py-2 bg-warm-gray-800 text-white rounded-lg font-medium hover:bg-warm-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Note
          </button>
        </div>
      </form>

      {/* Notes List */}
      {notes.length === 0 ? (
        <div className="text-center py-12 text-warm-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>No notes yet. Start journaling!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map(note => (
            <div
              key={note._id}
              className="bg-white border border-warm-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{getNoteIcon(note.type)}</span>
                
                <div className="flex-1 min-w-0">
                  <p className="text-warm-gray-800 whitespace-pre-wrap">{note.text}</p>
                  
                  <div className="flex items-center gap-2 mt-2 text-xs text-warm-gray-500">
                    <span className="capitalize">{note.type.replace('-', ' ')}</span>
                    <span>•</span>
                    <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    <span>{new Date(note.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteNote(note._id)}
                  className="flex-shrink-0 p-1 text-warm-gray-400 hover:text-red-600 transition-colors"
                  title="Delete note"
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

export default NotesSection;
