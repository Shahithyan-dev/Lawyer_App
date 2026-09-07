const express = require('express');
const router = express.Router();
const Client = require('../models/Client');

// Get all clients
router.get('/', async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new client
router.post('/', async (req, res) => {
  const client = new Client({
    clientId: req.body.clientId,
    name: req.body.name,
    email: req.body.email,
    mobile: req.body.mobile,
    address: req.body.address,
    status: req.body.status || 'Active'
  });

  try {
    const newClient = await client.save();
    res.status(201).json(newClient);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single client
router.get('/:id', async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (client == null) {
      return res.status(404).json({ message: 'Cannot find client' });
    }
    res.json(client);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
