import NavIcon from "./common/NavIcon";
import MessageBox from "./common/MessageBox";
import { Button, Popover, message } from "antd";
import { useNavigate } from "react-router";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import useAuthStore from "../store/auth";

const NavBar = () => {
  const navigate = useNavigate();
  const { resetAuth } = useAuthStore();

  const handleLogout = () => {
    // 清除本地存储的token
    localStorage.removeItem("user_token");
    // 重置认证状态
    resetAuth();
    // 显示消息提示
    message.success("退出登录成功");
    // 重定向到登录页面
    navigate("/auth/login");
  };

  return (
    <div className="w-full bg-white px-10 py-2 flex flex-row justify-between shadow">
      <p className="text-2xl font-bold text-black">AI记忆录</p>
      <div className="flex flex-row gap-3 mr-20">
        <div className="relative group">
          <NavIcon
            onClick={() => {}}
            icon="mdi:message-outline"
            iconText="消息"
          ></NavIcon>
          <div className="w-[400px] h-[500px] absolute top-[110%] left-[-200px] invisible group-hover:visible">
            <MessageBox></MessageBox>
          </div>
        </div>

        <NavIcon
          onClick={() => navigate("/")}
          icon="mdi:home-outline"
          iconText="主页"
        ></NavIcon>

        <NavIcon
          onClick={() => navigate("/user")}
          icon="mdi:account-circle-outline"
          iconText="用户中心"
        ></NavIcon>
      </div>
    </div>
  );
};

export default NavBar;
