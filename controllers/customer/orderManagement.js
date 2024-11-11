const Order = require("../../models/seller/OrderModel")

//GET

const expressAsyncHandler = require("express-async-handler");

//api/users/order
const getOrders = expressAsyncHandler(async(req,res)=>{
    const order = await Order.find({user: req.user._id})
    .populate("products.productId", "name photos")
    .exec();
    console.log("order", order)
    if(!order){
        return res.status(404).json({msg: "Empty Order"})
    }
    return res.status(200).json({msg: "Fetch orders successfully", data: order})
})

module.exports = {getOrders}