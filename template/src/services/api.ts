import { request } from "@/utils/request";
import type { BaseResponse } from "@/types";

// 用户相关接口
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
  expires: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// 分页接口
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 用户API服务
export class UserService {
  /**
   * 用户登录
   */
  static async login(data: LoginRequest): Promise<BaseResponse<LoginResponse>> {
    return request.post<LoginResponse>("/auth/login", data, {
      showLoading: true,
      showError: true,
    });
  }

  /**
   * 用户注册
   */
  static async register(data: RegisterRequest): Promise<BaseResponse<User>> {
    return request.post<User>("/auth/register", data, {
      showLoading: true,
      showError: true,
    });
  }

  /**
   * 获取当前用户信息
   */
  static async getCurrentUser(): Promise<BaseResponse<User>> {
    return request.get<User>("/auth/profile", {
      showError: true,
    });
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(data: Partial<User>): Promise<BaseResponse<User>> {
    return request.put<User>("/auth/profile", data, {
      showLoading: true,
      showError: true,
    });
  }

  /**
   * 修改密码
   */
  static async changePassword(data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<BaseResponse<null>> {
    return request.put<null>("/auth/password", data, {
      showLoading: true,
      showError: true,
    });
  }

  /**
   * 用户退出登录
   */
  static async logout(): Promise<BaseResponse<null>> {
    return request.post<null>("/auth/logout", null, {
      showError: false,
    });
  }

  /**
   * 获取用户列表（管理员功能）
   */
  static async getUserList(
    params: PaginationParams = {}
  ): Promise<BaseResponse<PaginationResponse<User>>> {
    return request.get<PaginationResponse<User>>("/admin/users", {
      // 将参数转换为查询字符串
      body: new URLSearchParams(params as Record<string, string>).toString(),
      showError: true,
    });
  }

  /**
   * 上传头像
   */
  static async uploadAvatar(
    file: File
  ): Promise<BaseResponse<{ url: string }>> {
    return request.upload<{ url: string }>("/upload/avatar", file, {
      showLoading: true,
      showError: true,
    });
  }
}

// 系统API服务
export class SystemService {
  /**
   * 获取系统配置
   */
  static async getConfig(): Promise<BaseResponse<Record<string, any>>> {
    return request.get<Record<string, any>>("/system/config", {
      showError: false,
    });
  }

  /**
   * 健康检查
   */
  static async healthCheck(): Promise<
    BaseResponse<{ status: string; timestamp: string }>
  > {
    return request.get<{ status: string; timestamp: string }>("/health", {
      timeout: 5000,
      showError: false,
      retryCount: 2,
    });
  }

  /**
   * 获取统计数据
   */
  static async getStatistics(): Promise<BaseResponse<Record<string, number>>> {
    return request.get<Record<string, number>>("/statistics", {
      showError: true,
    });
  }

  /**
   * 发送反馈
   */
  static async sendFeedback(data: {
    type: "bug" | "feature" | "general";
    title: string;
    content: string;
    email?: string;
  }): Promise<BaseResponse<null>> {
    return request.post<null>("/feedback", data, {
      showLoading: true,
      showError: true,
    });
  }
}

// 文件服务
export class FileService {
  /**
   * 上传文件
   */
  static async uploadFile(
    file: File,
    type: "image" | "document" | "video" = "image"
  ): Promise<BaseResponse<{ url: string; filename: string; size: number }>> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", type);

    return request.upload<{ url: string; filename: string; size: number }>(
      "/upload/file",
      formData,
      {
        showLoading: true,
        showError: true,
        timeout: 30000, // 文件上传延长超时时间
      }
    );
  }

  /**
   * 下载文件
   */
  static async downloadFile(url: string, filename?: string): Promise<void> {
    return request.download(url, filename, {
      showError: true,
    });
  }

  /**
   * 删除文件
   */
  static async deleteFile(fileId: string): Promise<BaseResponse<null>> {
    return request.delete<null>(`/files/${fileId}`, {
      showLoading: true,
      showError: true,
    });
  }
}

// 导出所有服务
export { UserService as User, SystemService as System, FileService as File };

// 默认导出，便于模块化导入
export default {
  User: UserService,
  System: SystemService,
  File: FileService,
};
