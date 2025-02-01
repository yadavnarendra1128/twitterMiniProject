require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db");

const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const notificationRoutes = require("./routes/notification");

const app = express();
const PORT = process.env.PORT || 3001; 

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true, // Allow cookies (credentials) to be sent with requests
};

app.use(cors(corsOptions))
app.use(express.json({limit:"5mb"})); 
app.use(cookieParser());

const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});

