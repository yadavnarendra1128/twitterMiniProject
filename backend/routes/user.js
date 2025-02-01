const router = require('express').Router();
const protectRoute = require('../middleware/protectRoute');

const { followUnfollowUser, getUserProfile,getProfileSuggestedUsers, isFollowingUser,getUserInfo,updatePrivateInfo, updatePublicInfo, getSuggestedUsers} = require('../controllers/user.controller');

router.get("/profile/:username", protectRoute, getUserProfile);

router.get("/user/:id", protectRoute, getUserInfo);

router.get("/suggested", protectRoute, getSuggestedUsers);
router.get("/suggested/:username", protectRoute, getProfileSuggestedUsers);

router.post("/follow/:id", protectRoute, followUnfollowUser);

router.get("/isfollowing/:id",protectRoute, isFollowingUser);

router.put("/update/public", protectRoute, updatePublicInfo);

router.put("/update", protectRoute, updatePrivateInfo);

router.get('/', protectRoute, (req,res)=>{
    return res.json({UserInfo:req.user, UserCookie:req.cookies});
})

module.exports = router;