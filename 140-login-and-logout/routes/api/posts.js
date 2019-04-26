const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Profile model
const Profile = require("../../models/Profile");

// Post model
const Post = require("../../models/Post");
//Post validation
const validatePostInputs = require("../../validation/post");

router.get("/test", (req, res) => res.json({ msg: "Posts works" }));

//@route  GET api/posts/
//@desc   Get all posts
//@access Public

router.get("/", (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json(err));
});

//@route  GET api/posts/:id
//@desc   Get post by id
//@access Public

router.get("/:id", (req, res) => {
  Post.findById(req.params.id)
    .then(posts => res.json(posts))
    .catch(err =>
      res.status(404).json({ nopostfound: "Post with this ID not found" })
    );
});

//@route  POST api/posts/
//@desc   Create post
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInputs(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

//@route  DELETE api/posts/:id
//@desc   Delete post
//@access Private

router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check if post was created by current user
          if (post.user.toString() !== req.user.id) {
            return res
              .status(401)
              .json({ noauthorized: "User not authorized" });
          }
          //Delete post
          post.remove().then(() => res.json({ succes: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

//@route  POST api/posts/like/:id
//@desc   Like post
//@access Private

router.post(
  "/like/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check if likes array of current post contains current user id
          if (post.likes.some(like => like.user.toString() === req.user.id)) {
            return res.status(400).json({ arleadyliked: "Post already liked" });
          }

          post.likes.unshift({ user: req.user.id });

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

//@route  POST api/posts/unlike/:id
//@desc   Unlike post
//@access Private

router.post(
  "/unlike/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id)
        .then(post => {
          //Check if user already like a post
          if (!post.likes.some(like => like.user.toString() === req.user.id)) {
            return res
              .status(400)
              .json({ notliked: "You have not yet like this post" });
          }

          const removeIndex = post.likes
            .map(item => item.user.toString())
            .indexOf(req.user.id);

          post.likes.splice(removeIndex, 1);

          post.save().then(post => res.json(post));
        })
        .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
    });
  }
);

//@route  POST api/posts/comment/:id
//@desc   Add comment to post
//@access Private

router.post(
  "/comment/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    //Check field before comment
    const { errors, isValid } = validatePostInputs(req.body);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    Post.findById(req.params.id)
      .then(post => {
        const newComment = {
          text: req.body.text,
          avatar: req.body.avatar,
          name: req.body.name,
          user: req.user.id
        };

        //Add comment to array
        post.comments.unshift(newComment);
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

//@route  DELETE api/posts/comment/:id
//@desc   Remove comment to post
//@access Private

router.delete(
  "/comment/:id/comment_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        //Check if comment exists
        if (
          !post.comments.some(
            comment => comment.id.toString() === req.params.comment_id
          )
        ) {
          return res
            .status(404)
            .json({ commentnotexists: "Comment does not exist" });
        }
        //comments array : [ {_id: "id generated by mongoose" } ]
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        post.comments.splice(removeIndex, 1);

        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ postnotfound: "Post not found" }));
  }
);

module.exports = router;
