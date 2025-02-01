const router = require("express").Router();
const {signUp,logIn,logOut,myProfile,getCookie} = require("../controllers/auth.controller");
const protectRoute = require("../middleware/protectRoute");

router.post("/login", logIn);

router.post("/signup", signUp);

router.post("/logout", logOut);

router.get("/me", protectRoute, myProfile);

// router.get("/logged", getCookie);

module.exports = router;
