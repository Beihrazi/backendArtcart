// GET /admin/customer: View all customers.
// GET /admin/customer/:id: View a specific user’s profile.
// DELETE /admin/customer/:id: Deactivate or remove a customer’s account.

const expressAsyncHandler = require("express-async-handler")
const userModel = require("../../models/userModel")

//verify any id
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id)

// GET - /admin/customer:
//Get all registered customer.
const getAllCustomer = expressAsyncHandler(async(req, res)=>{
    const customer = await userModel.find({role: 'customer'})
    if(!customer.length){
      return res.status(404).json({msg: "No customers found"})
    }
    res.status(200).json(customer)
})

// GET /admin/customer/:id
const singleCustomer = expressAsyncHandler(async(req, res) =>{
  const {id} = req.params
  if(!isValidId(id)){
      return res.status(400).json({msg: "Invalid Id"})
  }
  const getCustomer = await userModel.findById(id)
  if(!getCustomer){
    return res.status(404).json({msg: "Customer not found"})
  }
  res.status(200).json(getCustomer)
})

// DELETE /admin/customer/:id
const deleteSingleCustomer = expressAsyncHandler(async(req, res) =>{
  const {id} = req.params
  if(!isValidId(id)){
      return res.status(400).json({msg: "Invalid Id"})
  }
  const getCustomer = await userModel.findByIdAndDelete(id)
  if(!getCustomer){
    return res.status(404).json({msg: "Customer not found"})
  }
  res.status(200).json({
    msg: "Customer deleted sucessfully"
  })
})

module.exports = {getAllCustomer, singleCustomer, deleteSingleCustomer}