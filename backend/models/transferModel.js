const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  from: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  to: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  convertedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  rate: {
    type: Number,
    required: true,
    min: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);
