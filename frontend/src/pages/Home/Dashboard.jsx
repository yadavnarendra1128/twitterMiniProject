import React from "react";
import { Outlet,useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import AccSuggestions from "./AccSuggestions";
import ProfileAccSuggestions from "./ProfileAccSuggestions";

const Dashboard = () => {
  
  const location = useLocation();
  const isProfile = location.pathname.includes("/profile");
  return (
    <div className="h-screen w-screen bg-black flex flex-row">
      <Sidebar />
      <Outlet />
      {!isProfile ? <AccSuggestions /> :<ProfileAccSuggestions/>}
    </div>
  );
};

export default Dashboard;
