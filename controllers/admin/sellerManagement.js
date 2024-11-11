// GET /admin/sellers: View all registered sellers. (DONE)
// GET /admin/sellers/:id: View a specific seller’s profile. (DONE)
// PUT /admin/sellers/:id/verify: Verify or unverify a seller’s account. (DONE)
// DELETE /admin/sellers/:id: Remove a seller from the platform. (DONE)

const expressAsyncHandler = require("express-async-handler");
const Category = require("../../models/admin/category");
const userModel = require("../../models/userModel");
const mongoose = require('mongoose');
const sellerModel = require("../../models/seller/sellerModel");


//verify any id
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

// GET - /admin/seller:
//View all registered sellers.
const viewAllSellers = expressAsyncHandler(async(req, res)=>{
    const sellers = await sellerModel.find()
    console.log("sellers: ", sellers)
    if(!sellers.length){
      return res.status(404).json({msg: "No selllers found"})
    }
    res.status(200).json(sellers)
})

// GET /admin/seller/:id
const singleSeller = expressAsyncHandler(async(req, res) =>{
  const {id} = req.params
  if(!isValidId(id)){
      return res.status(400).json({msg: "Invalid Id"})
  }
  const getSeller = await sellerModel.findById(id)
  if(!getSeller){
    return res.status(404).json({msg: "Seller not found"})
  }
  res.status(200).json(getSeller)
})

// DELETE /admin/sellers/:id
const deleteSingleSeller = expressAsyncHandler(async(req, res) =>{
  const {id} = req.params
  if(!isValidId(id)){
      return res.status(400).json({msg: "Invalid Id"})
  }
  const getSeller = await sellerModel.findByIdAndDelete(id)
  if(!getSeller){
    return res.status(404).json({msg: "Seller not found"})
  }
  res.status(200).json({
    msg: `Seller with id: ${id} deleted sucessfully`
  })
})


//update seller's adminId and approve seller
const updateSellerStatus = expressAsyncHandler(async(req, res)=>{

    const {id} = req.params
    const {isVerified} = req.body

    if(!isValidId(id)){
        return res.status(400).json({msg: "Invalid Id"})
    }
    const updatedSeller = await sellerModel.findByIdAndUpdate(
        id,
        {adminId: req.user._id, isVerified},
        { new: true, runValidators: true }
    )
    if (!updatedSeller) {
        return res.status(404).json({ error: 'Seller not found' });
      }
  
      res.status(200).json({
        message: "Seller is verified",
        body: updatedSeller
      });
})

module.exports = {updateSellerStatus, viewAllSellers, singleSeller, deleteSingleSeller}