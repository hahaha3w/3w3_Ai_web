import Oml2d from "@/components/Oml2d";
import { Bubble, Sender } from "@ant-design/x";

import { Icon } from "@iconify-icon/react/dist/iconify.js";
import {
  ConfigProvider,
  Dropdown,
  GetProp,
  GetRef,
  MenuProps,
  theme,
  Tooltip,
  Button,
} from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { useRef, useState, memo, useCallback } from "react";
import styles from "./ChatArea.module.scss";
import useChatStore from "@/store/chat";
import Api from "@/service/api";

// 使用 memo 包装 Header 组件避免不必要的重渲染
const Header = memo(
  ({
    title,
    oml2d,
    onToggleSidebar,
  }: {
    title: string;
    oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
    onToggleSidebar?: () => void;
  }) => {
    const { addMessage, setMessage } = useChatStore();

    const items: MenuProps["items"] = [
      {
        key: "1",
        label: "切换衣服",
        onClick: () => {
          if (oml2d) {
            oml2d.loadNextModelClothes();
          }
        },
      },
      {
        key: "2",
        label: "SSE",
        onClick: () => {
          const key = Date.now();
          let content = "SSE: 连接中...";
          addMessage({
            content: content,
            conversationId: 1, // Example conversationId
            messageId: key, // Example messageId
            sendTime: new Date().toISOString(),
            senderType: "ai",
            userId: 0, // Example userId for AI
          });
          Api.Test.subscribeToUpdates(
            (message: { count: number; message: string }) => {
              if (message.message) {
                content = content + " | " + message.message;
              } else {
                content = content + " | " + "第 " + message.count + " 条消息";
              }
              setMessage(key, content);
            }
          );
        },
      },
    ];

    return (
      <div className="w-full absolute top-0 bg-gradient-to-b from-[rgba(0,0,0,0.5)] to-transparent z-10001 opacity-80">
        <div className="flex justify-between items-center h-[60px] px-4">
          <div className="flex items-center">
            {onToggleSidebar && (
              <Button
                type="text"
                icon={
                  <Icon
                    icon="heroicons:bars-3"
                    className="text-xl text-white"
                  />
                }
                onClick={onToggleSidebar}
                className="mr-2 border-0 shadow-none"
              />
            )}
            <h2 className="text-2xl font-bold mt-0">{title}</h2>
          </div>
          <div className="relative inline-block text-left">
            <Dropdown
              // trigger={["click"]}
              overlayClassName="chat-area-settings"
              menu={{ items }}
              placement="bottomRight"
              dropdownRender={(menus) => {
                return <div className={styles.menu}>{menus}</div>;
              }}
            >
              <div className="cursor-pointer">
                <Icon icon="uil:setting" className="text-3xl" />
              </div>
            </Dropdown>
          </div>
        </div>
      </div>
    );
  }
);

const rolesAsObject: GetProp<typeof Bubble.List, "roles"> = {
  ai: {
    placement: "start",
    typing: { step: 5, interval: 20 },
    style: {
      maxWidth: 600,
    },
    shape: "round",
    styles: {
      content: {
        color: "white",
        background: "rgba(0,0,0,0.5)",
      },
    },
  },
  user: {
    placement: "end",
    shape: "round",
    styles: {
      content: {
        color: "white",
        background: "rgba(0,0,0,0.5)",
      },
    },
  },
};

// 使用 memo 来优化 MessageList 组件
const MessageList = memo(
  ({
    oml2d,
  }: {
    oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  }) => {
    const listRef = useRef<GetRef<typeof Bubble.List>>(null);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    const { messages, addMessage } = useChatStore();

    const handleSend = useCallback(
      (message: string) => {
        addMessage({
          content: message,
          conversationId: 1, // Example conversationId
          messageId: messages.length + 1, // Example messageId
          sendTime: new Date().toISOString(),
          senderType: "user",
          userId: 0, // Example userId for AI
        });
        setTimeout(() => {
          setLoading(false);
          addMessage({
            content: message,
            conversationId: 1, // Example conversationId
            messageId: messages.length + 1, // Example messageId
            sendTime: new Date().toISOString(),
            senderType: "ai",
            userId: 0, // Example userId for AI
          });
          oml2d?.tipsMessage("你才是猫娘，你全家都是猫娘！", 3000, 1);
        }, 3000);
      },
      [addMessage, oml2d]
    );

    return (
      <div className="w-full h-full box-border flex justify-end flex-col top-0 absolute p-4 z-10000">
        <Bubble.List
          className={styles.bubbleListContainer}
          ref={listRef}
          roles={rolesAsObject}
          items={messages}
        />
        <Sender
          className="mt-4 bg-[rgba(0,0,0,0.5)]"
          value={value}
          onChange={setValue}
          loading={loading}
          onSubmit={(value) => {
            if (!value.trim()) return;
            setValue("");
            setLoading(true);
            handleSend(value);
          }}
          placeholder="聊点什么呢？"
          onCancel={() => {
            setLoading(false);
          }}
          actions={(_, info) => {
            const { SendButton, LoadingButton } = info.components;

            if (loading) {
              return (
                <Tooltip title="取消">
                  <LoadingButton />
                </Tooltip>
              );
            }

            return (
              <Tooltip title={value ? "发送 \u21B5" : "请输入内容"}>
                <SendButton
                  className={`${styles.sendButton}`}
                  variant="text"
                  icon={<Icon icon="iconamoon:send-light" />}
                />
              </Tooltip>
            );
          }}
        />
      </div>
    );
  }
);

type ChatAreaProps = {
  title: string;
  onToggleSidebar?: () => void;
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  setOml2d: React.Dispatch<
    React.SetStateAction<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>
  >;
};

const ChatArea = ({
  title,
  onToggleSidebar,
  oml2d,
  setOml2d,
}: ChatAreaProps) => {
  return (
    <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
      <div
        className={`relative text-gray-50 w-full h-full overflow-hidden rounded-lg shadow-xl ${styles.chatContainer}`}
      >
        <Header title={title} oml2d={oml2d} onToggleSidebar={onToggleSidebar} />
        <Oml2d oml2d={oml2d} setOml2d={setOml2d} />
        <MessageList oml2d={oml2d} />
      </div>
    </ConfigProvider>
  );
};

export default ChatArea;
