const {setProduct, updateProduct, deleteProduct, getAllProduct, getSingleProduct, getCategoryFromSeller} = require("../../controllers/seller/productController");
const { accessSellerDashboard } = require("../../controllers/seller/sellerDashboard");
const { setProfile, updateProfile, deleteProfile, testProfile } = require("../../controllers/seller/sellerProfile");
const { authenticateUser, authorizeRoles, isSellerVerified } = require("../../middleware/authenticateUser");

const express = require('express');
const sellerProfileCompletion = require("../../middleware/sellerProfileCompletion");
const upload = require("../../middleware/multer");
const { getOrderDetails, updateStatus } = require("../../controllers/seller/OrderController");
const router = express.Router();

//dashboard
router.get('/dashboard', authenticateUser, authorizeRoles('seller'), sellerProfileCompletion,accessSellerDashboard);

//Products
router.post('/product', upload.fields([{name: "photos", maxCount: 4}]), authenticateUser, authorizeRoles('seller'), isSellerVerified, setProduct)

router.get('/product/:id', authenticateUser, authorizeRoles('seller'), isSellerVerified, getSingleProduct)
router.get('/product', authenticateUser, authorizeRoles('seller'), isSellerVerified, getAllProduct)
router.put('/product/:id',  upload.fields([{ name: "photos", maxCount: 4 }]), authenticateUser, authorizeRoles('seller'), isSellerVerified, updateProduct)
router.delete('/product/:id', authenticateUser, authorizeRoles('seller'), isSellerVerified, deleteProduct)

//category-seller
router.get('/category', authenticateUser, authorizeRoles('seller'), isSellerVerified, getCategoryFromSeller)

//Profile

router.post(
    '/profile',
    upload.fields([{ name: 'profileDp', maxCount: 1 }, { name: 'aadhaarDoc', maxCount: 1 }]), authenticateUser,authorizeRoles('seller'),
    setProfile
  );
  

router.put('/profile/:id', authenticateUser, authorizeRoles('seller'), updateProfile)
router.delete('/profile/:id', authenticateUser, authorizeRoles('seller'), deleteProfile)

//Orders
router.get('/orders', authenticateUser, authorizeRoles('seller'), getOrderDetails)
router.put("/orders/:id", authenticateUser, authorizeRoles("seller"), updateStatus)

module.exports = router