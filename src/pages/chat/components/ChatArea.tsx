import Oml2d from "@/components/Oml2d";
import zhCN from "antd/locale/zh_CN";
import { ConfigProvider, theme } from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React from "react";
import styles from "./ChatArea.module.scss";
import Header from "./Header";
import MessageList from "./MessageList";

// 主组件类型定义
type ChatAreaProps = {
  title: string;
  onToggleSidebar?: () => void;
  oml2d: (Oml2dProperties & Oml2dMethods & Oml2dEvents) | null;
  setOml2d: React.Dispatch<
    React.SetStateAction<(Oml2dProperties & Oml2dMethods & Oml2dEvents) | null>
  >;
};

// 主组件
const ChatArea = ({
  title,
  onToggleSidebar,
  oml2d,
  setOml2d,
}: ChatAreaProps) => {
  return (
    <ConfigProvider locale={zhCN} theme={{ algorithm: theme.darkAlgorithm }}>
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
