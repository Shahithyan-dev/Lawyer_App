const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password').populate('supervisor', 'name username');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new user (Staff)
router.post('/', async (req, res) => {
  const { name, username, password, role, supervisor } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this ID/Username' });
    }

    user = new User({
      name,
      username,
      password: password || 'defaultpassword123', // In a real app, hash this!
      role: role || 'Junior Advocate',
      supervisor: supervisor || null
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
