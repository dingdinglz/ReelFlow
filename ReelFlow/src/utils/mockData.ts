/**
 * 演示数据 - 用于开发和测试
 */
import { Task } from '../types';

export const mockTasks: Task[] = [
  {
    id: 'task_20250710',
    startTime: new Date('2025-07-10T00:00:00').getTime(),
    endTime: new Date('2025-07-10T23:59:59').getTime(),
    status: 'ready',
    downloadPath: '/mock/path/task_20250710',
    resources: [
      {
        id: 'res_001',
        type: 'video',
        url: 'https://example.com/video1.mp4',
        localPath: '/mock/path/video1.mp4',
      },
    ],
  },
  {
    id: 'task_20250711',
    startTime: new Date('2025-07-11T00:00:00').getTime(),
    endTime: new Date('2025-07-11T23:59:59').getTime(),
    status: 'ready',
    downloadPath: '/mock/path/task_20250711',
    resources: [
      {
        id: 'res_002',
        type: 'image',
        url: 'https://example.com/image1.jpg',
        duration: 5000,
        localPath: '/mock/path/image1.jpg',
      },
      {
        id: 'res_003',
        type: 'image',
        url: 'https://example.com/image2.jpg',
        duration: 5000,
        localPath: '/mock/path/image2.jpg',
      },
    ],
  },
  {
    id: 'task_20250720',
    startTime: new Date('2025-07-20T00:00:00').getTime(),
    endTime: new Date('2025-07-20T23:59:59').getTime(),
    status: 'pending',
    resources: [
      {
        id: 'res_004',
        type: 'video',
        url: 'https://example.com/video2.mp4',
      },
    ],
  },
];

/**
 * 初始化演示数据
 */
export const initMockData = () => {
  if (__DEV__) {
    console.log('初始化演示数据...');
    console.log('可用任务:', mockTasks.length);
  }
};
