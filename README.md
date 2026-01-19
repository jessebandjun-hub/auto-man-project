# Auto Man Project

这是一个使用 Turborepo 构建的 Monorepo 项目，包含 NestJS 后端和 React 前端。

## 项目结构

- **apps/backend**: 基于 NestJS 和 Prisma 的后端应用。
- **apps/web**: 基于 Vite 和 React 的前端应用。
- **packages/ui**: 共享 UI 组件库。
- **packages/tsconfig**: 共享 TypeScript 配置。

## 技术栈

- **包管理器**: [pnpm](https://pnpm.io/)
- **构建工具**: [Turborepo](https://turbo.build/)
- **后端**: [NestJS](https://nestjs.com/), [Prisma](https://www.prisma.io/)
- **前端**: [React](https://reactjs.org/), [Vite](https://vitejs.dev/)
- **语言**: [TypeScript](https://www.typescriptlang.org/)

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 启动开发服务器

```bash
pnpm dev
```

这将同时启动后端和前端应用。

### 3. 构建项目

```bash
pnpm build
```

## 其他命令

- `pnpm lint`: 运行代码检查
- `pnpm format`: 格式化代码
- `pnpm push-proxy`: 使用代理推送代码到远程仓库
