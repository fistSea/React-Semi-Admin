import React from "react";
import {
  Card,
  Typography,
  Row,
  Col,
  Button,
  Space,
  Tag,
} from "@douyinfe/semi-ui";
import {
  IconHeartStroked,
  IconStar,
  IconThumbUpStroked,
} from "@douyinfe/semi-icons";
import "./Home.css";
import PermissionTest from "@/components/PermissionTest/PermissionTest";

const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const features = [
    {
      title: "现代化设计",
      description: "基于Semi UI设计系统，提供一致的用户体验",
      icon: <IconHeartStroked style={{ color: "#f53f3f" }} />,
    },
    {
      title: "高性能",
      description: "使用React 18和Vite构建，快速的开发和构建体验",
      icon: <IconStar style={{ color: "#ff7d00" }} />,
    },
    {
      title: "类型安全",
      description: "完整的TypeScript支持，提供更好的开发体验",
      icon: <IconThumbUpStroked style={{ color: "#00bc79" }} />,
    },
  ];

  return (
    <div className="home">
      <div className="hero-section">
        <Card className="hero-card">
          <div className="hero-content">
            <Title heading={1}>欢迎使用 Semi UI React 应用</Title>
            <Paragraph
              style={{ marginTop: 16, marginBottom: 24, fontSize: "16px" }}
            >
              这是一个基于抖音Semi UI框架构建的现代化React应用模板，
              集成了路由、状态管理、类型检查等常用功能。
            </Paragraph>
            <Space>
              <PermissionTest />
            </Space>
            <div style={{ marginTop: 16 }}>
              <Space>
                <Tag color="blue">React 18</Tag>
                <Tag color="green">TypeScript</Tag>
                <Tag color="orange">Semi UI</Tag>
                <Tag color="purple">Vite</Tag>
              </Space>
            </div>
          </div>
        </Card>
      </div>

      <div className="features-section">
        <Title heading={2} style={{ textAlign: "center", marginBottom: 32 }}>
          核心特性
        </Title>
        <Row gutter={24}>
          {features.map((feature, index) => (
            <Col span={8} key={index}>
              <Card className="feature-card" bodyStyle={{ padding: 24 }}>
                <div className="feature-icon">{feature.icon}</div>
                <Title heading={4} style={{ marginTop: 16, marginBottom: 12 }}>
                  {feature.title}
                </Title>
                <Paragraph type="secondary">{feature.description}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* 添加更多内容来测试滚动 */}
      <div style={{ marginTop: 48 }}>
        <Title heading={2} style={{ textAlign: "center", marginBottom: 32 }}>
          技术栈介绍
        </Title>
        <Row gutter={24}>
          <Col span={12}>
            <Card title="前端技术" style={{ marginBottom: 24 }}>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>React 18 - 现代化的UI库</li>
                <li style={{ marginBottom: 8 }}>
                  TypeScript - 类型安全的JavaScript
                </li>
                <li style={{ marginBottom: 8 }}>Semi UI - 字节跳动设计系统</li>
                <li style={{ marginBottom: 8 }}>React Router - 路由管理</li>
                <li style={{ marginBottom: 8 }}>SCSS - CSS预处理器</li>
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card title="构建工具" style={{ marginBottom: 24 }}>
              <ul style={{ paddingLeft: 20 }}>
                <li style={{ marginBottom: 8 }}>Vite - 快速的构建工具</li>
                <li style={{ marginBottom: 8 }}>ESLint - 代码质量检查</li>
                <li style={{ marginBottom: 8 }}>PNPM - 高效的包管理器</li>
                <li style={{ marginBottom: 8 }}>热重载 - 开发时实时更新</li>
                <li style={{ marginBottom: 8 }}>TypeScript - 编译时类型检查</li>
              </ul>
            </Card>
          </Col>
        </Row>
      </div>

      <div style={{ marginTop: 32 }}>
        <Card title="快速开始">
          <Paragraph style={{ marginBottom: 16 }}>
            按照以下步骤快速启动项目：
          </Paragraph>
          <div
            style={{
              background: "var(--semi-color-fill-0)",
              padding: 16,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <code>1. 克隆项目: git clone [repository-url]</code>
          </div>
          <div
            style={{
              background: "var(--semi-color-fill-0)",
              padding: 16,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <code>2. 安装依赖: pnpm install</code>
          </div>
          <div
            style={{
              background: "var(--semi-color-fill-0)",
              padding: 16,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <code>3. 启动开发: pnpm dev</code>
          </div>
          <div
            style={{
              background: "var(--semi-color-fill-0)",
              padding: 16,
              borderRadius: 6,
              marginBottom: 16,
            }}
          >
            <code>4. 构建项目: pnpm build</code>
          </div>
        </Card>
      </div>

      <div style={{ marginTop: 32, marginBottom: 32 }}>
        <Card title="更多信息">
          <Row gutter={16}>
            <Col span={8}>
              <div style={{ textAlign: "center", padding: 24 }}>
                <Title
                  heading={3}
                  style={{ color: "var(--semi-color-primary)" }}
                >
                  100+
                </Title>
                <Paragraph>组件数量</Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center", padding: 24 }}>
                <Title
                  heading={3}
                  style={{ color: "var(--semi-color-success)" }}
                >
                  99%
                </Title>
                <Paragraph>TypeScript覆盖率</Paragraph>
              </div>
            </Col>
            <Col span={8}>
              <div style={{ textAlign: "center", padding: 24 }}>
                <Title
                  heading={3}
                  style={{ color: "var(--semi-color-warning)" }}
                >
                  24/7
                </Title>
                <Paragraph>社区支持</Paragraph>
              </div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};

export default Home;
