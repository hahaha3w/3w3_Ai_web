import Api from "@/service/api";
import { LoginReq } from "@/service/api/auth/types";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import styles from "./login.module.scss";
import useAuthStore from "@/store/auth";
import { useTokenStore } from "@/store/token";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {setEmail, setToken, setUser, ...tokenData} = useTokenStore()
  const [form] = Form.useForm();
  const { setAuth } = useAuthStore();

  const onFinish = async (values: LoginReq & { remember: boolean }) => {
    try {
      setLoading(true);
      const { remember, ...loginData } = values;

      const response = await Api.authApi.login(loginData);

      if (response && response.data) {
        // 存储用户信息和token
        const { token, ...user } = response.data;
        setToken(token);
        setUser(JSON.stringify(user));

        if (remember) {
          setEmail(values.email);
        } else {
          setEmail("");
        }

        setAuth({
          ...user,
          theme: user.theme === "light" || user.theme === "dark" ? user.theme : undefined,
        });

        message.success("登录成功");
        navigate("/"); // 登录成功后跳转
      }
    } catch (error: any) {
      message.error(error.message || "登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>欢迎登录</h1>
        <Form
          form={form}
          name="login"
          initialValues={{
            remember: true,
            email: localStorage.getItem("email") || "",
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "请输入您的邮箱" },
              { type: "email", message: "请输入有效的邮箱地址" },
            ]}
          >
            <Input
              prefix={<Icon icon="mdi:email-outline" />}
              placeholder="邮箱"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入您的密码" }]}
          >
            <Input.Password
              prefix={<Icon icon="mdi:lock-outline" />}
              placeholder="密码"
              size="large"
              iconRender={(visible) =>
                visible ? (
                  <Icon icon="mdi:eye-outline" />
                ) : (
                  <Icon icon="mdi:eye-off-outline" />
                )
              }
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginButton}
              loading={loading}
              size="large"
              block
            >
              登录
            </Button>
          </Form.Item>

          <div className={styles.registerLink}>
            还没有账号? <a onClick={()=> navigate("/auth/register")}>立即注册</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
