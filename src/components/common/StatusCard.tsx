import { FC } from "react"

interface StatusCardProps {
  icon: string,
  title: string,
  num: number
}

const StatusCard: FC<StatusCardProps> = ({icon, title, num}) => {
  return (
    <div className="flex justify-start gap-4 items-center grow bg-white p-4 shadow rounded-2xl">
      <img className="w-[20px]" src={icon}/>
      <div className="flex flex-col justify-between items-start">
        <p className="text-xl">{title}</p>
        <p className="text-2xl font-bold">{num}</p>
      </div>
    </div>
  )
}

export default StatusCard