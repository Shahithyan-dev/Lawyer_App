const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  caseReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: false
  },
  priority: {
    type: String,
    enum: ['HIGH PRIORITY', 'NORMAL', 'LOW'],
    default: 'NORMAL'
  },
  status: {
    type: String,
    enum: ['To Do', 'In Progress', 'Completed'],
    default: 'To Do'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  documentUrl: {
    type: String,
    required: false
  },
  documentName: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
