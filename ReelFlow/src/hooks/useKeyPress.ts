/**
 * 遥控器按键检测 Hook
 * 用于检测特定按键组合（如连续按返回键）
 */
import { useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

export const useKeyPress = (callback: () => void, keyCount: number = 3, delay: number = 2000) => {
  const pressCount = useRef(0);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      pressCount.current += 1;

      // 清除之前的定时器
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // 如果达到指定次数，触发回调
      if (pressCount.current >= keyCount) {
        callback();
        pressCount.current = 0;
      } else {
        // 设置定时器，超时后重置计数
        timerRef.current = setTimeout(() => {
          pressCount.current = 0;
        }, delay);
      }

      // 如果不是触发条件，则正常处理返回键
      return pressCount.current < keyCount;
    });

    return () => {
      backHandler.remove();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [callback, keyCount, delay]);
};
