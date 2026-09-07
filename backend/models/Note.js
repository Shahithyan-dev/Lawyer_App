const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Internal Note', 'Client Call', 'Email', 'Meeting'],
    default: 'Internal Note'
  },
  relatedCase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Note', noteSchema);
