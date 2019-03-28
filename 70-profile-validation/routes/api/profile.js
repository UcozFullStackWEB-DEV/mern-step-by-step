const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load profile module
const Profile = require("../../models/Profile");
const User = require("../../models/User");
//Load validation
const validateProfileInputs = require("../../validation/profile");

router.get("/test", (req, res) => res.json({ msg: "Profile works" }));

//@route  GET api/profile/
//@desc   Return user profile
//@access Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};

    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then(profile => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

//@route  GET api/profile/
//@desc   Create or edit user profile
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { isValid, errors } = validateProfileInputs(req.body);

    if (!isValid) {
      return res.status(400).json(errors);
    }
    //Get fields
    const profilefieds = {};
    profilefieds.user = req.user.id;

    if (req.body.handle) profilefieds.handle = req.body.handle;
    if (req.body.company) profilefieds.company = req.body.company;
    if (req.body.website) profilefieds.website = req.body.website;
    if (req.body.location) profilefieds.location = req.body.location;
    if (req.body.status) profilefieds.status = req.body.status;
    if (req.body.bio) profilefieds.bio = req.body.bio;
    if (req.body.githubusername)
      profilefieds.githubusername = req.body.githubusername;

    //Skills - split string into array
    if (typeof req.body.skills !== "undefined") {
      profilefieds.skills = req.body.skills.split(",");
    }
    //Social
    profilefieds.social = {};
    if (req.body.youtube) profilefieds.social.youtube = req.body.youtube;
    if (req.body.twitter) profilefieds.social.twitter = req.body.twitter;
    if (req.body.facebook) profilefieds.social.facebook = req.body.facebook;
    if (req.body.linkedin) profilefieds.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profilefieds.social.instagram = req.body.instagram;
    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profilefieds },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //Create
        //Check if handle exists
        Profile.findOne({ handle: profilefieds.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          //Save
          new Profile(profilefields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
