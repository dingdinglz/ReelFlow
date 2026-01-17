/**
 * 播放器屏幕 - 支持视频/图片无缝切换
 */
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import Video from 'react-native-video';
import { Task, Resource } from '../types';
import { StorageService } from '../services/storage';
import { DownloaderService } from '../services/downloader';
import ApiService from '../services/api';

const { width, height } = Dimensions.get('window');

export const PlayerScreen: React.FC = () => {
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [nextTask, setNextTask] = useState<Task | null>(null);
  const [activeLayer, setActiveLayer] = useState<'A' | 'B'>('A');
  const [currentResourceIndex, setCurrentResourceIndex] = useState(0);

  const videoRefA = useRef<Video>(null);
  const videoRefB = useRef<Video>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initializePlayer();
    startMonitoring();

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentTask && currentTask.resources.length > 0) {
      // 如果有多个资源，设置轮播
      if (currentTask.resources.length > 1) {
        scheduleNextResource();
      }
    }
  }, [currentTask, currentResourceIndex]);

  const initializePlayer = async () => {
    // 清理过期任务
    await StorageService.cleanExpiredTasks();

    // 获取当前任务
    const task = await StorageService.getCurrentTask();
    setCurrentTask(task);

    // 获取下一个任务用于预加载
    const next = await StorageService.getNextTask();
    if (next && next.status === 'pending') {
      // 开始下载下一个任务
      downloadAndPrepareTask(next);
      setNextTask(next);
    }
  };

  const startMonitoring = () => {
    // 每秒检查是否需要切换任务
    timerRef.current = setInterval(() => {
      checkAndSwitchTask();
    }, 1000);
  };

  const checkAndSwitchTask = async () => {
    const task = await StorageService.getCurrentTask();

    if (task && task.id !== currentTask?.id) {
      // 需要切换到新任务
      switchToNewTask(task);
    }
  };

  const switchToNewTask = async (task: Task) => {
    const oldTask = currentTask;

    // 切换图层
    setActiveLayer((prev) => prev === 'A' ? 'B' : 'A');

    // 更新当前任务
    setCurrentTask(task);
    setCurrentResourceIndex(0);

    // 清理旧任务资源
    if (oldTask) {
      setTimeout(() => {
        DownloaderService.deleteTaskResources(oldTask.id);
      }, 5000); // 延迟删除，确保切换完成
    }

    // 准备下一个任务
    const next = await StorageService.getNextTask();
    if (next && next.status === 'pending') {
      downloadAndPrepareTask(next);
      setNextTask(next);
    }
  };

  const downloadAndPrepareTask = async (task: Task) => {
    try {
      await DownloaderService.downloadTask(task);
    } catch (error) {
      console.error('任务下载失败:', error);
    }
  };

  const scheduleNextResource = () => {
    if (!currentTask) return;

    const resource = currentTask.resources[currentResourceIndex];
    const duration = resource.type === 'video' ? undefined : resource.duration || 5000;

    if (duration) {
      setTimeout(() => {
        const nextIndex = (currentResourceIndex + 1) % currentTask.resources.length;
        setCurrentResourceIndex(nextIndex);
      }, duration);
    }
  };

  const handleVideoEnd = () => {
    if (!currentTask) return;

    if (currentTask.resources.length > 1) {
      const nextIndex = (currentResourceIndex + 1) % currentTask.resources.length;
      setCurrentResourceIndex(nextIndex);
    }
  };

  const renderLayerA = () => {
    if (!currentTask) return null;
    const resource = currentTask.resources[currentResourceIndex];
    if (!resource) return null;

    const isVisible = activeLayer === 'A';

    return (
      <View style={[styles.layer, isVisible ? styles.visible : styles.hidden]}>
        {resource.type === 'video' ? (
          <Video
            ref={videoRefA}
            source={{ uri: `file://${resource.localPath}` }}
            style={styles.fullScreen}
            resizeMode="cover"
            repeat={currentTask.resources.length === 1}
            onEnd={handleVideoEnd}
            paused={!isVisible}
          />
        ) : (
          <Image
            source={{ uri: `file://${resource.localPath}` }}
            style={styles.fullScreen}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  const renderLayerB = () => {
    if (!currentTask) return null;
    const resource = currentTask.resources[currentResourceIndex];
    if (!resource) return null;

    const isVisible = activeLayer === 'B';

    return (
      <View style={[styles.layer, isVisible ? styles.visible : styles.hidden]}>
        {resource.type === 'video' ? (
          <Video
            ref={videoRefB}
            source={{ uri: `file://${resource.localPath}` }}
            style={styles.fullScreen}
            resizeMode="cover"
            repeat={currentTask.resources.length === 1}
            onEnd={handleVideoEnd}
            paused={!isVisible}
          />
        ) : (
          <Image
            source={{ uri: `file://${resource.localPath}` }}
            style={styles.fullScreen}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" hidden />

      {/* 双容器预加载 */}
      {renderLayerA()}
      {renderLayerB()}

      {/* 调试信息（仅开发模式显示） */}
      {__DEV__ && (
        <View style={styles.debugInfo}>
          {/* 可以在这里添加调试信息 */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height,
    backgroundColor: '#000',
  },
  layer: {
    ...StyleSheet.absoluteFillObject,
    width,
    height,
  },
  visible: {
    zIndex: 2,
  },
  hidden: {
    zIndex: 1,
  },
  fullScreen: {
    width,
    height,
  },
  debugInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 5,
  },
});
