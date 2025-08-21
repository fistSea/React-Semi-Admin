import React, { Component, ErrorInfo, ReactNode } from "react";
import { Empty, Button } from "@douyinfe/semi-ui";
import { IconAt } from "@douyinfe/semi-icons";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <Empty
            image={<IconAt size="extra-large" style={{ color: "#f93920" }} />}
            title="页面出现错误"
            description={
              <div>
                <p>抱歉，页面运行时出现了错误</p>
                {process.env.NODE_ENV === "development" && this.state.error && (
                  <details
                    style={{
                      marginTop: "16px",
                      padding: "12px",
                      backgroundColor: "#f6f6f6",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontFamily: "monospace",
                    }}
                  >
                    <summary>错误详情（开发模式）</summary>
                    <pre
                      style={{ margin: "8px 0 0 0", whiteSpace: "pre-wrap" }}
                    >
                      {this.state.error.stack}
                    </pre>
                  </details>
                )}
              </div>
            }
          >
            <div style={{ marginTop: "16px" }}>
              <Button
                type="primary"
                onClick={this.handleReload}
                style={{ marginRight: 8 }}
              >
                刷新页面
              </Button>
              <Button onClick={this.handleGoHome}>回到首页</Button>
            </div>
          </Empty>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
