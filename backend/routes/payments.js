const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');

// Get all payments
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate({
        path: 'invoice',
        populate: {
          path: 'client',
          select: 'name email'
        }
      })
      .sort({ date: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new payment
router.post('/', async (req, res) => {
  const newPayment = new Payment({
    paymentId: req.body.paymentId,
    invoice: req.body.invoice,
    amountPaid: req.body.amountPaid,
    date: req.body.date || Date.now(),
    method: req.body.method,
    referenceNumber: req.body.referenceNumber
  });

  try {
    const savedPayment = await newPayment.save();

    // Update invoice status logic (Mocked basic logic)
    const invoice = await Invoice.findById(req.body.invoice);
    if (invoice) {
      if (req.body.amountPaid >= invoice.amount) {
        invoice.status = 'Paid';
      } else {
        invoice.status = 'Partial';
      }
      await invoice.save();
    }

    res.status(201).json(savedPayment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
