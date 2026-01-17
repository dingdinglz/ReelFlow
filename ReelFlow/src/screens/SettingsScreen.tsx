/**
 * 设置屏幕 - 网络配置
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { getServerUrl, setServerUrl } from '../utils/deviceInfo';
import ApiService from '../services/api';

const { width, height } = Dimensions.get('window');

export const SettingsScreen: React.FC = () => {
  const [serverUrl, setServerUrlState] = useState('');
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const url = await getServerUrl();
    setServerUrlState(url);
  };

  const handleSave = async () => {
    if (serverUrl.trim()) {
      await setServerUrl(serverUrl.trim());
      Alert.alert('成功', '服务器地址已保存', [
        { text: '确定', onPress: () => {} },
      ]);
    }
  };

  const handleTestConnection = async () => {
    if (!serverUrl.trim()) {
      Alert.alert('提示', '请输入服务器地址');
      return;
    }

    setTesting(true);
    try {
      const isConnected = await ApiService.testConnection(serverUrl);
      if (isConnected) {
        Alert.alert('成功', '服务器连接正常', [
          { text: '确定' },
        ]);
      } else {
        Alert.alert('失败', '无法连接到服务器', [
          { text: '确定' },
        ]);
      }
    } catch (error) {
      Alert.alert('错误', '连接测试失败', [
        { text: '确定' },
      ]);
    } finally {
      setTesting(false);
    }
  };

  const handleReset = () => {
    setServerUrlState('https://link.demo.com');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 标题 */}
        <Text style={styles.title}>系统设置</Text>

        {/* 服务器地址配置 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>服务器配置</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>服务器地址</Text>
            <TextInput
              style={styles.input}
              value={serverUrl}
              onChangeText={setServerUrlState}
              placeholder="https://link.demo.com"
              placeholderTextColor="rgba(255,255,255,0.4)"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.testButton]}
              onPress={handleTestConnection}
              disabled={testing}
            >
              <Text style={styles.buttonText}>
                {testing ? '测试中...' : '测试连接'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.resetButton]}
              onPress={handleReset}
            >
              <Text style={styles.buttonText}>重置默认</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>保存设置</Text>
          </TouchableOpacity>
        </View>

        {/* 设备信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>设备信息</Text>
          <Text style={styles.infoText}>
            屏幕尺寸: {Math.round(width)} x {Math.round(height)}
          </Text>
        </View>

        {/* 操作提示 */}
        <View style={styles.hintSection}>
          <Text style={styles.hintTitle}>操作提示</Text>
          <Text style={styles.hintText}>
            • 连续按返回键可退出设置页面
          </Text>
          <Text style={styles.hintText}>
            • 修改服务器地址后请先测试连接再保存
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: height * 0.1,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  section: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: width * 0.03,
    padding: width * 0.05,
    marginBottom: height * 0.03,
  },
  sectionTitle: {
    fontSize: width * 0.035,
    fontWeight: 'bold',
    color: '#4fc3f7',
    marginBottom: height * 0.02,
  },
  inputContainer: {
    marginBottom: height * 0.03,
  },
  label: {
    fontSize: width * 0.025,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: height * 0.01,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: width * 0.02,
    paddingHorizontal: width * 0.03,
    paddingVertical: height * 0.02,
    fontSize: width * 0.03,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: height * 0.02,
  },
  button: {
    flex: 1,
    paddingVertical: height * 0.02,
    borderRadius: width * 0.02,
    alignItems: 'center',
    marginHorizontal: width * 0.01,
  },
  testButton: {
    backgroundColor: '#2196F3',
  },
  resetButton: {
    backgroundColor: '#607D8B',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: width * 0.025,
    fontWeight: 'bold',
  },
  infoText: {
    fontSize: width * 0.025,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: height * 0.01,
  },
  hintSection: {
    backgroundColor: 'rgba(255,193,7,0.1)',
    borderRadius: width * 0.03,
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: 'rgba(255,193,7,0.3)',
  },
  hintTitle: {
    fontSize: width * 0.03,
    fontWeight: 'bold',
    color: '#FFC107',
    marginBottom: height * 0.015,
  },
  hintText: {
    fontSize: width * 0.025,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: height * 0.01,
  },
});
