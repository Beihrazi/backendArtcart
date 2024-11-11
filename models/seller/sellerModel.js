const mongoose = require('mongoose')

const sellerSchema = mongoose.Schema({
    
    name: {
        type: String,
        required: true,
        unique: true
    },
   
    contact: {
        type: Number,
        required: false,
        trim: true,
        match: /^[0-9]{10}$/,
    },
    profileDp:{
        type: String,
        required: true
    },
    aadhaarDoc:{
        type: String,
        required: true
    },
    aadhaarNo:{
        type: Number,
        required:true,
        maxlength: 12,
        minlength: 12,
        trim:true
    },
    //References and stuff
    sellerUser:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    adminId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    isVerified:{
        type: Boolean,
        default: false
    },
  
    profileStatus: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true,
})
module.exports = mongoose.model('seller', sellerSchema)