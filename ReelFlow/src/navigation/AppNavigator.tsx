/**
 * 应用导航
 */
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BackHandler } from 'react-native';
import { AuthorizationScreen } from '../screens/AuthorizationScreen';
import { PlayerScreen } from '../screens/PlayerScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { getAuthStatus } from '../utils/deviceInfo';

export type RootStackParamList = {
  Authorization: undefined;
  Player: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  const [authStatus, setAuthStatus] = useState<'waiting' | 'authorized' | 'rejected'>('waiting');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // 监听返回键，用于检测是否要打开设置
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // 这里可以添加检测连续按返回键的逻辑
      return false;
    });

    return () => backHandler.remove();
  }, []);

  const checkAuthStatus = async () => {
    const status = await getAuthStatus();
    setAuthStatus(status);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        initialRouteName={authStatus === 'authorized' ? 'Player' : 'Authorization'}
      >
        <Stack.Screen name="Authorization" component={AuthorizationScreen} />
        <Stack.Screen name="Player" component={PlayerScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
