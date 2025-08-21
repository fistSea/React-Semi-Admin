import React from "react";
import {
  IconHome,
  IconUser,
  IconSetting,
  IconCode,
  IconFile,
  IconShield,
  IconActivity,
  IconPieChartStroked,
} from "@douyinfe/semi-icons";

// 用户角色类型
export type UserRole = "admin" | "user" | "guest";

// 权限配置类型
export interface PermissionConfig {
  // 允许访问的角色列表
  allowedRoles: UserRole[];
  // 是否需要登录
  requireAuth?: boolean;
  // 权限描述
  description?: string;
}

// 路由配置接口
export interface RouteItem {
  itemKey: string;
  text: string;
  icon?: React.ReactNode;
  path?: string;
  component?: React.ComponentType;
  items?: RouteItem[];
  // 权限配置
  permission?: PermissionConfig;
}

// 导入页面组件
const Home = React.lazy(() => import("@/pages/Home/Home"));
const About = React.lazy(() => import("@/pages/About/About"));
const StateManagement = React.lazy(
  () => import("@/pages/StateManagement/StateManagement")
);
const ApiDemo = React.lazy(() => import("@/pages/ApiDemo/ApiDemo"));

// 导入多级菜单页面组件
const UserManagement = React.lazy(
  () => import("@/pages/System/UserManagement/UserManagement")
);
const RoleManagement = React.lazy(
  () => import("@/pages/System/RoleManagement/RoleManagement")
);
const Analytics = React.lazy(
  () => import("@/pages/Dashboard/Analytics/Analytics")
);
const Monitor = React.lazy(() => import("@/pages/Dashboard/Monitor/Monitor"));

// 权限检查工具函数
export const checkPermission = (
  permission: PermissionConfig | undefined,
  userRole: UserRole,
  isLoggedIn: boolean
): boolean => {
  // 如果没有权限配置，默认允许访问
  if (!permission) {
    return true;
  }

  // 如果需要登录但用户未登录，拒绝访问
  if (permission.requireAuth && !isLoggedIn) {
    return false;
  }

  // 检查用户角色是否在允许的角色列表中
  return permission.allowedRoles.includes(userRole);
};

// 检查路由是否可访问
export const isRouteAccessible = (
  route: RouteItem,
  userRole: UserRole,
  isLoggedIn: boolean
): boolean => {
  return checkPermission(route.permission, userRole, isLoggedIn);
};

// 路由配置 - 支持多级菜单（带权限控制）
export const routeConfig: RouteItem[] = [
  {
    itemKey: "home",
    text: "首页",
    icon: React.createElement(IconHome, {
      style: { color: "#1890ff", fontSize: "18px" },
    }),
    path: "/",
    component: Home,
    // 首页所有用户都可以访问
    permission: {
      allowedRoles: ["admin", "user", "guest"],
      requireAuth: false,
      description: "所有用户都可以访问首页",
    },
  },

  {
    itemKey: "system",
    text: "系统管理",
    icon: React.createElement(IconSetting, {
      style: { color: "#fa8c16", fontSize: "18px" },
    }),
    // 父级菜单无路径
    permission: {
      allowedRoles: ["admin"],
      requireAuth: true,
      description: "只有管理员可以访问系统管理",
    },
    items: [
      {
        itemKey: "user-management",
        text: "用户管理",
        icon: React.createElement(IconUser, {
          style: { color: "#1890ff", fontSize: "16px" },
        }),
        path: "/system/users",
        component: UserManagement,
        permission: {
          allowedRoles: ["admin"],
          requireAuth: true,
          description: "管理员可以管理用户",
        },
      },
      {
        itemKey: "role-management",
        text: "角色管理",
        icon: React.createElement(IconShield, {
          style: { color: "#722ed1", fontSize: "16px" },
        }),
        path: "/system/roles",
        component: RoleManagement,
        permission: {
          allowedRoles: ["admin"],
          requireAuth: true,
          description: "管理员可以管理角色",
        },
      },
    ],
  },
  {
    itemKey: "state",
    text: "状态管理",
    icon: React.createElement(IconCode, {
      style: { color: "#722ed1", fontSize: "18px" },
    }),
    path: "/state",
    component: StateManagement,
    // 状态管理需要登录用户或管理员
    permission: {
      allowedRoles: ["admin", "user"],
      requireAuth: true,
      description: "需要登录的用户才能访问状态管理",
    },
  },
  {
    itemKey: "api",
    text: "接口封装",
    icon: React.createElement(IconFile, {
      style: { color: "#fa541c", fontSize: "18px" },
    }),
    path: "/api",
    component: ApiDemo,
    // 接口封装只有管理员可以访问
    permission: {
      allowedRoles: ["admin"],
      requireAuth: true,
      description: "只有管理员可以访问接口封装功能",
    },
  },
  {
    itemKey: "about",
    text: "关于",
    icon: React.createElement(IconUser, {
      style: { color: "#52c41a", fontSize: "18px" },
    }),
    path: "/about",
    component: About,
    // 关于页面所有用户都可以访问
    permission: {
      allowedRoles: ["admin", "user", "guest"],
      requireAuth: false,
      description: "所有用户都可以访问关于页面",
    },
  },
];

