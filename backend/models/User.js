const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true // We will store plain text for this simple prototype, but normally this must be hashed.
  },
  role: {
    type: String,
    enum: ['Senior Advocate', 'Junior Advocate', 'Paralegal', 'Clerk', 'Admin'],
    default: 'Junior Advocate'
  },
  supervisor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  pushSubscriptions: {
    type: Array,
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
