import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useDispatch, useSelector } from "react-redux";
import { handleProfileFollowersStatus, handleProfileFollowingStatus } from "../redux/Home/profileSlice";

const useFollowUnfollowProfile = (id) => {
  const [isFollowing, setIsFollowing] = useState(false);
  const dispatch=useDispatch()
  const {data:user} = useSelector(state => state.user);

  useEffect(() => {
    const fetchFollowingStatus = async () => {
      try {
        const res = await axiosInstance.get(`/api/users/isfollowing/${id}`);
        setIsFollowing(() => res.data.isFollowing);
      } catch (e) {
        console.log("Error in fetching following status:", e);
      }
    };
    id ? fetchFollowingStatus() : null;
  }, [id]);
  
  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/api/users/follow/${id}`);
      setIsFollowing((prev) => !prev);
      dispatch(handleProfileFollowersStatus(user._id))
    } catch (e) {
      console.log("Error in follow/unfollow:", e);
    }
  };

  return [isFollowing, handleFollow];
};

export default useFollowUnfollowProfile;
