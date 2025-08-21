import React from "react";
import { Nav, Avatar, Dropdown, Button, Space } from "@douyinfe/semi-ui";
import { IconSemiLogo, IconMoon, IconSun } from "@douyinfe/semi-icons";
import { useNavigate, useLocation } from "react-router-dom";
import { routeConfig, getAccessibleNavItems } from "@/config/routes";
import { useUser, useApp, useTheme } from "@/contexts/AppContext";
import styles from "./Layout.module.scss";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useUser();
  const { app } = useApp();
  const { isDark, toggleMode } = useTheme();

  // 从配置中获取有权限的导航菜单项
  const navItems = getAccessibleNavItems(
    routeConfig,
    user.role,
    user.isLoggedIn
  );

  // 处理导航点击事件
  const handleNavSelect = (data: {
    itemKey?: string | number;
    selectedKeys?: (string | number)[];
  }) => {
    const selectedKey = data.itemKey;

    if (!selectedKey || typeof selectedKey !== "string") return;

    // 递归查找路径
    const findPath = (
      items: typeof routeConfig,
      key: string
    ): string | null => {
      for (const item of items) {
        if (item.itemKey === key && item.path) {
          return item.path;
        }
        if (item.items) {
          const found = findPath(item.items, key);
          if (found) return found;
        }
      }
      return null;
    };

    const path = findPath(routeConfig, selectedKey);
    if (path) {
      navigate(path);
    }
  };

  // 获取当前选中的key
  const getCurrentSelectedKey = (): string => {
    const findKeyByPath = (
      items: typeof routeConfig,
      path: string
    ): string | null => {
      for (const item of items) {
        if (item.path === path) {
          return item.itemKey;
        }
        if (item.items) {
          const found = findKeyByPath(item.items, path);
          if (found) return found;
        }
      }
      return null;
    };

    return findKeyByPath(routeConfig, location.pathname) || "home";
  };

  return (
    <div className={styles.frame}>
      {/* 顶部导航栏 - 参考Semi运营后台样例 */}
      <Nav
        mode="horizontal"
        items={navItems}
        onSelect={handleNavSelect}
        selectedKeys={[getCurrentSelectedKey()]}
        header={{
          logo: <IconSemiLogo style={{ height: "36px", fontSize: 36 }} />,
          text: app.title,
        }}
        footer={
          <Space>
            {/* 主题切换按钮 */}
            <Button
              theme="borderless"
              icon={isDark ? <IconSun /> : <IconMoon />}
              onClick={toggleMode}
              style={{
                color: "var(--semi-color-text-0)",
                fontSize: "18px",
              }}
            />

            {/* 用户下拉菜单 */}
            <Dropdown
              trigger="click"
              position="bottomRight"
              content={
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => navigate("/profile")}>
                    个人资料
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate("/settings")}>
                    设置
                  </Dropdown.Item>
                  <Dropdown.Item onClick={logout}>退出登录</Dropdown.Item>
                </Dropdown.Menu>
              }
            >
              <div
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "var(--semi-color-fill-0)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                }}
              >
                <Avatar size="small" color="light-blue" src={user.avatar}>
                  {user.name.charAt(0) || "G"}
                </Avatar>
                <span
                  style={{
                    color: "var(--semi-color-text-0)",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                >
                  {user.name || "游客"}
                </span>
              </div>
            </Dropdown>
          </Space>
        }
        className={styles.topNav}
      />

      {/* 内容区域 */}
      <div className={styles.contentArea}>{children}</div>
    </div>
  );
};

export default Layout;
