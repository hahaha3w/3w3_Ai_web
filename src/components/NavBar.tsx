import NavIcon from "./common/NavIcon"
import chat from "../assets/chat.svg"
import home from "../assets/home.svg"
import message from "../assets/message.svg"
import MessageBox from "./common/MessageBox"

const NavBar = () => {
  return (
    <div className="w-full bg-white px-10 py-2 flex flex-row justify-between shadow">
      <p className="text-2xl font-bold text-black">AI记忆录</p>
      <div className="flex flex-row gap-3 mr-20">
        <div className="relative group">
          <NavIcon onClick={() => {}} iconImg={message} iconText="消息"></NavIcon>
          <div className="w-[400px] h-[500px] absolute top-[110%] left-[-200px] invisible group-hover:visible">
            <MessageBox></MessageBox>
          </div>
        </div>
        <NavIcon onClick={() => {}} iconImg={home} iconText="主页"></NavIcon>
        <NavIcon onClick={() => {}} iconImg={chat} iconText="聊天"></NavIcon>
      </div>
    </div>
  )
}

export default NavBar