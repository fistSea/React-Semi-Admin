// 通用接口定义
export interface BaseResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 用户相关类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
  createdAt: string;
  updatedAt: string;
}

// 路由相关类型
export interface RouteItem {
  path: string;
  component: React.ComponentType;
  title: string;
  icon?: React.ReactNode;
  children?: RouteItem[];
}

// 主题相关类型
export type ThemeMode = "light" | "dark";

// 通用组件Props
export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}
