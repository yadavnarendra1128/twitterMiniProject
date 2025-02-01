import React from 'react'

const Button = ({onClick,text,classes}) => {
  return (
    <button
      className={`w-fit text-md font-semibold py-1 px-2 rounded-full transition duration-500 ${classes}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default Button;