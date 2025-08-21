# 项目结构说明

## 🏗️ 项目架构

这是一个基于 **Semi UI** 设计的现代化 React 应用，采用 **Context + useReducer** 状态管理架构，支持主题切换和本地存储。

## 📁 目录结构

```
root-semi/
├── public/                    # 静态资源
├── src/
│   ├── components/           # 公共组件
│   │   ├── Layout/          # 布局组件
│   │   │   ├── Layout.tsx   # 主布局（导航、头部、内容区）
│   │   │   └── Layout.module.scss # 布局样式
│   │   ├── Loading/         # 加载组件
│   │   │   ├── Loading.tsx  # 自定义Loading组件
│   │   │   └── Loading.css  # 加载样式
│   │   ├── StateDemo/       # 状态管理演示组件
│   │   │   └── StateDemo.tsx # 完整的状态管理示例
│   │   └── ApiDemo/         # 接口封装演示组件
│   │       └── ApiDemo.tsx  # HTTP请求封装演示
│   ├── pages/               # 页面组件
│   │   ├── Home/           # 首页
│   │   │   ├── Home.tsx    # 首页组件
│   │   │   └── Home.css    # 首页样式
│   │   ├── About/          # 关于页面
│   │   │   ├── About.tsx   # 关于组件
│   │   │   └── About.css   # 关于样式
│   │   ├── StateManagement/ # 状态管理演示页
│   │   │   ├── StateManagement.tsx # 状态管理页面
│   │   │   └── StateManagement.css # 页面样式
│   │   └── ApiDemo/         # 接口封装演示页
│   │       ├── ApiDemo.tsx  # API演示页面
│   │       └── ApiDemo.css  # 页面样式
│   ├── contexts/            # Context状态管理
│   │   └── AppContext.tsx  # 全局状态管理（用户、UI、应用状态）
│   ├── services/           # 服务层
│   │   └── api.ts          # API服务封装（用户、系统、文件服务）
│   ├── config/             # 配置文件
│   │   └── routes.ts       # 路由配置（JSON化路由管理）
│   ├── hooks/              # 自定义 Hooks
│   │   ├── useLocalStorage.ts # 本地存储Hook
│   │   └── useTheme.ts     # 主题切换Hook
│   ├── utils/              # 工具函数
│   │   ├── constants.ts    # 常量定义
│   │   └── request.ts      # HTTP请求封装（拦截器、重试、错误处理）
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts        # 通用类型
│   ├── styles/             # 样式文件
│   │   └── reset.css       # CSS重置样式
│   ├── App.tsx             # 根组件（Provider集成）
│   ├── main.tsx            # 应用入口
│   ├── index.css           # 全局样式
│   └── env.d.ts            # 环境变量类型定义
├── package.json            # 项目配置
├── tsconfig.json           # TypeScript 配置
├── vite.config.ts          # Vite 构建配置
├── README.md               # 项目说明
└── PROJECT-STRUCTURE.md    # 项目结构文档
```

## 🧭 导航架构设计

### 主导航结构

```
├── 首页 (/)                 # 欢迎页面，展示项目特性
├── 关于 (/about)            # 项目信息，技术栈介绍
├── 状态管理 (/state)        # Context + useReducer 演示
└── 接口封装 (/api)          # HTTP请求封装演示
```

### 架构特点

1. **功能完整**：四个核心页面，涵盖现代 React 应用核心功能
2. **状态驱动**：完整的 Context + useReducer 演示
3. **接口封装**：生产级 HTTP 请求封装，支持拦截器、重试、错误处理
4. **主题一致**：全局主题切换，本地存储
5. **JSON 配置化**：路由通过配置文件管理
6. **生产优化**：自动去除 console 警告，性能优化

## 🎨 页面功能说明

### 核心页面

| 页面     | 路径     | 功能描述                      |
| -------- | -------- | ----------------------------- |
| 首页     | `/`      | 应用介绍，核心特性展示        |
| 关于     | `/about` | 项目信息，技术栈介绍          |
| 状态管理 | `/state` | Context + useReducer 完整演示 |
| 接口封装 | `/api`   | HTTP 请求封装功能演示         |

