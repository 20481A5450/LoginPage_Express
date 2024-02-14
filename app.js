const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('express-flash');

const app = express();
//app.get('/images', (req, res) => {
//  res.send('<h1>Namstea</h1>');
//})
// Connect to MongoDB
mongoose.connect('mongodb://localhost/simple-web-app', { useNewUrlParser: true, useUnifiedTopology: true });

// Set up express session
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Set up passport
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

// Set up multer for image upload
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// User model
const User = require('./models/user');

// Passport local strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Parse URL-encoded bodies (extended syntax)
app.use(express.urlencoded({ extended: true }));

// Routes
const authRoutes = require('./routes/authRoutes');
const imageRoutes = require('./routes/imageRoutes');

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Add a route for the root URL
app.get('/', (req, res) => {
  res.redirect('/login'); // Redirect to the login page or another suitable route
});

app.use('/', authRoutes.router);
app.use('/images', imageRoutes); // Add the isLoggedIn middleware for image routes

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
