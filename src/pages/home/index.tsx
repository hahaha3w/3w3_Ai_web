import Activity from '@/components/home/Activity/Activity'
import Memoir from '@/components/home/Memoirs/Memoir'
import AIStatus from '@/components/home/Status'
import UserCard from '@/components/home/UserCard'
import { useAuth } from '@/hooks/useAuth'
import useAuthStore from '@/store/auth'

const HomePage = () => {
  useAuth()
  return (
    <div className='w-[90%] m-auto flex flex-col gap-6 justify-start items-center p-10 scroll-auto'>
      <UserCard></UserCard>
      <AIStatus></AIStatus>
      <Activity></Activity>
      <Memoir></Memoir>
    </div>
  )
}

export default HomePage
