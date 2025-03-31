import { useEffect, useState, useCallback, memo } from "react";
import ChatArea from "./components/ChatArea";
import Sidebar from "./components/Sidebar/";
import { useMediaQuery } from "react-responsive";
import styles from "./index.module.scss";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import { useLocation, useParams } from "react-router";
import useChatStore from "@/store/chat"; // 导入chat store

// 将控制台日志包装在开发环境检查中
const logInfo = (message: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(message, data);
  }
};

// 使用memo优化渲染性能
const ChatPage = memo(() => {
  const [title, setTitle] = useState<string>("与猫娘的对话");
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [oml2d, setOml2d] = useState<
    (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null
  >(null);
  
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  
  // 使用严格的选择器，只提取需要的数据
  const chatList = useChatStore(state => state.chatList);
  const currentChatId = useChatStore(state => state.currentChatId);

  // 仅在开发环境中记录日志，并减少记录频率
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("ChatPage渲染 - ID:", id);
    }
  }, [id]); // 只在id变化时记录日志

  // 使用媒体查询来检测屏幕宽度
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  // 使用 useCallback 缓存函数，避免不必要的重渲染
  const toggleSidebar = useCallback(() => {
    setSidebarVisible((prev) => !prev);
  }, []);

  // 当currentChatId或chatList变化时更新标题
  useEffect(() => {
    if (currentChatId) {
      const currentChat = chatList.find(chat => chat.conversationId === currentChatId);
      if (currentChat) {
        setTitle(`${currentChat.sessionTitle}`);
        // 更新页面标题
        document.title = `${currentChat.sessionTitle} | 心忆灵伴`;
      } else {
        setTitle("新对话");
        document.title = "新对话 | 心忆灵伴";
      }
    } else if (id) {
      // 如果有ID但没有currentChatId(可能是初始加载)
      const chatId = Number(id);
      if (!isNaN(chatId)) {
        const chat = chatList.find(chat => chat.conversationId === chatId);
        if (chat) {
          setTitle(`${chat.sessionTitle}`);
          document.title = `${chat.sessionTitle} | 心忆灵伴`;
        } else {
          setTitle(`新对话`);
          document.title = "新对话 | 心忆灵伴";
        }
      }
    }
  }, [currentChatId, chatList, id]);

  useEffect(() => {
    // 在移动设备上自动隐藏侧边栏，但只在组件初始化和屏幕尺寸变化时执行
    setSidebarVisible(!isMobile);
  }, [isMobile]);

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
});

export default ChatPage;
