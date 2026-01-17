/**
 * 应用类型定义
 */

export type ResourceType = 'video' | 'image';

export interface Task {
  id: string;
  startTime: number; // 时间戳
  endTime: number; // 时间戳
  resources: Resource[];
  status: 'pending' | 'downloading' | 'ready' | 'active' | 'expired';
  downloadPath?: string;
}

export interface Resource {
  id: string;
  type: ResourceType;
  url: string;
  duration?: number; // 图片显示时长（毫秒）
  localPath?: string;
}

export interface DeviceInfo {
  deviceId: string;
  authStatus: 'waiting' | 'authorized' | 'rejected';
  serverUrl: string;
}

export interface AppSettings {
  serverUrl: string;
  autoPlay: boolean;
  volume: number;
}
