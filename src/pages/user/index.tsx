import { useState, useEffect } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  Spin,
  Avatar,
  Modal,
  Divider,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  EditOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import useAuthStore from "../../store/auth";
import { userApi } from "../../service/api/user";
import { authApi } from "../../service/api/auth";
import { useNavigate } from "react-router";

const UserPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const { username, email, bio, useDay, setAuth, resetAuth } = useAuthStore();
  const navigate = useNavigate();

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
        avatar: "",
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

  const handleDeleteAccount = () => {
    setDeleteModalVisible(true);
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword) {
      message.error("请输入密码");
      return;
    }
    
    setLoading(true);
    try {
      await authApi.deleteAccount({ password: deletePassword });
      resetAuth();
      localStorage.removeItem("user_token");
      message.success("账号已成功删除");
      setDeleteModalVisible(false);
      navigate("/auth/login");
    } catch (error) {
      message.error("删除账号失败，请检查密码是否正确");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cancelDeleteAccount = () => {
    setDeleteModalVisible(false);
    setDeletePassword("");
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        <UserOutlined className="mr-2" />
        用户中心
      </h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Card
          title={
            <span className="text-xl font-semibold text-gray-700">
              个人信息
            </span>
          }
          className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-300"
          bordered={false}
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <Spin spinning={loading}>
            <div className="flex flex-col items-center mb-6">
              <Avatar
                size={110}
                icon={<UserOutlined />}
                className="mb-5 bg-blue-500 shadow-md hover:scale-105 transition-all duration-300"
              />
              <p className="text-center text-xl font-medium mb-2">{username}</p>
              <p className="text-center text-gray-500 mb-3">{email}</p>

              <div className="bg-blue-50 rounded-lg px-6 py-3 mb-5 w-full text-center">
                <p className="text-blue-700 font-medium">
                  已使用天数: <span className="text-lg">{useDay}</span> 天
                </p>
              </div>

              <Divider className="my-4">个人简介</Divider>

              <div className="bg-gray-50 rounded-lg p-4 mb-6 w-full">
                <p className="text-center text-gray-700 italic">
                  {bio || "这个人很懒，还没有填写个人简介"}
                </p>
              </div>

              <Button
                type="primary"
                danger
                icon={<DeleteOutlined />}
                onClick={handleDeleteAccount}
                size="large"
                className="hover:opacity-90 transition-opacity"
              >
                删除账号
              </Button>
            </div>
          </Spin>
        </Card>

        <Card
          title={
            <span className="text-xl font-semibold text-gray-700">
              <EditOutlined className="mr-2" />
              编辑个人信息
            </span>
          }
          className="flex-1 shadow-md hover:shadow-lg transition-shadow duration-300"
          bordered={false}
          style={{ borderRadius: "12px", overflow: "hidden" }}
        >
          <Spin spinning={loading}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{ username, bio }}
              className="p-2"
            >
              <Form.Item
                name="username"
                label={
                  <span className="text-gray-700 font-medium">用户名</span>
                }
                rules={[{ required: true, message: "请输入用户名" }]}
              >
                <Input
                  placeholder="请输入新的用户名"
                  size="large"
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item
                name="bio"
                label={
                  <span className="text-gray-700 font-medium">个人简介</span>
                }
              >
                <Input.TextArea
                  placeholder="介绍一下自己吧"
                  rows={5}
                  maxLength={200}
                  showCount
                  className="rounded-lg"
                />
              </Form.Item>

              <Form.Item className="mt-6">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  size="large"
                  icon={<SaveOutlined />}
                  className="rounded-lg h-12 font-medium text-base hover:opacity-90 transition-opacity"
                >
                  保存修改
                </Button>
              </Form.Item>
            </Form>
          </Spin>
        </Card>
      </div>

      <Modal
        title={<span className="text-red-500 font-bold">删除账号确认</span>}
        open={deleteModalVisible}
        onOk={confirmDeleteAccount}
        onCancel={cancelDeleteAccount}
        okText="确认删除"
        cancelText="取消"
        okButtonProps={{ danger: true }}
        centered
        className="user-delete-modal"
      >
        <div className="py-4">
          <p className="text-lg mb-4">
            警告：删除账号是不可逆操作，所有数据将被永久删除！请谨慎操作。
          </p>
          <p className="mb-4">请输入您的密码以确认删除账号：</p>
          <Input.Password
            placeholder="请输入密码"
            value={deletePassword}
            onChange={(e) => setDeletePassword(e.target.value)}
            className="w-full"
          />
        </div>
      </Modal>
    </div>
  );
};

export default UserPage;
