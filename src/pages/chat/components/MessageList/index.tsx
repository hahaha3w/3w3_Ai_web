import { Bubble, Sender } from "@ant-design/x";
import Api from "@/service/api";
import useChatStore from "@/store/chat";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { GetProp, GetRef, Spin, Tooltip, Typography, message } from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styles from "../ChatArea.module.scss";
import markdownit from "markdown-it";
import "./MarkdownStyles.scss";

// 初始化markdown-it
const md = markdownit({ html: true, breaks: true });

// 角色样式配置
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
    // 添加Markdown渲染函数
    messageRender: (content) => (
      <Typography>
        <div dangerouslySetInnerHTML={{ __html: md.render(content) }} />
      </Typography>
    ),
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

// 消息列表组件
const MessageList = memo(
  ({
    oml2d,
  }: {
    oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  }) => {
    // 组件状态
    const listRef = useRef<GetRef<typeof Bubble.List>>(null);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);

    // Store 状态
    const {
      messages,
      addMessage,
      currentChatId,
      setMessage,
      loadingHistory,
      setMessageLoading,
    } = useChatStore();

    // 引用变量
    const closeEventSource = useRef<(() => void) | null>(null);
    const aiResponseRef = useRef("");
    const tempMessageIdRef = useRef<number | null>(null);
    const updateTimerRef = useRef<NodeJS.Timeout | null>(null);

    // 组件卸载时清理资源
    useEffect(() => {
      return () => {
        if (closeEventSource.current) {
          closeEventSource.current();
          closeEventSource.current = null;
        }
        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
          updateTimerRef.current = null;
        }
      };
    }, []);

    // 取消发送请求
    const handleCancel = useCallback(() => {
      setLoading(false);
      if (closeEventSource.current) {
        closeEventSource.current();
        closeEventSource.current = null;
      }
      if (tempMessageIdRef.current) {
        // 取消消息加载状态
        setMessageLoading(tempMessageIdRef.current, false);
        tempMessageIdRef.current = null;
      }
      aiResponseRef.current = "";
    }, [setMessageLoading]);

    // 更新消息内容
    const updateMessageContent = useCallback(
      (messageId: number, content: string) => {
        setMessage(messageId, content);
      },
      [setMessage]
    );

    // 发送消息
    const handleSend = useCallback(
      async (content: string) => {
        // 验证会话ID
        if (!currentChatId) {
          message.error("请先选择或创建一个对话");
          setLoading(false);
          return;
        }

        // 添加用户消息 - 使用 "\u0001" 表示用户消息
        addMessage({
          content,
          conversationId: currentChatId,
          messageId: Date.now(),
          sendTime: new Date().toISOString(),
          senderType: "\u0001", // 修改为特殊字符
          userId: 123,
        });

        // 重置状态
        aiResponseRef.current = "";
        const tempMessageId = Date.now() + 1;
        tempMessageIdRef.current = tempMessageId;

        if (updateTimerRef.current) {
          clearTimeout(updateTimerRef.current);
          updateTimerRef.current = null;
        }

        // 添加初始AI消息（空内容） - 使用 "\u0002" 表示AI消息
        addMessage({
          content: "",
          conversationId: currentChatId,
          messageId: tempMessageId,
          sendTime: new Date().toISOString(),
          senderType: "\u0002", // 修改为特殊字符
          userId: 0,
        });

        // 设置消息加载状态
        setMessageLoading(tempMessageId, true);

        try {
          // 调用API发送消息
          const cleanup = await Api.chatApi.sendMsg(
            {
              content,
              conversationId: currentChatId,
            },
            (data) => {
              // 检查消息内容
              if (data && data.message) {
                // 消息接收完毕
                if (
                  Object.keys(data.message).length === 0 ||
                  data.message.content === undefined
                ) {
                  if (tempMessageIdRef.current) {
                    updateMessageContent(
                      tempMessageIdRef.current,
                      aiResponseRef.current
                    );
                    // 取消消息加载状态
                    setMessageLoading(tempMessageIdRef.current, false);
                    tempMessageIdRef.current = null;
                  }

                  setLoading(false);
                  if (closeEventSource.current) {
                    closeEventSource.current();
                    closeEventSource.current = null;
                  }
                  return;
                }

                // 更新AI响应
                aiResponseRef.current += data.message.content;

                // 实时更新UI
                if (tempMessageIdRef.current) {
                  updateMessageContent(
                    tempMessageIdRef.current,
                    aiResponseRef.current
                  );
                }
              }

              // 流结束处理
              if (data && data.end === true) {
                if (tempMessageIdRef.current) {
                  updateMessageContent(
                    tempMessageIdRef.current,
                    aiResponseRef.current
                  );
                  // 取消消息加载状态
                  setMessageLoading(tempMessageIdRef.current, false);
                  tempMessageIdRef.current = null;
                }

                // 显示Live2D气泡消息
                if (oml2d && aiResponseRef.current) {
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

              // 发生错误时取消消息加载状态
              if (tempMessageIdRef.current) {
                setMessageLoading(tempMessageIdRef.current, false);
              }

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

          // 发生错误时取消消息加载状态
          if (tempMessageIdRef.current) {
            setMessageLoading(tempMessageIdRef.current, false);
          }
        }
      },
      [
        addMessage,
        currentChatId,
        oml2d,
        updateMessageContent,
        setMessageLoading,
      ]
    );

    // 聊天消息滚动到底部
    useEffect(() => {
      if (listRef.current && messages.length > 0) {
        // 滚动到底部的逻辑
        const nativeElement = listRef.current.nativeElement;
        if (nativeElement) {
          const scrollElement =
            nativeElement.querySelector(".ant-x-bubble-list");
          if (scrollElement) {
            setTimeout(() => {
              scrollElement.scrollTop = scrollElement.scrollHeight;
            }, 100);
          }
        }
      }
    }, [messages]);

    return (
      <div className="w-full h-full box-border flex justify-end flex-col top-0 absolute p-4 z-10000">
        {/* 加载历史记录覆盖层 */}
        {loadingHistory && (
          <div className={styles.loadingOverlay}>
            <Spin tip="加载对话历史..." size="large" />
          </div>
        )}

        {/* 消息气泡列表 */}
        <Bubble.List
          className={`${styles.bubbleListContainer} markdown-enabled`}
          ref={listRef}
          roles={rolesAsObject}
          items={messages}
        />

        {/* 消息输入框 */}
        <Sender
          className="mt-4 bg-[rgba(0,0,0,0.5)]"
          value={value}
          onChange={setValue}
          loading={loading}
          disabled={loadingHistory}
          onSubmit={(value) => {
            if (!value.trim() || loadingHistory) return;
            setValue("");
            setLoading(true);
            handleSend(value);
          }}
          placeholder={loadingHistory ? "正在加载对话历史..." : "聊点什么呢？"}
          onCancel={handleCancel}
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
              <Tooltip
                title={
                  value && !loadingHistory
                    ? "发送 \u21B5"
                    : loadingHistory
                    ? "加载中..."
                    : "请输入内容"
                }
              >
                <SendButton
                  className={`${styles.sendButton}`}
                  variant="text"
                  icon={<Icon icon="iconamoon:send-light" />}
                  disabled={loadingHistory}
                />
              </Tooltip>
            );
          }}
        />
      </div>
    );
  }
);

export default MessageList;
