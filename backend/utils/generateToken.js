const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  try {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });

   res.cookie("jwt", token, {
      maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
      secure: process.env.NODE_ENV === "production", // Ensures cookie is sent over HTTPS
      httpOnly: true, // Prevents client-side access to the cookie
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Strict", // to allow req from different domains if secure is false.
    });

  } catch (err) {
    console.error("Token Generation Error:", err); // Log error
    res.status(500).json({ msg: "Token creation failed", err: err.message });
  }
};

module.exports = generateToken;
