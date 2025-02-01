import React from "react";

const LoaderSvg = ({ width = "50", height = "50" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      width={width}
      height={height} 
      style={{
        shapeRendering: "auto",
        display: "block",
        background: "transparent",
      }}
    >
      <g>
        <circle
          strokeDasharray="160.22122533307947 55.40707511102649"
          r="34"
          strokeWidth="10"
          stroke="#1da1f2" 
          fill="none"
          cy="50"
          cx="50"
        >
          <animateTransform
            keyTimes="0;1"
            values="0 50 50;360 50 50"
            dur="1s"
            repeatCount="indefinite"
            type="rotate"
            attributeName="transform"
          />
        </circle>
      </g>
    </svg>
  );
};

export default LoaderSvg;
