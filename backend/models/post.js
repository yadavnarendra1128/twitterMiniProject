const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    // text, img, link, likes, comments, createdByUSER_ID

    postBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // post content
    text: { type: String },
    img: { type: String },
    link: { type: String },

    // activity
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: {
          type: String,
          required: true,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
