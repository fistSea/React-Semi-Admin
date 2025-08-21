# 多级菜单使用指南

## 概述

本项目已成功为 `App.tsx` 的路由配置添加了完整的多级菜单支持，包括：

1. **多级路由结构**：支持父菜单和子菜单的嵌套结构
2. **权限控制集成**：每个菜单层级都支持独立的权限配置
3. **自动权限过滤**：根据用户角色自动显示/隐藏菜单项
4. **路由守卫保护**：防止未授权访问受保护的页面

## 当前多级菜单结构

### 🏠 首页

- **路径**: `/`
- **权限**: 所有用户可访问
- **描述**: 应用程序主页

### 📊 仪表盘 (父菜单)

- **权限**: 登录用户可访问 (`admin`, `user`)

#### 📈 数据分析

- **路径**: `/dashboard/analytics`
- **权限**: 登录用户可访问 (`admin`, `user`)
- **功能**: 显示系统关键指标和数据分析

#### 🖥️ 系统监控

- **路径**: `/dashboard/monitor`
- **权限**: 仅管理员可访问 (`admin`)
- **功能**: 实时监控系统运行状态和性能

### ⚙️ 系统管理 (父菜单)

- **权限**: 仅管理员可访问 (`admin`)

#### 👥 用户管理

- **路径**: `/system/users`
- **权限**: 仅管理员可访问 (`admin`)
- **功能**: 管理系统用户账号和状态

#### 🛡️ 角色管理

- **路径**: `/system/roles`
- **权限**: 仅管理员可访问 (`admin`)
- **功能**: 管理系统角色和权限配置

### 🔧 状态管理

- **路径**: `/state`
- **权限**: 登录用户可访问 (`admin`, `user`)
- **描述**: React 状态管理演示

### 📁 接口封装

- **路径**: `/api`
- **权限**: 仅管理员可访问 (`admin`)
- **描述**: API 封装功能演示

### ℹ️ 关于

- **路径**: `/about`
- **权限**: 所有用户可访问
- **描述**: 项目信息和权限测试面板

## 如何添加新的多级菜单

### 1. 创建页面组件

首先在相应目录下创建新的页面组件：

```bash
# 例如：添加系统设置页面
mkdir -p src/pages/System/Settings
touch src/pages/System/Settings/Settings.tsx
```

```typescript
// src/pages/System/Settings/Settings.tsx
import React from "react";
import { Card, Typography } from "@douyinfe/semi-ui";

const { Title, Text } = Typography;

const Settings: React.FC = () => {
  return (
    <div style={{ padding: "24px" }}>
      <Card>
        <Title heading={3}>系统设置</Title>
        <Text>系统参数配置页面</Text>
      </Card>
    </div>
  );
};

export default Settings;
```

### 2. 更新路由配置

在 `src/config/routes.ts` 中添加新的路由配置：

```typescript
// 1. 导入新组件
const Settings = React.lazy(() => import("@/pages/System/Settings/Settings"));

// 2. 在相应的父菜单下添加子路由
{
  itemKey: "system",
  text: "系统管理",
  // ... 其他配置
  items: [
    // ... 现有子菜单
    {
      itemKey: "system-settings",
      text: "系统设置",
      icon: React.createElement(IconSetting, {
        style: { color: "#52c41a", fontSize: "16px" },
      }),
      path: "/system/settings",
      component: Settings,
      permission: {
        allowedRoles: ["admin"],
        requireAuth: true,
        description: "管理员可以配置系统参数",
      },
    },
  ],
},
```

### 3. 添加新的父级菜单

如果需要添加新的父级菜单，在 `routeConfig` 数组中添加：

```typescript
{
  itemKey: "reports",
  text: "报表中心",
  icon: React.createElement(IconBarChartVStroked, {
    style: { color: "#722ed1", fontSize: "18px" },
  }),
  // 父级菜单无路径
  permission: {
    allowedRoles: ["admin", "user"],
    requireAuth: true,
    description: "登录用户可以访问报表功能",
  },
  items: [
    {
      itemKey: "sales-report",
      text: "销售报表",
      icon: React.createElement(IconLineChartStroked, {
        style: { color: "#1890ff", fontSize: "16px" },
      }),
      path: "/reports/sales",
      component: SalesReport,
      permission: {
        allowedRoles: ["admin", "user"],
        requireAuth: true,
        description: "查看销售数据报表",
      },
    },
  ],
},
```

