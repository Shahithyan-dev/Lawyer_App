const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  fileUrl: {
    type: String,
    required: true
  },
  caseReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Case',
    required: false
  },
  clientReference: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: false
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Document', documentSchema);
