const express = require("express");
const protectRoute = require("../middleware/protectRoute");
const {
  createPost,
  deletePost,
  userPosts,
  followingAccPosts,
  allPosts,
  likedPosts,
  likeUnlikePost,
  commentOnPost,
} = require("../controllers/post.controller");
const multer = require("multer"); // Import multer module

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Use memory storage to handle file as Buffer

// Your route for post creation
router.post("/", protectRoute, upload.single("image"), createPost); // Ensure multer handles image upload

router.delete("/:id", protectRoute, deletePost); // Delete a post by ID

// GET routes for posts
router.get("/user/:username", protectRoute, userPosts); // Get posts of a particular user
router.get("/liked/:username", protectRoute, likedPosts); // Get posts liked by a user
router.get("/following", protectRoute, followingAccPosts); // Get posts from following accounts

router.get("/all", protectRoute, allPosts); // Get all posts

// POST routes for liking and commenting posts
router.post("/like/:postId", protectRoute, likeUnlikePost); // Like or unlike a post
router.post("/comment/:postId", protectRoute, commentOnPost); // Comment on a post

module.exports = router;
