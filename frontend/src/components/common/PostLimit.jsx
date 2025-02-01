import React, { useState } from "react";

const CharLimitTextarea = ({text,setText,inputName,placeholder ,maxChars=200,height,textSize, error,setError}) => {

  const handleInput = (e) => {
    if(error){setError("")};  // Clear any previous error for this field
    const inputText = e.target.value;
    if (inputText.length <= maxChars) {
      setText(inputText);
    }
  };

  return (
    <div className="flex flex-col relative w-full h-fit">
      <textarea
        name={inputName}
        placeholder={placeholder}
        className={`text-md ${textSize} border-b-2 pb-2 bg-transparent text-gray-300 border-gray-800 w-full ${height} outline-none resize-none leading-normal`}
        value={text}
        onChange={handleInput}
      />
      <p className={`text-sm absolute bottom-1 self-end  text-gray-500 mt-2`}>
        {text.length}/
        {text.length >= maxChars ? (
          <span className="text-red-600">{maxChars}</span>
        ) : (
          maxChars
        )}{" "}
        characters
      </p>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CharLimitTextarea;
