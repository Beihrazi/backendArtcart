const expressAsyncHandler = require("express-async-handler");
const productModel = require("../../models/seller/productModel");
const Category = require('../../models/admin/category')
const mongoose = require('mongoose');
const userModel = require("../../models/userModel");
const sellerModel = require("../../models/seller/sellerModel");
require('dotenv').config()

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

//GET-category
const getCategoryFromSeller = expressAsyncHandler(async(req,res)=>{
    const categories = await Category.find();
    console.log("user name", categories)
    if(!categories){
        return res.status(404).json({msg: "Empty categories"})
    }
    res.status(200).json(categories)
})

//GET - Listing Single product
//api/seller/product/id

const getSingleProduct = expressAsyncHandler(async(req,res)=>{
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        return res.status(400).json({ msg: "Invalid product ID" });
    }

    const products = await productModel.findById(id)
   
    if(!products){
        return res.status(404).json({msg: "Empty Products"})
    } 
    res.status(200).json(products)
})

//GET - Listing All products
//api/seller/product/

const getAllProduct = expressAsyncHandler(async(req,res)=>{
    // req.user._id - userId
    const userSeller = await sellerModel.findOne({sellerUser: req.user._id})
    // console.log("userSellers: ", userSeller)
    const products = await productModel.find({seller: userSeller._id}).populate("category","name").exec()
    // console.log("proudcts: ", products)

    if(products.length === 0){
        return res.status(404).json({msg: "Empty Products"})
    } 
    res.status(200).json(products)
})

//POST
//api/seller/product
const setProduct = expressAsyncHandler(async(req,res)=>{
    
    const {name, price, description, inStock, category} = req.body

    if(!name || !price || !description || !inStock || !req.files.photos || !category){
        return res.status(400).json({msg: "Empty field, Fill all the remainng Fields"})
    }
    //checking category is valid and created by admin no need actually will be managed from frontend
    // const adminId = process.env.ADMIN_ID;
    // const validCategory = await Category.findOne({name: category, createdBy: adminId})

    // if(!validCategory){
    //     return res.status(400).json({msg: "Invalid category, please selected a valid category"})
    // }

    const existingProduct = await productModel.findOne({ name, category });
    if (existingProduct) {
        return res.status(400).json({ msg: "Product already exists in this category" });
    }
    const sellerName = await sellerModel.findOne({sellerUser: req.user._id})
    // console.log("seller ", sellerName)
    if (!sellerName) {
        return res.status(404).json({ message: 'User Product not found' });
    }
    
    
    const photopath = req.files.photos.map((photo)=> photo.path)
    console.log("photo: ", photopath)
    
    const product = new productModel({
        name,
        price,
        description,
        inStock,
        photos: photopath,
        category,
        seller: sellerName._id, //seller_id not sellerUser
    })
    const saveProduct = await product.save()
    // console.log(saveProduct)

    res.status(201).json({
        message: "successfully Product added",
        data:{
            productId: saveProduct._id,
            seller: req.user.email,
            category: saveProduct.category,
            photos: saveProduct.photos
        }
    })
})



const updateProduct = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        return res.status(400).json({ msg: "Invalid product ID" });
    }

    // Check if the product exists and belongs to the seller
    const existingProduct = await productModel.findById(id);
    if (!existingProduct) {
        return res.status(404).json({ msg: "Product does not exist" });
    }

    const userSeller = await sellerModel.findOne({ sellerUser: req.user._id });
    if (!userSeller || existingProduct.seller.toString() !== userSeller._id.toString()) {
        return res.status(403).json({ msg: "Forbidden! You do not have permission!" });
    }

    // Collect updates
    const updates = { ...req.body };

    // Update photos if provided
    if (req.files && req.files.photos && req.files.photos.length > 0) {
        updates.photos = req.files.photos.map((photo) => photo.path);
    }

    // Update the product with new data
    const updatedProduct = await productModel.findByIdAndUpdate(
        id,
        updates,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({
        message: "Updated Product successfully",
        data: {
            product: updatedProduct
        }
    });
});


//DELETE
//api/seller/:id
const deleteProduct = expressAsyncHandler(async(req, res)=>{

    const deleteCommand = await productModel.findByIdAndDelete(req.params.id)
    console.log("delete: ", deleteCommand)

    const userSeller = await sellerModel.findOne({sellerUser: req.user._id})

    if(!deleteCommand){
        return res.status(404).json({msg: "Product does not exist"})
    }
    if(deleteCommand.seller.toString() !== userSeller._id.toString()){
        return res.status(403).json({msg: "Forbidden! You do not have permission!"})
    }
   
    res.status(200)
    .json({
        message: "Product deleted successfully"
    })
})

module.exports = {getSingleProduct, getAllProduct, setProduct, updateProduct, deleteProduct, getCategoryFromSeller};