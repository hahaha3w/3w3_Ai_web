import { useEffect, useState, useCallback } from "react";
import ChatArea from "./components/ChatArea";
import Sidebar from "./components/Sidebar";
import { useMediaQuery } from "react-responsive";
import styles from "./index.module.scss";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import { useLocation, useParams } from "react-router";

const ChatPage = () => {
  const [title, setTitle] = useState<string>("Chat Title");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [oml2d, setOml2d] = useState<
    (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null
  >(null);
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  console.log("location", location);
  console.log("Chat ID:", id); // 输出获取到的ID

  // 使用媒体查询来检测屏幕宽度
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // 使用 useCallback 缓存函数，避免不必要的重渲染
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  useEffect(() => {
    // 如果有ID参数，可以设置不同的标题
    if (id) {
      setTitle(`与猫娘的对话 #${id}`);
    } else {
      setTitle("与猫娘的对话");
    }
    // 在移动设备上自动隐藏侧边栏，但只在组件初始化和屏幕尺寸变化时执行
    setSidebarVisible(!isMobile);
  }, [isMobile, id]);

  return (
    <div className="w-full flex h-screen overflow-hidden">
      <Sidebar
        visible={sidebarVisible}
        onClose={toggleSidebar}
        oml2d={oml2d}
        id={id}
      />
      <div
        className={`will-change-transform flex-1 h-full flex items-center justify-center ${
          sidebarVisible && !isMobile ? "ml-[250px]" : "ml-0"
        } transition-[margin] duration-300 bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 p-4`}
      >
        <div className={styles.aspectRatioContainer}>
          <ChatArea
            title={title}
            onToggleSidebar={toggleSidebar}
            oml2d={oml2d}
            setOml2d={setOml2d}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
