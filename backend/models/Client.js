const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },
  mobile: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: false
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Client', clientSchema);
