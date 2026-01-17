/**
 * 后台任务服务
 * 用于定期同步任务和资源
 */
import { AppState, AppStateStatus } from 'react-native';
import { getDeviceId } from '../utils/deviceInfo';
import ApiService from './api';
import { StorageService } from './storage';
import { DownloaderService } from './downloader';
import { Task } from '../types';
import Logger from '../utils/logger';

export class BackgroundTaskService {
  private static instance: BackgroundTaskService;
  private syncInterval: NodeJS.Timeout | null = null;
  private isRunning = false;

  private constructor() {}

  static getInstance(): BackgroundTaskService {
    if (!BackgroundTaskService.instance) {
      BackgroundTaskService.instance = new BackgroundTaskService();
    }
    return BackgroundTaskService.instance;
  }

  /**
   * 启动后台任务
   */
  start() {
    if (this.isRunning) return;

    Logger.info('启动后台任务服务');
    this.isRunning = true;

    // 立即执行一次同步
    this.syncTasks();

    // 每30秒同步一次任务
    this.syncInterval = setInterval(() => {
      this.syncTasks();
    }, 30000);

    // 监听应用状态变化
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  /**
   * 停止后台任务
   */
  stop() {
    if (!this.isRunning) return;

    Logger.info('停止后台任务服务');
    this.isRunning = false;

    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }

    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  /**
   * 处理应用状态变化
   */
  private handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      Logger.info('应用进入前台，执行同步');
      this.syncTasks();
    }
  };

  /**
   * 同步任务
   */
  private async syncTasks() {
    try {
      const deviceId = await getDeviceId();
      const response = await ApiService.getTasks(deviceId);

      if (response && response.tasks) {
        const serverTasks: Task[] = response.tasks;
        const localTasks = await StorageService.getTasks();

        // 对比任务，找出需要下载的新任务
        const newTasks = serverTasks.filter(
          (serverTask) => !localTasks.some((localTask) => localTask.id === serverTask.id)
        );

        // 保存新任务
        if (newTasks.length > 0) {
          Logger.info(`发现 ${newTasks.length} 个新任务`);

          const updatedTasks = [...localTasks, ...newTasks];
          await StorageService.saveTasks(updatedTasks);

          // 开始下载新任务
          for (const task of newTasks) {
            if (task.status === 'pending') {
              this.downloadTask(task);
            }
          }
        }
      }
    } catch (error) {
      Logger.error('同步任务失败', error);
    }
  }

  /**
   * 下载任务
   */
  private async downloadTask(task: Task) {
    try {
      Logger.info(`开始下载任务: ${task.id}`);
      await DownloaderService.downloadTask(task);
      Logger.info(`任务下载完成: ${task.id}`);
    } catch (error) {
      Logger.error(`任务下载失败: ${task.id}`, error);
    }
  }
}

export default BackgroundTaskService.getInstance();
