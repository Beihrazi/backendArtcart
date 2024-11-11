const express = require('express');
const { authenticateUser, authorizeRoles } = require('../../middleware/authenticateUser');
const { setCategory, editCategory, getCategory, deleteCategory } = require('../../controllers/admin/adminController');
const { viewAllSellers, singleSeller, deleteSingleSeller, updateSellerStatus } = require('../../controllers/admin/sellerManagement');
const { getAllSellerProduct, getSingleSellerProduct, deleteSingleSellerProduct } = require('../../controllers/admin/productManagement');
const { getAllCustomer, singleCustomer, deleteSingleCustomer } = require('../../controllers/admin/userManagement');
const { isValidUser } = require('../../controllers/admin/adminDashboard');
const router = express.Router();

//category route
router.get('/category', authenticateUser, authorizeRoles('admin'), getCategory)
router.post('/category', authenticateUser, authorizeRoles('admin'), setCategory)
router.put('/category/:id', authenticateUser, authorizeRoles('admin'), editCategory )
router.delete('/category/:id', authenticateUser, authorizeRoles('admin'), deleteCategory)

//update adminId and approve seller status - sellerId
router.patch('/seller/:id', authenticateUser, authorizeRoles('admin'), updateSellerStatus)

//seller-management routes
router.get('/seller', authenticateUser, authorizeRoles('admin'), viewAllSellers)
router.get('/seller/:id', authenticateUser, authorizeRoles('admin'), singleSeller)
router.delete('/seller/:id', authenticateUser, authorizeRoles('admin'), deleteSingleSeller)

//admin-product routes
router.get('/product', authenticateUser, authorizeRoles('admin'), getAllSellerProduct)
router.get('/product/:id', authenticateUser, authorizeRoles('admin'),getSingleSellerProduct)
router.delete('/product/:id', authenticateUser, authorizeRoles('admin'), deleteSingleSellerProduct)

//admin-customer routes
router.get('/customer', authenticateUser, authorizeRoles('admin'), getAllCustomer)
router.get('/customer/:id', authenticateUser, authorizeRoles('admin'), singleCustomer)
router.delete('/customer/:id', authenticateUser, authorizeRoles('admin'), deleteSingleCustomer)

//admin-dashboard routes
router.get('/dashboard', authenticateUser, authorizeRoles('admin'), isValidUser)

module.exports = router;