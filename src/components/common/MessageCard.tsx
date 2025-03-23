
import { FC, useMemo } from "react";
import { ActivityData } from "../home/Activity/ActivityType";
import { dateCalc } from "@/utils/dateCalc";

const MessageCard: FC<ActivityData> = ({type, content, time}) => {
   const title = useMemo(()=> {
      return type == "chat" ? "新对话": "新回忆"
    }, [type])
  return (
    <div className="w-full p-4 flex flex-row justify-center items-start gap-1 bg-gray-100 rounded-2xl">
      <div className="flex flex-col gap-1 justify-around items-start grow">
        <div className="text-xl font-bold">{title}</div>
        <div className="text-sm line-clamp-1">{content}</div>
        <div className="text-xs text-gray-400">{dateCalc(time)}</div>
      </div>
    </div>
  )
}

export default MessageCard