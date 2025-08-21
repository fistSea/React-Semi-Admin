// 全局应用状态管理 - 使用Context + useReducer
import React, { createContext, useContext, useReducer, ReactNode } from "react";

// 🎯 1. 定义状态类型
export interface AppState {
  user: {
    id: string | null;
    name: string;
    email: string;
    avatar: string;
    isLoggedIn: boolean;
    role: "admin" | "user" | "guest";
  };
  ui: {
    loading: boolean;
    sidebarCollapsed: boolean;
    notifications: Array<{
      id: string;
      type: "success" | "error" | "warning" | "info";
      title: string;
      message: string;
      timestamp: number;
    }>;
  };
  app: {
    title: string;
    version: string;
    isOnline: boolean;
  };
}

// 🎯 2. 定义操作类型 (Actions)
export type AppAction =
  // 用户相关操作
  | {
      type: "USER_LOGIN";
      payload: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
        role?: "admin" | "user";
      };
    }
  | { type: "USER_LOGOUT" }
  | { type: "USER_UPDATE_PROFILE"; payload: Partial<AppState["user"]> }

  // UI相关操作
  | { type: "UI_SET_LOADING"; payload: boolean }
  | { type: "UI_TOGGLE_SIDEBAR" }
  | { type: "UI_SET_SIDEBAR"; payload: boolean }
  | {
      type: "UI_ADD_NOTIFICATION";
      payload: Omit<AppState["ui"]["notifications"][0], "id" | "timestamp">;
    }
  | { type: "UI_REMOVE_NOTIFICATION"; payload: string }
  | { type: "UI_CLEAR_NOTIFICATIONS" }

  // 应用相关操作
  | { type: "APP_SET_ONLINE"; payload: boolean }
  | { type: "APP_SET_TITLE"; payload: string };

// 🎯 3. 初始状态
const initialState: AppState = {
  user: {
    id: null,
    name: "",
    email: "",
    avatar: "",
    isLoggedIn: false,
    role: "guest",
  },
  ui: {
    loading: false,
    sidebarCollapsed: false,
    notifications: [],
  },
  app: {
    title: "Semi 运营后台",
    version: "1.0.0",
    isOnline: navigator.onLine,
  },
};

// 🎯 4. Reducer函数 (类似Vue的mutations)
const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    // 用户相关
    case "USER_LOGIN":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          isLoggedIn: true,
          role: action.payload.role || "user",
          avatar:
            action.payload.avatar ||
            `https://api.dicebear.com/7.x/avataaars/svg?seed=${action.payload.name}`,
        },
      };

    case "USER_LOGOUT":
      return {
        ...state,
        user: {
          ...initialState.user,
        },
      };

    case "USER_UPDATE_PROFILE":
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      };

    // UI相关
    case "UI_SET_LOADING":
      return {
        ...state,
        ui: {
          ...state.ui,
          loading: action.payload,
        },
      };

    case "UI_TOGGLE_SIDEBAR":
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: !state.ui.sidebarCollapsed,
        },
      };

    case "UI_SET_SIDEBAR":
      return {
        ...state,
        ui: {
          ...state.ui,
          sidebarCollapsed: action.payload,
        },
      };

    case "UI_ADD_NOTIFICATION":
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [
            ...state.ui.notifications,
            {
              ...action.payload,
              id: Date.now().toString(),
              timestamp: Date.now(),
            },
          ],
        },
      };

    case "UI_REMOVE_NOTIFICATION":
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: state.ui.notifications.filter(
            (n) => n.id !== action.payload
          ),
        },
      };

    case "UI_CLEAR_NOTIFICATIONS":
      return {
        ...state,
        ui: {
          ...state.ui,
          notifications: [],
        },
      };

    // 应用相关
    case "APP_SET_ONLINE":
      return {
        ...state,
        app: {
          ...state.app,
          isOnline: action.payload,
        },
      };

    case "APP_SET_TITLE":
      return {
        ...state,
        app: {
          ...state.app,
          title: action.payload,
        },
      };

    default:
      return state;
  }
};

