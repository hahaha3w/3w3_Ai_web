import NavIcon from "./common/NavIcon";
import chat from "../assets/chat.svg";
import home from "../assets/home.svg";
import messageIcon from "../assets/message.svg";
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
            iconImg={messageIcon}
            iconText="消息"
          ></NavIcon>
          <div className="w-[400px] h-[500px] absolute top-[110%] left-[-200px] invisible group-hover:visible">
            <MessageBox></MessageBox>
          </div>
        </div>

        <NavIcon
          onClick={() => navigate("/")}
          iconImg={home}
          iconText="主页"
        ></NavIcon>

        <Popover
          content={
            <div className="col-center gap-3">
              <Button type="primary" danger onClick={handleLogout}>
                退出登录
              </Button>
            </div>
          }
          placement="bottom"
          trigger="hover"
        >
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => navigate("/user")}
          >
            <Icon icon="mdi:account-circle-outline" width="24" height="24" />
            <span className="text-xs">用户中心</span>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default NavBar;
