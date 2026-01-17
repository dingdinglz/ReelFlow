/**
 * 设备授权屏幕
 */
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { getDeviceId, getAuthStatus } from '../utils/deviceInfo';
import ApiService from '../services/api';

const { width, height } = Dimensions.get('window');

export const AuthorizationScreen: React.FC = () => {
  const [deviceId, setDeviceId] = useState<string>('');
  const [authStatus, setAuthStatusState] = useState<'waiting' | 'authorized' | 'rejected'>('waiting');

  useEffect(() => {
    initializeDevice();
  }, []);

  useEffect(() => {
    if (deviceId) {
      // 启动心跳
      const heartbeatInterval = setInterval(async () => {
        try {
          await ApiService.registerDevice(deviceId);
          const status = await getAuthStatus();
          setAuthStatusState(status);
        } catch (error) {
          console.error('心跳失败:', error);
        }
      }, 30000); // 30秒心跳

      return () => clearInterval(heartbeatInterval);
    }
  }, [deviceId]);

  const initializeDevice = async () => {
    const id = await getDeviceId();
    setDeviceId(id);

    // 首次注册
    try {
      await ApiService.registerDevice(id);
    } catch (error) {
      console.error('设备注册失败:', error);
    }
  };

  return (
    <View style={styles.background}>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        {/* 标题 */}
        <Text style={styles.title}>电视内容投放系统</Text>
        <Text style={styles.subtitle}>设备授权激活</Text>

        {/* 加载状态 */}
        {!deviceId ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>正在初始化设备...</Text>
          </View>
        ) : (
          <>
            {/* 二维码区域 */}
            <View style={styles.qrContainer}>
              <View style={styles.qrBox}>
                <QRCode
                  value={deviceId}
                  size={width * 0.3}
                  color="white"
                  backgroundColor="rgba(0,0,0,0.8)"
                />
              </View>
              <Text style={styles.qrLabel}>扫描二维码进行授权</Text>
            </View>

            {/* 设备信息 */}
            <View style={styles.infoContainer}>
              <Text style={styles.label}>设备 ID</Text>
              <Text style={styles.deviceId}>{deviceId}</Text>

              <View style={[
                styles.statusBox,
                authStatus === 'authorized' && styles.statusAuthorized,
                authStatus === 'rejected' && styles.statusRejected,
              ]}>
                <Text style={styles.statusText}>
                  {authStatus === 'waiting' && '等待授权...'}
                  {authStatus === 'authorized' && '设备已激活'}
                  {authStatus === 'rejected' && '授权被拒绝'}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* 底部提示 */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            请在管理后台添加此设备以完成激活
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: width * 0.05,
  },
  title: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.035,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: height * 0.08,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: width * 0.04,
    color: '#fff',
    fontWeight: '600',
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: height * 0.08,
  },
  qrBox: {
    padding: width * 0.03,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: width * 0.02,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  qrLabel: {
    fontSize: width * 0.025,
    color: 'rgba(255,255,255,0.7)',
    marginTop: height * 0.02,
  },
  infoContainer: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: width * 0.04,
    borderRadius: width * 0.02,
  },
  label: {
    fontSize: width * 0.025,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: height * 0.01,
  },
  deviceId: {
    fontSize: width * 0.04,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: height * 0.03,
    letterSpacing: 2,
  },
  statusBox: {
    paddingHorizontal: width * 0.05,
    paddingVertical: height * 0.015,
    borderRadius: width * 0.01,
    backgroundColor: 'rgba(255,193,7,0.3)',
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  statusAuthorized: {
    backgroundColor: 'rgba(76,175,80,0.3)',
    borderColor: '#4CAF50',
  },
  statusRejected: {
    backgroundColor: 'rgba(244,67,54,0.3)',
    borderColor: '#F44336',
  },
  statusText: {
    fontSize: width * 0.03,
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: height * 0.05,
    alignItems: 'center',
  },
  footerText: {
    fontSize: width * 0.02,
    color: 'rgba(255,255,255,0.5)',
  },
});
