import { FC, useContext } from "react"
import { UserInfoStatusContext } from "../home/Status"
import { Spin } from "antd"
import { SmileOutlined } from "@ant-design/icons"

interface StatusCardProps {
  icon: string,
  title: string,
  num?: number,
  gradient?: string
}

const StatusCard: FC<StatusCardProps> = ({icon, title, num, gradient = "from-gray-100 to-gray-200"}) => {
  const isLoading = useContext(UserInfoStatusContext)
  return (
    <div className={`flex justify-start gap-4 items-center grow bg-gradient-to-r ${gradient} p-5 shadow-md rounded-2xl transition-transform duration-300 hover:scale-105`}>
      <div className="bg-white/60 p-3 rounded-full shadow-sm">
        <img className="w-[24px] h-[24px]" src={icon} alt={title}/>
      </div>
      <div className="flex flex-col justify-between items-start h-[3.75rem]">
        <p className="text-lg font-medium text-gray-600">{title}</p>
        {
          num != undefined 
          ? <p className="text-3xl font-bold text-gray-800">{num}</p>
          : 
          isLoading 
          ? <Spin className="mt-2" />
          : <p className="text-sm text-gray-500">加载失败</p>
        }
      </div>
    </div>
  )
}

export default StatusCard