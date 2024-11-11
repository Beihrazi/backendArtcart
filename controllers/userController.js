const expressAsyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const customerModel = require("../models/customer/customerModel");
require('dotenv').config()

//REGISTRATION
const registerUser = expressAsyncHandler(async (req, res) => {
  // console.log('Request URL:', req.originalUrl);
  const { email, password } = req.body;

  const isSeller = req.originalUrl.includes('seller');
  const isAdmin = req.originalUrl.includes('admin');

  const assignedRole = isAdmin ? 'admin' : (isSeller ? 'seller' : 'customer');

  let user = await User.findOne({ email, role: assignedRole});
  if (user) {
    return res.status(400).json({ msg: "user already exist" });
  }

  //create user
  user = new User({
    email,
    password,
    role: assignedRole,
  });
  await user.save();

  //if user is customer create customerModel
  if(assignedRole === "customer"){
    let customer = new customerModel({
      customerUser: user._id
    })
    await customer.save()
  }

  res.status(201).json({
    status: true,
    message: "Registration successful",
    data: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
});

//LOGIN
const loginUser = expressAsyncHandler(async(req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({msg: "Email or password are required"})
    }
    let user = await User.findOne({email})
    
    if(!user || !(await user.matchPassword(password))){
        return res.status(400).json({msg: "invalid credential"})
       
    }
    const token = generateJwt(user)

    res.status(200).json({
        message: "Login successful",
        _id: user._id,
        email: user.email,
        profileStatus: user.profileStatus,
        role: user.role,
        token,
    })
})

const generateJwt = (user) =>{
    return jwt.sign({
      _id: user._id,    // Pass _id
      email: user.email,  // Pass email
      role: user.role    // Pass role
    }, process.env.JWT_SECRET,{
        expiresIn: '15d',
    })
}

//Get-Test
const getMe = expressAsyncHandler(async (req, res)=>{
  const user = await User.findById(req.user._id).select("-password")
  // console.log("user: ", user)
  if(!user){
    return res.status(404).json({msg: "User not found"});
  }
  res.status(200).json(req.user)
})

module.exports = { registerUser, loginUser, getMe };
