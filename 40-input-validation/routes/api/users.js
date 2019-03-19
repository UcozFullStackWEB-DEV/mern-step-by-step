const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys").secretOrKey;

//Load input validation
const validateRegisterInput = require("../../validation/register");

// load user model
const User = require("../../models/User");

//@route  GET api/users/test
//@desc   Tests users route
//@access Public

router.get("/test", (req, res) => res.json({ msg: "Users works" }));

//@route  GET api/users/register
//@desc   Register user
//@access Public

router.get("/", (req, res) => {
  res.send("Users page");
});

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: "Email already exists"
      });
    } else {
      const { name, email, password } = req.body;
      const avatar = gravatar.url(email, {
        s: "200", //size
        r: "pg", //rating,
        d: "mm" //default
      });
      const newUser = new User({
        name,
        email,
        avatar,
        password
      });
      //Passwor hashing
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(console.log(err));
        });
      });
    }
  });
});

//@route  GET api/users/login
//@desc   Login user/ Returning JWT
//@access Public

router.post("/login", (req, res) => {
  const { email, password } = req.body;
  // Find user by email with mongo model
  User.findOne({ email }).then(user => {
    console.log(user);
    if (!user) {
      return res.status(404).json({ email: "User email not found" });
    }
    //Comparing password in db with password from request object
    bcrypt.compare(password, user.password).then(isEqual => {
      //promise return a bool
      if (isEqual) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; // JWT payload obj
        //Sign token payl,secretWord from cfg,exp date,callback
        jwt.sign(payload, keys, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token
          });
        });
      } else {
        return res.status(400).json({ password: "Password incorrect" });
      }
    });
  });
});

module.exports = router;
