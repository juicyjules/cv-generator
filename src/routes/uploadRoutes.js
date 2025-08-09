const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/authMiddleware');

const prisma = new PrismaClient();
const router = express.Router();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null, 'avatar-' + req.userId + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000}, // 1MB limit
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('profileImage');

// Check file type
function checkFileType(file, cb){
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}

router.post('/upload-photo', authMiddleware, (req, res) => {
  upload(req, res, async (err) => {
    if(err){
      res.status(400).json({ message: err });
    } else {
      if(req.file == undefined){
        res.status(400).json({ message: 'Error: No File Selected!' });
      } else {
        try {
          const updatedUser = await prisma.user.update({
            where: { id: req.userId },
            data: { photoUrl: `/uploads/${req.file.filename}` }
          });
          res.status(200).json({
            message: 'File uploaded successfully!',
            filePath: `/uploads/${req.file.filename}`
          });
        } catch (error) {
          res.status(500).json({ message: 'Error updating user profile' });
        }
      }
    }
  });
});

module.exports = router;
