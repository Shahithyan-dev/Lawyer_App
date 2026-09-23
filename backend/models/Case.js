const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a case title'],
  },
  caseNumber: {
    type: String,
    required: [true, 'Please add a case number'],
    unique: true,
  },
  type: {
    type: String,
    required: [true, 'Please add a case type'],
    enum: ['Civil', 'Criminal', 'Corporate', 'Family', 'Intellectual Property', 'Real Estate', 'Other', 'Special Court', 'Tribunal', 'Tax']
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Pending', 'Closed', 'Archived'],
    default: 'Open',
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    required: true,
  },
  assignedTo: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  }],
  court: {
    type: String,
  },
  judge: {
    type: String,
  },
  filingDate: {
    type: Date,
    default: Date.now,
  },
  nextHearingDate: {
    type: Date,
  },
  description: {
    type: String,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium'
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Case', CaseSchema);
