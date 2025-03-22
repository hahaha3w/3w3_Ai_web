import React from 'react'

interface NavIconProps {
  iconImg: string,
  iconText: string,
  onClick: () => void
}
export default function NavIcon({iconImg, iconText, onClick}: NavIconProps) {
  return (
    <div className='col-center flex-col' onClick={onClick}>
      <img src={iconImg} className='w-[20px]'/>
      <p className='text-sm'>{iconText}</p>
    </div>
  )
}
