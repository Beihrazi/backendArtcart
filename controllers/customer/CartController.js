const userModel = require('../../models/userModel')

const expressAsyncHandler = require("express-async-handler");

//Post - add to cart
//api/users/cart
const addToCart = expressAsyncHandler(async(req,res)=>{
    
    const user = await userModel.findById(req.user._id)
    if(!user){
        return res.status(404).json({msg: "User not found"})
    }
    const {productId} = req.body

    //check if product already exist in the cart 
    const cartItem = await user.cart.find(item => item.productId.toString() === productId)
    console.log("CartId: ", cartItem)
    if(cartItem){
        cartItem.quantity  += 1;
    }else{
        user.cart.push({productId, quantity: 1})
    }
    await user.save()

    res.status(201).json({msg: "Product added to cart"})
})

//GET
//api/users/cart
const displayCart = expressAsyncHandler(async(req, res)=>{
    const user = await userModel.findById(req.user._id).populate('cart.productId')
    if(!user){
        return res.status(404).json({msg: "User not found"})
    }
    if(user.cart.length===0){
        return res.status(200).json({ msg: "Cart is empty", cart: [] });
    }
    //for displaying
    const simplifiedCart = user.cart.map(cartItem => ({
        cart_id: cartItem._id,
        productName: cartItem.productId.name, 
        quantity: cartItem.quantity
      }));
    res.status(200).json({ msg: "Cart retrieved successfully", cart: simplifiedCart });
})

//checking 
//UPDATE
//api/users/cart/:id
const updateCart = expressAsyncHandler(async(req, res)=>{
    const user = await userModel.findById(req.user._id)
    if(!user){
        return res.status(404).json({msg: "User not found"})
    }
    //find product_id and quantity to update
    const {_id, quantity} = req.body
    const cartItem = user.cart.find(item => item._id.toString() === _id)
    // console.log("cartitem = ", cartItem)
    cartItem.quantity = quantity
    await user.save()
    
    res.status(200).json({msg: "Cart updated successfully"})
})

//DELETE
//api/users/cart
const deleteCart = expressAsyncHandler(async(req, res)=>{
    const user = await userModel.findById(req.user._id)
    if(!user){
        return res.status(404).json({msg: "User not found"})
    }
    const {_id} = req.body
    user.cart =  user.cart.filter(item => item._id.toString() !== _id)
    await user.save()

    res.status(200).json({msg: "Cart removed Successfully"})
    
})



module.exports = {addToCart, displayCart, updateCart, deleteCart}