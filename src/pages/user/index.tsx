import { useState, useEffect } from "react";
import { Card, Form, Input, Button, Avatar, Upload, message, Spin } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { Icon } from "@iconify-icon/react/dist/iconify.js";
import useAuthStore from "../../store/auth";
import { userApi } from "../../service/api/user";
import { UploadChangeParam } from "antd/lib/upload";
import { UploadFile } from "antd/lib/upload/interface";

const UserPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { username, email, avatar, bio, useDay, setAuth } = useAuthStore();

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    form.setFieldsValue({
      username,
      bio,
    });
  }, [username, bio, form]);

  const fetchUserInfo = async () => {
    setLoading(true);
    try {
      const userInfo = await userApi.getUserInfo();
      setAuth({
        userId: userInfo.userId,
        username: userInfo.username,
        email: userInfo.email,
        avatar: userInfo.avatar,
        bio: userInfo.bio,
        theme: userInfo.theme as "light" | "dark",
        useDay: userInfo.useDay,
      });
    } catch (error) {
      message.error("获取用户信息失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: { username: string; bio: string }) => {
    setLoading(true);
    try {
      await userApi.updateUserInfo({
        username: values.username,
        bio: values.bio,
        avatar, // 使用当前头像
      });
      setAuth({
        username: values.username,
        bio: values.bio,
      });
      message.success("更新信息成功");
    } catch (error) {
      message.error("更新信息失败");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (
    info: UploadChangeParam<UploadFile<any>>
  ) => {
    if (info.file.status === "uploading") {
      setUploading(true);
      return;
    }
    if (info.file.status === "done") {
      setUploading(false);
      // 假设服务器返回的是上传后的图片URL
      const avatarUrl = info.file.response.url;
      try {
        await userApi.updateUserInfo({
          username,
          bio,
          avatar: avatarUrl,
        });
        setAuth({ avatar: avatarUrl });
        message.success("头像更新成功");
      } catch (error) {
        message.error("头像更新失败");
        console.error(error);
      }
    }
  };

  const uploadButton = (
    <div>
      {uploading ? <Spin size="small" /> : <UploadOutlined />}
      <div style={{ marginTop: 8 }}>上传头像</div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">用户中心</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <Card title="个人信息" className="flex-1">
          <Spin spinning={loading}>
            <div className="flex flex-col items-center mb-6">
              <Avatar
                size={100}
                icon={<Icon icon="mdi:account" width="60" height="60" />}
                src={avatar}
                className="mb-3"
              />
              <Upload
                name="avatar"
                action="/api/user/avatar" // 上传头像的API地址
                showUploadList={false}
                onChange={handleAvatarChange}
              >
                <Button icon={<UploadOutlined />}>更换头像</Button>
              </Upload>
            </div>
            <p className="text-center text-lg font-medium mb-1">{username}</p>
            <p className="text-center text-gray-500 mb-4">{email}</p>
            <p className="text-center mb-6">已使用天数: {useDay}天</p>
            <p className="text-center mb-4">
              {bio || "这个人很懒，还没有填写个人简介"}
            </p>
          </Spin>
        </Card>

        <Card title="编辑个人信息" className="flex-1">
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ username, bio }}
            >
              <Form.Item
                name="username"
                label="用户名"
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input placeholder="请输入新的用户名" />
              </Form.Item>

              <Form.Item name="bio" label="个人简介">
                <Input.TextArea
                  placeholder="介绍一下自己吧"
                  rows={4}
                  maxLength={200}
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block>
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>
    </div>
  );
};

export default UserPage;
