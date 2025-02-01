const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user.js");
const {
  signUpValidator,
  logInValidator,
} = require("../utils/validators/auth.validators.js");
const generateToken = require("../utils/generateToken.js");

const signUp = async (req, res) => {
  try {
    const body = req.body;
    const success = signUpValidator.safeParse(body);

    if (!success.success) {
      return res
        .status(400)
        .json({ msg: "Bad Request Data", err: success.error.issues[0] });
    }

    const { username, email, password, fullname } = body;

    // Check if the email already exists
    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res.status(409).json({ msg: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullname,
    });

    if (!user || !user._id) {
      return res.status(500).json({ msg: "Error: User creation failed" });
    }

    // Generate JWT token for the user
    generateToken(user._id, res);

    return res.status(201).json({
      data: {
        _id: user._id,
        fullname,
        username,
        email,
        followers:[],
        following:[],
        profileImg:"",
        coverImg:"",
        likedPosts: [],
            commentedPosts: [],
      }
    });
  } catch (err) {
    console.error("Sign Up Error:", err); // Log the error
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

const logIn = async (req, res) => {
  try {
    const body = req.body;

    const success = logInValidator.safeParse(body);

    if (!success.success) {
      return res
        .status(400)
        .json({ msg: "Wrong input format", err: success.error.issues[0] });
    }

    // Find the user by username
    const Exists = await User.findOne({ username: body.username });

    if (!Exists) {
      return res.status(409).json({ msg: "Username doesn't exist" });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(body.password, Exists.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT token for the logged-in user
    generateToken(Exists._id, res);

    const {
      _id,
      fullname,
      username,
      email,
      followers,
      following,
      profileImg,
      coverImg,
      likedPosts,
      commentedPosts,
    } = Exists;

    return res.status(200).json({
      data: {
        _id,
        fullname,
        username,
        email,
        followers,
        following,
        profileImg,
        coverImg,
        likedPosts,
        commentedPosts,
      },
    });
  } catch (err) {
    console.error("Login Error:", err); // Log the error
    res.status(500).json({ msg: "Internal Server Error", err: err.message });
  }
};

const logOut = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const myProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

const getCookie = async (req, res) => {
  try {
    const token = req.cookies?.jwt;
    if (!token) return res.status(401).json({ msg: "token is not presnt" });
    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ error: "cookie access failed" });
  }
};

module.exports = { signUp, logIn, logOut, myProfile, getCookie };
