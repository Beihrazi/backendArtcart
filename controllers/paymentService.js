const Payment = require('../models/paymentModel'); // Import the Payment model

async function savePaymentDetails(paymentDetails) {
    try {
        const payment = new Payment(paymentDetails);  // Create a new Payment instance
        const savedPayment = await payment.save();  // Save to database
        return savedPayment;
    } catch (error) {
        throw new Error('Error saving payment details: ' + error.message);
    }
}

module.exports = {
  savePaymentDetails,
};