// 🎯 5. Context创建
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

// 🎯 6. Provider组件
export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // 监听网络状态变化
  React.useEffect(() => {
    const handleOnline = () =>
      dispatch({ type: "APP_SET_ONLINE", payload: true });
    const handleOffline = () =>
      dispatch({ type: "APP_SET_ONLINE", payload: false });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 🎯 7. 自定义Hook - 获取完整状态
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
};

// 🎯 8. 便捷的分模块Hooks
export const useUser = () => {
  const { state, dispatch } = useAppContext();

  return {
    // 状态
    user: state.user,

    // 操作方法
    login: (userInfo: {
      id: string;
      name: string;
      email: string;
      avatar?: string;
      role?: "admin" | "user";
    }) => {
      dispatch({ type: "USER_LOGIN", payload: userInfo });
    },

    logout: () => {
      dispatch({ type: "USER_LOGOUT" });
    },

    updateProfile: (updates: Partial<AppState["user"]>) => {
      dispatch({ type: "USER_UPDATE_PROFILE", payload: updates });
    },
  };
};

// 🎯 8. 主题相关Hook - 使用Semi UI官方方式 + 本地存储
export const useTheme = () => {
  // 从localStorage读取主题设置，默认为light
  const getInitialTheme = () => {
    try {
      const savedTheme = localStorage.getItem("semi-theme-mode");
      return savedTheme === "dark";
    } catch {
      return false; // 如果localStorage不可用，默认浅色模式
    }
  };

  const [isDark, setIsDark] = React.useState(getInitialTheme);

  // 初始化时应用保存的主题
  React.useEffect(() => {
    const body = document.body;
    if (isDark) {
      body.setAttribute("theme-mode", "dark");
    } else {
      body.removeAttribute("theme-mode");
    }
  }, []); // 只在组件挂载时执行一次

  const toggleMode = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    const body = document.body;
    if (newIsDark) {
      body.setAttribute("theme-mode", "dark");
      localStorage.setItem("semi-theme-mode", "dark");
    } else {
      body.removeAttribute("theme-mode");
      localStorage.setItem("semi-theme-mode", "light");
    }
  };

  const setMode = (mode: "light" | "dark") => {
    const newIsDark = mode === "dark";
    setIsDark(newIsDark);

    const body = document.body;
    if (newIsDark) {
      body.setAttribute("theme-mode", "dark");
      localStorage.setItem("semi-theme-mode", "dark");
    } else {
      body.removeAttribute("theme-mode");
      localStorage.setItem("semi-theme-mode", "light");
    }
  };

  return {
    // 状态
    isDark,
    mode: isDark ? "dark" : "light",

    // 操作方法
    toggleMode,
    setMode,
  };
};

export const useUI = () => {
  const { state, dispatch } = useAppContext();

  return {
    // 状态
    ui: state.ui,

    // 操作方法
    setLoading: (loading: boolean) => {
      dispatch({ type: "UI_SET_LOADING", payload: loading });
    },

    toggleSidebar: () => {
      dispatch({ type: "UI_TOGGLE_SIDEBAR" });
    },

    setSidebar: (collapsed: boolean) => {
      dispatch({ type: "UI_SET_SIDEBAR", payload: collapsed });
    },

    addNotification: (
      notification: Omit<AppState["ui"]["notifications"][0], "id" | "timestamp">
    ) => {
      dispatch({ type: "UI_ADD_NOTIFICATION", payload: notification });
    },

    removeNotification: (id: string) => {
      dispatch({ type: "UI_REMOVE_NOTIFICATION", payload: id });
    },

    clearNotifications: () => {
      dispatch({ type: "UI_CLEAR_NOTIFICATIONS" });
    },
  };
};

export const useApp = () => {
  const { state, dispatch } = useAppContext();

  return {
    // 状态
    app: state.app,

    // 操作方法
    setTitle: (title: string) => {
      dispatch({ type: "APP_SET_TITLE", payload: title });
      document.title = title;
    },
  };
};
