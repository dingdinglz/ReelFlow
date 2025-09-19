# ReelFlow 前端（Nuxt 4）

本项目是 ReelFlow 的前端部分，基于 Nuxt 4 + TypeScript 构建，支持多设备多场景的智能化多媒体内容发布与管理。

## 目录结构

- `app/`：应用主目录，包含页面、组件、布局、样式等。
- `content/`：内容数据（如首页内容）。
- `public/`：静态资源。
- `content.config.ts`：内容结构定义。
- `nuxt.config.ts`：Nuxt 配置。
- 其他为依赖和配置相关文件。

## 运行与调试指南

### 环境准备

1. 安装 [Node.js](https://nodejs.org/)（推荐 18+）。
2. 安装 [pnpm](https://pnpm.io/) 包管理器。

### 安装依赖

```sh
pnpm install
```

本地开发启动

```sh
pnpm dev
```

访问 http://localhost:3000 查看效果。

构建生产包

```sh
pnpm build
```

## 相关网站

- [Nuxt 官方文档](https://nuxt.com/docs)
- [ReelFlow 项目主页](https://github.com/dingdinglz/ReelFlow)
