import { React } from "react";

const Navbar = ({ tabs, selectedTab, setSelectedTab }) => {
  const handleClick = (e) => {
    setSelectedTab(e.target.innerText);
  };
  return (
    <>
      <div className="flex w-full justify-around p-2 border-b-2 text-lg border-gray-800">
        {tabs.map((tab) => (
          <div className="w-fit relative" key={tab}>
            <div
              className={`font-semibold cursor-pointer ${
                selectedTab === tab ? "text-twitter" : "text-gray-400"
              }`}
              onClick={handleClick}
            >
              {tab}
            </div>
            {selectedTab === tab && (
              <span className="absolute -bottom-2 bg-twitter h-0 rounded-lg w-full block"></span>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default Navbar;
