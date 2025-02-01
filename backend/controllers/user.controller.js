const User = require("../models/user.js");
const {
  passwordValidator,
  emailValidator,
  validators,
} = require("../utils/validators/auth.validators.js");

const { v2: cloudinary } = require("cloudinary");
const bcrypt = require("bcryptjs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getUserProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const parsedUsername = validators.safeParse({ username });
    if (!parsedUsername.success)
      return res
        .status(400)
        .json({ err: parsedUsername.error, msg: "Invalid username" });
    const user = await User.findOne({ username }).select("-password");
    if (!user)
      return res.status(404).json({ msg: "User does not exist in db" });
    return res.status(200).json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

const getUserInfo = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).select("-password");
    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ err: err, msg: "err getting user using id" });
  }
};

const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;

    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $project: {
          password: 0, // Excludes password from the result
        },
      },
      { $sample: { size: 10 } },
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );

    if (filteredUsers.length == 0) {
      const suggestedUsers = users.slice(0, 4);
      return res.status(200).json({ suggestedUsers });
    }

    const suggestedUsers = filteredUsers.slice(0, 4);
    res
      .status(200)
      .json({ suggestedUsers, msg: "Suggested users fetched successfully" });
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const getProfileSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const username = req.params.username;

    const profile = await User.findOne({ username: username }).select(
      "-password"
    );

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    const usersFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $nin: [userId, profile._id] },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      { $sample: { size: 10 } }, // Get 10 random users
    ]);
    const filteredUsers = users.filter(
      (user) => !usersFollowedByMe.following.includes(user._id)
    );
    if (filteredUsers.length == 0) {
      const profileSuggestedUsers = users.slice(0, 4);
      return res.status(200).json({ profileSuggestedUsers });
    }

    const profileSuggestedUsers = filteredUsers.slice(0, 4);
    res.status(200).json({
      profileSuggestedUsers,
      msg: "Profile Suggested users fetched successfully",
    });
  } catch (error) {
    console.log("Error in getSuggestedUsers: ", error.message);
    res.status(500).json({ error: error.message });
  }
};

const followUnfollowUser = async (req, res) => {
  try {
    const profile_id = req.params.id;
    const user_id = req.user._id;

    if (!profile_id || !user_id) {
      return res.status(400).json({ msg: "id missing of either" });
    }

    if (profile_id === user_id.toString()) {
      return res
        .status(400)
        .json({ msg: "You can't follow/unfollow yourself" });
    }

    const profile = await User.findById(profile_id);

    if (!profile) {
      return res.status(404).json({ msg: "User doesn't exists" });
    }

    const user = await User.findById({ _id: user_id });

    const isUserFollowing = user.following.includes(profile_id);

    let isFollowing;

    if (isUserFollowing) {
      await User.findByIdAndUpdate(user_id, {
        $pull: { following: profile_id },
      });
      await User.findByIdAndUpdate(profile_id, {
        $pull: { followers: user_id },
      });
      isFollowing = false;
    } else {
      await User.findByIdAndUpdate(user_id, {
        $push: { following: profile_id },
      });
      await User.findByIdAndUpdate(profile_id, {
        $push: { followers: user_id },
      });
      isFollowing = true;
    }

    return res.json({ msg: "follow/unfollow done", isFollowing });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error", err });
  }
};

const isFollowingUser = async (req, res) => {
  try {
    const profile_id = req.params.id;
    const user_id = req.user._id;

    if (!profile_id || !user_id) {
      return res.status(400).json({ msg: "id missing of either" });
    }

    if (profile_id === user_id.toString()) {
      return res.status(200).json({ isFollowing: null });
    }

    const profile = await User.findById(profile_id);

    if (!profile) {
      return res.status(404).json({ msg: "User doesn't exists" });
    }

    const user = await User.findById(user_id);

    const isUserFollowing = user.following.includes(profile_id);

    if (isUserFollowing) {
      return res.status(200).json({ isFollowing: true });
    } else {
      return res.status(200).json({ isFollowing: false });
    }
  } catch (err) {
    console.error(err.message, "in isfollowing user");
    res.status(500).json({ msg: "Server Error", err });
  }
};

const updatePrivateInfo = async (req, res) => {
  try {
    let updatedField = {};
    const { currentPassword, newPassword, email, username } = req.body;
    const parsedData = validators.safeParse(req.body);
    if (!parsedData.success || req.body.length == 0) {
      return res.status(400).json({ msg: "Input validation failed" });
    }
    if (email) {
      updatedField.email = email;
    }
    if (username) {
      updatedField.username = username;
    }

    if (currentPassword && newPassword) {
      if (currentPassword !== newPassword) {
        const isMatch = await bcrypt.compare(
          currentPassword,
          req.user.password
        );
        if (!isMatch)
          return res.status(401).json({ msg: "Invalid current password" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        updatedField.password = hashedPassword;
      } else {
        return res.status(400).json({ msg: "Password is same as previous" });
      }
    } else if (currentPassword || newPassword) {
      return res
        .status(400)
        .json({ msg: "Current password and new password are required" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updatedField, {
      new: true,
    });

    return res.status(200).json({ user, msg: "Profile updated successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: "Server Error" });
  }
};

const updatePublicInfo = async (req, res) => {
  const user = req.user;
  let { profileImg, coverImg } = req.body;
  try {
    if (profileImg && profileImg !== user.profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(profileImg, {
        folder: "profile_images",
        width: 1000,
        height: 1000,
        crop: "limit",
      });
      req.body.profileImg = uploadedResponse.secure_url;
    }

    if (coverImg && coverImg !== user.coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0]
        );
      }

      const uploadedResponse = await cloudinary.uploader.upload(coverImg, {
        folder: "cover_images",
        width: 1500,
        height: 500,
        crop: "limit",
      });

      req.body.coverImg = uploadedResponse.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
    });
    return res.status(200).json({
      updateUser: updatedUser,
      msg: "Profile updated successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Error updating profile" });
  }
};

module.exports = {
  getUserProfile,
  getSuggestedUsers,
  followUnfollowUser,
  updatePrivateInfo,
  updatePublicInfo,
  getUserInfo,
  isFollowingUser,
  getProfileSuggestedUsers,
};
