const express = require('express')
const authenticateUser = require('../middleware/authenticateUser')
const getMe = require('../controllers/userController')
const router = express.Router()

// router.get('/admin', authenticateUser, getMe )

module.exports = router
