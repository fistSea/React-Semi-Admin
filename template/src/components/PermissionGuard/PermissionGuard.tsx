import React from "react";
import { useLocation } from "react-router-dom";
import { Empty, Button } from "@douyinfe/semi-ui";
import { IconUser, IconShield } from "@douyinfe/semi-icons";
import { useUser } from "@/contexts/AppContext";
import {
  routeConfig,
  isPathAccessible,
  PermissionConfig,
} from "@/config/routes";

interface PermissionGuardProps {
  children: React.ReactNode;
  // 可选：直接指定权限配置，如果不提供则从路由配置中查找
  permission?: PermissionConfig;
  // 可选：当权限不足时的重定向路径，默认为首页
  redirectTo?: string;
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  permission,
  redirectTo = "/",
}) => {
  const { user } = useUser();
  const location = useLocation();

  // 如果没有指定权限配置，则从路由配置中查找当前路径的权限要求
  const hasPermission = permission
    ? checkDirectPermission(permission, user.role, user.isLoggedIn)
    : isPathAccessible(
        location.pathname,
        routeConfig,
        user.role,
        user.isLoggedIn
      );

  // 直接权限检查函数
  function checkDirectPermission(
    permissionConfig: PermissionConfig,
    userRole: string,
    isLoggedIn: boolean
  ): boolean {
    // 如果需要登录但用户未登录
    if (permissionConfig.requireAuth && !isLoggedIn) {
      return false;
    }

    // 检查用户角色是否在允许的角色列表中
    return permissionConfig.allowedRoles.includes(userRole as any);
  }

  // 如果有权限，正常渲染子组件
  if (hasPermission) {
    return <>{children}</>;
  }

  // 根据不同情况显示不同的错误页面
  if (!user.isLoggedIn) {
    // 未登录，显示登录提示
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px",
        }}
      >
        <Empty
          image={<IconUser size="extra-large" />}
          title="需要登录"
          description="请先登录以访问此页面"
        >
          <div style={{ marginTop: "16px" }}>
            <Button
              type="primary"
              onClick={() => {
                // 这里可以跳转到登录页面或者触发登录模态框
                // 暂时模拟一个简单的登录流程
                alert("请实现登录功能");
              }}
              style={{ marginRight: 8 }}
            >
              立即登录
            </Button>
            <Button onClick={() => window.history.back()}>返回上页</Button>
          </div>
        </Empty>
      </div>
    );
  }

  // 已登录但权限不足
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <Empty
        image={<IconShield size="extra-large" />}
        title="权限不足"
        description={`抱歉，您当前的角色（${user.role}）无权访问此页面`}
      >
        <div style={{ marginTop: "16px" }}>
          <Button
            type="primary"
            onClick={() => {
              // 跳转到指定的重定向路径
              window.location.href = redirectTo;
            }}
            style={{ marginRight: 8 }}
          >
            返回首页
          </Button>
          <Button onClick={() => window.history.back()}>返回上页</Button>
        </div>
      </Empty>
    </div>
  );
};

export default PermissionGuard;
