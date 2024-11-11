const { registerUser, loginUser } = require("../controllers/userController")
const express = require('express');
const upload = require("../middleware/multer");
const router = express.Router()

router.post('/register', registerUser);
router.post('/login', loginUser)

// router.post('/upload', upload.single('file'), (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
  
//     // File upload was successful
//     res.status(200).json({
//       message: 'File uploaded successfully',
//       fileUrl: req.file.path,  // Cloudinary file URL
//     });
//   });

module.exports = router
