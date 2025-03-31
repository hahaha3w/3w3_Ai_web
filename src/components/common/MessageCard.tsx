import { FC, useMemo } from "react";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { dateCalc } from "@/utils/dateCalc";
import { ActivityData } from "@/service/api/home/types";

const MessageCard: FC<ActivityData> = ({type, description, createdAt}) => {
   const title = useMemo(()=> {
      return type == "chat" ? "新对话": "新回忆"
    }, [type])
   
   const icon = useMemo(()=> {
      return type == "chat" ? "mdi:chat-processing-outline" : "mdi:memory-outline"
   }, [type])
   
  return (
    <div className="w-full p-4 flex flex-row justify-center items-start gap-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-gray-50">
      <div className="rounded-full p-2 bg-blue-50 text-blue-500">
        <Icon icon={icon} width={24} height={24} />
      </div>
      <div className="flex flex-col gap-1 justify-around items-start grow">
        <div className="text-xl font-bold text-gray-800">{title}</div>
        <div className="text-sm line-clamp-2 text-gray-600">{description}</div>
        <div className="text-xs text-gray-400 mt-1">{dateCalc(createdAt)}</div>
      </div>
    </div>
  )
}

export default MessageCard