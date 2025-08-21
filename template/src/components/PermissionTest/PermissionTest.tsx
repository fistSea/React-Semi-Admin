import React from "react";
import {
  Card,
  Button,
  Tag,
  Space,
  Typography,
  Divider,
} from "@douyinfe/semi-ui";
import { useUser } from "@/contexts/AppContext";
import {
  routeConfig,
  getAccessibleNavItems,
  getAccessiblePaths,
} from "@/config/routes";

const { Title, Text } = Typography;

/**
 * 权限测试组件 - 用于演示和测试权限控制功能
 * 可以放在任何页面中使用，比如在About页面展示
 */
const PermissionTest: React.FC = () => {
  const { user, login, logout } = useUser();

  // 获取当前用户可访问的导航项和路径
  const accessibleNavItems = getAccessibleNavItems(
    routeConfig,
    user.role,
    user.isLoggedIn
  );
  const accessiblePaths = getAccessiblePaths(
    routeConfig,
    user.role,
    user.isLoggedIn
  );

  // 模拟登录不同角色的用户
  const loginAsRole = (role: "admin" | "user") => {
    login({
      id: `${role}-001`,
      name: role === "admin" ? "管理员" : "普通用户",
      email: `${role}@example.com`,
      role: role,
    });
  };

  // 切换到游客状态
  const switchToGuest = () => {
    logout();
  };

  // 获取角色标签颜色
  const getRoleTagColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "user":
        return "blue";
      case "guest":
        return "grey";
      default:
        return "grey";
    }
  };

  return (
    <Card title="权限控制测试面板" style={{ margin: "20px 0" }} bordered>
      <div style={{ padding: "16px" }}>
        {/* 当前用户状态 */}
        <div style={{ marginBottom: "24px" }}>
          <Title heading={5}>当前用户状态</Title>
          <Space>
            <Text>用户：{user.name || "未登录"}</Text>
            <Tag color={getRoleTagColor(user.role)} size="large">
              {user.role === "admin"
                ? "管理员"
                : user.role === "user"
                ? "普通用户"
                : "游客"}
            </Tag>
            <Tag color={user.isLoggedIn ? "green" : "orange"}>
              {user.isLoggedIn ? "已登录" : "未登录"}
            </Tag>
          </Space>
        </div>

        <Divider />

        {/* 角色切换 */}
        <div style={{ marginBottom: "24px" }}>
          <Title heading={5}>角色切换（测试用）</Title>
          <Space>
            <Button
              type="primary"
              onClick={() => loginAsRole("admin")}
              disabled={user.role === "admin" && user.isLoggedIn}
            >
              切换为管理员
            </Button>
            <Button
              type="secondary"
              onClick={() => loginAsRole("user")}
              disabled={user.role === "user" && user.isLoggedIn}
            >
              切换为普通用户
            </Button>
            <Button
              type="tertiary"
              onClick={switchToGuest}
              disabled={!user.isLoggedIn}
            >
              切换为游客
            </Button>
          </Space>
        </div>

        <Divider />

        {/* 可访问的路径 */}
        <div style={{ marginBottom: "24px" }}>
          <Title heading={5}>当前可访问的页面路径</Title>
          <div
            style={{
              background: "var(--semi-color-fill-0)",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "8px",
            }}
          >
            {accessiblePaths.length > 0 ? (
              <Space wrap>
                {accessiblePaths.map((path) => (
                  <Tag key={path} color="cyan">
                    {path}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="tertiary">无可访问路径</Text>
            )}
          </div>
        </div>

        {/* 可访问的菜单项 */}
        <div>
          <Title heading={5}>当前可见的导航菜单</Title>
          <div
            style={{
              background: "var(--semi-color-fill-0)",
              padding: "12px",
              borderRadius: "6px",
              marginTop: "8px",
            }}
          >
            {accessibleNavItems.length > 0 ? (
              <Space wrap>
                {accessibleNavItems.map((item) => (
                  <Tag key={item.itemKey} color="blue">
                    {item.text}
                  </Tag>
                ))}
              </Space>
            ) : (
              <Text type="tertiary">无可见菜单项</Text>
            )}
          </div>
        </div>

        <Divider />

        {/* 权限说明 */}
        <div>
          <Title heading={5}>权限说明</Title>
          <div style={{ fontSize: "14px", lineHeight: "1.6" }}>
            <Text type="tertiary">
              • <strong>游客</strong>：只能访问首页和关于页面
              <br />• <strong>普通用户</strong>
              ：可以访问首页、关于、状态管理页面
              <br />• <strong>管理员</strong>
              ：可以访问所有页面，包括接口封装功能
              <br />• 切换角色后，导航菜单会实时更新，只显示有权限的菜单项
            </Text>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default PermissionTest;
