import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import { Button, Form, Input, message } from 'antd';
import Api from '@/service/api';
import { ChangePasswordReq } from '@/service/api/auth/types';
import styles from './login.module.scss';

const ChangePasswordPage: React.FC = () => {
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
      const response = await Api.Auth.sendCode({ email });
      if (response && response.data) {
        message.success('验证码已发送，请查收邮件');
        startCountdown();
      }
    } catch (error: any) {
      message.error(error.message || '发送验证码失败，请重试');
    } finally {
      setSendingCode(false);
    }
  };

  const onFinish = async (values: ChangePasswordReq & { confirmPassword: string }) => {
    try {
      setLoading(true);
      const { confirmPassword, ...changePasswordData } = values;
      
      const response = await Api.Auth.changePassword(changePasswordData);

      if (response && response.data) {
        message.success('密码修改成功');
        navigate('/auth/login'); // 密码修改成功后跳转到登录页
      }
    } catch (error: any) {
      message.error(error.message || '密码修改失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginForm}>
        <h1 className={styles.title}>修改密码</h1>
        <Form
          form={form}
          name="changePassword"
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

          <Form.Item
            name="newPassword"
            rules={[
              { required: true, message: '请输入新密码' },
              { min: 6, message: '密码长度不能少于6个字符' }
            ]}
          >
            <Input.Password
              prefix={<Icon icon="mdi:lock-outline" />}
              placeholder="新密码"
              size="large"
              iconRender={visible =>
                visible ? <Icon icon="mdi:eye-outline" /> : <Icon icon="mdi:eye-off-outline" />
              }
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: '请确认新密码' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<Icon icon="mdi:lock-outline" />}
              placeholder="确认新密码"
              size="large"
              iconRender={visible =>
                visible ? <Icon icon="mdi:eye-outline" /> : <Icon icon="mdi:eye-off-outline" />
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
              确认修改
            </Button>
          </Form.Item>

          <div className={styles.registerLink}>
            <a href="/auth/login">返回登录</a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ChangePasswordPage;
