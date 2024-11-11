const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },  
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        
    }
})
module.exports = mongoose.model("Category", productSchema)