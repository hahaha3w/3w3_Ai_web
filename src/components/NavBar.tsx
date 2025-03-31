import { Badge, Button, Modal, Popover, message } from "antd";
import { useNavigate } from "react-router";
import useAuthStore from "../store/auth";
import MessageBox from "./common/MessageBox";
import NavIcon from "./common/NavIcon";
import logo from "/logo.svg"; // 导入logo图片

const NavBar = () => {
  const navigate = useNavigate();
  const { resetAuth } = useAuthStore();

  const handleLogout = () => {
    // 显示确认对话框
    Modal.confirm({
      title: "退出登录",
      content: "确定要退出登录吗？",
      okText: "确认",
      cancelText: "取消",
      onOk: () => {
        // 清除本地存储的token
        localStorage.removeItem("user_token");
        // 重置认证状态
        resetAuth();
        // 显示消息提示
        message.success("退出登录成功");
        // 重定向到登录页面
        navigate("/auth/login");
      },
    });
  };

  const messageContent = (
    <div className="w-[420px] h-[500px] p-2">
      <MessageBox></MessageBox>
    </div>
  );

  const userContent = (
    <div className="p-2">
      <Button type="primary" danger onClick={handleLogout}>
        退出登录
      </Button>
    </div>
  );

  return (
    <div className="w-full bg-white px-10 py-2 flex flex-row justify-between shadow">
      <div className="flex items-center">
        <img src={logo} alt="logo" className="h-8 mr-2" />
        <p className="text-2xl font-bold text-black">心忆灵伴</p>
      </div>
      <div className="flex flex-row gap-3 mr-20">
        <Popover
          content={messageContent}
          placement="bottomRight"
          overlayStyle={{ width: "420px", padding: 0 }}
          overlayInnerStyle={{ padding: 0 }}
          arrow={false}
        >
          <div>
            <Badge dot>
              <NavIcon
                onClick={() => {}}
                icon="mdi:message-outline"
                iconText="消息"
                className="hover:text-blue-500 transition-colors"
              ></NavIcon>
            </Badge>
          </div>
        </Popover>

        <NavIcon
          onClick={() => navigate("/")}
          icon="mdi:home-outline"
          iconText="主页"
          className="hover:text-blue-500 transition-colors"
        ></NavIcon>

        <Popover
          content={userContent}
          trigger="hover"
          placement="bottom"
          arrow={false}
        >
          <div>
            <NavIcon
              onClick={() => navigate("/user")}
              icon="mdi:account-circle-outline"
              iconText="用户中心"
              className="hover:text-blue-500 transition-colors"
            ></NavIcon>
          </div>
        </Popover>
      </div>
    </div>
  );
};

export default NavBar;
