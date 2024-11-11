// GET /admin/products: List all products across the platform. 
// PUT /admin/products/:id: Update product details.
// DELETE /admin/products/:id: Remove inappropriate or discontinued prod

const expressAsyncHandler = require("express-async-handler");
const productModel = require("../../models/seller/productModel");
const mongoose = require('mongoose')

// GET 
//api/admin/products:
const getAllSellerProduct = expressAsyncHandler(async(req, res)=>{
    const products = await productModel.find()
    console.log("products: ", products)
    if(!products && !products.length){
        return res.status(404).json({msg: "Products not found"})
    }
    res.status(200).json(products)
})

//check valid id 
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)
// GET 
//api/admin/products/:id:
const getSingleSellerProduct = expressAsyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!isValidId(id)){
        return res.status(400).status({msg: "Invalid Id"})
    }
    const product = await productModel.findById(id)
    console.log("Single product: ", product)
    if(!product){
        return res.status(404).json({msg: "product not found"})
    }
    res.status(200).json(product)
})

// DELETE 
//api/admin/products/:id:
const deleteSingleSellerProduct = expressAsyncHandler(async(req, res)=>{
    const {id} = req.params
    if(!isValidId(id)){
        return res.status(400).status({msg: "Invalid Id"})
    }
    const product = await productModel.findByIdAndDelete(id)
    
    if(!product){
        return res.status(404).json({msg: "product not found"})
    }
    res.status(200).json({
        msg: "Product deleted successfully"
    })
})

module.exports = {getAllSellerProduct, getSingleSellerProduct, deleteSingleSellerProduct}