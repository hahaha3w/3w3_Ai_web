import React from "react";
import { Button, Typography } from "antd";
import { useNavigate } from "react-router";
import NotFoundSvg from "@/assets/404.svg";

const { Title, Paragraph } = Typography;

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100 px-4 py-12">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl p-8 transform transition-all hover:scale-[1.02] duration-300">
        <div className="relative">
          <img
            src={NotFoundSvg}
            alt="404 Not Found"
            className="mx-auto block w-72 md:w-96 animate-pulse-slow"
            style={{ animationDuration: "3s" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent bottom-0 h-16"></div>
        </div>

        <Title
          level={1}
          className="mt-6 font-bold text-gray-800 text-center text-3xl md:text-4xl bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
        >
          哎呀，页面未找到！
        </Title>

        <Paragraph className="mt-5 mb-6 text-gray-600 text-center text-lg leading-relaxed">
          您访问的页面似乎已经迷路了。可能是链接已过期，页面已被移动，或者您输入了错误的地址。
        </Paragraph>

        <div className="flex justify-center space-x-4">
          <Button
            type="primary"
            size="large"
            onClick={() => navigate("/")}
            className="rounded-full px-8 py-3 h-auto font-medium text-base shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 to-blue-700 border-none"
          >
            返回首页
          </Button>
          <Button
            onClick={() => navigate(-1)}
            size="large"
            className="rounded-full px-8 py-3 h-auto font-medium text-base border-2 border-gray-300 shadow-sm hover:border-blue-400 hover:text-blue-500 transition-all duration-300"
          >
            返回上一页
          </Button>
        </div>

        <div className="mt-10 text-center text-gray-500">
          <div className="inline-flex items-center">
            <span className="h-px w-8 bg-gray-300 mr-3"></span>
            <span>需要帮助？</span>
            <span className="h-px w-8 bg-gray-300 ml-3"></span>
          </div>
          <Paragraph className="mt-2">
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              联系我们
            </a>
            {" 或 "}
            <a
              href="#"
              className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
            >
              查看帮助中心
            </a>
          </Paragraph>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
