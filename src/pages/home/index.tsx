import Activity from '@/components/home/Activity/Activity'
import AIStatus from '@/components/home/Status'
import UserCard from '@/components/home/UserCard'
import React from 'react'

const HomePage = () => {
  return (
    <div className='w-[90%] m-auto flex flex-col gap-6 justify-start items-center p-10 scroll-auto'>
      <UserCard></UserCard>
      <AIStatus></AIStatus>
      <Activity></Activity>
    </div>
  )
}

export default HomePage
