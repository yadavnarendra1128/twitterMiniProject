const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // user confidential info
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },

    // user follower info
    followers: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],
    following: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
    ],

    // user public info
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },

    // user activity info
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
    commentedPosts: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Post", default: [] },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;