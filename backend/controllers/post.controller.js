const Post = require("../models/post");
const User = require("../models/user");

const {
  postValidator,
  idValidator,
} = require("../utils/validators/post.validators");
const {
  signUpValidator,
  logInValidator,
  validators,
} = require("../utils/validators/auth.validators");

const multer = require("multer");
const { v2: cloudinary } = require("cloudinary");
const upload = multer({ storage: multer.memoryStorage() }); // Store file in memory as Buffer

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const createPost = async (req, res) => {
  try {
    const { text}  = req.body; 
    const file = req.file;

    if (!text && !file) {
      return res.status(400).json({
        error: "Post content is empty or image is missing",
        msg: "Invalid data provided",
      });
    }

    let imageUrl = ""; 

    if (file) {
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "posts", width: 1000, height: 1000, crop: "limit" },
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

        uploadStream.end(file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const posted = await Post.create({
      ...req.body,
      postBy: req.user._id,
      img: imageUrl || "", 
    });

    res.status(201).json({ post: posted, msg: "Post created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, msg: "Internal Server Error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const id = req.params.id;

    const parsedId = idValidator.safeParse({ id });
    if (!parsedId.success) {
      return res
        .status(400)
        .json({ error: parsedId.errors, msg: "wrong format id provided" });
    }

    const post = await Post.findByIdAndDelete(id);
    if (post) {
      res.status(200).json({ msg: "Post deleted successfully" });
    } else {
      res.status(404).json({ msg: "Post not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "post deletion failed", err: err });
  }
};

const userPosts = async (req, res) => {
  try {
    const username = req.params.username;

    if ((username.length = 0)) {
      return res
        .status(400)
        .json({ error: "username is required", msg: "Invalid data provided" });
    }

    const parsedUser = validators.safeParse({ username }); // cant send not object
    if (!parsedUser.success) {
      return res
        .status(400)
        .json({ error: parsedUser, msg: "Invalid username provided" });
    }

    const user = await User.findOne({ username: username }).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const posts = await Post.find({ postBy: user._id })
 
    if (!posts) {
      return res.status(404).json({ msg: "No posts found for this user" });
    }

    res.json({ posts: posts, msg: "Posts fetched successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, msg: "Internal Server Error" });
  }
};

const followingAccPosts = async (req, res) => {
  try {
    const user = req.user;
    if (user.following.length == 0) {
      return res.status(404).json({ msg: "no following accounts." });
    }
    const posts = await Post.find({ postBy: { $in: user.following } });
    if (!posts) {
      return res
        .status(404)
        .json({ msg: "No posts found for following accounts." });
    }

    return res
      .status(200)
      .json({ msg: "following accounts fetched successfully", posts: posts });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err, msg: "Internal Server Error followingAccPosts" });
  }
};

const likedPosts = async (req, res) => {
  try {
    const username = req.params.username;
    const parsedUser = validators.safeParse({ username }); // cant send not object
    if (!parsedUser.success) {
      return res
        .status(400)
        .json({ error: parsedUser, msg: "Invalid username provided" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
      .populate({
        path: "postBy",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (!likedPosts) {
      return res.status(404).json({ msg: "No liked posts found" });
    }
    return res.status(200).json({
      msg: "Liked posts fetched successfully",
      likedPosts: likedPosts,
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err, msg: "Internal Server Error likedPosts" });
  }
};

const allPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    if (!posts) {
      return res.status(404).json({ msg: "No posts found." });
    }

    return res
      .status(200)
      .json({ msg: "All posts fetched successfully", posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err, msg: "Internal Server Error allPosts" });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({
        error: "post id is required",
        msg: "empty Invalid data provided",
      });
    }

    const parsedPost = idValidator.safeParse({ id: postId });
    if (!parsedPost.success) {
      return res.status(400).json({
        error: parsedPost,
        msg: "Invalid post id provided. zod error",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }
    const isUserLiked = post.likes.includes(userId);
    if (isUserLiked) {
      await Post.findByIdAndUpdate(postId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedPosts: postId } });
    } else {
      await Post.findByIdAndUpdate(postId, { $push: { likes: userId } });
      await User.findByIdAndUpdate(userId, {
        $push: { likedPosts: postId },
      });
    }
    return res.status(200).json({ msg: "Post liked/unliked successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err, msg: "Internal Server Error likeUnlikePost" });
  }
};

const commentOnPost = async (req, res) => {
  try {
    const text = req.body.text;
    const postId = req.params.postId;
    const userId = req.user._id;

    if (!postId || !userId) {
      return res.status(400).json({
        error: "post id and user id are required",
        msg: "empty Invalid data provided",
      });
    }
    const parsedPost = idValidator.safeParse({ id: postId });
    if (!parsedPost.success) {
      return res.status(400).json({
        error: parsedPost,
        msg: "Invalid post id provided. zod error",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const user = await User.findByIdAndUpdate(userId, {
      $push: { commentedPosts: postId },
    });

    const comment = { user: userId, text };

    post.comments.push(comment);
    await post.save();

    res.status(200).json(post);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err, msg: "Internal Server Error commentonPost" });
  }
};

module.exports = {
  createPost,
  likedPosts,
  deletePost,
  userPosts,
  followingAccPosts,
  allPosts,
  likeUnlikePost,
  commentOnPost,
};
