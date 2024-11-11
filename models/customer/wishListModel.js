const mongoose = require('mongoose')

const wishListSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
},{
    Timestamp: true
})

module.exports = wishListSchema