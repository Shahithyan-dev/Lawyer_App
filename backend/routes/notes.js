const express = require('express');
const router = express.Router();
const Note = require('../models/Note');

// Get all notes
router.get('/', async (req, res) => {
  try {
    const notes = await Note.find()
      .populate('relatedCase', 'caseId title')
      .populate('author', 'name')
      .sort({ date: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new note
router.post('/', async (req, res) => {
  const newNote = new Note({
    title: req.body.title,
    content: req.body.content,
    type: req.body.type || 'Internal Note',
    relatedCase: req.body.relatedCase || undefined,
    author: req.body.author || undefined,
    date: req.body.date || Date.now()
  });

  try {
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
