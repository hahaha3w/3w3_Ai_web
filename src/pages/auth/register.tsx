import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Button, Form, Input, message } from 'antd';
import Api from '@/service/api';
import { RegisterReq } from '@/service/api/auth/types';
import styles from './login.module.scss';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [form] = Form.useForm();

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async () => {
    try {
      // 获取邮箱并验证
      const email = form.getFieldValue('email');
      if (!email) {
        message.error('请先输入邮箱');
        return;
      }

      // 验证邮箱格式
      const emailRule = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRule.test(email)) {
        message.error('请输入有效的邮箱地址');
        return;
      }

      setSendingCode(true);
      const response = await Api.authApi.sendCode({ email });
      if (response && response.data) {
        message.success('验证码已发送，请查收邮件');
        startCountdown();
      }
    } catch (error: any) {
      console.error('发送验证码失败', error);
      message.error('发送验证码失败，请重试');
    } finally {
      setSendingCode(false);
    }
  };

  const onFinish = async (values: RegisterReq) => {
    try {
      setLoading(true);
      const response = await Api.authApi.register(values);
      console.log(response);

      if (response && response.data) {
        message.success('注册成功');
        navigate('/auth/login'); // 注册成功后跳转到登录页
      }
    } catch (error: any) {
      console.error('注册失败', error);
      message.error('注册失败，请检查您邮箱是否已被注册，或验证码是否正确');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>账号注册</h1>
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入您的邮箱' },
              { type: 'email', message: '请输入有效的邮箱地址' }
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
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度不能少于6个字符' }
            ]}
          >
            <Input.Password
              prefix={<Icon icon="mdi:lock-outline" />}
              placeholder="密码"
              size="large"
              iconRender={visible =>
                visible ? <Icon icon="mdi:eye-outline" /> : <Icon icon="mdi:eye-off-outline" />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: '请确认密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<Icon icon="mdi:lock-outline" />}
              placeholder="确认密码"
              size="large"
              iconRender={visible =>
                visible ? <Icon icon="mdi:eye-outline" /> : <Icon icon="mdi:eye-off-outline" />
              }
            />
          </Form.Item>

          <Form.Item
            name="code"
            rules={[{ required: true, message: '请输入验证码' }]}
          >
            <div style={{ display: 'flex' }}>
              <Input
                prefix={<Icon icon="mdi:shield-check-outline" />}
                placeholder="验证码"
                size="large"
                style={{ flex: 1 }}
              />
              <Button
                size="large"
                disabled={countdown > 0 || sendingCode}
                loading={sendingCode}
                onClick={handleSendCode}
                style={{ marginLeft: 8, width: 120 }}
              >
                {countdown > 0 ? `${countdown}秒后重试` : '获取验证码'}
              </Button>
            </div>
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
              注册
            </Button>
          </Form.Item>

          <div className={styles.registerLink}>
            已有账号? <a onClick={()=> navigate("/auth/login")}>立即登录</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default RegisterPage;
