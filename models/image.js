// models/image.js
const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  filename: String,
  // Add any additional fields you need for your image model
});

const Image = mongoose.model('Image', imageSchema);

module.exports = Image;
