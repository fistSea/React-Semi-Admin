# 故障排除指南

## 常见问题和解决方案

### 1. 图标导入错误

#### 问题现象

```
Uncaught SyntaxError: The requested module '/node_modules/.vite/deps/@douyinfe_semi-icons.js' does not provide an export named 'IconChart'
```

#### 原因

Semi UI 图标库中不存在某些图标名称。

#### 解决方案

检查并使用正确的图标名称：

**常见错误图标及替代方案：**

- `IconChart` → `IconPieChartStroked`
- `IconMonitor` → `IconDesktop` 或 `IconActivity`
- `IconTable` → `IconList` 或 `IconMenu`

**如何查找正确图标：**

1. 访问 [Semi UI 图标库文档](https://semi.design/zh-CN/basic/icon)
2. 在图标列表中搜索相似功能的图标
3. 使用正确的图标名称

### 2. 组件导入错误

#### 问题现象

```
The requested module does not provide an export named 'Result'
```

#### 原因

Semi UI 中不存在 `Result` 组件。

#### 解决方案

使用 `Empty` 组件替代：

```typescript
// ❌ 错误
import { Result } from "@douyinfe/semi-ui";

// ✅ 正确
import { Empty } from "@douyinfe/semi-ui";
```

### 3. 权限检查错误

#### 问题现象

- 菜单项不显示
- 路由无法访问
- 权限检查失败

#### 解决方案

**检查用户状态：**

```typescript
const { user } = useUser();
console.log("用户信息:", user);
console.log("是否登录:", user.isLoggedIn);
console.log("用户角色:", user.role);
```

**检查权限配置：**

```typescript
// 确保权限配置正确
permission: {
  allowedRoles: ["admin", "user"], // 允许的角色
  requireAuth: true,               // 是否需要登录
  description: "功能描述"          // 权限描述
}
```

### 4. 路由守卫错误

#### 问题现象

页面显示错误边界或白屏

#### 解决方案

**检查路由配置：**

```typescript
// 确保路径和组件配置正确
{
  itemKey: "unique-key",    // 唯一标识
  text: "菜单文本",         // 显示文本
  path: "/correct/path",    // 正确路径
  component: ComponentName, // 组件引用
  permission: { ... }       // 权限配置
}
```

### 5. 多级菜单显示问题

#### 问题现象

- 子菜单不显示
- 菜单层级错误
- 菜单状态不同步

#### 解决方案

**检查菜单结构：**

```typescript
// 正确的多级菜单结构
{
  itemKey: "parent",
  text: "父菜单",
  icon: ParentIcon,
  permission: { ... },
  items: [  // 子菜单数组
    {
      itemKey: "child",
      text: "子菜单",
      path: "/parent/child",
      component: ChildComponent,
      permission: { ... }
    }
  ]
}
```

**检查权限继承：**

- 父菜单权限会影响子菜单显示
- 子菜单权限应该不低于父菜单权限

### 6. 开发环境错误

#### ESLint 配置错误

**问题现象：**

```
ESLint couldn't find the config "@typescript-eslint/recommended"
```

**解决方案：**

```bash
# 安装缺失的依赖
npm install --save-dev @typescript-eslint/recommended

# 或者更新 .eslintrc.cjs 配置
```

#### Vite 开发服务器错误

**问题现象：**

- 热重载失败
- 模块解析错误

**解决方案：**

```bash
# 清除缓存并重启
rm -rf node_modules/.vite
npm run dev
```

### 7. 错误边界使用

项目已集成错误边界组件，当出现运行时错误时会显示友好的错误页面：

**特性：**

- 捕获组件树中的 JavaScript 错误
- 显示友好的错误提示
- 开发模式下显示详细错误信息
- 提供刷新和返回首页的操作

**使用方式：**
错误边界已自动包装在 App 组件中，无需额外配置。

### 8. 性能问题排查

#### 组件渲染缓慢

**排查步骤：**

1. 使用 React DevTools 分析组件渲染
2. 检查是否有不必要的重渲染
3. 考虑使用 React.memo 优化

**优化建议：**

```typescript
// 使用React.memo优化
const OptimizedComponent = React.memo(MyComponent);

// 使用useMemo缓存计算结果
const expensiveValue = useMemo(() => {
  return expensiveCalculation(data);
}, [data]);
```

### 9. 样式问题

#### 主题切换问题

**检查主题配置：**

```typescript
const { isDark, toggleMode } = useTheme();
```

#### 响应式布局问题

**使用 Semi UI 的响应式组件：**

```typescript
import { Row, Col } from "@douyinfe/semi-ui";

// 响应式布局
<Row gutter={16}>
  <Col span={24} md={12} lg={8}>
    内容
  </Col>
</Row>;
```

### 10. 调试技巧

#### 权限调试

```typescript
// 在权限测试面板中切换角色
// 访问 /about 页面查看当前权限状态
```

#### 路由调试

```typescript
// 在浏览器控制台查看当前路由状态
console.log("当前路径:", window.location.pathname);
console.log("路由历史:", window.history);
```

#### 状态调试

```typescript
// 使用React DevTools查看组件状态
// 或在组件中添加调试日志
const { state } = useAppContext();
console.log("应用状态:", state);
```

### 11. 获取帮助

如果遇到无法解决的问题：

1. **检查文档**：查看相关组件的使用文档
2. **查看示例**：参考 `/examples` 目录下的示例代码
3. **检查控制台**：查看浏览器控制台的错误信息
4. **使用调试工具**：使用 React DevTools 和浏览器调试工具

### 12. 最佳实践

#### 错误预防

- 使用 TypeScript 类型检查
- 定期更新依赖包
- 遵循代码规范
- 编写单元测试

#### 代码质量

- 使用 ESLint 检查代码质量
- 遵循组件命名规范
- 保持代码结构清晰
- 及时重构过时代码

通过遵循这些指南，您应该能够解决大部分常见问题并提高开发效率。
