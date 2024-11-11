const express = require('express')
const expressAsyncHandler = require('express-async-handler')
const sellerUser = require('../../models/seller/sellerModel')
const mongoose = require('mongoose')
const sellerModel = require('../../models/seller/sellerModel')
const userModel = require('../../models/userModel')
const testModel = require('../../models/testModel')


const testProfile = expressAsyncHandler(async (req, res) => {
    // Check if both files were uploaded
    const profileDpFile = req.files.profileDp ? req.files.profileDp[0] : null;
    const aadhaarDocFile = req.files.aadhaarDoc ? req.files.aadhaarDoc[0] : null;
  
    if (!profileDpFile || !aadhaarDocFile) {
      return res.status(400).json({ message: 'Both profileDp and aadhaarDoc files are required!' });
    }
    
    const result = await testModel.create({
        profileDp: profileDpFile.path,
        aadhaarDoc: aadhaarDocFile.path
    })
    // Both files were successfully uploaded
    res.status(201).json({
      message: 'Files uploaded successfully',
      files: {
        data: result
      },
    });
  });
  

//POST
//api/seller/profile
const setProfile = expressAsyncHandler(async (req, res) => {
    const { name, contact, aadhaarNo } = req.body;

    // Validate fields and files
    if (!name || !contact || !aadhaarNo) {
        return res.status(400).json({ msg: "All fields must be provided!" });
    }

    const profileDpFile = req.files.profileDp ? req.files.profileDp[0] : null;
    const aadhaarDocFile = req.files.aadhaarDoc ? req.files.aadhaarDoc[0] : null;

    if (!profileDpFile) {
        return res.status(400).json({ msg: "Profile picture (profileDp) file is required!" });
    }

    if (!aadhaarDocFile) {
        return res.status(400).json({ msg: "Aadhaar document (aadhaarDoc) file is required!" });
    }

    // Create the seller in the database
    const seller = new sellerModel({
        name,
        contact,
        aadhaarNo,
        profileDp: profileDpFile.path,  // Cloudinary URL for profileDp
        aadhaarDoc: aadhaarDocFile.path,  // Cloudinary URL for aadhaarDoc
        profileStatus: true,
        sellerUser: req.user._id
    });

    const sellerUser = await seller.save();
    if (!sellerUser) {
        return res.status(404).json({ message: 'Error creating seller profile' });
    }
    // Respond with the created seller profile data
    res.status(201).json({  // Changed to 201 for creation
        msg: "Seller profile created successfully",
        data: {
            sellerId: sellerUser._id,
            name: sellerUser.name,
            contact: sellerUser.contact,
            profileDp: sellerUser.profileDp,
            aadhaarDoc: sellerUser.aadhaarDoc,
        },
    });
});



  
//checking valid id
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

//PUT
//api/seller/profile/:id
const updateProfile = expressAsyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!isValidId(id)){
        return res.status(404).json({msg: "Invalid Profile Id"})
    }
    const editProfile = await userModel.findByIdAndUpdate(
        id,
        req.body,
        {
            new:true,
            runValidators: true
        }
    )
    console.log("editProfile: ", editProfile)
    
    if(!editProfile){
        return res.status(404).json({msg: "Seller profile does not exist"})
    }
    res.status(200)
    .json({
        message: "Updated profile successfully",
        data: {
            profile: editProfile
        }
    })
})

//DELETE
//api/seller/profile/:id
const deleteProfile = expressAsyncHandler(async(req,res)=>{
    const {id} = req.params
    if(!isValidId(id)){
        return res.status(400).status({msg: "Invalid Id"})
    }
    const remove = await userModel.findByIdAndDelete(id)

    if(!remove){
        return res.status(404).json({msg: "Seller profile does not exist"})
    }
    res.status(200)
    .json({
        message: "profile deleted successfully",
    })
})

module.exports = {setProfile, updateProfile, deleteProfile, testProfile}