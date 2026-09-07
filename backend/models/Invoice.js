const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  invoiceId: {
    type: String,
    required: true,
    unique: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  caseReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Unpaid'
  },
  dueDate: {
    type: Date,
    required: true
  },
  lineItems: [{
    description: String,
    amount: Number
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Invoice', invoiceSchema);
