import { MODELS } from "@/models/modelDefinitions";
import useChatStore from "@/store/chat";
import useMood from "@/hooks/useMood"; // 导入心情钩子
import { MoodType } from "@/store/mood"; // 导入心情类型
import { Conversation } from "@/service/api/chat/types";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Button, Collapse, Tooltip } from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { memo, useEffect, useState } from "react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  visible: boolean;
  id: string | number | undefined; // 添加 id 属性
  onClose: () => void;
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
}

// 使用 memo 优化 Sidebar 组件
const Sidebar: React.FC<SidebarProps> = memo(
  ({ visible, id, onClose, oml2d }) => {
    const { chatList, setCurrentChat, currentChatId, setChatList } =
      useChatStore(); // 从 store 获取对话列表和方法
    const { mood, setMood } = useMood(); // 使用心情钩子
    const [currentModelIndex, setCurrentModelIndex] = useState<number>(0);
    const [isSwitching, setIsSwitching] = useState<boolean>(false); // 控制切换状态
    // 默认展开的面板，使用数组格式，与Ant Design Collapse一致
    const [activeKeys, setActiveKeys] = useState<string[]>(['models', 'chats']);

    useEffect(() => {
      const chatId = Number(id); // 尝试将 id 转换为数字
      if (!isNaN(chatId)) {
        const chat = chatList.find((chat) => chat.conversationId === chatId);
        if (chat) {
          setCurrentChat(chat.conversationId); // 设置当前对话
        } else {
          console.error("未找到对应的对话：", id);
        }
      } else if (id === "new") {
        handleNewChat(); // 如果是新对话，调用新建对话函数
      } else {
        console.error("非法参数：", id);
        alert("非法参数，返回主页");
        window.location.href = "/"; // 返回主页
      }
    }, [id]); // 监听 id 变化

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

    // 处理心情设置
    const handleSetMood = (moodType: MoodType) => {
      setMood(moodType);
      console.log("设置心情为：", moodType);
    };

    // 心情映射表
    const moodMap: Record<MoodType, { emoji: string, text: string }> = {
      happy: { emoji: "😊", text: "开心" },
      sad: { emoji: "😢", text: "难过" },
      angry: { emoji: "😡", text: "生气" },
      tired: { emoji: "😴", text: "疲惫" },
      neutral: { emoji: "😐", text: "平静" }
    };

    // 处理折叠面板变化
    const handleCollapseChange = (keys: string | string[]) => {
      setActiveKeys(typeof keys === 'string' ? [keys] : keys);
    };

    return (
      <div
        className={`${styles.sidebar} ${
          visible ? styles.visible : styles.hidden
        } 
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

        {/* 使用 Ant Design 的 Collapse 组件 */}
        <Collapse 
          activeKey={activeKeys} 
          onChange={handleCollapseChange}
          bordered={false}
          expandIconPosition="end"
          className="mt-4"
        >
          {/* 模型选择面板 */}
          <Collapse.Panel key="models" header="模型选择">
            <div className={styles.modelSelector}>
              {MODELS.map((model, index) => (
                <div
                  key={model.id}
                  className={`${styles.modelItem} ${
                    currentModelIndex === index ? styles.active : ""
                  } ${isSwitching ? styles.disabled : ""}`}
                  onClick={() => handleModelChange(index)}
                >
                  <Icon
                    icon={model.icon}
                    className={`text-2xl ${
                      currentModelIndex === index
                        ? "text-blue-500"
                        : "text-gray-600"
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
          </Collapse.Panel>
          
          {/* 对话列表面板 */}
          <Collapse.Panel key="chats" header="对话列表">
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
          </Collapse.Panel>
        </Collapse>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <div className="mb-4">
            <div className="px-2 py-2">
              <h3 className="text-base font-medium">今日心情</h3>
            </div>
            
            {/* 调整心情容器的布局 */}
            <div className="flex justify-between px-2 mt-2"> {/* 改为justify-between并添加水平内边距 */}
              {(["happy", "sad", "angry", "tired"] as MoodType[]).map((moodType) => (
                <div
                  key={moodType}
                  className={`${styles.moodItem} ${mood === moodType ? styles.active : ""}`}
                  onClick={() => handleSetMood(moodType)}
                >
                  <span className={styles.moodEmoji}>{moodMap[moodType].emoji}</span>
                  <div className={styles.moodText}>{moodMap[moodType].text}</div>
                </div>
              ))}
            </div>
          </div>
          
          <Button
            type="primary"
            block
            icon={<Icon icon="material-symbols:add" />}
            onClick={handleNewChat}
          >
            新建对话
          </Button>
        </div>
      </div>
    );
  }
);

export default Sidebar;
