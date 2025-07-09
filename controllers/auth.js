const router = require('express').Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");

// GET Sign up Page
router.get("/sign-up", (req, res) => {
  res.render("auth/sign-up.ejs");
});

// POST Sign up details
router.post("/sign-up", async (req, res )=>{

  // Validate entered details (Also done in the front end js 'signup-validation.js')
  // validation also done in the backend to ensure proper validation.
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(userInDatabase) {
      return res.render('messages/message.ejs', { title: "Sign Up", message: `Username already taken!`, url: `/auth/sign-up` });
  }

  // Check password match
  if(req.body.password !== req.body.confirmPassword){
    return res.render('messages/message.ejs', { title: "Sign Up", message: `Password and confirm password must match!`, url: `/auth/sign-up` });
  }

  // Register a User
  // Encrypting the password with 10 seeds
  const hashedPassword = bcrypt.hashSync(req.body.password, 10);
  req.body.password = hashedPassword;

  // Create a User
  const user = await User.create(req.body);

  // Set user in session (auto sign-in)
  req.session.user = {
    _id: user._id,
    username: user.username
  };

  res.render('messages/message.ejs', {title: "Welcome", message: `Thanks for signing up ${user.username}`, url: '/'}); 

});

// GET Sign in page
router.get("/sign-in", (req, res) => {
  res.render("auth/sign-in.ejs");
});

// POST Sign in details
router.post("/sign-in", async (req, res) => {
  const userInDatabase = await User.findOne({ username: req.body.username});
  if(!userInDatabase){
    return res.render('messages/message.ejs', {title: "Sign in", message: `Login Failed. Please try again later`, url: '/auth/sign-in'}); 
  }

  const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
  if(!validPassword){
    return res.render('messages/message.ejs', {title: "Sign in", message: `Login Failed. Please try again later`, url: '/auth/sign-in'}); 
  }

  req.session.user = {
    username: userInDatabase.username,
    _id: userInDatabase._id
  };

  res.redirect("/");

});


router.get("/sign-out", (req, res)=>{
  req.session.destroy();
    res.render('messages/message.ejs', {title: "Sign out", message: `Signing out..`, url: '/'}); 
});

// Validate username from the front end js
router.get("/check-username", async (req, res) => {
  const username = req.query.username;
  const user = await User.findOne({ username });
  res.json({ taken: !!user });
});


module.exports = router;