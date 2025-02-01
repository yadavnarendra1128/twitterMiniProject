import React, { useState } from "react";

import InputBox from "../../components/Auth/InputBox";
import BottomText from "../../components/Auth/BottomText";
import AltButton from "../../components/Auth/AltButton";
import Button from "../../components/common/Button";
import XSvg from "../../utils/svg/XSvg";

import { z } from "zod";
import logInValidator from "../../validators/login";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/Home/userSlice"

import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [info, setInfo] = useState({
    username: "johndoe123",
    password: "johndoe123",
  });
  const [error, setError] = useState({ username: null, password: null });
  const [axiosError, setAxiosError] = useState(null);

  const handleChange = (e) => {
    setInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    error?.username || error?.password
      ? setError((prev) => ({ ...prev, [e.target.name]: null }))
      : null;
    axiosError ? setAxiosError((prev) => null) : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      logInValidator.parse(info);

      const res = await axiosInstance.post("/api/auth/login", info);
      dispatch(setUser(res.data.data));
      navigate("/");
    } catch (err) {
      if (err instanceof z.ZodError) {
        const fieldErrors = err.errors.reduce((acc, curr) => {
          acc[curr.path[0]] = curr.message;
          return acc;
        }, {});

        setError(fieldErrors);
      } else {
        setAxiosError(
          err.response?.data?.msg || "Server error. Please try again later"
        );
      }
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row items-center justify-center bg-black gap-y-6 px-4 lg:gap-x-10 lg:px-0">
      <XSvg className="w-[25%] lg:w-[15%] fill-white" />
      <div className="flex flex-col bg-transparent gap-y-4 py-8 px-2 sm:pb-10 w-[40%] lg:w-[20%]">
        <div className="text-4xl flex flex-col gap-y-2 lg:text-4xl text-white font-bold pb-4 text-center lg:text-left pl-2">
          Let&apos;s Go.{" "}
          <span className="text-sm font-normal">
            credentials are set. Click on login.
          </span>
        </div>
        <InputBox
          handleChange={handleChange}
          label={"username"}
          name={"username"}
          value={info.username} // Controlled input
          placeholder={"username"}
          errText={error?.username}
        />
        <InputBox
          handleChange={handleChange}
          label={"password"}
          name={"password"}
          value={info.password} // Controlled input
          placeholder={"password"}
          type="password"
          errText={error?.password}
        />
        {axiosError && (
          <div className="text-md text-red-500 font-normal text-center lg:text-left">
            {axiosError}
          </div>
        )}
        <Button
          classes="self-center w-[60%] text-lg px-8 py-2 bg-twitter hover:bg-hoverTwitter text-white"
          onClick={handleSubmit}
          text="Log In"
        />
        <BottomText text="Don't have an account?" />
        <AltButton
          classes="w-[40%] self-center"
          text="Sign Up"
          onClick={() => navigate("/signup")}
        />
      </div>
    </div>
  );
};

export default Login;
