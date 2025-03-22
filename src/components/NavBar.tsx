import NavIcon from "./common/NavIcon"
import chat from "../assets/chat.svg"
import home from "../assets/home.svg"

const NavBar = () => {
  return (
    <div className="w-full bg-white px-10 py-2 flex flex-row justify-between shadow">
      <p className="text-2xl font-bold text-black">AI记忆录</p>
      <div className="flex flex-row gap-3">
        <NavIcon onClick={() => {}} iconImg={home} iconText="主页"></NavIcon>
        <NavIcon onClick={() => {}} iconImg={chat} iconText="聊天"></NavIcon>
      </div>
    </div>
  )
}

export default NavBar