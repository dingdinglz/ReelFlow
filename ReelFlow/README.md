# 电视内容投放系统 - React Native

一个基于 React Native 的电视端（大屏）内容投放客户端，支持设备的唯一标识与授权、高度自定义的服务器连接，以及基于时间线的资源预下载与无缝动态切换。

## 功能特性

### ✅ 已实现的核心功能

1. **设备初始化与授权管理**
   - 自动生成唯一设备 UUID
   - 二维码展示，方便管理员扫描授权
   - 实时显示授权状态
   - 自动心跳，保持与后台连接

2. **网络与高度自定义配置**
   - 可自定义服务器地址
   - 连接测试功能
   - 持久化配置存储

3. **资源同步与预载**
   - 支持即时同步新任务
   - 静默后台下载
   - 本地资源库管理
   - 自动清理过期资源

4. **播放引擎与动态切换**
   - 双容器预加载机制
   - 无缝切换不同时间段的资源
   - 支持视频和图片混合播放
   - 支持轮播多个资源

5. **自适应大屏 UI**
   - 响应式布局，适配各种屏幕尺寸
   - 漂亮的渐变色背景
   - 专业的电视端界面设计

## 项目结构

```
ReelFlow/
├── src/
│   ├── components/          # 可复用组件
│   ├── constants/           # 常量配置
│   │   └── app.ts          # 应用常量
│   ├── hooks/              # 自定义 Hooks
│   │   └── useKeyPress.ts  # 遥控器按键检测
│   ├── navigation/         # 导航配置
│   │   └── AppNavigator.tsx
│   ├── screens/            # 屏幕组件
│   │   ├── AuthorizationScreen.tsx  # 授权屏幕
│   │   ├── PlayerScreen.tsx          # 播放器屏幕
│   │   └── SettingsScreen.tsx        # 设置屏幕
│   ├── services/           # 业务服务
│   │   ├── api.ts         # API 服务
│   │   ├── backgroundTask.ts  # 后台任务
│   │   ├── downloader.ts  # 下载服务
│   │   └── storage.ts     # 存储服务
│   ├── types/              # TypeScript 类型定义
│   │   └── index.ts
│   └── utils/              # 工具函数
│       ├── deviceInfo.ts  # 设备信息工具
│       └── logger.ts      # 日志工具
├── android/                # Android 原生代码
├── ios/                    # iOS 原生代码
└── App.tsx                # 应用入口
```

## 快速开始

### 环境要求

- Node.js >= 20
- React Native 0.83.1
- Android Studio（用于 Android 开发）
- 真机或模拟器

### 安装依赖

```bash
npm install
```

### 运行应用

```bash
# 运行在 Android 设备
npm run android

# 运行在 iOS 设备（仅 macOS）
npm run ios

# 启动 Metro 服务器
npm start
```

### 开发模式

```bash
# 启动开发服务器
npm start
```

## 核心技术栈

- **React Native 0.83.1** - 跨平台移动应用框架
- **TypeScript** - 类型安全
- **React Navigation** - 导航管理
- **MMKV** - 高性能键值存储
- **Axios** - HTTP 客户端
- **React Native Video** - 视频播放
- **QR Code** - 二维码生成

## API 集成

### 服务器接口

应用需要以下 API 端点：

| 端点 | 方法 | 描述 |
|------|------|------|
| `/api/device/register` | POST | 设备注册/心跳 |
| `/api/device/heartbeat` | POST | 设备心跳 |
| `/api/device/tasks` | GET | 获取任务列表 |
| `/api/device/config` | GET | 获取配置信息 |

### 任务数据结构

```typescript
interface Task {
  id: string;
  startTime: number;  // 开始时间戳
  endTime: number;    // 结束时间戳
  resources: Resource[];
  status: 'pending' | 'downloading' | 'ready' | 'active' | 'expired';
  downloadPath?: string;
}

interface Resource {
  id: string;
  type: 'video' | 'image';
  url: string;
  duration?: number;  // 图片显示时长（毫秒）
  localPath?: string;
}
```

## 使用说明

### 1. 设备激活流程

1. 首次启动应用，自动生成设备 UUID
2. 显示二维码和设备 ID
3. 管理员在后台添加设备并授权
4. 应用通过心跳检测授权状态
5. 授权成功后自动进入播放界面

### 2. 服务器配置

- 默认服务器地址：`https://link.demo.com`
- 进入设置页面修改服务器地址
- 建议先测试连接再保存

### 3. 资源播放

- 应用自动下载任务资源
- 根据时间自动切换内容
- 支持视频循环和图片轮播

## 开发说明

### 添加新功能

1. 在 `src/screens/` 创建新的屏幕组件
2. 在 `src/navigation/AppNavigator.tsx` 添加路由
3. 在 `src/services/` 添加相应的服务逻辑
4. 在 `src/types/` 定义类型

### 样式规范

- 使用 `Dimensions.get('window')` 获取屏幕尺寸
- 所有尺寸基于屏幕宽高的百分比，确保自适应
- 使用渐变色和半透明效果提升视觉体验

### 调试

```bash
# 查看日志
adb logcat *:S ReactNative:V ReactNativeJS:V

# 晃动手机打开开发者菜单
# - Reload: 重新加载应用
# - Debug: 开启 Chrome 调试
# - Show Perf Monitor: 显示性能监控
```

## 性能优化

1. **双容器预加载**：提前加载下一个任务资源，确保无缝切换
2. **资源清理**：自动删除过期资源，释放存储空间
3. **后台下载**：在后台线程下载资源，不阻塞主线程
4. **MMKV 存储**：使用高性能的 MMKV 替代 AsyncStorage

## 常见问题

### Q: 如何进入设置页面？

A: 连续按遥控器返回键 3 次即可进入设置页面。

### Q: 资源下载失败怎么办？

A: 应用会自动重试失败的下载任务。检查服务器地址和网络连接。

### Q: 如何测试应用？

A: 使用模拟任务数据，在 `src/services/api.ts` 中修改 API 返回值。

## 许可证

MIT License

## 作者

ReelFlow Team
