const expressAsyncHandler = require("express-async-handler");
const { findById } = require("../../models/userModel");
const userModel = require("../../models/userModel");
const customerModel = require("../../models/customer/customerModel");
const addressSchema = require("../../models/addressModel");


//GET
//api/users/billing
const getBilling = expressAsyncHandler(async (req, res) => {

    const data = await customerModel.findOne({customerUser: req.user._id});

    // If no billing records are found
    if (!data) {
        return res.status(400).json({ msg: "No billing records found" });
    }

    return res.status(200).json({
        msg: "Successfully fetched billing data",
        data
    });
});


// PUT
// api/users/personalDetail
const personalDetail = expressAsyncHandler(async (req, res) => {
  const { name, contact, altContact } = req.body;
  
  // Check for required fields
  if (!name || !contact) {
    return res.status(400).json({ msg: "Name and contact are required" });
  }

  // Find the user and update their details
  const updatedUser = await customerModel.findOneAndUpdate(
    {customerUser: req.user._id},
    { name, contact, altContact },
    { new: true}  // Return the updated user
  );

  if (!updatedUser) {
    return res.status(404).json({ msg: "User not found" });
  }

  return res.status(200).json({
    msg: "User details updated successfully",
    user: updatedUser,
  });
});


//POST
//api/users/billing
const userBilling = expressAsyncHandler(async (req, res) => {
  const { address } = req.body;

  
  for (const add of address) {
    if ( !add.street || !add.city || !add.state || !add.pincode || !add.locality) {
      return res.status(400).json({ msg: "All fields except landmark are required in address" });
    }
  }

  // Step 2: Find the existing customer document or create a new one if not found
  let customer = await customerModel.findOne({ customerUser: req.user._id });
  
  // Step 3: If customer does not exist, create a new customer document
  if (!customer) {
    // Create a new customer with the provided address
    customer = new customerModel({
      customerUser: req.user._id,
      address: address,  // Assign the provided address array
      // You can add other fields here if required, such as `name`, `contact`, etc.
    });
    await customer.save(); // Save the newly created customer document
  } else {
    // Step 4: If customer exists, just push new addresses to the existing address array
    customer.address.push(...address);
    await customer.save(); // Save the updated customer document
  }

  // Step 5: Return the updated customer address information in the response
  return res.status(201).json({
    msg: "User billing information updated successfully",
    data: customer.address, // Return the updated address array
  });
});


module.exports = {userBilling, getBilling, personalDetail}