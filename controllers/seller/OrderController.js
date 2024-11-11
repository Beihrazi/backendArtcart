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
const getOrderDetails = expressAsyncHandler(async (req, res) => {
    try {
        console.log("user: ", req.user._id);

        // Find the seller based on the logged-in user
        const seller = await sellerModel.findOne({ sellerUser: req.user._id });
        if (!seller) {
            return res.status(404).json({ msg: "Seller not found" });
        }

        console.log("sellerId: ", seller._id);

        // Fetch orders and populate products with `seller` field
        const orders = await OrderModel.find({ "products.productId": { $exists: true } })
            .populate({
                path: "products.productId",
                select: "name price inStock seller",  // Ensure `seller` is included in the populated fields
            });

        console.log("Orders after population:", orders);

        // Filter orders to include only those with products from this specific seller
        const filteredOrders = orders.filter(order =>
            order.products.some(product => 
                product.productId &&  // Ensure productId is populated
                product.productId.seller &&  // Ensure seller field exists
                product.productId.seller.toString() === seller._id.toString()
            )
        );

        if (filteredOrders.length === 0) {
            return res.status(404).json({ msg: "No orders found for this seller's products" });
        }

        console.log("Filtered Orders: ", filteredOrders);
        res.status(200).json({ msg: "Orders fetched successfully", orders: filteredOrders });
    } catch (error) {
        console.error("Error fetching orders: ", error);
        res.status(500).json({ msg: "Server error" });
    }
});



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