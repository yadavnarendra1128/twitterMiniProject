import React, { useEffect } from "react";
import Button from "./Button";
import { Link } from "react-router-dom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import {
  addFollowedPosts,
  deleteUnfollowedPosts,
} from "../../redux/Home/postSlice";

const AccountItem = ({ acc }) => {
  const [isFollowing, handleFollow] = useFollowUnfollow(acc?._id);
  const dispatch = useDispatch();

  // setIsFollowing is async so checking isFollowing runs first despite comes after setIsFollowing

  useEffect(() => {
    const fetchUserPosts = async (username) => {
      try {
        const res = await axiosInstance(`/api/posts/user/${username}`);
        const data = await res.data;
        dispatch(addFollowedPosts(data.posts));
      } catch (error) {
        console.error("Error fetching user posts:", error);
        return [];
      }
    };
    
    if (isFollowing) {
      fetchUserPosts(acc.username);
    } else if (isFollowing === false) {
      dispatch(deleteUnfollowedPosts(acc._id));
    }
  }, [isFollowing, dispatch, acc._id, acc.username]);

  return (
    <div className="py-1 flex w-full justify-between items-center">
      <div className="flex gap-x-2">
        <img
          className="w-10 h-10 rounded-full object-cover"
          src={`${acc.profileImg}` || "/assets/defaultprofile.jpg"}
          alt="Profile"
        />
        <div className="relative">
          <div className="text-sm font-medium text-white">{acc.fullname}</div>
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
          onClick={handleFollow}
          text={isFollowing ? "Unfollow" : "Follow"}
          classes="text-black bg-white hover:bg-slate-200 px-3"
        />
      )}
    </div>
  );
};

export default AccountItem;
