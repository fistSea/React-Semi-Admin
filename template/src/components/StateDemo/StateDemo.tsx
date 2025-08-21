// 状态管理演示组件
import React from "react";
import {
  Card,
  Button,
  Space,
  Typography,
  Avatar,
  Tag,
  Row,
  Col,
  Input,
  Divider,
} from "@douyinfe/semi-ui";
import {
  IconUser,
  IconMoon,
  IconSun,
  IconBell,
  IconSetting,
  IconEdit,
} from "@douyinfe/semi-icons";
import { useUser, useUI, useApp, useTheme } from "@/contexts/AppContext";

const { Title, Text, Paragraph } = Typography;

const StateDemo: React.FC = () => {
  const { user, login, logout, updateProfile } = useUser();
  const { isDark, mode, toggleMode } = useTheme();
  const { ui, setLoading, toggleSidebar, addNotification, clearNotifications } =
    useUI();
  const { app, setTitle } = useApp();

  // 用于强制重新渲染localStorage显示
  const [storageRefresh, setStorageRefresh] = React.useState(0);

  // 监听主题变化来刷新localStorage显示
  React.useEffect(() => {
    setStorageRefresh((prev) => prev + 1);
  }, [isDark]);

  // 模拟登录
  const handleLogin = () => {
    login({
      id: "1",
      name: "张三",
      email: "zhangsan@example.com",
      role: "admin",
    });
    addNotification({
      type: "success",
      title: "登录成功",
      message: "欢迎回来！",
    });
  };

  // 模拟登出
  const handleLogout = () => {
    logout();
    addNotification({
      type: "info",
      title: "已退出登录",
      message: "感谢使用，再见！",
    });
  };

  // 模拟加载
  const handleLoading = async () => {
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    addNotification({
      type: "success",
      title: "加载完成",
      message: "数据加载成功！",
    });
  };

  // 更新用户名
  const handleUpdateName = () => {
    const newName = prompt("请输入新用户名:", user.name);
    if (newName) {
      updateProfile({ name: newName });
      addNotification({
        type: "success",
        title: "更新成功",
        message: `用户名已更新为: ${newName}`,
      });
    }
  };

  return (
    <div style={{ padding: "24px" }}>
      <Title heading={2}>Context + useReducer 状态管理演示</Title>
      <Paragraph>
        这个演示展示了如何使用React内置的Context
        API和useReducer来实现全局状态管理。
      </Paragraph>

      <Row gutter={24}>
        {/* 用户状态 */}
        <Col span={12}>
          <Card title="👤 用户状态管理" style={{ marginBottom: 16 }}>
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <Avatar
                size="large"
                src={user.avatar}
                style={{ marginBottom: 8 }}
              >
                {user.name.charAt(0)}
              </Avatar>
              <div>
                <Text strong>{user.name || "未登录"}</Text>
                <br />
                <Text type="secondary">{user.email}</Text>
                <br />
                <Tag color={user.isLoggedIn ? "green" : "grey"}>
                  {user.isLoggedIn ? `${user.role}` : "游客"}
                </Tag>
              </div>
            </div>

            <Space wrap style={{ width: "100%", justifyContent: "center" }}>
              {!user.isLoggedIn ? (
                <Button theme="solid" onClick={handleLogin} icon={<IconUser />}>
                  模拟登录
                </Button>
              ) : (
                <>
                  <Button onClick={handleUpdateName} icon={<IconEdit />}>
                    修改用户名
                  </Button>
                  <Button onClick={handleLogout} icon={<IconUser />}>
                    退出登录
                  </Button>
                </>
              )}
            </Space>
          </Card>
        </Col>

        {/* 主题状态 - 使用Semi UI官方方式 */}
        <Col span={12}>
          <Card title="🎨 主题切换 (Semi UI)" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <div style={{ marginBottom: 12 }}>
                <Text>当前主题: </Text>
                <Tag color={mode === "light" ? "orange" : "blue"}>
                  {mode === "light" ? "浅色模式" : "深色模式"}
                </Tag>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text>状态: </Text>
                <Tag color={isDark ? "purple" : "green"}>
                  {isDark ? "已启用深色模式" : "使用浅色模式"}
                </Tag>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text>本地存储: </Text>
                <Tag color="cyan" key={storageRefresh}>
                  {localStorage.getItem("semi-theme-mode") || "light"}
                </Tag>
              </div>

              <div style={{ marginBottom: 12 }}>
                <Text>实现方式: </Text>
                <Tag color="lime">body[theme-mode='dark'] + localStorage</Tag>
              </div>
            </div>

            <Space wrap>
              <Button
                onClick={toggleMode}
                icon={isDark ? <IconSun /> : <IconMoon />}
                theme="solid"
              >
                {isDark ? "切换到浅色模式" : "切换到深色模式"}
              </Button>

              <Button
                onClick={() => {
                  localStorage.removeItem("semi-theme-mode");
                  window.location.reload(); // 刷新页面查看默认主题
                }}
                theme="outline"
                type="danger"
              >
                清除本地存储
              </Button>
            </Space>

            <div
              style={{
                marginTop: 16,
                padding: 12,
                background: "var(--semi-color-fill-0)",
                borderRadius: 6,
                fontSize: 12,
                fontFamily: "monospace",
              }}
            >
              实现代码（含本地存储）：
              <br />
              {`// 切换主题
const toggleMode = () => {
  const newIsDark = !isDark;
  const body = document.body;
  
  if (newIsDark) {
    body.setAttribute('theme-mode', 'dark');
    localStorage.setItem('semi-theme-mode', 'dark');
  } else {
    body.removeAttribute('theme-mode');
    localStorage.setItem('semi-theme-mode', 'light');
  }
};

// 初始化主题
const savedTheme = localStorage.getItem('semi-theme-mode');
if (savedTheme === 'dark') {
  document.body.setAttribute('theme-mode', 'dark');
}`}
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24}>
        {/* UI状态 */}
        <Col span={12}>
          <Card title="🖥️ UI状态管理" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Text>加载状态: </Text>
              <Tag color={ui.loading ? "orange" : "green"}>
                {ui.loading ? "加载中..." : "空闲"}
              </Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text>侧边栏: </Text>
              <Tag color={ui.sidebarCollapsed ? "red" : "blue"}>
                {ui.sidebarCollapsed ? "已收起" : "已展开"}
              </Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text>通知数量: </Text>
              <Tag>{ui.notifications.length}</Tag>
            </div>

            <Space wrap>
              <Button
                onClick={handleLoading}
                loading={ui.loading}
                icon={<IconSetting />}
              >
                模拟加载
              </Button>

              <Button onClick={toggleSidebar}>切换侧边栏</Button>

              <Button
                onClick={() =>
                  addNotification({
                    type: "info",
                    title: "测试通知",
                    message: `这是第${ui.notifications.length + 1}条通知`,
                  })
                }
                icon={<IconBell />}
              >
                添加通知
              </Button>

              {ui.notifications.length > 0 && (
                <Button onClick={clearNotifications}>清空通知</Button>
              )}
            </Space>
          </Card>
        </Col>

        {/* 应用状态 */}
        <Col span={12}>
          <Card title="📱 应用状态管理" style={{ marginBottom: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <Text>应用标题: </Text>
              <Tag>{app.title}</Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text>版本: </Text>
              <Tag>v{app.version}</Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text>网络状态: </Text>
              <Tag color={app.isOnline ? "green" : "red"}>
                {app.isOnline ? "在线" : "离线"}
              </Tag>
            </div>

            <Space wrap>
              <Input
                placeholder="输入新标题"
                addonAfter={
                  <Button
                    onClick={(e) => {
                      const input = (
                        e.target as HTMLElement
                      ).parentElement?.parentElement?.querySelector("input");
                      if (input?.value) {
                        setTitle(input.value);
                        input.value = "";
                      }
                    }}
                  >
                    更新标题
                  </Button>
                }
              />
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 状态总览 */}
      <Card title="📊 完整状态数据" style={{ marginTop: 16 }}>
        <Paragraph>
          <strong>当前状态预览:</strong>
        </Paragraph>
        <div
          style={{
            background: "var(--semi-color-fill-0)",
            padding: 16,
            borderRadius: 6,
            fontSize: 12,
            fontFamily: "monospace",
            whiteSpace: "pre-wrap",
            maxHeight: 300,
            overflow: "auto",
          }}
        >
          {JSON.stringify(
            {
              user: {
                name: user.name,
                email: user.email,
                isLoggedIn: user.isLoggedIn,
                role: user.role,
              },
              theme: {
                isDark: isDark,
                mode: mode,
              },
              ui: {
                loading: ui.loading,
                sidebarCollapsed: ui.sidebarCollapsed,
                notificationCount: ui.notifications.length,
              },
              app: app,
            },
            null,
            2
          )}
        </div>
      </Card>

      <Divider />

      <Card title="💡 使用说明">
        <Title heading={4}>在组件中使用状态:</Title>
        <div
          style={{
            background: "var(--semi-color-fill-0)",
            padding: 16,
            borderRadius: 6,
            fontFamily: "monospace",
            fontSize: 12,
          }}
        >
          {`// 导入Hook
import { useUser, useTheme, useUI } from '@/contexts/AppContext';

// 在组件中使用
function MyComponent() {
  const { user, login, logout } = useUser();
  const { isDark, mode, toggleMode } = useTheme();
  const { ui, setLoading } = useUI();
  
  return (
    <div>
      <p>用户: {user.name}</p>
      <p>主题模式: {mode}</p>
      <p>是否深色: {isDark ? '是' : '否'}</p>
      <button onClick={login}>登录</button>
      <button onClick={toggleMode}>切换主题</button>
    </div>
  );
}`}
        </div>
      </Card>
    </div>
  );
};

export default StateDemo;
