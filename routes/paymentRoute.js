const express = require('express')
const { authenticateUser, authorizeRoles } = require('../middleware/authenticateUser')
const { orderPayment, paymentVerification } = require('../controllers/razorpay')
const router = express.Router()

router.post("/order", authenticateUser, authorizeRoles('customer'), orderPayment)
router.post("/verify", authenticateUser, authorizeRoles('customer'), paymentVerification)

module.exports = router