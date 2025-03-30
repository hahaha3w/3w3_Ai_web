import Activity from '@/components/home/Activity/Activity'
import Memoir from '@/components/home/Memoirs/Memoir'
import AIStatus from '@/components/home/Status'
import UserCard from '@/components/home/UserCard'
import { ModalBox } from '@/components/ModalBox/ModalBox'
import { ApiKeys } from '@/constants/apiKeys'
import { useAuth } from '@/hooks/useAuth'
import Api from '@/service/api'
import useAuthStore from '@/store/auth'
import { useQuery } from '@tanstack/react-query'
import { useQueries } from 'node_modules/@tanstack/react-query/build/legacy'


const HomePage = () => {
  useAuth()

  const {data, isLoading} = useQuery(
    {
      queryKey: [ApiKeys.userInfo],
      queryFn: () => Api.userApi.getUserInfo()
    }
  )
  return (
    <div className='w-[90%] m-auto flex flex-col gap-6 justify-start items-center p-10 scroll-auto'>
      <UserCard userName={data?.username}></UserCard>
      <AIStatus {... {
        chat: data?.chatCount,
        memoir: data?.memoirCount,
        useDay: data?.useDay,
        isLoading
      }} ></AIStatus>
      {/* <Activity></Activity> */}
      <Memoir></Memoir>
      <ModalBox></ModalBox>
    </div>
  )
}

export default HomePage
