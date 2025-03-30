import { FC, useContext } from "react"
import { UserInfoStatusContext } from "../home/Status"
import { Spin } from "antd"
import { SmileOutlined } from "@ant-design/icons"

interface StatusCardProps {
  icon: string,
  title: string,
  num?: number
}

const StatusCard: FC<StatusCardProps> = ({icon, title, num}) => {
  const isLoading = useContext(UserInfoStatusContext)
  return (
    <div className="flex justify-start gap-4 items-center grow bg-white p-4 shadow rounded-2xl">
      <img className="w-[20px]" src={icon}/>
      <div className="flex flex-col justify-between items-start h-[3.75rem]">
        <p className="text-xl">{title}</p>
        {
          num != undefined 
          ? <p className="text-2xl font-bold">{num}</p>
          : 
          isLoading 
          ? <Spin/>
          : <p>加载失败</p>
        }
      </div>
    </div>
  )
}

export default StatusCard