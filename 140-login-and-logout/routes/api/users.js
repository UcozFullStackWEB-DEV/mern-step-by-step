const express = require("express");
const router = express.Router();
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys").secretOrKey;
const passport = require("passport");

//Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInputs = require("../../validation/login");

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
            .catch(errors => {
              return res.status(404).json(errors);
            });
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
  const { isValid, errors } = validateLoginInputs(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  // Find user by email with mongo model
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
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
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Password incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

//@route  GET api/users/current
//@desc   Return curent user
//@access Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { id, name, email } = req.user;
    res.json({
      id,
      name,
      email
    });
  }
);

module.exports = router;
