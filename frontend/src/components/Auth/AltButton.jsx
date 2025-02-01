import React from 'react'

const AltButton = ({onClick,text,classes}) => {
  return (
    <button
      className={`bg-transparent w-fit mt-2 border border-[#1A91DA] hover:bg-[#1A91DA] hover-text-white text-white font-semibold py-2 px-4 rounded-full transition duration-300 ${classes}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default AltButton