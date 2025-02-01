import { React, useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../components/common/Button";
import Navbar from "../../components/common/Navbar";
import LoaderSvg from "../../utils/svg/LoaderSvg";
import PostContainer from "../../components/common/PostContainer";

import {
  fetchProfile,setIsUser,
  fetchLikedPosts,
  fetchTweets,updateFetchNeeded
} from "../../redux/Home/profileSlice";

import useFollowUnfollowProfile from "../../hooks/useFollowUnfollowProfile";

const Profile = () => {
  const { username } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {data:user}=useSelector(state=>state.user)
  const { profile,isUser,loading,fetchNeeded } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("Posts");

  const followTargetId = useMemo(() => {
    return profile ? profile?._id : null;
  }, [profile]);

  const [isFollowing, handleFollow] = useFollowUnfollowProfile(followTargetId);

  useEffect(() => {
    if (username.trim()) {
      dispatch(fetchProfile(username));
      dispatch(setIsUser(username == user.username));
    }
    setActiveTab("Posts");
  }, [username, dispatch]);

  useEffect(() => {
    if (username.trim()) {
      dispatch(fetchTweets(username));
      dispatch(fetchLikedPosts(username))
    }
  }, [username, dispatch]);


   useEffect(() => {
    (activeTab !== "Posts" && fetchNeeded) ? 
    (dispatch(fetchLikedPosts(username)) && dispatch(updateFetchNeeded())):null;
   }, [username, dispatch,activeTab]);

  return !loading ? (
    <div className="flex flex-col bg-black text-white w-[55%] h-[100%] border-r-2 border-slate-800 overflow-auto scrollbar-none">
      {/* Back and User Name */}

      <div className="p-2 flex gap-x-2 items-center">
        <img
          onClick={() => navigate(-1)}
          src="/assets/icons/arrow-left.svg"
          alt="Back"
          className="w-6 h-6 rounded-full cursor-pointer"
        />
        <div className="text-xl text-slate-200">{profile?.fullname}</div>
      </div>

      {/* Banner Image */}
      <div
        className="relative w-full h-20 bg-slate-700"
        style={{
          backgroundImage: `url(${
            profile?.coverImg || "/assets/icons/banner.jpg"
          })`,
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-30" />
      </div>

      {/* Profile Section */}
      <div className="flex flex-row justify-start items-center py-4 px-6 bg-black border-2 relative border-gray-800">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-slate-500">
          <img
            src={profile?.profileImg || "/assets/defaultprofile.jpg"}
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="pl-4">
          <h2 className="text-2xl font-bold">
            {profile ? profile?.fullname : "Loading..."}
          </h2>
          <Link to="" className="text-gray-400">
            @{profile ? profile?.username : "Loading..."}
          </Link>
          <p className="text-gray-400 mt-1">
            {profile?.bio ? profile?.bio : "Bio not available"}
          </p>
        </div>
      </div>

      {/* Follow Stats and Follow Button */}
      <div className="flex items-center px-6 py-4 bg-black text-gray-400">
        <div className="flex flex-row w-full gap-x-2">
          <div className="text-center flex gap-x-1 items-center">
            <p className="text-lg font-semibold">
              {profile?.following?.length || 0}
            </p>
            <p className="text-md font-normal text-gray-500">Following</p>
          </div>
          <div className="text-center flex gap-x-1 items-center">
            <p className="text-lg font-semibold">
              {profile?.followers?.length || 0}
            </p>
            <p className="text-md font-normal text-gray-500">Followers</p>
          </div>
        </div>
        {/* Follow Button */}
        {!isUser ? (
          <Button
            onClick={handleFollow}
            text={isFollowing ? "Unfollow" : "Follow"}
            classes="text-black bg-white hover:bg-slate-200 px-3"
          />
        ) : (
          <Button
            onClick={() => navigate("/update")}
            text={"Set Profile"}
            classes="text-black bg-white hover:bg-slate-200 px-3  whitespace-nowrap text-sm"
          />
        )}
      </div>

      {/* Stats Section: Posts, Replies, Liked Posts */}
      <div className="px-6 py-4 bg-black text-gray-400 h-[45%] w-full">
        <Navbar
          selectedTab={activeTab}
          setSelectedTab={setActiveTab}
          tabs={["Posts", "LikedPosts"]}
        />
        {/* Tab Content */}
        <div className="flex flex-col pt-2 w-full h-[100%]">
          <PostContainer activeTab={activeTab} />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex bg-black w-[55%] border-r-2 border-slate-800 justify-center items-center">
      <LoaderSvg />
    </div>
  );

};

export default Profile;
