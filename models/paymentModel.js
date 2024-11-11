const mongoose = require('mongoose');

// Define the Payment Schema
const paymentSchema = new mongoose.Schema({
  order_id: {
    type: String,
    required: true,
    unique: true, // Ensure unique order ID
  },
  payment_id: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true, // Amount in paise (100 paise = 1 INR)
  },
  currency: {
    type: String,
    default: 'INR', // Default currency is INR
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending', // Default status is 'pending'
  },
  payment_method: {
    type: String,
    required: true,
  },
  signature: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
