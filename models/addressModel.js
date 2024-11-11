const mongoose = require("mongoose");

const userAddress = mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  landmark: { type: String, required: false },
  pincode: { type: Number, required: true, maxlength: 6},
  locality: { type: String, required: true },
});

module.exports = userAddress
