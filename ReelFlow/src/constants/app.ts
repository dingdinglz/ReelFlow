/**
 * 应用常量配置
 */

export const APP_CONSTANTS = {
  // 默认服务器地址
  DEFAULT_SERVER_URL: 'https://link.demo.com',

  // 存储键
  STORAGE_KEYS: {
    DEVICE_ID: 'tv_device_id',
    SERVER_URL: 'tv_server_url',
    AUTH_STATUS: 'tv_auth_status',
    TASKS_DB: 'tv_tasks_db',
    SETTINGS: 'tv_settings',
  },

  // 心跳间隔（毫秒）
  HEARTBEAT_INTERVAL: 30000, // 30秒

  // 资源检查间隔（毫秒）
  RESOURCE_CHECK_INTERVAL: 1000, // 1秒

  // API 端点
  API_ENDPOINTS: {
    REGISTER: '/api/device/register',
    HEARTBEAT: '/api/device/heartbeat',
    TASKS: '/api/device/tasks',
    CONFIG: '/api/device/config',
  },
};
