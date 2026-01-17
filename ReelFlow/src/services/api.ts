/**
 * API 服务
 */
import axios, { AxiosInstance } from 'axios';
import { getServerUrl } from '../utils/deviceInfo';
import { APP_CONSTANTS } from '../constants/app';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * 注册设备（发送心跳）
   */
  async registerDevice(deviceId: string) {
    try {
      const serverUrl = await getServerUrl();
      const response = await axios.post(
        `${serverUrl}${APP_CONSTANTS.API_ENDPOINTS.REGISTER}`,
        {
          deviceId,
          timestamp: Date.now(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('注册设备失败:', error);
      throw error;
    }
  }

  /**
   * 发送心跳
   */
  async sendHeartbeat(deviceId: string) {
    try {
      const serverUrl = await getServerUrl();
      const response = await axios.post(
        `${serverUrl}${APP_CONSTANTS.API_ENDPOINTS.HEARTBEAT}`,
        {
          deviceId,
          timestamp: Date.now(),
        }
      );
      return response.data;
    } catch (error) {
      console.error('发送心跳失败:', error);
      throw error;
    }
  }

  /**
   * 获取任务列表
   */
  async getTasks(deviceId: string) {
    try {
      const serverUrl = await getServerUrl();
      const response = await axios.get(
        `${serverUrl}${APP_CONSTANTS.API_ENDPOINTS.TASKS}`,
        {
          params: { deviceId },
        }
      );
      return response.data;
    } catch (error) {
      console.error('获取任务列表失败:', error);
      throw error;
    }
  }

  /**
   * 测试服务器连接
   */
  async testConnection(url: string): Promise<boolean> {
    try {
      const response = await axios.get(`${url}${APP_CONSTANTS.API_ENDPOINTS.CONFIG}`, {
        timeout: 5000,
      });
      return response.status === 200;
    } catch (error) {
      console.error('测试连接失败:', error);
      return false;
    }
  }
}

export default new ApiService();
