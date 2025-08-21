# 权限控制使用示例

## 概述

本项目已为路由配置增加了完整的权限控制功能，包括：

1. **角色定义**：`admin`（管理员）、`user`（普通用户）、`guest`（游客）
2. **权限配置**：每个路由可以配置允许访问的角色和是否需要登录
3. **权限过滤**：自动过滤用户无权访问的菜单项和路由
4. **权限守卫**：保护页面，防止未授权访问

## 使用方法

### 1. 路由权限配置

在 `src/config/routes.ts` 中为路由添加权限配置：

```typescript
{
  itemKey: "admin-panel",
  text: "管理面板",
  icon: React.createElement(IconSetting),
  path: "/admin",
  component: AdminPanel,
  permission: {
    allowedRoles: ["admin"],           // 只有管理员可以访问
    requireAuth: true,                 // 需要登录
    description: "管理员专用功能"       // 权限描述
  }
}
```

### 2. 在 Layout 中使用权限过滤

Layout 组件会自动根据用户角色过滤导航菜单：

```typescript
// 获取用户有权限的导航菜单项
const navItems = getAccessibleNavItems(routeConfig, user.role, user.isLoggedIn);
```

### 3. 使用权限守卫保护页面

方式一：在路由级别使用（推荐）

```typescript
// 在App.tsx或路由配置中
import PermissionGuard from "@/components/PermissionGuard/PermissionGuard";

<Route
  path="/admin"
  element={
    <PermissionGuard>
      <AdminPanel />
    </PermissionGuard>
  }
/>;
```

方式二：在组件内部使用

```typescript
// 在具体页面组件中
const AdminPanel = () => {
  return (
    <PermissionGuard
      permission={{
        allowedRoles: ["admin"],
        requireAuth: true,
        description: "管理员功能",
      }}
    >
      <div>管理员面板内容</div>
    </PermissionGuard>
  );
};
```

### 4. 权限检查工具函数

```typescript
import {
  isRouteAccessible,
  isPathAccessible,
  getAccessiblePaths,
} from "@/config/routes";

// 检查用户是否可以访问某个路由
const canAccess = isRouteAccessible(route, user.role, user.isLoggedIn);

// 检查用户是否可以访问某个路径
const canAccessPath = isPathAccessible(
  "/admin",
  routeConfig,
  user.role,
  user.isLoggedIn
);

// 获取用户可以访问的所有路径
const accessiblePaths = getAccessiblePaths(
  routeConfig,
  user.role,
  user.isLoggedIn
);
```

### 5. 动态角色切换示例

```typescript
// 在组件中切换用户角色（用于测试）
const { user, updateProfile } = useUser();

const switchToAdmin = () => {
  updateProfile({ role: "admin" });
};

const switchToUser = () => {
  updateProfile({ role: "user" });
};

const switchToGuest = () => {
  updateProfile({ role: "guest", isLoggedIn: false });
};
```

## 权限配置详解

### 角色层级

```
guest < user < admin
```

- **guest**：游客，未登录用户，只能访问公开页面
- **user**：普通用户，已登录，可以访问用户功能
- **admin**：管理员，拥有所有权限

### 权限配置选项

```typescript
interface PermissionConfig {
  allowedRoles: UserRole[]; // 允许访问的角色列表
  requireAuth?: boolean; // 是否需要登录（可选，默认false）
  description?: string; // 权限描述（可选）
}
```

### 当前路由权限设置

- **首页** (`/`)：所有用户可访问，无需登录
- **关于** (`/about`)：所有用户可访问，无需登录
- **状态管理** (`/state`)：需要登录，普通用户和管理员可访问
- **接口封装** (`/api`)：需要登录，仅管理员可访问

## 最佳实践

1. **最小权限原则**：默认拒绝，明确授权
2. **层级设计**：合理设计角色层级，避免权限混乱
3. **前后端一致**：确保前端权限控制与后端 API 权限保持一致
4. **用户体验**：权限不足时提供清晰的提示和引导
5. **安全考虑**：前端权限控制仅用于 UI 展示，真正的安全验证必须在后端进行

## 注意事项

⚠️ **重要**：前端权限控制主要用于改善用户体验，不能作为唯一的安全措施。真正的权限验证必须在后端 API 层面进行。

✅ **建议**：

- 定期审查权限配置
- 为敏感操作添加二次确认
- 记录权限相关的操作日志
- 考虑实现权限缓存和失效机制
