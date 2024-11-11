const expressAsyncHandler = require("express-async-handler");
const categoryModel = require("../../models/admin/category");
const productModel = require("../../models/seller/productModel");

//GET
//api/users/product
const categoryFiltering = expressAsyncHandler(async(req,res) =>{
    const {categoryName} = req.query
    const category =  await categoryModel.findOne({name: categoryName})
    if (!category) {
        return res.status(404).json({ message: "Category not found" });
    }
    // console.log("category is: ", category)

    const product = await productModel.find({category: categoryName})
    // console.log("product: ", product)
    res.status(200).json(product)
})


//GET-Category
//api/users/category
const getCategoryFromCustomer = expressAsyncHandler(async(req,res) =>{
    const category = await categoryModel.find();
    if(!category){
        return res.status(400).json({msg: "Empty category"})
    }
    return res.status(200).json({msg: "Fetch category successfully", 
        category,
    })
})

const accessOrderPage = expressAsyncHandler(async(req,res)=>{
    return res.status(200).json({msg: "success"})
})

module.exports = {categoryFiltering, getCategoryFromCustomer, accessOrderPage}