import React from "react";
import { Button, Empty, Popconfirm, Spin } from "antd";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Conversation } from "@/service/api/chat/types";
import styles from "./Sidebar.module.scss";

interface ChatListProps {
  chatList: Conversation[];
  currentChatId: number | null;
  fetchingChats: boolean;
  onSwitchChat: (conversationId: number) => void;
  onDeleteChat: (conversationId: number, e: React.MouseEvent) => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chatList,
  currentChatId,
  fetchingChats,
  onSwitchChat,
  onDeleteChat,
}) => {
  // 在对话项组件中添加点击处理
  const handleChatItemClick = (conversationId: number) => {
    // 如果点击的是当前已选中的对话，不执行任何操作
    if (conversationId === currentChatId) return;
    onSwitchChat(conversationId);
  };

  // 格式化时间函数
  const formatTime = (dateString: string) => {
    try {
      const date = new Date(dateString);

      // 如果是今天，只显示时间
      const today = new Date();
      if (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      ) {
        return `今天 ${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      }

      // 如果是昨天，显示"昨天 + 时间"
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      if (
        date.getDate() === yesterday.getDate() &&
        date.getMonth() === yesterday.getMonth() &&
        date.getFullYear() === yesterday.getFullYear()
      ) {
        return `昨天 ${date.getHours().toString().padStart(2, "0")}:${date
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      }

      // 否则显示完整日期时间
      return `${date.getFullYear()}-${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
    } catch (error) {
      console.error("时间格式化错误:", error);
      return dateString;
    }
  };

  return (
    <div className={styles.chatList}>
      {fetchingChats ? (
        <div className="flex justify-center items-center py-4">
          <Spin tip="加载中..." />
        </div>
      ) : chatList.length === 0 ? (
        <Empty description="暂无对话" className="py-4" />
      ) : (
        chatList
          .sort((a, b) => {
            // 完全按照更新时间排序，最新更新的排在最前面
            return (
              new Date(b.updatedAt || b.createTime).getTime() -
              new Date(a.updatedAt || a.createTime).getTime()
            );
          })
          .map((chat: Conversation) => (
            <div
              key={chat.conversationId}
              className={`${styles.chatItem} ${
                currentChatId === chat.conversationId ? styles.active : ""
              } group`}
              onClick={() => handleChatItemClick(chat.conversationId)}
            >
              <div className="flex items-center w-full">
                <div className="flex flex-col flex-grow">
                  <span
                    className={`font-medium ${
                      currentChatId === chat.conversationId
                        ? "text-blue-600"
                        : "text-gray-800"
                    }`}
                  >
                    {chat.sessionTitle}
                  </span>
                  <span className="text-gray-500 text-xs truncate">
                    {formatTime(chat.updatedAt || chat.createTime)}
                  </span>
                </div>
                <Popconfirm
                  title="确定要删除这个对话吗?"
                  onConfirm={(e) =>
                    onDeleteChat(chat.conversationId, e as React.MouseEvent)
                  }
                  okText="确定"
                  cancelText="取消"
                  placement="left"
                >
                  <Button
                    type="text"
                    size="small"
                    className={`${styles.deleteButton} opacity-0 group-hover:opacity-100 transition-opacity`}
                    icon={
                      <Icon
                        icon="mdi:delete-outline"
                        className="text-red-500"
                      />
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                </Popconfirm>
              </div>
              {currentChatId === chat.conversationId && (
                <div className={styles.activeIndicator}></div>
              )}
            </div>
          ))
      )}
    </div>
  );
};

export default ChatList;
