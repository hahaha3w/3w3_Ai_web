import React, { memo, useEffect, useState } from "react";
import { Button, Collapse, message, Tooltip } from "antd";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { useNavigate } from "react-router";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import useChatStore from "@/store/chat";
import useMood from "@/hooks/useMood";
import Api from "@/service/api";
import { MoodType } from "@/store/mood";
import styles from "./Sidebar.module.scss";

// 导入拆分的组件
import SidebarHeader from "./SidebarHeader";
import ModelSelector from "./ModelSelector";
import ChatList from "./ChatList";
import MoodSelector from "./MoodSelector";

interface SidebarProps {
  visible: boolean;
  id: string | number | undefined;
  onClose: () => void;
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
}

const Sidebar: React.FC<SidebarProps> = memo(
  ({ visible, id, onClose, oml2d }) => {
    const { chatList, setCurrentChat, currentChatId, setChatList } =
      useChatStore();
    const { mood, setMood } = useMood();
    const [currentModelIndex, setCurrentModelIndex] = useState<number>(0);
    const [isSwitching, setIsSwitching] = useState<boolean>(false);
    const [activeKeys, setActiveKeys] = useState<string[]>(["chats"]);
    const [loading, setLoading] = useState<boolean>(false);
    const [isCreatingChat, setIsCreatingChat] = useState<boolean>(false);
    const [fetchingChats, setFetchingChats] = useState<boolean>(false);
    const navigate = useNavigate();

    // 获取对话列表
    const fetchConversationList = async () => {
      try {
        setFetchingChats(true);
        const response = await Api.chatApi.getConversationList({
          pageNumber: 1,
          pageSize: 50,
        });

        if (response.data && response.data.conversations) {
          setChatList(response.data.conversations);

          if (!currentChatId && response.data.conversations.length > 0) {
            setCurrentChat(response.data.conversations[0].conversationId);
          }
        } else {
          message.error("获取对话列表失败");
        }
      } catch (error) {
        console.error("获取对话列表失败:", error);
        message.error("获取对话列表失败，请刷新重试");
      } finally {
        setFetchingChats(false);
      }
    };

    // 组件挂载时获取对话列表
    useEffect(() => {
      fetchConversationList();
    }, []);

    // ID 变更时的处理逻辑
    useEffect(() => {
      if (isCreatingChat || loading) return;

      // 处理新建对话请求
      const handleNewChatRequest = async () => {
        try {
          setLoading(true);
          setIsCreatingChat(true);

          // 调用API创建新对话，移除标题中的时间戳
          const response = await Api.chatApi.createConversation({
            mode: "MODE_HAPPY",
            sessionTitle: `新对话`,
          });

          if (response.data && response.data.conversation) {
            const newChat = response.data.conversation;

            // 创建成功后重新获取对话列表
            await fetchConversationList();

            // 设置当前对话为新创建的对话并清空消息列表
            setCurrentChat(newChat.conversationId);
            useChatStore.getState().clearMessages();
            navigate(`/chat/${newChat.conversationId}`, { replace: true });
            message.success("创建对话成功");
          } else {
            message.error("创建对话失败：返回数据格式错误");
            navigate("/chat", { replace: true });
          }
        } catch (error) {
          console.error("创建新对话失败:", error);
          message.error("创建对话失败，请稍后重试");

          // 创建失败时仍然重新获取对话列表
          await fetchConversationList();

          // 如果有现有对话，选择第一个
          if (chatList.length > 0) {
            const firstChatId = chatList[0].conversationId;
            setCurrentChat(firstChatId);
            navigate(`/chat/${firstChatId}`, { replace: true });
          } else {
            navigate("/chat", { replace: true });
          }
        } finally {
          setLoading(false);
          // 延迟释放创建锁
          setTimeout(() => {
            setIsCreatingChat(false);
          }, 1000);
        }
      };

      // 处理选择现有对话请求
      const handleExistingChatRequest = async (chatId: number) => {
        // 如果这个ID已经是当前选中的，不需要重新加载
        if (chatId === currentChatId) return;

        try {
          setLoading(true);

          // 先检查列表中是否已有该对话
          const chat = chatList.find((chat) => chat.conversationId === chatId);

          if (chat) {
            // 如果找到了，设置当前对话并加载消息
            setCurrentChat(chat.conversationId);

            // 加载对话消息历史
            const response = await Api.chatApi.getMsgHistory({
              conversationId: chatId,
              pageNum: 1,
              pageSize: 50, // 获取足够多的消息
            });

            if (response.data && response.data.messages) {
              // 调用store中的setMessages方法更新消息列表
              useChatStore
                .getState()
                .setMessages(response.data.messages.reverse());
            } else {
              // 如果没有消息或获取失败，清空消息列表
              useChatStore.getState().clearMessages();
            }
          } else {
            // 如果没找到，重新获取对话列表
            await fetchConversationList();

            // 再次检查是否找到对话
            const refreshedChat = chatList.find(
              (chat) => chat.conversationId === chatId
            );

            if (refreshedChat) {
              setCurrentChat(refreshedChat.conversationId);
            } else {
              // 如果依然没找到，提示并跳转到第一个对话或创建新对话
              message.warning("未找到对应的对话");
              if (chatList.length > 0) {
                const firstChatId = chatList[0].conversationId;
                setCurrentChat(firstChatId);
                navigate(`/chat/${firstChatId}`, { replace: true });
              } else {
                navigate("/chat/new", { replace: true });
              }
            }
          }
        } catch (error) {
          console.error("处理现有对话失败:", error);
          message.error("加载对话失败，请刷新重试");
        } finally {
          setLoading(false);
        }
      };

      // 主逻辑：根据 id 类型执行不同操作
      if (id === "new") {
        // 如果是新建对话请求
        handleNewChatRequest();
      } else if (id) {
        // 尝试将 id 转换为数字
        const chatId = Number(id);

        if (!isNaN(chatId)) {
          // 如果是有效的数字 ID，处理现有对话
          handleExistingChatRequest(chatId);
        } else {
          // 如果是无效的 ID 格式
          console.error("非法参数：", id);
          message.error("访问参数错误，返回主页");
          navigate("/");
        }
      }
    }, [id, isCreatingChat, loading, currentChatId, chatList, navigate]);

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

    // 新建对话按钮点击处理函数
    const handleNewChat = () => {
      if (loading || isCreatingChat) return;
      navigate("/chat/new", { replace: true });
    };

    // 处理切换对话
    const handleSwitchChat = async (conversationId: number) => {
      // 如果点击的是当前已选中的对话，不执行任何操作
      if (conversationId === currentChatId) return;

      try {
        // 先设置当前对话ID和更新URL
        setCurrentChat(conversationId);
        navigate(`/chat/${conversationId}`);

        // 显示加载状态
        setLoading(true);

        // 加载对话消息历史
        const response = await Api.chatApi.getMsgHistory({
          conversationId,
          pageNum: 1,
          pageSize: 50, // 获取足够多的消息
        });

        if (response.data && response.data.messages) {
          // 调用store中的setMessages方法更新消息列表
          useChatStore.getState().setMessages(response.data.messages.reverse());
        } else {
          // 如果没有消息或获取失败，清空消息列表
          useChatStore.getState().clearMessages();
        }
      } catch (error) {
        console.error("获取对话消息失败:", error);
        message.error("获取对话消息失败，请重试");
        // 清空消息列表
        useChatStore.getState().clearMessages();
      } finally {
        setLoading(false);
      }
    };

    // 处理删除对话
    const handleDeleteChat = async (
      conversationId: number,
      e: React.MouseEvent
    ) => {
      e.stopPropagation(); // 阻止点击事件冒泡，避免触发选择对话

      try {
        setLoading(true);
        // 调用API删除对话
        const response = await Api.chatApi.deleteConversation({
          conversationId,
        });

        if (response.data && response.data.success) {
          // 删除成功，从列表中移除
          setChatList(
            chatList.filter((chat) => chat.conversationId !== conversationId)
          );
          message.success("对话已删除");

          // 如果删除的是当前选中的对话，则需要跳转到其他对话
          if (currentChatId === conversationId) {
            // 查找其他对话
            const remainingChats = chatList.filter(
              (chat) => chat.conversationId !== conversationId
            );
            if (remainingChats.length > 0) {
              // 选择剩余对话列表中的第一个
              const firstChatId = remainingChats[0].conversationId;
              setCurrentChat(firstChatId);
              navigate(`/chat/${firstChatId}`, { replace: true });
            } else {
              // 如果没有剩余对话，则创建新对话
              navigate("/chat/new", { replace: true });
            }
          }
        } else {
          message.error("删除对话失败");
        }
      } catch (error) {
        console.error("删除对话失败:", error);
        message.error("删除对话失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    // 处理心情设置
    const handleSetMood = (moodType: MoodType) => {
      setMood(moodType);
      console.log("设置心情为：", moodType);
    };

    // 处理折叠面板变化
    const handleCollapseChange = (keys: string | string[]) => {
      setActiveKeys(typeof keys === "string" ? [keys] : keys);
    };

    return (
      <div
        className={`${styles.sidebar} ${
          visible ? styles.visible : styles.hidden
        } fixed top-0 left-0 h-full bg-white backdrop-blur-md z-[1000] 
              will-change-transform transition-transform duration-300 shadow-lg`}
      >
        <SidebarHeader onClose={onClose} />

        <Collapse
          activeKey={activeKeys}
          onChange={handleCollapseChange}
          bordered={false}
          expandIconPosition="end"
          className="mt-4"
        >
          <Collapse.Panel key="models" header="模型选择">
            <ModelSelector
              currentModelIndex={currentModelIndex}
              isSwitching={isSwitching}
              oml2d={oml2d}
              onModelChange={handleModelChange}
            />
          </Collapse.Panel>

          <Collapse.Panel
            key="chats"
            header={
              <div className="flex justify-between items-center w-full pr-6">
                <span>对话列表</span>
                <Tooltip title="刷新列表">
                  <Button
                    type="text"
                    size="small"
                    icon={<Icon icon="mdi:refresh" className="text-gray-600" />}
                    onClick={(e) => {
                      e.stopPropagation(); // 阻止事件冒泡，避免触发折叠面板
                      fetchConversationList();
                    }}
                    loading={fetchingChats}
                    className="border-0 shadow-none"
                  />
                </Tooltip>
              </div>
            }
          >
            <ChatList
              chatList={chatList}
              currentChatId={currentChatId}
              fetchingChats={fetchingChats}
              onSwitchChat={handleSwitchChat}
              onDeleteChat={handleDeleteChat}
            />
          </Collapse.Panel>
        </Collapse>

        <div className="absolute bottom-4 left-0 right-0 px-4">
          <MoodSelector mood={mood} onSetMood={handleSetMood} />

          <Button
            type="primary"
            block
            icon={<Icon icon="material-symbols:add" />}
            onClick={handleNewChat}
            loading={loading}
            disabled={loading}
          >
            新建对话
          </Button>
        </div>
      </div>
    );
  }
);

export default Sidebar;
