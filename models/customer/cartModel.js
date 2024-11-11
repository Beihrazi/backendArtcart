const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    }
},{
    Timestamp: true
})

module.exports = cartSchema