## 权限配置详解

### 父子菜单权限继承

- 如果父菜单设置了权限，会影响整个子菜单组的显示
- 子菜单可以设置比父菜单更严格的权限
- 如果用户对父菜单无权限，即使对某个子菜单有权限，整个菜单组也不会显示

### 权限过滤逻辑

```typescript
// 系统会自动执行以下逻辑：
// 1. 检查父菜单权限
if (!checkPermission(parentMenu.permission, userRole, isLoggedIn)) {
  // 隐藏整个菜单组
  return null;
}

// 2. 过滤有权限的子菜单
const accessibleItems = parentMenu.items.filter((item) =>
  checkPermission(item.permission, userRole, isLoggedIn)
);

// 3. 如果没有可访问的子菜单，显示空的父菜单（取决于具体实现）
```

## 最佳实践

### 1. 菜单结构设计

```
✅ 推荐的菜单结构：
📊 业务功能分组
  ├── 📈 具体功能1
  ├── 📉 具体功能2
  └── 📋 具体功能3

❌ 避免的菜单结构：
📊 功能1
  └── 📈 功能1详情 (只有一个子菜单)
```

### 2. 权限设计原则

- **最小权限**：默认拒绝，明确授权
- **层级清晰**：父菜单权限不应低于子菜单
- **逻辑一致**：相同功能模块使用相同权限等级

### 3. 图标使用规范

```typescript
// 父级菜单使用18px图标
icon: React.createElement(IconSetting, {
  style: { color: "#fa8c16", fontSize: "18px" },
}),

// 子级菜单使用16px图标
icon: React.createElement(IconUser, {
  style: { color: "#1890ff", fontSize: "16px" },
}),
```

### 4. 路径命名规范

```typescript
// 推荐的路径命名
"/dashboard/analytics"; // 仪表盘 - 数据分析
"/system/users"; // 系统管理 - 用户管理
"/reports/sales"; // 报表中心 - 销售报表

// 避免的路径命名
"/page1"; // 不明确的命名
"/dashboard-analytics"; // 使用下划线而非斜杠
```

## 测试多级菜单

您可以通过以下方式测试多级菜单功能：

1. **访问关于页面** (`/about`)，使用权限测试面板切换不同角色
2. **观察菜单变化**：

   - 游客：只能看到首页和关于
   - 普通用户：可以看到仪表盘（仅数据分析）、状态管理
   - 管理员：可以看到所有菜单，包括系统管理和接口封装

3. **测试路由保护**：
   - 直接访问受保护的 URL（如 `/system/users`）
   - 系统会根据权限显示相应的提示页面

## 技术实现要点

### 1. 路由扁平化处理

系统自动将多级菜单结构扁平化为 React Router 可识别的路由：

```typescript
// 多级结构 → 扁平化路由
{
  "dashboard": {
    items: ["analytics", "monitor"]
  }
}
↓
[
  { path: "/dashboard/analytics", component: Analytics },
  { path: "/dashboard/monitor", component: Monitor }
]
```

### 2. 权限守卫集成

每个路由都自动包装了权限守卫：

```typescript
<Route
  path={route.path}
  element={
    <PermissionGuard permission={route.permission}>
      <route.component />
    </PermissionGuard>
  }
/>
```

### 3. 导航状态同步

系统自动根据当前路径高亮对应的菜单项，支持多级菜单的状态同步。

## 故障排除

### 常见问题

1. **菜单不显示**

   - 检查权限配置是否正确
   - 确认用户角色和登录状态
   - 验证图标导入是否正确

2. **路由无法访问**

   - 检查路径配置是否正确
   - 确认组件导入路径
   - 验证权限守卫配置

3. **菜单状态不同步**
   - 检查 itemKey 是否唯一
   - 确认路径匹配逻辑
   - 验证 getCurrentSelectedKey 函数

通过以上配置，您的应用现在拥有了完整的多级菜单支持，包括权限控制和路由保护功能！
