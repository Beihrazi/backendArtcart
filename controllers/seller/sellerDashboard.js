const expressAsyncHandler = require('express-async-handler');

// Controller to handle seller dashboard access
const accessSellerDashboard = expressAsyncHandler(async (req, res) => {
    console.log("User: ", req.user);
    res.status(200).json({
        message: "Access granted to the Seller Dashboard!",
        profileStatus: true
    });
});

// Export the controller
module.exports = { accessSellerDashboard };