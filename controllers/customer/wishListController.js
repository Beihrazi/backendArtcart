// Add, View, remove - wishlist items

const expressAsyncHandler = require("express-async-handler");
const userModel = require("../../models/userModel");
const category = require("../../models/admin/category");


//POST
//api/user/wishlist/cart - { from wishlist to cart }
const fromWishListToCart = expressAsyncHandler(async(req,res) =>{
    const user = await userModel.findById(req.user._id)
    if(!user){
        return res.status(404).json({msg: "user not found"})
    }
    //product_id
    const {productId} = req.body
    // const productToCart = user.wishList.find(item => item.productId.toString() === productId);

    const productInCart = user.cart.find(item => item.productId.toString() === productId)
    if(productInCart){
        productInCart.quantity += 1
    }else{
        user.cart.push({productId, quantity: 1})
    }
    await user.save();

    const updatedUser = await userModel.findById(req.user._id).populate('cart.productId');
    console.log("updatesd: ", updatedUser)
    // Structure populated cart items for the response
    const populatedCartItems = updatedUser.cart.map(item => ({
        productId: item.productId._id,
        name: item.productId.name,
        category: item.productId.category,
        quantity: item.quantity,
    }));

    res.status(200).json({
        msg: "Product added to Cart successfully",
        cart: populatedCartItems
    });
})

//POST 
//api/users/wishlist - the proudct_Id will be passed from the body

const addToWishlist = expressAsyncHandler(async (req, res) =>{

    //Each user has its own wishlis so find user first
    const user = await userModel.findById(req.user._id)
    if(!user){
        return res.status(404).json({msg: "user not found"})
    }
    const {productId} = req.body

    const wishListItem = user.wishList.find((item)=>item.productId.toString() === productId)
    if(wishListItem){
        return res.json({ msg: "Product is already in the wishlist" });
    }
    // if (user.wishList.includes(productId)) {
    //     return res.json({ msg: "Product is already in the wishlist" });
    // }

    //i need to push ObjectId not stringId
    user.wishList.push({productId});
    await user.save(); // Save the updated user document
    res.status(201).json({ msg: "Product added to wishlist" });

})

//GET
//api/users/wishlist
const getAllWishlist = expressAsyncHandler(async(req,res)=>{

    const user = await userModel.findById(req.user._id).populate('wishList.productId');
    if(!user){
        return res.status(404).json({msg: "user not found"})
    }
    if(!user.wishList.length){
        return res.status(404).json({msg: "Empty wishlist"})
    }
    const product = user.wishList.map((item) => ({
        product_Id: item.productId._id,
        name: item.productId.name,
        category: item.productId.category
    }))
    res.status(200).json({
        msg: "Retrieving wishList",
        wishlist: product
    })
   
})

//DELETE
//api/users/wishlist
const deleteWishlist = expressAsyncHandler(async(req,res)=>{

    const user = await userModel.findById(req.user._id)
    if(!user){
        return res.status(404).json({msg: "user not found"})
    }
    const {_id} = req.body
    user.wishList = user.wishList.filter((id)=> id.toString() !== _id)
    await user.save()

    res.status(200).json({ message: 'Product removed from wishlist' });
   
})


module.exports = {addToWishlist, getAllWishlist, deleteWishlist, fromWishListToCart}