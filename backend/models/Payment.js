const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, 'Please add payment amount'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed', 'Failed', 'Refunded'],
    default: 'Completed',
  },
  method: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Credit Card', 'Cheque', 'Other'],
    default: 'Cash'
  },
  referenceNo: {
    type: String,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true
  },
  case: {
    type: mongoose.Schema.ObjectId,
    ref: 'Case',
  },
  date: {
    type: Date,
    default: Date.now,
  },
  recordedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  notes: {
    type: String
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Payment', PaymentSchema);
