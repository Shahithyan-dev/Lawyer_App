const mongoose = require('mongoose');

const caseSchema = new mongoose.Schema({
  caseId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  court: {
    type: String,
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  status: {
    type: String,
    enum: ['Active', 'Pending Docs', 'Closed'],
    default: 'Active'
  },
  nextHearing: {
    type: Date,
    required: false
  },
  filingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Case', caseSchema);
