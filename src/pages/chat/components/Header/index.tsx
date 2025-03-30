import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Button, Dropdown, MenuProps } from "antd";
import { Oml2dEvents, Oml2dMethods, Oml2dProperties } from "oh-my-live2d";
import React, { memo } from "react";
import styles from "../ChatArea.module.scss";

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

export default Header;
