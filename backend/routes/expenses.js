const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

// Get all expenses
router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('relatedCase', 'caseId title')
      .sort({ date: -1 });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new expense
router.post('/', async (req, res) => {
  const newExpense = new Expense({
    expenseId: req.body.expenseId,
    category: req.body.category,
    amount: req.body.amount,
    date: req.body.date || Date.now(),
    description: req.body.description,
    relatedCase: req.body.relatedCase || undefined,
    status: req.body.status || 'Pending'
  });

  try {
    const savedExpense = await newExpense.save();
    res.status(201).json(savedExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
