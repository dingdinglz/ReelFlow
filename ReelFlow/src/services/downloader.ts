/**
 * 资源下载服务
 */
import RNBlobUtil from 'react-native-blob-util';
import { Task, Resource } from '../types';
import { StorageService } from './storage';

export class DownloaderService {
  private static activeDownloads = new Map<string, any>();

  /**
   * 下载任务的所有资源
   */
  static async downloadTask(task: Task): Promise<string> {
    const { dirs } = RNBlobUtil.fs;
    const taskPath = `${dirs.DocumentDir}/tasks/${task.id}`;

    // 创建任务目录
    RNBlobUtil.fs.mkdir(taskPath);

    // 更新任务状态为下载中
    StorageService.updateTaskStatus(task.id, 'downloading');

    try {
      // 下载所有资源
      for (const resource of task.resources) {
        const localPath = await this.downloadResource(resource, taskPath);
        resource.localPath = localPath;
      }

      // 更新任务状态为就绪
      task.downloadPath = taskPath;
      task.status = 'ready';
      StorageService.saveTasks(StorageService.getTasks().map(t => t.id === task.id ? task : t));

      return taskPath;
    } catch (error) {
      console.error('下载任务失败:', error);
      StorageService.updateTaskStatus(task.id, 'pending');
      throw error;
    }
  }

  /**
   * 下载单个资源
   */
  private static async downloadResource(resource: Resource, taskPath: string): Promise<string> {
    const extension = resource.type === 'video' ? 'mp4' : 'jpg';
    const localPath = `${taskPath}/${resource.id}.${extension}`;

    return new Promise((resolve, reject) => {
      RNBlobUtil.config({
        fileCache: true,
        path: localPath,
      })
        .fetch('GET', resource.url)
        .progress((received, total) => {
          const progress = (received / total) * 100;
          console.log(`下载进度: ${progress.toFixed(2)}%`);
        })
        .then((res) => {
          if (res.info().status === 200) {
            resolve(res.path());
          } else {
            reject(new Error('下载失败'));
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 删除任务资源
   */
  static async deleteTaskResources(taskId: string): Promise<void> {
    const { dirs } = RNBlobUtil.fs;
    const taskPath = `${dirs.DocumentDir}/tasks/${taskId}`;

    try {
      const exists = await RNBlobUtil.fs.exists(taskPath);
      if (exists) {
        await RNBlobUtil.fs.unlink(taskPath);
        console.log(`已删除任务 ${taskId} 的资源`);
      }
    } catch (error) {
      console.error('删除资源失败:', error);
    }
  }

  /**
   * 取消下载
   */
  static cancelDownload(taskId: string): void {
    const download = this.activeDownloads.get(taskId);
    if (download) {
      download.cancel();
      this.activeDownloads.delete(taskId);
    }
  }
}
