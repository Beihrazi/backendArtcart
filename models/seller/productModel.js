const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description:{
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        default: true
    },
    photos:{
        type: [String],
        required: true
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'seller',
        required: true
    }
},{
    timestamps: true
}
)
module.exports = mongoose.model('Product', productSchema)