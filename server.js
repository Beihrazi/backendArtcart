const express = require('express');
const connectDB = require('./config/db'); 
require('dotenv').config();
const userRoute = require('./routes/userRoutes');
const sellerProductRoute = require('./routes/seller/sellerRoutes')
const adminRoute = require('./routes/userRoutes')
const adminDashboard = require('./routes/admin/adminRoutes')
const adminCategoryRoute = require('./routes/admin/adminRoutes')
const adminProductControllerRoute = require('./routes/admin/adminRoutes')
const sellerRoute = require('./routes/userRoutes')
const userWishlist = require('./routes/customerRoute')
const userCart = require('./routes/customerRoute')
const categoryFiltering = require('./routes/customerRoute')
const adminFetchCustomers = require('./routes/admin/adminRoutes')
const adminFetchSeller  = require('./routes/admin/adminRoutes')
const customer = require('./routes/customerRoute')
const orderpayment = require('./routes/paymentRoute')
const errorMiddleware = require('./middleware/errorMiddleware');
const getOrderDetailSeller = require('./routes/seller/sellerRoutes')
const cors = require("cors");


const app = express();
app.use(cors())

connectDB();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));

app.get('/api/users/', (req, res) => {
    res.send("API is running ok...");
});

//Registers and login
app.use('/api/users', userRoute)
app.use('/api/admin', adminRoute)
app.use('/api/seller', sellerRoute)

//admin-customer relation
app.use('/api/admin', adminFetchCustomers)

//admin-seller relation
app.use('/api/admin', adminFetchSeller)

//product
app.use('/api/seller', sellerProductRoute)
app.use('/api/admin', adminProductControllerRoute)

//Browsing - filtering
app.use('/api/users', categoryFiltering)

//category
app.use('/api/admin', adminCategoryRoute)

//wishlist
app.use('/api/users', userWishlist)

//cart
app.use('/api/users', userCart)

//admin-dashboard
app.use('/api/admin', adminDashboard )

//customer - dashboard
app.use('/api/users', customer)

app.use(errorMiddleware)

//Orders
app.use('/api/seller', getOrderDetailSeller)

//payment
app.use('/api/payment', orderpayment)

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
