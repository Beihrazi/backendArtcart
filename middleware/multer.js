const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'uploads', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
  },
});

// const storage = multer.diskStorage({
//   destination: function(req,file,cb){
//     cb(null, './upload')
//   },
//   filename: function(req,file,cb){
//     cb(null, file.originalname)
//   }
// })

const upload = multer({ storage: storage });
module.exports = upload;
