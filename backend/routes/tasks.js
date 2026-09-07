const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'task-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find().populate('caseReference', 'caseId title').populate('assignedTo', 'name email').sort({ dueDate: 1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new task (with optional document upload)
router.post('/', upload.single('document'), async (req, res) => {
  const newTask = new Task({
    title: req.body.title,
    description: req.body.description,
    caseReference: req.body.caseReference !== 'null' ? req.body.caseReference : undefined,
    priority: req.body.priority || 'NORMAL',
    status: req.body.status || 'To Do',
    assignedTo: req.body.assignedTo,
    dueDate: req.body.dueDate
  });

  if (req.file) {
    newTask.documentUrl = `/uploads/${req.file.filename}`;
    newTask.documentName = req.file.originalname;
  }

  try {
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
