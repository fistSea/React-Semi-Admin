import React from "react";
import {
  Card,
  Typography,
  Descriptions,
  Tag,
  Space,
  Button,
} from "@douyinfe/semi-ui";
import { IconGithubLogo, IconMailStroked } from "@douyinfe/semi-icons";
import PermissionTest from "@/components/PermissionTest/PermissionTest";
import "./About.css";

const { Title, Paragraph } = Typography;

const About: React.FC = () => {
  const projectInfo = [
    { key: "项目名称", value: "Semi UI React App" },
    { key: "版本", value: "1.0.0" },
    { key: "构建工具", value: "Vite" },
    { key: "开发语言", value: "TypeScript" },
    { key: "UI框架", value: "Semi UI" },
    { key: "路由", value: "React Router v6" },
  ];

  return (
    <div className="about">
      <Card>
        <Title heading={2}>关于项目</Title>
        <Paragraph style={{ marginTop: 16, marginBottom: 24 }}>
          这是一个基于抖音Semi UI设计系统构建的React应用脚手架，
          提供了完整的开发环境配置和基础组件结构。
        </Paragraph>

        <Title heading={3} style={{ marginTop: 32, marginBottom: 16 }}>
          项目信息
        </Title>
        <Descriptions data={projectInfo} row size="medium" />

        <Title heading={3} style={{ marginTop: 32, marginBottom: 16 }}>
          技术栈
        </Title>
        <Space wrap>
          <Tag size="large" color="blue">
            React 18
          </Tag>
          <Tag size="large" color="green">
            TypeScript
          </Tag>
          <Tag size="large" color="orange">
            Semi UI
          </Tag>
          <Tag size="large" color="purple">
            Vite
          </Tag>
          <Tag size="large" color="cyan">
            React Router
          </Tag>
          <Tag size="large" color="red">
            ESLint
          </Tag>
        </Space>

        <Title heading={3} style={{ marginTop: 32, marginBottom: 16 }}>
          特性说明
        </Title>
        <div className="features-list">
          <Card className="feature-item" bodyStyle={{ padding: 16 }}>
            <h4>🎨 现代化UI设计</h4>
            <p>基于Semi UI设计系统，提供美观一致的用户界面</p>
          </Card>
          <Card className="feature-item" bodyStyle={{ padding: 16 }}>
            <h4>⚡ 快速开发</h4>
            <p>使用Vite构建工具，提供极速的开发和构建体验</p>
          </Card>
          <Card className="feature-item" bodyStyle={{ padding: 16 }}>
            <h4>🔧 完整配置</h4>
            <p>预配置TypeScript、ESLint、路径别名等开发工具</p>
          </Card>
          <Card className="feature-item" bodyStyle={{ padding: 16 }}>
            <h4>📱 响应式设计</h4>
            <p>支持多设备适配，提供良好的移动端体验</p>
          </Card>
        </div>

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Space>
            <Button icon={<IconGithubLogo />} theme="outline">
              GitHub
            </Button>
            <Button icon={<IconMailStroked />} theme="outline">
              联系我们
            </Button>
          </Space>
        </div>
      </Card>

      {/* 权限控制测试面板 */}
      <PermissionTest />
    </div>
  );
};

export default About;
