import { Icon } from "@iconify-icon/react/dist/iconify.js";
import {
  Button,
  Dropdown,
  MenuProps,
  Modal,
  Form,
  DatePicker,
  Select,
  Space,
  ConfigProvider,
  theme,
} from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { memo, useState } from "react";
import styles from "../ChatArea.module.scss";
import Api from "@/service/api";
import useApp from "antd/es/app/useApp";
import zhCN from "antd/locale/zh_CN";

// 聊天区域顶部标题栏组件
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
    const { message, modal } = useApp();
    const [form] = Form.useForm();
    // 定义下拉菜单项
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

    const [isGenerating, setIsGenerating] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 预设的生成风格选项 - 修改为使用中文值
    const styleOptions = [
      { value: "幽默风趣", label: "幽默风趣" },
      { value: "专业严谨", label: "专业严谨" },
      { value: "冷静分析", label: "冷静分析" },
      { value: "叙事流畅", label: "叙事流畅" },
      { value: "深度沉思", label: "深度沉思" },
      { value: "正式严谨", label: "正式严谨" },
      { value: "毒舌犀利", label: "毒舌犀利" },
      { value: "戏剧化", label: "戏剧化" },
      { value: "夸张风", label: "夸张风" },
      { value: "自嘲型", label: "自嘲型" },
    ];

    const generateMemoir = async (values: any) => {
      try {
        setIsGenerating(true);
        // Show loading message using Ant Design message API
        message.loading({ content: "正在生成回忆录...", key: "memoir" });

        // 创建一个Promise.race来处理超时
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => {
            reject(new Error('timeout'));
          }, 3000); // 3秒超时
        });

        // 传递用户选择的参数
        const generatePromise = Api.memoirApi.generateMemory({
          type: "Memoir",
          style: values.style,
          startDate: values.dateRange?.[0]?.format("YYYY-MM-DD"),
          endDate: values.dateRange?.[1]?.format("YYYY-MM-DD"),
        });

        await Promise.race([generatePromise, timeoutPromise]);
        
        // 如果没有超时，显示成功消息
        message.success({ content: "回忆录生成成功", key: "memoir" });
        setIsModalOpen(false);
      } catch (error) {
        if ((error as Error).message === 'timeout') {
          // 超时的情况，提示用户稍后在主页查看
          message.info({ 
            content: "回忆录正在生成中，请稍后在主页查看结果", 
            key: "memoir",
            duration: 6 
          });
          setIsModalOpen(false);
        } else {
          // 其他错误情况
          message.error({ content: "回忆录生成失败", key: "memoir" });
        }
      } finally {
        setIsGenerating(false);
      }
    };

    const handleGenerateMemoir = () => {
      setIsModalOpen(true);
    };

    const handleModalCancel = () => {
      setIsModalOpen(false);
    };

    const handleModalOk = () => {
      form.submit();
    };

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
          <div className="flex items-center gap-4">
            <Button
              type="primary"
              onClick={handleGenerateMemoir}
              loading={isGenerating}
              className={`${styles.memoirButton} flex items-center justify-center`}
              size="middle"
              icon={
                <Icon
                  icon="material-symbols:history-edu-outline-rounded"
                  className="text-lg flex-shrink-0"
                  style={{ display: "inline-flex", verticalAlign: "middle" }}
                />
              }
            >
              <span style={{ display: "inline-flex", verticalAlign: "middle" }}>
                生成回忆录
              </span>
            </Button>
            <div className="relative text-left flex items-center justify-center">
              <Dropdown
                overlayClassName="chat-area-settings"
                menu={{ items }}
                placement="bottomRight"
                dropdownRender={(menus) => {
                  return <div className={styles.menu}>{menus}</div>;
                }}
              >
                <div className="cursor-pointer flex items-center justify-center h-full">
                  <Icon icon="uil:setting" className="text-2xl" />
                </div>
              </Dropdown>
            </div>
          </div>
        </div>

        {/* 回忆录生成设置Modal */}
        <ConfigProvider
          locale={zhCN}
          theme={{ algorithm: theme.defaultAlgorithm }}
        >
          <Modal
            title="生成回忆录设置"
            open={isModalOpen}
            onCancel={handleModalCancel}
            onOk={handleModalOk}
            confirmLoading={isGenerating}
            okText="生成"
            cancelText="取消"
            destroyOnClose
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={generateMemoir}
              initialValues={{ style: "幽默风趣" }}
            >
              <Form.Item
                name="style"
                label="生成风格"
                rules={[{ required: true, message: "请选择生成风格" }]}
              >
                <Select options={styleOptions} placeholder="请选择生成风格" />
              </Form.Item>
              <Form.Item
                name="dateRange"
                label="日期范围"
                rules={[{ required: true, message: "请选择日期范围" }]}
              >
                <DatePicker.RangePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  placeholder={["开始日期", "结束日期"]}
                />
              </Form.Item>
            </Form>
          </Modal>
        </ConfigProvider>
      </div>
    );
  }
);

export default Header;
