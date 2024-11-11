const mongoose = require('mongoose')
const addressSchema = require('../addressModel')
const wishListSchema = require('./wishListModel')
const cartSchema = require('./cartModel')
const userAddress = require('../addressModel')

const customerSchema = mongoose.Schema({
    name: {
        type: String,
        required: false,
        unique: true
    },
   
    contact: {
        type: Number,
        required: false,
        trim: true,
        match: /^[0-9]{10}$/,
    },
    altContact: {
        type: Number,
        required: false,
        trim: true,
        match: /^[0-9]{10}$/,
    },
    address:[userAddress],
    wishList: [wishListSchema],
    cart: [cartSchema],
    customerUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    
},{
    timestamps: true,
}
)
module.exports = mongoose.model('customer', customerSchema)