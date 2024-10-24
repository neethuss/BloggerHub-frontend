import React from 'react'
import { TextareaProps } from '../interface/TextArea'

const TextArea:React.FC<TextareaProps> = ({value, 
  onChange, 
  placeholder, 
  rows = 3, 
  cols = 50, 
  disabled = false, 
  className = '', 
  id, 
  name, 
  required = false}) => {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      cols={cols}
      disabled={disabled}
      className={`w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none ${className}`}
      id={id}
      name={name}
      required={required}
    />
  )
}

export default TextArea
