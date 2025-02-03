import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Button from "../common/Button";

import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import { handleProfileFollowingStatus } from "../../redux/Home/profileSlice";

const ProfileAccountItem = ({ acc }) => {
  const [isFollowing, handleFollow] = useFollowUnfollow(acc?._id);
  const dispatch = useDispatch();
  const { isUser,loading } = useSelector((state) => state.profile);

  const handleFollowClick = async () => {
    await handleFollow();
    isUser && dispatch(handleProfileFollowingStatus(acc._id));
  };

  return (
    <div className="py-1 flex w-full justify-between items-center">
      <div className="flex gap-x-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={`${acc.profileImg}` || "/assets/defaultprofile.jpg"}
          alt="Profile"
        />
        <div className="relative">
          <div className="text-sm font-medium text-white">
            {acc?.fullname.length > 15
              ? acc.fullname.split(" ")[0]
              : acc.fullname || "fullname"}
          </div>
          <Link
            to={`/profile/${acc.username}`}
            className="text-sm text-slate-400"
          >
            @{acc.username}
          </Link>
        </div>
      </div>
      {isFollowing !== null && (
        <Button
          disabled={loading}
          onClick={handleFollowClick}
          text={isFollowing ? "Unfollow" : "Follow"}
          classes="text-black bg-white hover:bg-slate-200 px-3"
        />
      )}
    </div>
  );
};

export default ProfileAccountItem;
