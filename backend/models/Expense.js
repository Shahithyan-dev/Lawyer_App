const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  expenseId: {
    type: String,
    required: true,
    unique: true
  },
  category: {
    type: String,
    enum: ['Travel', 'Court Fee', 'Office Supplies', 'Legal Tools', 'Miscellaneous'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  relatedCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Reimbursed'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
