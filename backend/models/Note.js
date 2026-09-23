const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a note title'],
  },
  content: {
    type: String,
    required: [true, 'Please add note content'],
  },
  relatedCase: {
    type: mongoose.Schema.ObjectId,
    ref: 'Case',
  },
  relatedClient: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Note', NoteSchema);
