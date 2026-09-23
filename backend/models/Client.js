const mongoose = require('mongoose');

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  type: {
    type: String,
    enum: ['Individual', 'Corporate', 'Government', 'Other'],
    default: 'Individual',
  },
  email: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive', 'Lead'],
    default: 'Active',
  },
  addedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  totalCases: {
    type: Number,
    default: 0
  },
  companyName: {
    type: String,
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Reverse populate with virtuals
ClientSchema.virtual('cases', {
  ref: 'Case',
  localField: '_id',
  foreignField: 'client',
  justOne: false
});

module.exports = mongoose.model('Client', ClientSchema);
