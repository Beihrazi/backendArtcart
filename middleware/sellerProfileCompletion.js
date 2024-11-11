const expressAsyncHandler = require("express-async-handler");
const userModel = require("../models/userModel");
const sellerModel = require("../models/seller/sellerModel");

const sellerProfileCompletion = expressAsyncHandler(async(req, res, next)=>{
   
    const seller = await sellerModel.findOne({sellerUser: req.user._id})
    // console.log("user: ", seller.profileStatus)
    if(!seller){
        return res.status(404).json({msg: "Seller not found"})
    }
    if(!seller || !seller.profileStatus){
        return res.status(403).json({msg: "Please complete your profile first"})
    }
    next()
})

module.exports = sellerProfileCompletion