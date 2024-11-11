const expressAsyncHandler = require("express-async-handler");

const isValidUser = expressAsyncHandler(async(req,res)=>{
    res.status(200).json(req.user)
})

module.exports = {isValidUser}