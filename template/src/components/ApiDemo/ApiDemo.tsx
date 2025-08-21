import React, { useState } from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Form,
  Toast,
  Upload,
  Divider,
  Table,
  Tag,
  Row,
  Col,
  Badge,
  Timeline,
  Progress,
} from "@douyinfe/semi-ui";
import {
  IconUpload,
  IconDownload,
  IconRefresh,
  IconUser,
  IconServer,
  IconFile,
  IconSend,
  IconPlay,
  IconTickCircle,
  IconAlertTriangle,
} from "@douyinfe/semi-icons";
import { UserService, SystemService, FileService } from "@/services/api";

const { Title, Paragraph, Text } = Typography;

/**
 * API接口演示组件
 */
const ApiDemo: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [apiCalls, setApiCalls] = useState<
    Array<{
      time: string;
      api: string;
      status: "success" | "error" | "loading";
      message: string;
    }>
  >([]);

  // 添加API调用记录
  const addApiCall = (
    api: string,
    status: "success" | "error" | "loading",
    message: string
  ) => {
    const newCall = {
      time: new Date().toLocaleTimeString(),
      api,
      status,
      message,
    };
    setApiCalls((prev) => [newCall, ...prev.slice(0, 9)]); // 保留最近10条记录
  };

  // 模拟登录
  const handleLogin = async () => {
    setLoading(true);
    addApiCall("UserService.login", "loading", "正在登录...");
    try {
      const response = await UserService.login({
        email: "demo@example.com",
        password: "123456",
      });
      Toast.success("登录成功！");
      addApiCall("UserService.login", "success", "登录成功");
      console.log("登录响应:", response);
    } catch (error) {
      addApiCall("UserService.login", "error", "登录失败");
      console.error("登录失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取用户信息
  const handleGetProfile = async () => {
    setLoading(true);
    addApiCall("UserService.getCurrentUser", "loading", "正在获取用户信息...");
    try {
      const response = await UserService.getCurrentUser();
      Toast.success("获取用户信息成功！");
      addApiCall("UserService.getCurrentUser", "success", "获取用户信息成功");
      console.log("用户信息:", response);
    } catch (error) {
      addApiCall("UserService.getCurrentUser", "error", "获取用户信息失败");
      console.error("获取用户信息失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 获取统计数据
  const handleGetStats = async () => {
    setLoading(true);
    addApiCall("SystemService.getStatistics", "loading", "正在获取统计数据...");
    try {
      const response = await SystemService.getStatistics();
      setStats(response.data || {});
      Toast.success("获取统计数据成功！");
      addApiCall("SystemService.getStatistics", "success", "获取统计数据成功");
    } catch (error) {
      addApiCall("SystemService.getStatistics", "error", "获取统计数据失败");
      console.error("获取统计数据失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 健康检查
  const handleHealthCheck = async () => {
    setLoading(true);
    addApiCall("SystemService.healthCheck", "loading", "正在进行健康检查...");
    try {
      const response = await SystemService.healthCheck();
      Toast.success(`系统状态: ${response.data?.status || "正常"}`);
      addApiCall("SystemService.healthCheck", "success", `系统状态正常`);
    } catch (error) {
      addApiCall("SystemService.healthCheck", "error", "健康检查失败");
      console.error("健康检查失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 文件上传
  const handleFileUpload = async (fileList: any[]) => {
    if (fileList.length === 0) return;

    const file = fileList[0].fileInstance;
    setLoading(true);
    addApiCall("FileService.uploadFile", "loading", "正在上传文件...");
    try {
      const response = await FileService.uploadFile(file);
      Toast.success(`文件上传成功！URL: ${response.data?.url}`);
      addApiCall(
        "FileService.uploadFile",
        "success",
        `文件上传成功: ${file.name}`
      );
    } catch (error) {
      addApiCall("FileService.uploadFile", "error", "文件上传失败");
      console.error("文件上传失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 发送反馈
  const handleSendFeedback = async (values: Record<string, any>) => {
    setLoading(true);
    addApiCall("SystemService.sendFeedback", "loading", "正在发送反馈...");
    try {
      await SystemService.sendFeedback({
        type: "general",
        title: values.title,
        content: values.content,
        email: values.email,
      });
      Toast.success("反馈发送成功！");
      addApiCall("SystemService.sendFeedback", "success", "反馈发送成功");
    } catch (error) {
      addApiCall("SystemService.sendFeedback", "error", "发送反馈失败");
      console.error("发送反馈失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // 表格列定义
  const columns = [
    {
      title: "统计项",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "数值",
      dataIndex: "value",
      key: "value",
      render: (value: number) => (
        <Tag color="blue" size="large">
          {value.toLocaleString()}
        </Tag>
      ),
    },
  ];

  // 统计数据转换为表格数据
  const statsData = Object.entries(stats).map(([key, value]) => ({
    key,
    value,
  }));

  return (
    <div
      style={{
        padding: "24px",
        background: "var(--semi-color-bg-0)",
        minHeight: "100vh",
      }}
    >
      {/* 头部信息 */}
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title
          heading={1}
          style={{ margin: "0 0 16px 0", color: "var(--semi-color-text-0)" }}
        >
          🚀 接口封装演示
        </Title>
        <Paragraph
          style={{
            fontSize: "16px",
            color: "var(--semi-color-text-1)",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          体验完整的HTTP请求封装功能，包含拦截器、重试机制、错误处理、文件上传下载等现代前端开发必备功能
        </Paragraph>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧功能区 */}
        <Col span={16}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "24px" }}
          >
            {/* 用户相关接口 */}
            <Card
              title={
                <Space>
                  <IconUser style={{ color: "var(--semi-color-primary)" }} />
                  <Text strong>用户接口演示</Text>
                </Space>
              }
              style={{ width: "100%" }}
              bodyStyle={{ padding: "24px" }}
            >
              <Space wrap>
                <Button
                  theme="solid"
                  type="primary"
                  icon={<IconPlay />}
                  onClick={handleLogin}
                  loading={loading}
                  size="large"
                >
                  模拟登录
                </Button>
                <Button
                  theme="outline"
                  icon={<IconUser />}
                  onClick={handleGetProfile}
                  loading={loading}
                  size="large"
                >
                  获取用户信息
                </Button>
              </Space>
            </Card>

            {/* 系统接口 */}
            <Card
              title={
                <Space>
                  <IconServer style={{ color: "var(--semi-color-success)" }} />
                  <Text strong>系统接口演示</Text>
                </Space>
              }
              style={{ width: "100%" }}
              bodyStyle={{ padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <Space wrap>
                  <Button
                    theme="solid"
                    type="secondary"
                    icon={<IconRefresh />}
                    onClick={handleGetStats}
                    loading={loading}
                    size="large"
                  >
                    获取统计数据
                  </Button>
                  <Button
                    theme="outline"
                    icon={<IconServer />}
                    onClick={handleHealthCheck}
                    loading={loading}
                    size="large"
                  >
                    健康检查
                  </Button>
                </Space>

                {/* 统计数据表格 */}
                {statsData.length > 0 && (
                  <div
                    style={{
                      background: "var(--semi-color-bg-1)",
                      padding: "16px",
                      borderRadius: "8px",
                      border: "1px solid var(--semi-color-border)",
                    }}
                  >
                    <div style={{ marginBottom: "12px" }}>
                      <Text strong style={{ fontSize: "16px" }}>
                        📊 统计数据
                      </Text>
                    </div>
                    <Table
                      columns={columns}
                      dataSource={statsData}
                      pagination={false}
                      size="small"
                    />
                  </div>
                )}
              </div>
            </Card>

            {/* 文件上传 */}
            <Card
              title={
                <Space>
                  <IconFile style={{ color: "var(--semi-color-warning)" }} />
                  <Text strong>文件服务演示</Text>
                </Space>
              }
              style={{ width: "100%" }}
              bodyStyle={{ padding: "24px" }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "20px",
                }}
              >
                <div
                  style={{
                    background: "var(--semi-color-fill-0)",
                    padding: "20px",
                    borderRadius: "8px",
                    border: "2px dashed var(--semi-color-border)",
                    textAlign: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: "14px",
                      color: "var(--semi-color-text-1)",
                      display: "block",
                      marginBottom: "16px",
                    }}
                  >
                    📁 支持图片、文档、视频格式
                  </Text>
                  <Upload
                    action=""
                    accept="image/*,.pdf,.doc,.docx"
                    limit={1}
                    onFileChange={handleFileUpload}
                    disabled={loading}
                  >
                    <Button
                      icon={<IconUpload />}
                      theme="solid"
                      type="tertiary"
                      disabled={loading}
                      size="large"
                    >
                      选择文件上传
                    </Button>
                  </Upload>
                </div>

                <Space wrap>
                  <Button
                    icon={<IconDownload />}
                    theme="outline"
                    size="large"
                    onClick={() => {
                      addApiCall(
                        "FileService.downloadFile",
                        "success",
                        "下载示例文件"
                      );
                      FileService.downloadFile(
                        "/demo/sample.pdf",
                        "示例文档.pdf"
                      );
                    }}
                  >
                    下载示例文件
                  </Button>
                </Space>
              </div>
            </Card>

            {/* 反馈表单 */}
            <Card
              title={
                <Space>
                  <IconSend style={{ color: "var(--semi-color-tertiary)" }} />
                  <Text strong>反馈接口演示</Text>
                </Space>
              }
              style={{ width: "100%" }}
              bodyStyle={{ padding: "24px" }}
            >
              <Form onSubmit={handleSendFeedback} style={{ width: "100%" }}>
                <Form.Input
                  field="title"
                  label="反馈标题"
                  placeholder="请输入反馈标题"
                  rules={[{ required: true, message: "请输入反馈标题" }]}
                  size="large"
                />
                <Form.TextArea
                  field="content"
                  label="反馈内容"
                  placeholder="请详细描述您的反馈内容"
                  rows={4}
                  rules={[{ required: true, message: "请输入反馈内容" }]}
                />
                <Form.Input
                  field="email"
                  label="联系邮箱"
                  placeholder="请输入您的邮箱地址"
                  type="email"
                  size="large"
                />
                <Button
                  htmlType="submit"
                  theme="solid"
                  type="primary"
                  icon={<IconSend />}
                  loading={loading}
                  size="large"
                  style={{ marginTop: "16px" }}
                >
                  发送反馈
                </Button>
              </Form>
            </Card>
          </div>
        </Col>

        {/* 右侧API调用记录 */}
        <Col span={8}>
          <Card
            title={
              <Space>
                <IconServer style={{ color: "var(--semi-color-info)" }} />
                <Text strong>API调用记录</Text>
                <Badge count={apiCalls.length} overflowCount={99} />
              </Space>
            }
            style={{ width: "100%", position: "sticky", top: "24px" }}
            bodyStyle={{
              padding: "16px",
              maxHeight: "600px",
              overflow: "auto",
            }}
          >
            {apiCalls.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px" }}>
                <IconAlertTriangle
                  size="large"
                  style={{ color: "var(--semi-color-text-2)" }}
                />
                <Text
                  style={{
                    display: "block",
                    marginTop: "12px",
                    color: "var(--semi-color-text-2)",
                  }}
                >
                  暂无API调用记录
                </Text>
                <Text
                  style={{
                    display: "block",
                    marginTop: "8px",
                    color: "var(--semi-color-text-3)",
                    fontSize: "12px",
                  }}
                >
                  点击上方按钮开始体验
                </Text>
              </div>
            ) : (
              <Timeline>
                {apiCalls.map((call, index) => (
                  <Timeline.Item
                    key={index}
                    time={call.time}
                    dot={
                      call.status === "success" ? (
                        <IconTickCircle
                          style={{ color: "var(--semi-color-success)" }}
                        />
                      ) : call.status === "error" ? (
                        <IconAlertTriangle
                          style={{ color: "var(--semi-color-danger)" }}
                        />
                      ) : (
                        <Progress
                          type="circle"
                          size="small"
                          percent={50}
                          showInfo={false}
                        />
                      )
                    }
                  >
                    <div>
                      <Text strong style={{ fontSize: "13px" }}>
                        {call.api}
                      </Text>
                      <br />
                      <Text
                        style={{
                          fontSize: "12px",
                          color:
                            call.status === "success"
                              ? "var(--semi-color-success)"
                              : call.status === "error"
                              ? "var(--semi-color-danger)"
                              : "var(--semi-color-warning)",
                        }}
                      >
                        {call.message}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            )}
          </Card>
        </Col>
      </Row>

      {/* 接口特性说明 */}
      <Card
        title={
          <Space>
            <IconTickCircle style={{ color: "var(--semi-color-success)" }} />
            <Text strong>接口封装特性</Text>
          </Space>
        }
        style={{ width: "100%", marginTop: "32px" }}
        bodyStyle={{ padding: "24px" }}
      >
        <Row gutter={[24, 16]}>
          <Col span={12}>
            <div style={{ marginBottom: "16px" }}>
              <Text
                strong
                style={{ fontSize: "16px", color: "var(--semi-color-text-0)" }}
              >
                🚀 核心功能特性
              </Text>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Tag color="blue" size="large">
                🔄 自动重试机制
              </Tag>
              <Tag color="green" size="large">
                ⏱️ 请求超时控制
              </Tag>
              <Tag color="orange" size="large">
                🔐 Token自动添加
              </Tag>
              <Tag color="red" size="large">
                🚨 错误统一处理
              </Tag>
              <Tag color="purple" size="large">
                ⌛ 加载状态管理
              </Tag>
            </div>
          </Col>
          <Col span={12}>
            <div style={{ marginBottom: "16px" }}>
              <Text
                strong
                style={{ fontSize: "16px", color: "var(--semi-color-text-0)" }}
              >
                ⚡ 高级功能特性
              </Text>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "8px" }}
            >
              <Tag color="cyan" size="large">
                🔌 拦截器支持
              </Tag>
              <Tag color="lime" size="large">
                📁 文件上传下载
              </Tag>
              <Tag color="indigo" size="large">
                📊 业务错误码处理
              </Tag>
              <Tag color="pink" size="large">
                🏗️ TypeScript支持
              </Tag>
              <Tag color="teal" size="large">
                🎯 服务层封装
              </Tag>
            </div>
          </Col>
        </Row>

        <Divider margin="24px" />

        <div
          style={{
            background:
              "linear-gradient(135deg, var(--semi-color-primary-light-default) 0%, var(--semi-color-secondary-light-default) 100%)",
            padding: "20px",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <Text
            strong
            style={{ fontSize: "18px", color: "var(--semi-color-primary)" }}
          >
            💡 这是一个生产级的HTTP请求封装方案
          </Text>
          <br />
          <Text
            style={{
              fontSize: "14px",
              color: "var(--semi-color-text-1)",
              marginTop: "8px",
            }}
          >
            集成了现代前端开发中必备的所有网络请求处理功能，开箱即用
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default ApiDemo;