### 功能特色

- **状态管理演示**：完整的 Context + useReducer 架构展示
- **接口封装演示**：HTTP 请求、文件上传下载、错误处理等完整演示
- **主题切换**：支持明暗主题动态切换，本地存储
- **响应式设计**：适配桌面端和移动端
- **用户菜单**：便捷的个人操作入口
- **加载优化**：自定义 Loading 组件，避免 findDOMNode 警告
- **路由配置化**：JSON 格式的路由管理
- **生产优化**：自动去除控制台警告，提升用户体验

## 🔧 技术栈

- **框架**：React 18 + TypeScript
- **UI 库**：@douyinfe/semi-ui + @douyinfe/semi-icons
- **状态管理**：Context + useReducer
- **路由**：React Router v6
- **构建**：Vite
- **样式**：SCSS + CSS Variables
- **代码规范**：ESLint + TypeScript

## 🚀 快速开始

1. **安装依赖**

   ```bash
   pnpm install
   ```

2. **启动开发服务器**

   ```bash
   pnpm dev
   ```

3. **访问应用**
   ```
   http://localhost:3001
   ```

## 📝 开发指南

### 添加新页面

1. 在 `src/pages/` 下创建页面目录
2. 创建 `.tsx` 和 `.css` 文件
3. 在 `src/config/routes.ts` 中添加路由配置
4. 页面会自动出现在导航菜单中

### 状态管理

使用项目内置的 Context + useReducer 架构：

```typescript
// 获取全局状态
import { useUser, useTheme, useUI } from "@/contexts/AppContext";

function MyComponent() {
  const { user, login, logout } = useUser();
  const { isDark, toggleMode } = useTheme();
  const { ui, setLoading } = useUI();

  return (
    <div>
      <p>用户: {user.name}</p>
      <button onClick={toggleMode}>切换主题</button>
    </div>
  );
}
```

### 主题切换

主题设置自动保存到 localStorage：

```typescript
// 使用主题Hook
const { isDark, mode, toggleMode, setMode } = useTheme();

// 主题会自动保存到 localStorage
toggleMode(); // 切换主题
setMode("dark"); // 设置为深色模式
```

### 接口调用

使用封装好的服务层进行 API 调用：

```typescript
import { UserService, SystemService, FileService } from "@/services/api";

// 用户相关操作
const loginResponse = await UserService.login({
  email: "user@example.com",
  password: "password123",
});

const userProfile = await UserService.getCurrentUser();

// 系统服务
const healthStatus = await SystemService.healthCheck();
const statistics = await SystemService.getStatistics();

// 文件服务
const uploadResult = await FileService.uploadFile(file, "image");
await FileService.downloadFile("/path/to/file", "filename.pdf");

// 自定义请求配置
import { request } from "@/utils/request";

const response = await request.post("/api/custom", data, {
  timeout: 30000, // 30秒超时
  retryCount: 3, // 重试3次
  showLoading: true, // 显示loading
  showError: false, // 不显示错误提示
});
```

## 🎯 设计亮点

- ✅ **完整的状态管理**：Context + useReducer 最佳实践演示
- ✅ **生产级接口封装**：HTTP 请求拦截器、重试机制、错误处理
- ✅ **主题本地存储**：Semi UI 官方主题切换方案
- ✅ **现代化 UI**：基于 Semi UI 设计系统
- ✅ **完整的 TypeScript 支持**：类型安全保障
- ✅ **配置化路由**：JSON 格式路由管理，易于维护
- ✅ **性能优化**：自定义 Loading 组件，解决 findDOMNode 警告
- ✅ **生产环境优化**：自动去除 console 警告，提升用户体验
- ✅ **服务层架构**：按业务模块组织 API 接口，便于维护
- ✅ **优秀的用户体验**：响应式设计 + 无缝主题切换

这个项目展示了现代 React 应用的完整架构，涵盖了状态管理、接口封装、主题切换等核心功能，特别适合学习现代前端开发最佳实践。
