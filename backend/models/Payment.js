const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  invoice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Invoice',
    required: true
  },
  amountPaid: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  method: {
    type: String,
    enum: ['Cash', 'Bank Transfer', 'Credit Card', 'UPI', 'Cheque'],
    required: true
  },
  referenceNumber: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
