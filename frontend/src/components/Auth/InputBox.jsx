import React from 'react'

const InputBox = ({label,errText,name,placeholder,handleChange,classes}) => {
  return (
    <div className="flex flex-col px-2">
        <input className={`bg-transparent rounded w-full py-4 px-3 border-2 border-gray-900 text-gray-300 leading-tight focus:outline-none ${classes}`} name={name} onChange={handleChange} type="text" placeholder={placeholder} />
        {errText && errText.length>0 && <div className="text-xs text-red-600">{errText}</div>}
    </div>
  )
}
export default InputBox