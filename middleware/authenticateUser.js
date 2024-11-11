const expressAsyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');
const sellerModel = require('../models/seller/sellerModel');
const userModel = require('../models/userModel');
require('dotenv').config()

//user authentication

const authenticateUser = (req, res, next) =>{
    //get authorization header
    const authHeader = req.headers.authorization
    // console.log("Authorization Header: ", authHeader);

    //check authorization header exist
    if(authHeader && authHeader.startsWith('Bearer')){
        //extract token
        const token = authHeader.split(' ')[1];
        // console.log("token: ", token)

        //verify token
        jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
            if(err){
                return res.status(403).json({msg: "Forbidden, invalid token"})
            }
            // const {_id, email, role} = user
            // console.log("ID: ", _id)
            // console.log("Email: ", email)
            // console.log("Role: ", role)

            req.user = user;
            next();
        })
    }else{
        return res.status(401).json({msg: "Unauthorized, no token provided"})
    }
}

//Role based Authorization

const authorizeRoles = (...roles)=>{
    return (req, res, next) => {
        if(!req.user){
            return res.status(401).json({msg: "You're not authorized to access this route"})
        }
        if(!roles.includes(req.user.role)){
            return res.status(403).json({msg: "Forbidden only for authorized users"})
        }
        next();
    }
}

//seller verification Status
const isSellerVerified = expressAsyncHandler(async(req, res, next)=>{
    // console.log("user: ", req.user._id)
    const user = await sellerModel.findOne({sellerUser: req.user._id})

    if(!user || !user.isVerified){
        return res.status(403).json({msg: "Wait for admin's approval."})
    }
    next()
})

module.exports = {authenticateUser, authorizeRoles, isSellerVerified}