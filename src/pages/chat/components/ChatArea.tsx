import Oml2d from "@/components/Oml2d";
import { Bubble, Sender } from "@ant-design/x";

import Api from "@/service/api";
import useChatStore from "@/store/chat";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import {
  Button,
  ConfigProvider,
  Dropdown,
  GetProp,
  GetRef,
  MenuProps,
  message,
  theme,
  Tooltip,
} from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "./ChatArea.module.scss";

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
    const { addMessage } = useChatStore();

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
    const { messages, addMessage, currentChatId, setMessage } = useChatStore();
    const closeEventSource = useRef<(() => void) | null>(null);
    const aiResponseRef = useRef("");
    const tempMessageIdRef = useRef<number | null>(null);
    const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 清理函数，确保组件卸载时关闭EventSource和计时器
    useEffect(() => {
      return () => {
        if (closeEventSource.current) {
          closeEventSource.current();
        }
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
        }
      };
    }, []);

    // 作为单独的Effect处理消息更新，防止与渲染循环交叉
    const updateMessageContent = useCallback(
      (messageId: number, content: string) => {
        setMessage(messageId, content);
      },
      [setMessage]
    );

    const handleSend = useCallback(
      async (content: string) => {
        if (!currentChatId) {
          message.error("请先选择或创建一个对话");
          setLoading(false);
          return;
        }

        // 添加用户消息
        addMessage({
          content,
          conversationId: currentChatId,
          messageId: Date.now(), // 临时ID
          sendTime: new Date().toISOString(),
          senderType: "user",
          userId: 123, // 应该从用户状态获取
        });

        // 重置流式响应相关变量
        aiResponseRef.current = "";
        const tempMessageId = Date.now() + 1; // 临时ID
        tempMessageIdRef.current = tempMessageId;

        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
          updateTimerRef.current = null;
        }

        // 添加初始的AI回复消息（空内容）
        addMessage({
          content: "",
          conversationId: currentChatId,
          messageId: tempMessageId,
          sendTime: new Date().toISOString(),
          senderType: "ai",
          userId: 0,
        });

        try {
          // 调用API发送消息
          const cleanup = await Api.chatApi.sendMsg(
            {
              content,
              conversationId: currentChatId,
            },
            (data) => {
              // 检查是否有消息和内容
              if (data && data.message) {
                // 如果message是空对象，视为接收完毕
                if (
                  Object.keys(data.message).length === 0 ||
                  data.message.content === undefined
                ) {
                  if (tempMessageIdRef.current) {
                    updateMessageContent(
                      tempMessageIdRef.current,
                      aiResponseRef.current
                    );
                    tempMessageIdRef.current = null;
                  }

                  setLoading(false);
                  if (closeEventSource.current) {
                    closeEventSource.current();
                    closeEventSource.current = null;
                  }
                  return;
                }

                // 正常处理有内容的消息
                aiResponseRef.current += data.message.content;
                console.log("AI Response:", data.message.content);

                // 直接更新UI，不使用防抖
                if (tempMessageIdRef.current) {
                  updateMessageContent(
                    tempMessageIdRef.current,
                    aiResponseRef.current
                  );
                }
              }

              // 处理流结束
              if (data && data.end === true) {
                if (tempMessageIdRef.current) {
                  updateMessageContent(
                    tempMessageIdRef.current,
                    aiResponseRef.current
                  );
                  tempMessageIdRef.current = null;
                }

                // 仅在完整响应结束后让Live2D模型显示消息
                if (oml2d && aiResponseRef.current) {
                  // 提取前50个字符或更少作为气泡消息
                  const previewText =
                    aiResponseRef.current.length > 50
                      ? aiResponseRef.current.substring(0, 50) + "..."
                      : aiResponseRef.current;
                  oml2d.tipsMessage(previewText, 3000, 1);
                }

                setLoading(false);
                if (closeEventSource.current) {
                  closeEventSource.current();
                  closeEventSource.current = null;
                }
              }
            },
            (error) => {
              console.error("消息发送错误:", error);
              message.error("消息发送失败");
              setLoading(false);

              if (closeEventSource.current) {
                closeEventSource.current();
                closeEventSource.current = null;
              }
            }
          );

          closeEventSource.current =
            typeof cleanup === "function" ? cleanup : null;
        } catch (error) {
          console.error("发送消息出错:", error);
          message.error("消息发送失败");
          setLoading(false);
        }
      },
      [addMessage, currentChatId, oml2d, updateMessageContent]
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
            if (closeEventSource.current) {
              closeEventSource.current();
              closeEventSource.current = null;
            }
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
