// API相关常量
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

// 本地存储键名
export const STORAGE_KEYS = {
  THEME: "theme",
  USER_INFO: "userInfo",
  AUTH_TOKEN: "authToken",
} as const;

// 路由路径
export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  LOGIN: "/login",
  PROFILE: "/profile",
} as const;

// 应用配置
export const APP_CONFIG = {
  NAME: "Semi UI React App",
  VERSION: "1.0.0",
  DESCRIPTION: "基于Semi UI的React应用",
} as const;

// 主题配置
export const THEME_CONFIG = {
  LIGHT: "light",
  DARK: "dark",
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;
