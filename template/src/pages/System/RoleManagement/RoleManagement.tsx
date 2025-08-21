import React from "react";
import { Card, Typography, Table, Button, Space, Tag } from "@douyinfe/semi-ui";
import { IconShield, IconEdit, IconDelete } from "@douyinfe/semi-icons";

const { Title, Text } = Typography;

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

const RoleManagement: React.FC = () => {
  // 模拟角色数据
  const roles: Role[] = [
    {
      id: "1",
      name: "管理员",
      description: "系统管理员，拥有所有权限",
      permissions: ["用户管理", "角色管理", "系统配置", "数据统计"],
      userCount: 2,
    },
    {
      id: "2",
      name: "普通用户",
      description: "普通用户，基础功能权限",
      permissions: ["个人资料", "基础功能"],
      userCount: 15,
    },
    {
      id: "3",
      name: "观察者",
      description: "只读权限用户",
      permissions: ["查看数据"],
      userCount: 5,
    },
  ];

  const columns = [
    {
      title: "角色名称",
      dataIndex: "name",
      key: "name",
      render: (name: string) => <Text strong>{name}</Text>,
    },
    {
      title: "描述",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "权限",
      dataIndex: "permissions",
      key: "permissions",
      render: (permissions: string[]) => (
        <Space wrap>
          {permissions.map((permission) => (
            <Tag key={permission} size="small" color="cyan">
              {permission}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "用户数量",
      dataIndex: "userCount",
      key: "userCount",
      render: (count: number) => <Text>{count} 人</Text>,
    },
    {
      title: "操作",
      key: "action",
      render: (_: any, record: Role) => (
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
            <IconShield style={{ marginRight: "8px" }} />
            角色管理
          </Title>
          <Text type="tertiary">管理系统角色和权限配置</Text>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <Space>
            <Button type="primary">添加角色</Button>
            <Button>权限配置</Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={roles}
          rowKey="id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default RoleManagement;
