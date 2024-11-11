const expressAsyncHandler = require("express-async-handler");
const productModel = require("../../models/seller/productModel");

//GET - fetching featuered products
//api/customer
const featuredProducts = expressAsyncHandler(async(req,res)=>{
    const data = await productModel.find().populate("category","name").populate("seller","name")
    console.log("data: ", data)
    if(!res){
        return res.status(404).json({msg: "Empty Products"})
    }
    res.status(200).json({
        msg: "Products fetch Successfully",
        data
    })
})



module.exports = {featuredProducts}