const expressAsyncHandler = require("express-async-handler");
const Category = require("../../models/admin/category");
const userModel = require("../../models/userModel");
const mongoose = require('mongoose')
const sellerModel = require("../../models/seller/sellerModel");

//verify any id
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

//GET
// api/admin/category
const getCategory = expressAsyncHandler(async(req,res)=>{
    const categories = await Category.find({ createdBy: req.user._id });
    console.log("user name", categories)
    if(!categories){
        return res.status(404).json({msg: "Empty categories"})
    }
    res.status(200).json(categories)
})

//POST
// api/admin/category
const setCategory = expressAsyncHandler(async(req, res)=>{
    const {name} = req.body
    if(!name){
        return res.status(400).json({msg: "category field name is missing"})
    }
    let category = new Category({
        name,
        createdBy: req.user._id
    })
    await category.save()

    res.status(201).json({
        message: "successfully added category",
        data:{
            _id: req.user._id,
            category: category.name
        }
    })
})

//PUT
// api/admin/category/:id
const editCategory = expressAsyncHandler(async(req, res)=>{

    // console.log("Request Body: ", req.body);
    const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id, 
        req.body,     
        {
            new: true,          
            runValidators: true, 
        }
    );
        // console.log("updateCategory: ", updatedCategory)
        if(!updatedCategory){
            return res.status(404).json({msg: "category not found"})
        }
        res.status(200)
        .json({
            message: "category updated successfully",
            data: {
                name: updatedCategory.name
            }
        })
})

//DELETE
//api/admin/category/:id
const deleteCategory = expressAsyncHandler(async(req, res)=>{
    const categoryId = await Category.findByIdAndDelete(req.params.id)
    if(!categoryId){
        return res.status(404).json({msg: "Category Id does not exist"})
    }
    res.status(200).json({
        message: "category deleted successfully"
    })
})

module.exports = {setCategory, editCategory, getCategory, deleteCategory}

