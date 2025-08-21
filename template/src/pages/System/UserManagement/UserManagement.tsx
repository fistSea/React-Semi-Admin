import React from "react";
import {
  Card,
  Typography,
  Table,
  Button,
  Space,
  Avatar,
  Tag,
} from "@douyinfe/semi-ui";
import { IconUser, IconEdit, IconDelete } from "@douyinfe/semi-icons";

const { Title, Text } = Typography;

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

const UserManagement: React.FC = () => {
  // 模拟用户数据
  const users: User[] = [
    {
      id: "1",
      name: "张三",
      email: "zhangsan@example.com",
      role: "admin",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=zhangsan",
    },
    {
      id: "2",
      name: "李四",
      email: "lisi@example.com",
      role: "user",
      status: "active",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=lisi",
    },
    {
      id: "3",
      name: "王五",
      email: "wangwu@example.com",
      role: "user",
      status: "inactive",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=wangwu",
    },
  ];

  const columns = [
    {
      title: "用户",
      dataIndex: "name",
      key: "name",
      render: (_: any, record: User) => (
        <Space>
          <Avatar size="small" src={record.avatar}>
            {record.name.charAt(0)}
          </Avatar>
          <div>
            <Text strong>{record.name}</Text>
            <br />
            <Text type="tertiary" size="small">
              {record.email}
            </Text>
          </div>
        </Space>
      ),
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "grey"}>
          {status === "active" ? "激活" : "未激活"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: () => (
        <Space>
          <Button icon={<IconEdit />} size="small" theme="borderless">
            编辑
          </Button>
          <Button
            icon={<IconDelete />}
            size="small"
            theme="borderless"
            type="danger"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <div style={{ marginBottom: "24px" }}>
          <Title
            heading={3}
            style={{ margin: 0, display: "flex", alignItems: "center" }}
          >
            <IconUser style={{ marginRight: "8px" }} />
            用户管理
          </Title>
          <Text type="tertiary">管理系统用户账号和权限</Text>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Space>
            <Button type="primary">添加用户</Button>
            <Button>批量导入</Button>
            <Button>导出数据</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="id"
          pagination={{
            pageSize: 10,
            total: users.length,
            showSizeChanger: true,
            showQuickJumper: true,
          }}
        />
      </Card>
    </div>
  );
};

export default UserManagement;
