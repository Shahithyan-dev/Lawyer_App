const express = require('express');
const router = express.Router();
const Invoice = require('../models/Invoice');

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('client', 'name email')
      .populate('caseReference', 'caseId title')
      .sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new invoice
router.post('/', async (req, res) => {
  const newInvoice = new Invoice({
    invoiceId: req.body.invoiceId,
    client: req.body.client,
    caseReference: req.body.caseReference || undefined,
    amount: req.body.amount,
    status: req.body.status || 'Unpaid',
    dueDate: req.body.dueDate,
    lineItems: req.body.lineItems || [],
    notes: req.body.notes
  });

  try {
    const savedInvoice = await newInvoice.save();
    res.status(201).json(savedInvoice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
