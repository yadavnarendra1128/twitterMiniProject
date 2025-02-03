import React from "react";
import XSvg from "../../utils/svg/XSvg"
import MenuItem from "../../components/common/MenuItem";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch,useSelector } from 'react-redux';
import {logOut} from '../../redux/Home/userSlice'

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {data:user} = useSelector((state)=>state.user)

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  return (
    <div className="w-[20%] h-full border-r-2 border-gray-800 flex flex-col">
<<<<<<< HEAD
      <span className="justify-center lg:justify-start px-4 items-center flex">
        <XSvg className="w-[60%] lg:w-[18%] fill-white pt-5 lg:pt-2"></XSvg>
      </span>
=======
      <Link to={`/`}>
        <span className="w-[100%] justify-center lg:justify-start px-4 items-center flex">
          <XSvg className="w-[80%] sm:w-[80%] md:w-[60%] lg:w-[18%] fill-white pt-5 lg:pt-2"></XSvg>
        </span>
      </Link>
>>>>>>> cfd6bb2 (made responsive)
      <div className="h-full flex flex-col justify-between px-4 pb-5">
        <div className="flex flex-col gap-y-5 mt-10">
          <MenuItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
<<<<<<< HEAD
                className="size-14 lg:size-8 fill-white"
=======
                className="size-8 sm:size-12 md:size-14 lg:size-8 fill-white"
>>>>>>> cfd6bb2 (made responsive)
              >
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            }
            label={"Home"}
            to="/"
          ></MenuItem>
          {/* <MenuItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
<<<<<<< HEAD
                className="size-14 lg:size-8 fill-white"
=======
                className="size-8 sm:size-12 md:size-14 lg:size-8 fill-white"
>>>>>>> cfd6bb2 (made responsive)
              >
                <path
                  fillRule="evenodd"
                  d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label={"Notifications"}
            // to="/notifications"
          ></MenuItem> */}
          <MenuItem
            icon={
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
<<<<<<< HEAD
                className="size-14 lg:size-8 fill-white"
=======
                className="size-8 sm:size-12 md:size-14 lg:size-8 fill-white"
>>>>>>> cfd6bb2 (made responsive)
              >
                <path
                  fillRule="evenodd"
                  d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  clipRule="evenodd"
                />
              </svg>
            }
            label={"Profile"}
            to={`/profile/${user.username}`}
          ></MenuItem>
        </div>
<<<<<<< HEAD
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full overflow-hidden object-cover mr-2"
            src={user?.profileImg || "/assets/defaultprofile.jpg"}
            alt="Profile"
          />
          <div className="relative w-[60%] bg-red-50 hidden sm:hidden lg:block">
=======
        <div className="flex items-center justify-center">
          <Link to={`/profile/${user?.username}`}>
            <img
              className="hidden sm:hidden md:block lg:block w-10 h-10 rounded-full overflow-hidden object-cover mr-2"
              src={user?.profileImg || "/assets/defaultprofile.jpg"}
              alt="Profile"
            />
          </Link>
          <div className="relative w-[60%] bg-red-50 hidden lg:block">
>>>>>>> cfd6bb2 (made responsive)
            <div className="text-lg font-semibold text-white absolute -bottom-1 ml-1">
              {user?.fullname.length > 15
                ? user.fullname.split(" ")[0]
                : user.fullname || "fullname"}
            </div>
            <Link
              to={`/profile/${user.username}`}
              className="text-sm text-slate-400 absolute -bottom-6"
            >
              @{user?.username || "username"}
            </Link>
          </div>
          <img
            onClick={handleLogout}
<<<<<<< HEAD
            className="w-10 h-10 px-2 sm:ml-2 bg-slate-800 flex justify-center items-center cursor-pointer rounded-lg"
=======
            className="w-12 h-12 px-2 sm:w-12 sm:h-12 md:w-10 md:h-10 lg:w-10 lg:h-10 sm:ml-2 bg-slate-800 flex justify-center items-center cursor-pointer rounded-lg"
>>>>>>> cfd6bb2 (made responsive)
            src="/assets/icons/log-out.svg"
            alt="Logout"
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
