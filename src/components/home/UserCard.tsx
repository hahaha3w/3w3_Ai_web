import { Button } from "antd"
import { useNavigate } from "react-router"
import { RightOutlined } from "@ant-design/icons"

const UserCard = ({
  userName
}: {
  userName?: string
}) => {
  const navigate = useNavigate()
  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-blue-100 flex flex-col gap-5 shadow-md p-7 rounded-2xl transition-all duration-300 hover:shadow-lg">
      <div className="text-3xl font-bold tracking-tight text-gray-800">欢迎回来，<span className="text-blue-700">{userName || "朋友"}</span></div>
      <div className="text-xl font-light text-gray-600">今天又会有什么值得回忆的新故事呢？</div>
      <Button 
        type="primary" 
        size="large" 
        className="w-[140px] flex items-center justify-center font-medium mt-2 hover:scale-105 transition-all bg-blue-600 hover:bg-blue-700" 
        onClick={() => {
          navigate("chat/new")
        }}
      >
        开始对话 <RightOutlined className="ml-1" />
      </Button>
    </div>
  )
}

export default UserCard