import React from "react";
import { Link } from "react-router-dom";

const MenuItem = ({ icon, label, to }) => {
  return (
    <div className="flex lg:gap-x-5 lg:justify-start px-2 justify-center items-center">
      <Link to={to}>{icon}</Link>
      <Link
        to={to}
        className="font-normal text-white hidden lg:block lg:text-2xl"
      >
        {label}
      </Link>
    </div>
  );
};

export default MenuItem;
