const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cartSchema = require("./customer/cartModel");
const wishListSchema = require("./customer/wishListModel");
const addressSchema = require("./addressModel");

// const userSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         unique: true,
//         required: false
//     },
//     //common
//     email: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 8,
//     },
//     role:{
//         type: String,
//         enum: ["admin", "customer", "seller"],
//         default: "customer",
//         required: true
//     },
    
//     // customer: {
//     //     type: mongoose.Schema.Types.ObjectId,
//     //     ref: "customer"
//     // },
//     contact: {
//         type: Number,
//         required: false,
//         trim: true,
//         match: /^[0-9]{10}$/,
//     },
//     altContact: {
//         type: Number,
//         required: false,
//         trim: true,
//         match: /^[0-9]{10}$/,
//     },
//     address: [addressSchema],
//     profileDp:{
//         type: String,
//         required: false
//     },
//     aadhaarDoc:{
//         type: String,
//         required: false
//     },
//     aadhaarNo:{
//         type: Number,
//         required: false,
//         maxlength: 12,
//         trim:true
//     },
//     adminId:{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: false
//     },
//     isVerified:{
//         type: Boolean,
//         default: false
//     },
//     profileStatus: {
//         type: Boolean,
//         default: false
//     },
//     wishList: [wishListSchema],
//     cart: [cartSchema]
// },{
//     timestamps: true,
// }
// )

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
    },
    role:{
        type: String,
        enum: ["admin", "customer", "seller"],
        default: "customer",
        required: true
    },
    
},{
    timestamps: true,
}
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  });
  
  
  userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
  };
  
  module.exports = mongoose.model("User", userSchema);