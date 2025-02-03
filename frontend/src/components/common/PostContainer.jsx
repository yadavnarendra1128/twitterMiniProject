import React from "react";
import ProfilePost from "../Profile/ProfilePost";
import Post from './Post'
import ProfileLikesPost from "../Profile/ProfileLikesPost";
import { useSelector } from "react-redux";
import LoaderSvg from '../../utils/svg/LoaderSvg'

const PostContainer = ({ activeTab }) => {
  const { posts, allPosts,loading:postsLoading,allPostsLoading } = useSelector((state) => state.posts);
  const { tweets, likedPosts, tweetsLoading,likedPostsLoading } = useSelector((state) => state.profile);

  let content;

  switch (activeTab) {
    case "Posts":
      content = !tweetsLoading ? tweets.map((p) => {
        return <ProfilePost key={p._id} post={p} />;
      }) : null
      break;
    case "LikedPosts":
      content = !likedPostsLoading ? likedPosts.map((p) => {
        return <ProfileLikesPost key={p._id} post={p} />;
      }) : null;
      break;
    case "For You":
      content = !postsLoading ? posts.map((p) => {
        return <Post key={p._id} post={p} />;
      }):null;
      break;
    case "Following":
      content = !allPostsLoading? allPosts.map((p) => {
        return <Post key={p._id} post={p} />;
      }):null;
      break;
    default:
      content = null;
  }

  return !content?<div className="w-full h-full flex justify-center items-center"><LoaderSvg/></div>:<>{content}</>;
};

export default PostContainer;
