import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addPostToAllPosts,addPostToPosts
} from "../../redux/Home/postSlice";
import Button from "./Button";
import CharLimitTextarea from "./PostLimit";
import EmojiPicker from "emoji-picker-react";
import axiosInstance from "../../utils/axiosInstance";

const CreatePost = () => {
  const dispatch = useDispatch();
  const { data:user } = useSelector((state) => state.user);

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [file, setFile] = useState("");

  const postApi = async () => {
    if(error)setError("");
    const formData = new FormData();

    if (text.trim()) {
      formData.append("text", text.trim());
    }

    if (file) {
      formData.append("image", file);
    }

    try {
      const res = await axiosInstance.post(`/api/posts`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const post = res.data.post;
      dispatch(addPostToPosts(post));
      dispatch(addPostToAllPosts(post));

      setText("");
      setFile(null);
    } catch (e) {
      if (e.response) {
        console.error("Error response:", e.response.data);
      } else {
        console.error("Error:", e.message);
      }
    }
  };


  const handlePost = async () => {
    setShowEmojiPicker(false);
    
    if (file || text.trim()) {
      try {
        await postApi();
      } catch (e) {
        console.error("Error while posting:", e);
        setError("Server error occurred while posting. Please try again.");
      }
    } else {
      setError("Post can't be empty.");
      return;
    }
  };

  const handleEmojiClick = (emoji) => {
    if (text.length <= 198) {
      setText((prev) => prev + emoji.emoji);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(() => file);
    }
  };

  return (
    <div className="border-b-2 border-gray-800 flex gap-x-2 px-4 pt-4 w-full">
      <img
        src={user?.profileImg || "/assets/defaultprofile.jpg"}
        className="w-10 text-white h-10 rounded-full object-cover"
        alt="User Img"
      />

      <div className="w-full mx-2">
        <CharLimitTextarea
          textSize={"text-lg"}
          height="h-[100px]"
          text={text}
          setText={setText}
          placeholder={`What's happening?`}
          error={error}
          setError={setError}
        />

        <div className="flex justify-between items-center py-2 mb-2">
          <div className="flex gap-x-2 items-center py-1">
            <label>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-twitter cursor-pointer"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                />
              </svg>
            </label>

            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="size-6 text-twitter cursor-pointer"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.536-4.464a.75.75 0 1 0-1.061-1.061 3.5 3.5 0 0 1-4.95 0 .75.75 0 0 0-1.06 1.06 5 5 0 0 0 7.07 0ZM9 8.5c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S7.448 7 8 7s1 .672 1 1.5Zm3 1.5c.552 0 1-.672 1-1.5S12.552 7 12 7s-1 .672-1 1.5.448 1.5 1 1.5Z"
                  clipRule="evenodd"
                />
              </svg>
              {showEmojiPicker && (
                <div className="absolute top-0 left-8 z-10">
                  <EmojiPicker
                    theme="dark"
                    className="bg-black"
                    onEmojiClick={handleEmojiClick}
                  />
                </div>
              )}
            </div>
          </div>

          <Button
            onClick={handlePost}
            text="Post"
            classes="bg-twitter text-slate-100 hover:bg-hoverTwitter px-4"
          ></Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
