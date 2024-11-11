const mongoose = require('mongoose')
const express = require('express')
const { authenticateUser, authorizeRoles } = require('../middleware/authenticateUser')
const { addToWishlist, getAllWishlist, deleteWishlist, fromWishListToCart } = require('../controllers/customer/wishListController')
const { addToCart, displayCart, updateCart, deleteCart } = require('../controllers/customer/CartController')
const { categoryFiltering, getCategoryFromCustomer, accessOrderPage } = require('../controllers/customer/BrowsingController')
const { featuredProducts } = require('../controllers/customer/productR&Rat')
const { getSingleProduct } = require('../controllers/seller/productController')
const { userBilling, getBilling, personalDetail } = require('../controllers/customer/profileController')
const { getOrders } = require('../controllers/customer/orderManagement')
const router = express.Router()

//wishlist
router.post('/wishlist', authenticateUser, authorizeRoles('customer'), addToWishlist)
router.get('/wishlist', authenticateUser, authorizeRoles('customer'), getAllWishlist)
router.delete('/wishlist', authenticateUser, authorizeRoles('customer'), deleteWishlist)

// from wishlist to cart
router.post('/wishlist/cart', authenticateUser, authorizeRoles('customer'), fromWishListToCart)

//cart
router.post('/cart', authenticateUser, authorizeRoles('customer'), addToCart)
router.get('/cart', authenticateUser, authorizeRoles('customer'), displayCart)
router.put('/cart', authenticateUser, authorizeRoles('customer'), updateCart)
router.delete('/cart', authenticateUser, authorizeRoles('customer'), deleteCart)

//Browsing
router.get('/product/by-category', authenticateUser, authorizeRoles('customer'), categoryFiltering)

//Landing-page
router.get('/products', featuredProducts)
router.get('/category', getCategoryFromCustomer )
router.get("/product/:id", getSingleProduct)

//Billing
router.post('/billing', authenticateUser, authorizeRoles("customer"), userBilling);
router.get('/billing', authenticateUser,authorizeRoles("customer"), getBilling);
router.put('/personalDetail', authenticateUser, authorizeRoles("customer"), personalDetail);
router.get('/billingPage', authenticateUser, authorizeRoles('customer'), accessOrderPage)
module.exports = router

//Order
router.get("/order", authenticateUser, authorizeRoles("customer"), getOrders)