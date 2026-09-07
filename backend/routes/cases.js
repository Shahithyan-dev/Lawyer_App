const express = require('express');
const router = express.Router();
const Case = require('../models/Case');

// Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().populate('client', 'name clientId').sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new case
router.post('/', async (req, res) => {
  const newCase = new Case({
    caseId: req.body.caseId,
    title: req.body.title,
    type: req.body.type,
    court: req.body.court,
    client: req.body.client,
    status: req.body.status || 'Active',
    nextHearing: req.body.nextHearing
  });

  try {
    const savedCase = await newCase.save();
    res.status(201).json(savedCase);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get a single case
router.get('/:id', async (req, res) => {
  try {
    const singleCase = await Case.findById(req.params.id).populate('client', 'name clientId email mobile');
    if (singleCase == null) {
      return res.status(404).json({ message: 'Cannot find case' });
    }
    res.json(singleCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
