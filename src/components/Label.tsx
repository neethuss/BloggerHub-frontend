import React from 'react'
import { LabelProps } from '../interface/Label'

const Label:React.FC<LabelProps> = ({
  htmlFor, 
  className = '', 
  children
}) => {
  return (
    <label
    htmlFor={htmlFor}
    className={`block text-gray-700 text-sm font-bold mb-2 ${className}`}
  >
    {children}
  </label>
  )
}

export default Label
