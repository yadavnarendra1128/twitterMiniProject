import React, { useState } from "react";

import InputBox from "../../components/Auth/InputBox";
import BottomText from "../../components/Auth/BottomText";
import AltButton from "../../components/Auth/AltButton";
import Button from "../../components/common/Button";
import XSvg from "../../utils/svg/XSvg";

import { z } from "zod";
import signUpValidator from "../../validators/signup";

import { useDispatch } from "react-redux";
import { setUser } from "../../redux/Home/userSlice";

import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
 const navigate = useNavigate();
  const dispatch = useDispatch();

  const [info, setInfo] = useState({
    fullname: "elon musk",
    username: "elonmusk123",
    email: "elonmusk123@gmail.com",
    password: "elonmusk123",
  });
  const [error, setError] = useState({});
  const [axiosError, setAxiosError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInfo((prev) => ({ ...prev, [name]: value }));

    setError((prev) => ({ ...prev, [name]: null }));
    setAxiosError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    try {
      signUpValidator.parse(info); 
      const res = await axiosInstance.post("/api/auth/signup", info); 
      dispatch(setUser(res.data.data)); 
      navigate("/"); 

    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(
          err.errors.reduce((acc, curr) => {
            acc[curr.path[0]] = curr.message;
            return acc;
          }, {})
        );
      } else {
        setAxiosError(
          err.response?.data?.msg || "Server error. Please try again later."
        );
      }
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="overflow-hidden h-screen w-screen flex flex-col lg:flex-row items-center justify-center bg-black gap-y-6 px-4 lg:gap-x-10 lg:px-0">
      <XSvg className="w-[25%] lg:w-[15%] fill-white" />
      <div className="flex flex-col bg-transparent gap-y-4 py-8 px-2 sm:pb-10 w-[40%] lg:w-[20%]">
        <div className="text-4xl lg:text-4xl text-white font-bold pb-4 text-center lg:text-left pl-2">
          Join today.
        </div>
        <InputBox
          handleChange={handleChange}
          label={"Full Name"}
          name={"fullname"}
          value={info.fullname}
          placeholder={"full name"}
          errText={error?.fullname}
        />
        <InputBox
          handleChange={handleChange}
          label={"Username"}
          name={"username"}
          value={info.username}
          placeholder={"username"}
          errText={error?.username}
        />
        <InputBox
          handleChange={handleChange}
          label={"Email"}
          name={"email"}
          value={info.email}
          placeholder={"email"}
          errText={error?.email}
        />
        <InputBox
          handleChange={handleChange}
          label={"Password"}
          name={"password"}
          value={info.password}
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
          classes="self-center w-[60%] text-lg px-8 py-2 bg-[#1DA1F2] hover:bg-[#419cd5] text-white"
          onClick={handleSubmit}
          text={loading ? "Signing Up..." : "Sign Up"}
          disabled={loading}
        />
        <BottomText text="Already joined?" />
        <AltButton
          classes="self-center w-[40%]"
          text="Log In"
          onClick={() => navigate("/login")}
        />
      </div>
    </div>
  );
};

export default SignUp;
