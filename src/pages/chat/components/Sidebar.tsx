import { MODELS } from "@/models/modelDefinitions";
import useChatStore from "@/store/chat"; // 引入 chat store
import { Conversation } from "@/service/api/chat/types";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Button, Divider, Tooltip } from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { memo, useState } from "react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  visible: boolean;
  onClose: () => void;
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
}

// 使用 memo 优化 Sidebar 组件
const Sidebar: React.FC<SidebarProps> = memo(({ visible, onClose, oml2d }) => {
  const { chatList, setCurrentChat, currentChatId, setChatList } =
    useChatStore(); // 从 store 获取对话列表和方法
  const [currentModelIndex, setCurrentModelIndex] = useState<number>(0);
  const [isSwitching, setIsSwitching] = useState<boolean>(false); // 控制切换状态

  // 处理模型切换
  const handleModelChange = (index: number) => {
    if (oml2d && !isSwitching) {
      const canvas = document.getElementById("oml2d-canvas");
      if (canvas) {
        canvas.style.transition = "opacity 0.5s";
        canvas.style.opacity = "0"; // 淡出
      }

      setIsSwitching(true); // 禁用切换按钮
      oml2d
        .loadModelByIndex(index)
        .then(() => {
          setCurrentModelIndex(index);
          setIsSwitching(false); // 恢复切换按钮
          console.log("模型切换到索引：", index);

          if (canvas) {
            setTimeout(() => {
              canvas.style.opacity = "1"; // 淡入
            }, 500); // 等待淡出完成后再淡入
          }
        })
        .catch(() => {
          setIsSwitching(false); // 即使失败也恢复切换按钮
          if (canvas) {
            canvas.style.opacity = "1"; // 恢复淡入
          }
        });
    }
  };

  // 新建对话
  const handleNewChat = () => {
    const newConversationId =
      Math.max(...chatList.map((chat) => chat.conversationId), 0) + 1;
    const newChat: Conversation = {
      conversationId: newConversationId,
      createTime: new Date().toISOString(),
      mode: "chat",
      sessionTitle: `新对话 ${newConversationId}`,
      userId: 123,
      lastMessage: "",
    };
    setChatList([...chatList, newChat]); // 更新对话列表
    setCurrentChat(newConversationId); // 切换到新对话
  };

  // 设置今日心情
  const handleSetMood = (mood: string) => {
    console.log("今日心情设置为：", mood);
    alert(`今日心情已设置为：${mood}`);
  };

  return (
    <div
      className={`${styles.sidebar} ${visible ? styles.visible : styles.hidden} 
                fixed top-0 left-0 h-full bg-white backdrop-blur-md z-[1000] 
                will-change-transform transition-transform duration-300 shadow-lg`}
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-xl text-gray-800 font-bold m-0">AI对话助手</h2>
        <div className="flex gap-2">
          <Tooltip title="返回主页">
            <Button
              type="text"
              icon={<Icon icon="mdi:home" className="text-gray-600" />}
              onClick={() => (window.location.href = "/")}
              className="border-0 shadow-none"
            />
          </Tooltip>
          <Tooltip title="关闭侧边栏">
            <Button
              type="text"
              icon={<Icon icon="mdi:close" className="text-gray-600" />}
              onClick={onClose}
              className="lg:hidden border-0 shadow-none"
            />
          </Tooltip>
        </div>
      </div>

      <Divider className="my-4">模型选择</Divider>

      <div className={styles.modelSelector}>
        {MODELS.map((model, index) => (
          <div
            key={model.id}
            className={`${styles.modelItem} ${
              currentModelIndex === index ? styles.active : ""
            } ${isSwitching ? styles.disabled : ""}`} // 添加禁用样式
            onClick={() => handleModelChange(index)}
          >
            <Icon
              icon={model.icon}
              className={`text-2xl ${
                currentModelIndex === index ? "text-blue-500" : "text-gray-600"
              }`}
            />
            <span
              className={`ml-2 ${
                currentModelIndex === index
                  ? "text-blue-500 font-medium"
                  : "text-gray-700"
              }`}
            >
              {model.name}
            </span>
            {currentModelIndex === index && (
              <Icon
                icon="material-symbols:check-circle"
                className="text-blue-500 ml-auto"
              />
            )}
          </div>
        ))}
      </div>

      <Divider className="my-4">对话列表</Divider>

      <div className={styles.chatList}>
        {chatList.map((chat: Conversation) => (
          <div
            key={chat.conversationId}
            className={`${styles.chatItem} ${
              currentChatId === chat.conversationId ? styles.active : ""
            }`}
            onClick={() => setCurrentChat(chat.conversationId)}
          >
            <span className="text-gray-800">{chat.sessionTitle}</span>
            <span className="text-gray-500 text-xs truncate">
              {chat.lastMessage}
            </span>
          </div>
        ))}
      </div>

      <div className="absolute bottom-4 left-0 right-0 px-4">
        <Divider className="my-4">今日心情</Divider>

        <div className="flex justify-around mb-4">
          <div
            className="text-center cursor-pointer"
            onClick={() => handleSetMood("😊")}
          >
            <span className="text-2xl">😊</span>
            <div className="text-sm text-gray-600">开心</div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => handleSetMood("😢")}
          >
            <span className="text-2xl">😢</span>
            <div className="text-sm text-gray-600">难过</div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => handleSetMood("😡")}
          >
            <span className="text-2xl">😡</span>
            <div className="text-sm text-gray-600">生气</div>
          </div>
          <div
            className="text-center cursor-pointer"
            onClick={() => handleSetMood("😴")}
          >
            <span className="text-2xl">😴</span>
            <div className="text-sm text-gray-600">疲惫</div>
          </div>
        </div>
        <Button
          type="primary"
          block
          icon={<Icon icon="material-symbols:add" />}
          onClick={handleNewChat} // 添加点击事件
        >
          新建对话
        </Button>
      </div>
    </div>
  );
});

export default Sidebar;
