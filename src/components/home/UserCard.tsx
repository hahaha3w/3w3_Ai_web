import { Button } from "antd"
import { useNavigate } from "react-router"

const UserCard = ({
  userName
}: {
  userName?: string
}) => {
  const navigate = useNavigate()
  return (
    <div className="w-full bg-white flex flex-col gap-4 shadow p-5 rounded-2xl">
      <div className="text-3xl font-bold">欢迎回来{userName}，AI回忆录欢迎你</div>
      <div className="text-1xl">今天又会有什么值得回忆的呢?</div>
      <Button type="primary" size="large" className="w-[100px]" onClick={() => {
        navigate("chat/new")
      }}>开始对话</Button>
    </div>
  )
}

export default UserCard