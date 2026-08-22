const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes for user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;
    
    const notes = await Note.find({ userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();
    
    res.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Create note
router.post('/', async (req, res) => {
  try {
    const { userId, text, type = 'quick', linkedGoalId = null } = req.body;
    
    if (!userId || !text) {
      return res.status(400).json({ error: 'userId and text are required' });
    }
    
    const note = new Note({
      userId,
      text,
      type,
      linkedGoalId
    });
    
    await note.save();
    res.json({ note });
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
});

// Search notes
router.get('/:userId/search', async (req, res) => {
  try {
    const { userId } = req.params;
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query (q) is required' });
    }
    
    const notes = await Note.find(
      { 
        userId,
        $text: { $search: q }
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(20)
      .lean();
    
    res.json({ notes });
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).json({ error: 'Failed to search notes' });
  }
});

// Delete note
router.delete('/:noteId', async (req, res) => {
  try {
    const { noteId } = req.params;
    const { userId } = req.body;
    
    await Note.deleteOne({ _id: noteId, userId });
    res.json({ message: 'Note deleted' });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

module.exports = router;
