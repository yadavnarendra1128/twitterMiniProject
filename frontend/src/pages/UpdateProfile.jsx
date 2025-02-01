import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateUser } from "../redux/Home/userSlice"; // Replace with your actual action
import axiosInstance from "../utils/axiosInstance";

const UpdateProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.data);

  const [formData, setFormData] = useState({
    profileImg: "",
    coverImg:  "",
    bio:  "",
    link: "",
  });

  const fileInputProfileRef = useRef(null);
  const fileInputCoverRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, [field]: reader.result }));
      };
      reader.readAsDataURL(file);
    }}

  const filterFormData = (data) => {
    const updatedData = {};
    for (let key in data) {
      if (data[key]) {
        updatedData[key] = data[key];
      }
    }
    return updatedData;
  };

  const updateInfo = async (updatedData) => {
    const res = await axiosInstance.put("/api/users/update/public", updatedData);
    const data = await res.data
    dispatch(updateUser(data.updateUser));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const updatedData = filterFormData(formData);

    if (Object.keys(updatedData).length === 0) {
      navigate(`/profile/${user.username}`);
      return;
    }
    await updateInfo(updatedData)
    
    navigate(`/profile/${user.username}`);
  };

  return (
    <div className="bg-black w-[55%] border-r-2 border-slate-800 overflow-auto scrollbar-none text-white px-6 py-2 rounded-lg shadow-md">
      <h1 className="text-xl font-semibold mb-8 my-2">Update Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-x-12 px-2 w-full">
          {/* Profile Image */}
          <div className="">
            <label className="block mb-2">Profile Image</label>
            <div className="flex items-center gap-4">
              <img
                src={formData?.profileImg || user?.profileImg || "/assets/defaultprofile.jpg"}
                alt="Profile Preview"
                className="w-16 h-16 rounded-full object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputProfileRef.current.click()}
                className="px-3 py-1 bg-slate-200 w-fit text-black rounded-lg"
              >
                Upload
              </button>
              <input
                ref={fileInputProfileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, "profileImg")}
              />
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <label className="block mb-2">Bio</label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className="w-[400px] px-2 flex items-center bg-gray-800 text-white rounded-lg"
              placeholder="Write a short bio..."
            ></textarea>
          </div>
        </div>

        {/* Cover Image */}
        <div className="my-4">
          <label className="block mb-2">Cover Image</label>
          <div className="flex items-center gap-4">
            <img
              src={formData.coverImg || "/assets/icons/banner.jpg"}
              alt="Cover Preview"
              className="w-full h-40 object-cover rounded-lg opacity-50"
            />
            <button
              type="button"
              onClick={() => fileInputCoverRef.current.click()}
              className="px-3 py-1 bg-slate-200 w-fit text-black rounded-lg"
            >
              Upload
            </button>
            <input
              ref={fileInputCoverRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileChange(e, "coverImg")}
            />
          </div>
        </div>

        {/* Link */}
        <div className="mb-4">
          <label className="block mb-2">Website/Link</label>
          <input
            type="text"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className="w-full p-2 bg-gray-800 text-white rounded-lg"
            placeholder="Website or profile link"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-fit px-3 mt-5 py-2 bg-twitter text-white rounded-lg hover:bg-blue-500"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default UpdateProfile;
