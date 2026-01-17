/**
 * 本地存储服务 - 管理任务和资源
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../constants/app';
import { Task } from '../types';

export class StorageService {
  /**
   * 保存任务列表
   */
  static async saveTasks(tasks: Task[]): Promise<void> {
    await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TASKS_DB, JSON.stringify(tasks));
  }

  /**
   * 获取任务列表
   */
  static async getTasks(): Promise<Task[]> {
    const tasksJson = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TASKS_DB);
    if (!tasksJson) return [];
    return JSON.parse(tasksJson);
  }

  /**
   * 获取当前应该执行的任务
   */
  static async getCurrentTask(): Promise<Task | null> {
    const tasks = await this.getTasks();
    const now = Date.now();

    return tasks.find(
      (task) => task.status === 'ready' && now >= task.startTime && now <= task.endTime
    ) || null;
  }

  /**
   * 获取下一个任务
   */
  static async getNextTask(): Promise<Task | null> {
    const tasks = await this.getTasks();
    const now = Date.now();

    // 找到下一个即将开始的任务
    const upcomingTasks = tasks
      .filter((task) => task.status === 'ready' && task.startTime > now)
      .sort((a, b) => a.startTime - b.startTime);

    return upcomingTasks[0] || null;
  }

  /**
   * 更新任务状态
   */
  static async updateTaskStatus(taskId: string, status: Task['status']): Promise<void> {
    const tasks = await this.getTasks();
    const taskIndex = tasks.findIndex((t) => t.id === taskId);

    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      await this.saveTasks(tasks);
    }
  }

  /**
   * 删除过期任务
   */
  static async cleanExpiredTasks(): Promise<void> {
    const tasks = await this.getTasks();
    const now = Date.now();

    const activeTasks = tasks.filter((task) => task.endTime > now);
    await this.saveTasks(activeTasks);
  }
}