// 权限过滤函数 - 根据用户角色过滤可访问的路由
export const filterRoutesByPermission = (
  routes: RouteItem[],
  userRole: UserRole,
  isLoggedIn: boolean
): RouteItem[] => {
  return routes
    .filter((route) => {
      // 检查当前路由是否可访问
      const accessible = isRouteAccessible(route, userRole, isLoggedIn);

      // 如果有子路由，递归过滤子路由
      if (route.items) {
        const filteredItems = filterRoutesByPermission(
          route.items,
          userRole,
          isLoggedIn
        );
        // 如果当前路由可访问但没有可访问的子路由，仍然保留当前路由
        if (accessible) {
          return {
            ...route,
            items: filteredItems,
          };
        }
        // 如果当前路由不可访问但有可访问的子路由，仍然保留（作为父级菜单）
        return filteredItems.length > 0;
      }

      return accessible;
    })
    .map((route) => {
      // 如果有子路由，更新子路由列表
      if (route.items) {
        return {
          ...route,
          items: filterRoutesByPermission(route.items, userRole, isLoggedIn),
        };
      }
      return route;
    });
};

// 扁平化路由配置，用于生成 React Router 路由
export const flattenRoutes = (routes: RouteItem[]): RouteItem[] => {
  const flattened: RouteItem[] = [];

  const flatten = (items: RouteItem[]) => {
    items.forEach((item) => {
      if (item.path && item.component) {
        flattened.push(item);
      }
      if (item.items) {
        flatten(item.items);
      }
    });
  };

  flatten(routes);
  return flattened;
};

// 扁平化可访问的路由配置（带权限过滤）
export const flattenAccessibleRoutes = (
  routes: RouteItem[],
  userRole: UserRole,
  isLoggedIn: boolean
): RouteItem[] => {
  const filteredRoutes = filterRoutesByPermission(routes, userRole, isLoggedIn);
  return flattenRoutes(filteredRoutes);
};

// 获取导航菜单项配置（用于Nav组件）- 原始版本（不过滤权限）
export const getNavItems = (routes: RouteItem[]) => {
  return routes.map((route) => ({
    itemKey: route.itemKey,
    text: route.text,
    icon: route.icon,
    items: route.items?.map((subItem) => ({
      itemKey: subItem.itemKey,
      text: subItem.text,
      items: subItem.items?.map((subSubItem) => subSubItem.text),
    })),
  }));
};

// 获取可访问的导航菜单项配置（带权限过滤）
export const getAccessibleNavItems = (
  routes: RouteItem[],
  userRole: UserRole,
  isLoggedIn: boolean
) => {
  // 先过滤路由，只保留用户有权限访问的路由
  const accessibleRoutes = filterRoutesByPermission(
    routes,
    userRole,
    isLoggedIn
  );

  // 再转换为导航菜单项格式
  return getNavItems(accessibleRoutes);
};

// 工具函数：获取所有可访问的路由路径（用于路由守卫）
export const getAccessiblePaths = (
  routes: RouteItem[],
  userRole: UserRole,
  isLoggedIn: boolean
): string[] => {
  const accessibleRoutes = flattenAccessibleRoutes(
    routes,
    userRole,
    isLoggedIn
  );
  return accessibleRoutes
    .filter((route) => route.path)
    .map((route) => route.path as string);
};

// 工具函数：检查特定路径是否可访问
export const isPathAccessible = (
  path: string,
  routes: RouteItem[],
  userRole: UserRole,
  isLoggedIn: boolean
): boolean => {
  const accessiblePaths = getAccessiblePaths(routes, userRole, isLoggedIn);
  return accessiblePaths.includes(path);
};
