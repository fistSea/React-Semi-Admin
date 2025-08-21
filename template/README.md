# Semi UI React 应用

基于抖音 Semi UI 设计系统构建的现代化 React 应用脚手架，集成 Context + useReducer 状态管理和主题切换功能。

## 🚀 快速开始

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 预览生产版本

```bash
pnpm preview
```

## 📦 技术栈

- **React 18** - 现代化的 React 框架
- **TypeScript** - 类型安全的 JavaScript
- **Semi UI** - 抖音前端团队的设计系统
- **Vite** - 快速的构建工具
- **React Router v6** - 客户端路由
- **Context + useReducer** - 状态管理
- **SCSS** - CSS 预处理器
- **ESLint** - 代码质量检查

## 📁 项目结构

```
src/
├── components/          # 公共组件
│   ├── Layout/         # 布局组件
│   ├── Loading/        # 加载组件
│   ├── StateDemo/      # 状态管理演示组件
│   └── ApiDemo/        # 接口封装演示组件
├── pages/              # 页面组件
│   ├── Home/           # 首页
│   ├── About/          # 关于页
│   ├── StateManagement/ # 状态管理演示页
│   └── ApiDemo/        # 接口封装演示页
├── contexts/           # Context状态管理
│   └── AppContext.tsx  # 全局状态管理
├── services/           # 服务层
│   └── api.ts          # API服务封装
├── hooks/              # 自定义Hooks
├── utils/              # 工具函数
│   └── request.ts      # HTTP请求封装
├── types/              # 类型定义
├── styles/             # 样式文件
│   └── reset.css       # 重置样式
├── config/             # 配置文件
│   └── routes.ts       # 路由配置
├── App.tsx             # 根组件
├── main.tsx            # 应用入口
└── index.css           # 全局样式
```

## 🎨 主要特性

- ✅ **现代化设计** - 基于 Semi UI 设计系统
- ✅ **TypeScript 支持** - 完整的类型检查
- ✅ **状态管理** - Context + useReducer 架构
- ✅ **接口封装** - 完整的 HTTP 请求封装，支持拦截器、重试、错误处理
- ✅ **主题切换** - 支持明暗主题，本地存储
- ✅ **路径别名** - 简化导入路径
- ✅ **响应式布局** - 适配多种设备
- ✅ **代码规范** - ESLint 配置
- ✅ **快速构建** - Vite 构建工具
- ✅ **路由管理** - JSON 配置化路由
- ✅ **组件演示** - 完整的状态管理和接口封装示例
- ✅ **生产优化** - 自动去除 console 警告，性能优化

## 🔧 配置说明

### 路径别名

项目配置了以下路径别名：

- `@/*` → `src/*`
- `@/components/*` → `src/components/*`
- `@/pages/*` → `src/pages/*`
- `@/contexts/*` → `src/contexts/*`
- `@/services/*` → `src/services/*`
- `@/config/*` → `src/config/*`
- `@/utils/*` → `src/utils/*`
- `@/hooks/*` → `src/hooks/*`
- `@/types/*` → `src/types/*`

### 环境变量

在项目根目录创建 `.env` 文件：

```bash
VITE_API_BASE_URL=http://localhost:3001
```

## 🛠️ 开发指南

### 添加新页面

1. 在 `src/pages/` 下创建页面目录
2. 创建组件文件和样式文件
3. 在 `src/config/routes.ts` 中添加路由配置
4. 页面会自动出现在导航菜单中

### 状态管理

项目使用 Context + useReducer 进行状态管理：

```typescript
// 使用全局状态
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
// 主题会自动保存到本地存储
const { isDark, mode, toggleMode } = useTheme();

// 手动设置主题
setMode("dark"); // 或 'light'
```

### 接口调用

使用封装好的服务层进行 API 调用：

```typescript
import { UserService, SystemService, FileService } from "@/services/api";

// 用户登录
const loginResponse = await UserService.login({
  email: "user@example.com",
  password: "password123",
});

// 上传文件
const uploadResult = await FileService.uploadFile(file, "image");

// 获取统计数据
const stats = await SystemService.getStatistics();

// 自定义配置
const response = await request.post("/api/data", data, {
  timeout: 30000, // 30秒超时
  retryCount: 3, // 重试3次
  showLoading: true, // 显示loading
  showError: false, // 不显示错误提示
});
```

### 添加新组件

1. 在 `src/components/` 下创建组件目录
2. 创建组件文件、样式文件和类型定义
3. 导出组件供其他模块使用

## 📚 相关文档

- [Semi UI 官方文档](https://semi.design/)
- [React 官方文档](https://react.dev/)
- [Vite 官方文档](https://vitejs.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来完善这个项目。

## 📄 开源协议

[MIT License](LICENSE)
