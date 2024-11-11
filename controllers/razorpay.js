const expressAsyncHandler = require("express-async-handler");
const crypto = require("crypto");
const razorpayInstance = require("../config/razorpayInstance");
const { savePaymentDetails } = require("./paymentService");
const OrderModel = require("../models/seller/OrderModel");
const customerModel = require("../models/customer/customerModel");

// POST - Create Order (Initiating Payment)
const orderPayment = expressAsyncHandler(async (req, res) => {
  const { products, totalAmount } = req.body;

  if (!totalAmount) {
    return res.status(400).json({ message: "Invalid amount provided" });
  }

  const options = {
    amount: Number(totalAmount * 100), // Amount in paise
    currency: "INR",
    receipt: crypto.randomBytes(10).toString("hex"),
    payment_capture: 1, // Automatically capture payment after authorization
  };

  try {

      //customerUser - 67-e0
  console.log("user: ", req.user._id)
  const customer  = await customerModel.findOne({customerUser: req.user._id})
  console.log("customer-su: ", customer)
    const order = await razorpayInstance.orders.create(options);
    if (!order) {
      return res
        .status(500)
        .json({ message: "Something went wrong while creating the order" });
    }
    const newOrder = new OrderModel({
      user: req.user._id, // Store user who placed the order
      userName: customer.name,
      products: products, // List of products
      totalAmount: totalAmount,
      razorpayOrderId: order.id, // Store Razorpay order ID
      receipt: options.receipt,
    });

    await newOrder.save();

    return res
      .status(200)
      .json({ msg: "Payment initiation successful", data: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    return res
      .status(500)
      .json({ message: "Error while creating order", error: error.message });
  }
});

// POST - Verify Payment
const paymentVerification = expressAsyncHandler(async (req, res) => {
  const { payment_id, order_id, signature, amount, currency } = req.body;
  console.log("Received order_id:", order_id);
  // Check if all required fields are present
  if (!payment_id || !order_id || !signature || !amount) {
    console.error("Missing required fields in payment verification:", req.body);
    return res
      .status(400)
      .json({ status: "failure", message: "Missing required fields" });
  }

  const sign = order_id + "|" + payment_id;
  const expected_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(sign)
    .digest("hex");

  console.log("Expected signature: ", expected_signature);
  console.log("Received signature: ", signature);
  console.log("payment_id : ", payment_id);

  // Compare expected signature with the received one
  if (expected_signature === signature) {
    const paymentDetails = {
      order_id,
      payment_id,
      amount,
      currency: currency || "INR", // Default to INR if no currency provided
      status: "completed",
      payment_method: "Razorpay",
      signature,
    };

    console.log("Payment details before saving: ", paymentDetails);

    try {
      const savedPayment = await savePaymentDetails(paymentDetails);
      if (!savedPayment) {
        console.error("Error saving payment details", paymentDetails);
        return res
          .status(500)
          .json({ status: "failure", message: "Error saving payment details" });
      }

      console.log("Payment details saved successfully:", savedPayment);
      return res.status(201).json({ status: "success", payment: savedPayment });
    } catch (error) {
      console.error("Payment verification failed:", error.message);
      return res
        .status(500)
        .json({ status: "failure", message: error.message });
    }
  } else {
    console.error("Signature mismatch");
    return res
      .status(400)
      .json({ status: "failure", message: "Signature mismatch" });
  }
});

module.exports = { orderPayment, paymentVerification };
