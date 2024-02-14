const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Middleware to check if the user is authenticated
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

// Route to render the login form
router.get('/login', (req, res) => {
  res.render('login', { currentUser: req.user });
  console.log("success in login");
});

// Route to render the registration form
router.get('/register', (req, res) => {
  res.render('register', { currentUser: req.user });
  console.log("success in register");
});

// Handle registration logic
router.post('/register', (req, res) => {
  const { email, username, password } = req.body;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,}$/;

  if (!passwordRegex.test(password)) {
    return res.render('register', { currentUser: req.user, errorMessage: 'Password must meet the specified criteria.' });
  }

  User.register(new User({ email,username }), password, (err, user) => {
    if (err) {
      console.error(err);
      return res.render('register', { currentUser: req.user, errorMessage: 'Registration failed.' });
    }

    passport.authenticate('local')(req, res, () => {
      res.redirect('/images');
    });
  });
});
console.log("success in register redirecting to uploads");


router.get('/images', (req, res) => {
  res.send('<h1>Namstea</h1>');
});

// Handle login logic
router.post('/login', passport.authenticate('local',{
  successRedirect: '/sk',
  failureRedirect: '/images',
}));

// Logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.session.destroy(() => {
    res.redirect('/login');
  });
});

module.exports = { router, isLoggedIn };
