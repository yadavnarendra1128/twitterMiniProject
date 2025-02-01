import { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const useFollowUnfollow = (id) => {
  const [isFollowing, setIsFollowing] = useState(false); 

  const handleFollow = async () => {
    try {
      await axiosInstance.post(`/api/users/follow/${id}`); 
      setIsFollowing((prev) => !prev); 
    } catch (e) {
      console.log("Error in follow/unfollow:", e);
    }
  };

  return [isFollowing, handleFollow];
};

export default useFollowUnfollow;
