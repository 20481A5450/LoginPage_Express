const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const isLoggedIn = require('../middleware/isLoggedIn');  // Import isLoggedIn middleware
const Image = require('../models/Image');

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Route to render the form for image upload
router.get('/upload', isLoggedIn, (req, res) => {
  res.render('upload');
});

// Route to handle image upload
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.render('upload', { errorMessage: 'Please select an image file.' });
  }

  // Create a new image document
  const newImage = new Image({
    filename: req.file.filename,
    // Add any additional fields you need for your image model
  });

  // Save the image document to the database
  newImage.save((err) => {
    if (err) {
      console.error(err);
      return res.render('upload', { errorMessage: 'Failed to save the image to the database.' });
    }

    res.redirect('/images'); // Redirect to a page showing uploaded images
  });
});

module.exports = router;
