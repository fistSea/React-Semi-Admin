import type { BaseResponse } from "@/types";
import { Toast } from "@douyinfe/semi-ui";

// 请求配置接口
interface RequestConfig extends RequestInit {
  timeout?: number;
  showError?: boolean; // 是否显示错误提示
  showLoading?: boolean; // 是否显示加载状态
  retryCount?: number; // 重试次数
}

// 拦截器接口
interface RequestInterceptors {
  requestInterceptor?: (
    config: RequestConfig
  ) => RequestConfig | Promise<RequestConfig>;
  responseInterceptor?: <T>(
    response: BaseResponse<T>
  ) => BaseResponse<T> | Promise<BaseResponse<T>>;
  errorInterceptor?: (error: any) => void;
}

// 默认配置
const DEFAULT_CONFIG: RequestConfig = {
  timeout: 10000,
  showError: true,
  showLoading: false,
  retryCount: 0,
  headers: {
    "Content-Type": "application/json",
  },
};

/**
 * HTTP请求工具类
 */
class Request {
  private baseURL: string;
  private defaultConfig: RequestConfig;
  private interceptors: RequestInterceptors;
  private loadingCount: number = 0;

  constructor(
    baseURL = "",
    config: RequestConfig = {},
    interceptors: RequestInterceptors = {}
  ) {
    this.baseURL = baseURL;
    this.defaultConfig = { ...DEFAULT_CONFIG, ...config };
    this.interceptors = interceptors;
  }

  /**
   * 显示加载状态
   */
  private showLoading() {
    this.loadingCount++;
    if (this.loadingCount === 1) {
      // 可以在这里集成全局Loading组件
      console.log("请求开始...");
    }
  }

  /**
   * 隐藏加载状态
   */
  private hideLoading() {
    this.loadingCount--;
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      console.log("请求结束");
    }
  }

  /**
   * 显示错误提示
   */
  private showError(message: string) {
    Toast.error({
      content: message,
      duration: 3,
    });
  }

  /**
   * 获取Token
   */
  private getToken(): string | null {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  }

  /**
   * 发送请求
   */
  private async request<T>(
    url: string,
    config: RequestConfig = {}
  ): Promise<BaseResponse<T>> {
    let finalConfig = { ...this.defaultConfig, ...config };
    const { timeout, showError, showLoading, retryCount, ...restConfig } =
      finalConfig;

    // 应用请求拦截器
    if (this.interceptors.requestInterceptor) {
      finalConfig = await this.interceptors.requestInterceptor(finalConfig);
    }

    // 处理URL
    const finalUrl = url.startsWith("http") ? url : `${this.baseURL}${url}`;

    // 添加Token到请求头
    const token = this.getToken();
    if (token && restConfig.headers) {
      (
        restConfig.headers as Record<string, string>
      ).Authorization = `Bearer ${token}`;
    }

    // 显示加载状态
    if (showLoading) {
      this.showLoading();
    }

    // 创建AbortController用于超时控制
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let attempt = 0;
    const maxRetries = retryCount || 0;

    while (attempt <= maxRetries) {
      try {
        const response = await fetch(finalUrl, {
          ...restConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `HTTP错误: ${response.status}`;

          // 尝试解析错误响应
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
          } catch {
            // 如果无法解析JSON，使用默认错误消息
          }

          throw new Error(errorMessage);
        }

        const data = await response.json();

        // 应用响应拦截器
        let result = data;
        if (this.interceptors.responseInterceptor) {
          result = await this.interceptors.responseInterceptor(data);
        }

        // 隐藏加载状态
        if (showLoading) {
          this.hideLoading();
        }

        // 检查业务错误码
        if (result.code && result.code !== 200 && result.code !== 0) {
          const errorMsg = result.message || "请求失败";
          if (showError) {
            this.showError(errorMsg);
          }
          throw new Error(errorMsg);
        }

        return result;
      } catch (error) {
        clearTimeout(timeoutId);

        // 判断是否需要重试
        if (attempt < maxRetries && this.shouldRetry(error)) {
          attempt++;
          await this.delay(1000 * attempt); // 指数退避
          continue;
        }

        // 隐藏加载状态
        if (showLoading) {
          this.hideLoading();
        }

        // 应用错误拦截器
        if (this.interceptors.errorInterceptor) {
          this.interceptors.errorInterceptor(error);
        }

        // 显示错误提示
        if (showError) {
          const message =
            error instanceof Error ? error.message : "网络请求失败";
          this.showError(message);
        }

        throw error;
      }
    }

    throw new Error("请求失败");
  }

  /**
   * 判断是否应该重试
   */
  private shouldRetry(error: any): boolean {
    // 网络错误或者5xx服务器错误才重试
    return (
      error.name === "AbortError" ||
      error.message.includes("网络") ||
      error.message.includes("timeout") ||
      error.message.includes("fetch")
    );
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * GET请求
   */
  get<T>(url: string, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: "GET" });
  }

  /**
   * POST请求
   */
  post<T>(url: string, data?: any, config?: RequestConfig) {
    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT请求
   */
  put<T>(url: string, data?: any, config?: RequestConfig) {
    return this.request<T>(url, {
      ...config,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH请求
   */
  patch<T>(url: string, data?: any, config?: RequestConfig) {
    return this.request<T>(url, {
      ...config,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE请求
   */
  delete<T>(url: string, config?: RequestConfig) {
    return this.request<T>(url, { ...config, method: "DELETE" });
  }

  /**
   * 上传文件
   */
  upload<T>(url: string, file: File | FormData, config?: RequestConfig) {
    const formData = file instanceof FormData ? file : new FormData();
    if (file instanceof File) {
      formData.append("file", file);
    }

    return this.request<T>(url, {
      ...config,
      method: "POST",
      body: formData,
      headers: {
        // 移除Content-Type，让浏览器自动设置boundary
        ...config?.headers,
      },
    });
  }

  /**
   * 下载文件
   */
  async download(url: string, filename?: string, config?: RequestConfig) {
    const response = await fetch(
      url.startsWith("http") ? url : `${this.baseURL}${url}`,
      {
        ...this.defaultConfig,
        ...config,
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error(`下载失败: ${response.status}`);
    }

    const blob = await response.blob();
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  /**
   * 设置拦截器
   */
  setInterceptors(interceptors: RequestInterceptors) {
    this.interceptors = { ...this.interceptors, ...interceptors };
  }

  /**
   * 设置baseURL
   */
  setBaseURL(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * 取消所有请求
   */
  cancelAll() {
    // 这里可以实现取消所有正在进行的请求
    this.loadingCount = 0;
  }
}

// 创建默认实例
const baseURL = import.meta.env.VITE_API_BASE_URL || "";
export const request = new Request(baseURL);

// 设置默认拦截器
request.setInterceptors({
  requestInterceptor: (config) => {
    // 可以在这里添加通用的请求头
    return config;
  },
  responseInterceptor: (response) => {
    // 可以在这里统一处理响应数据
    return response;
  },
  errorInterceptor: (error) => {
    // 可以在这里统一处理错误
    if (error.message.includes("401")) {
      // 处理token过期
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  },
});

// 导出Request类供自定义使用
export default Request;
