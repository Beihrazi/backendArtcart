const { default: mongoose } = require("mongoose")

const orderStatus = {
    placed: "Order Placed",
    dispatched: "Processing",
    delivered: "Delivered"
}

const orderSchema = new mongoose.Schema({

    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    userName: {
        type: String,
        require: false,
    },
   
    products : [
        {
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        quantity: {
            type: Number,
            required: true
        },
        amount:{
            type: Number,
            required: true
        },
        status : {
            type: String,
            enum : ["Order_Placed", "Processing", "Delivered"],
            default: "Order_Placed"
        },
    }
    ],
    totalAmount: {
        type: Number,
        required: true
    },

    
    razorpayOrderId:{
        type: String,
    },
    receipt: {
        type: String,
    },
    paymentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Payment"
    },
},{
    timestamps: true
})

module.exports = mongoose.model("Order", orderSchema)