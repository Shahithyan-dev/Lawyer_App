const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Ensure you have a JWT secret set in your environment variables. 
// For this MVP, we use a hardcoded fallback.
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key-123';

// Simple Login Endpoint (ID / Password)
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // In a real app, compare hashed password. For this prototype, compare plain text.
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token (does not expire)
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET);

    // Return user info and token
    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
      token
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
