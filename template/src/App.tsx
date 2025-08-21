import { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout/Layout";
import Loading from "@/components/Loading/Loading";
import PermissionGuard from "@/components/PermissionGuard/PermissionGuard";
import ErrorBoundary from "@/components/ErrorBoundary/ErrorBoundary";
import { flattenAccessibleRoutes, routeConfig } from "@/config/routes";
import { AppProvider, useUser } from "@/contexts/AppContext";

// 内部App组件，可以使用Context
const AppContent = () => {
  const { user } = useUser();

  // 获取用户有权限访问的扁平化路由配置
  const accessibleRoutes = flattenAccessibleRoutes(
    routeConfig,
    user.role,
    user.isLoggedIn
  );

  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<Loading size="large" text="页面加载中..." />}>
          <Routes>
            {accessibleRoutes.map((route) => (
              <Route
                key={route.itemKey}
                path={route.path}
                element={
                  <PermissionGuard permission={route.permission}>
                    {route.component ? <route.component /> : null}
                  </PermissionGuard>
                }
              />
            ))}
            {/* 404页面 */}
            <Route
              path="*"
              element={
                <div
                  style={{
                    textAlign: "center",
                    padding: "100px 20px",
                    fontSize: "16px",
                  }}
                >
                  <h2>页面未找到</h2>
                  <p>您访问的页面不存在或没有权限访问</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
