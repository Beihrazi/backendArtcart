// GET /seller/orders: View all orders that include the seller’s products.
// GET /seller/orders/:id: View details of a specific order.
// PUT /seller/orders/:id/status: Update the status of an order (e.g., processing, shipped).

const expressAsyncHandler = require("express-async-handler");
const { findById } = require("../../models/seller/OrderModel");
const Product = require("../../models/seller/productModel");
const OrderModel = require("../../models/seller/OrderModel");
const sellerModel = require("../../models/seller/sellerModel");
const customerModel = require("../../models/customer/customerModel");
const { default: mongoose } = require("mongoose");

//GET
//api/seller/orders
const getOrderDetails = expressAsyncHandler(async(req, res)=>{
    console.log("user: ", req.user._id);

    const customer = await customerModel.findOne({ customerUser: req.user._id });
    console.log("customer: ", customer)
    
    const sellerId = await sellerModel.findOne({sellerUser: req.user._id})
    
    const order = await OrderModel.find({"products.productId": {$exists: true}})
    .populate({
        path: "products.productId",
        match: {seller: sellerId._id},
        select: "name price inStock",
    })
    

    if(!order){
        return res.status(404).json({msg: "orders does not exist"})
    }
    //name and instock
    console.log("order: ", order)
    res.status(200).json({msg: "orders fetched Successfully", order})
})

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

//PUT
//api/seller/order/:id
const updateStatus = expressAsyncHandler(async(req,res)=>{
    const {id} = req.params
    
    const {status, productId} = req.body

    if(!isValidId(id)){
        return res.status(400).json({msg: "invalid id"})
    }
    if(!["Order_Placed", "Processing", "Delivered"].includes(status)){
        return res.status(400).json({msg: "invalid status value"})
    }
    // const log = await OrderModel.findById("672fc4a42a4249fe1ff4e3d7")
    // console.log("log: ", log)
    const updateStatus = await OrderModel.findOneAndUpdate(
        {_id: id, "products.productId": productId},

        {
            $set: {"products.$.status": status}
        },
        {new: true}
    )
    if(!updateStatus){
        return res.status(400).json({msg: "Order not found"})
    }
    res.status(200).json({
        msg: "status updated Successfully",
        data: updateStatus
    })

})

module.exports = {getOrderDetails, updateStatus}