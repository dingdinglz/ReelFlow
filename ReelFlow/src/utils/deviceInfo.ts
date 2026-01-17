/**
 * 设备信息工具类
 */
import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONSTANTS } from '../constants/app';

/**
 * 生成或获取设备唯一标识
 */
export const getDeviceId = async (): Promise<string> => {
  let deviceId = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.DEVICE_ID);

  if (!deviceId) {
    // 生成新的 UUID
    deviceId = generateUUID();
    await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.DEVICE_ID, deviceId);
  }

  return deviceId;
};

/**
 * 生成 UUID v4
 */
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

/**
 * 获取授权状态
 */
export const getAuthStatus = async (): Promise<'waiting' | 'authorized' | 'rejected'> => {
  const status = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_STATUS);
  return (status as any) || 'waiting';
};

/**
 * 设置授权状态
 */
export const setAuthStatus = async (status: 'waiting' | 'authorized' | 'rejected'): Promise<void> => {
  await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.AUTH_STATUS, status);
};

/**
 * 获取服务器 URL
 */
export const getServerUrl = async (): Promise<string> => {
  const url = await AsyncStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.SERVER_URL);
  return url || APP_CONSTANTS.DEFAULT_SERVER_URL;
};

/**
 * 设置服务器 URL
 */
export const setServerUrl = async (url: string): Promise<void> => {
  await AsyncStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.SERVER_URL, url);
};
