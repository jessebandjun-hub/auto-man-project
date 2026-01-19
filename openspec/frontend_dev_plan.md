# AI Storyboard Studio - Frontend Development Plan

> 基于 `product.md` 产品定义与 Figma 设计概念 (AI Storyboard Studio UI Design) 的前端实施方案。

## 1. 技术栈与基础设施 (Tech Stack & Infrastructure)

*   **Core Framework:** React 19 + Vite
*   **UI Library:** Ant Design 5.x (配合 `@repo/ui` 共享组件)
*   **State Management:** React Context (基础) + TanStack Query (数据同步，待引入)
*   **Routing:** React Router v7
*   **Styling:** CSS Modules / Styled Components (配合 Antd Token)
*   **Media Handling:** FFmpeg.wasm (视频预览/简单处理), Canvas API (图片编辑)

## 2. 页面与路由规划 (Pages & Routing)

| Route Path | Component | Description |
| :--- | :--- | :--- |
| `/login` | `LoginPage` | 用户登录页 |
| `/register` | `RegisterPage` | 用户注册页 |
| `/` | `DashboardLayout` | **主布局框架** (侧边栏 + 顶部导航) |
| `/projects` | `ProjectListPage` | 项目列表 (Grid/List 视图) |
| `/projects/:id` | `ProjectDetailLayout` | **项目内布局** (二级导航: 设定/分镜/剪辑) |
| `.../script` | `ScriptEditorPage` | 剧本创作与分析 |
| `.../assets` | `AssetStudioPage` | 角色/场景资产管理 |
| `.../storyboard` | `StoryboardLabPage` | 分镜列表与生成 |
| `.../editor` | `VideoEditorPage` | 视频剪辑与时间轴 |

## 3. 详细功能模块开发计划

### Phase 1: 基础框架与项目中心 (Foundation & Project Hub)
**目标:** 搭建应用骨架，实现用户登录与项目管理。

*   **UI Components:**
    *   `AppLayout`: 响应式侧边栏、顶部用户信息栏。
    *   `ProjectCard`: 展示项目封面、名称、更新时间。
    *   `CreateProjectModal`: 表单 (名称、简介)。
*   **Features:**
    *   集成 JWT 认证流程 (Login/Register/Logout)。
    *   项目列表数据的 Fetch 与展示。
    *   项目增删改查交互。

### Phase 2: 设定室 (Asset Studio)
**目标:** 实现剧本输入与角色定妆的交互流程。

*   **UI Components:**
    *   `ScriptEditor`:由于是剧本，建议使用富文本编辑器或 Markdown 编辑器 (如 Tiptap)。
    *   `CharacterList`: 角色卡片列表 (左侧)。
    *   `CharacterGenerator`: 角色生成面板 (右侧)。
        *   输入框: 角色描述。
        *   预览区: 4宫格图片展示。
        *   锁定按钮: 确认定妆照。
*   **Features:**
    *   剧本保存与自动保存。
    *   调用后端 API 提取角色。
    *   定妆照生成状态轮询与展示。
    *   图片预览与“设为定妆照”交互。

### Phase 3: 分镜台 (Storyboard Lab)
**目标:** 可视化分镜管理与 AI 生成交互。

*   **UI Components:**
    *   `StoryboardGrid`: 分镜卡片网格 (拖拽排序支持 - `dnd-kit`).
    *   `ShotCard`: 包含 镜号、景别标签、缩略图、描述文本。
    *   `PromptEditor`: 弹窗或侧边栏，用于精修 Prompt。
    *   `RefineChatModal`: 聊天式修图对话框。
*   **Features:**
    *   一键“自动拆解剧本”交互。
    *   分镜图生成进度条/骨架屏。
    *   图片点击放大预览 (Lightbox)。
    *   聊天窗口 UI：发送指令 -> 接收新图 -> 对比确认。

### Phase 4: 剪辑台 (Video Editor)
**目标:** 复杂的时间轴交互与视频预览。

*   **UI Components:**
    *   `EditorLayout`: 三栏布局 (左侧素材、上部预览、底部时间轴)。
    *   `AssetLibrary`: 从分镜台同步过来的图片列表 (可拖拽)。
    *   `VideoPlayer`: 封装 `<video>` 标签，支持播放控制、帧预览。
    *   `Timeline`: 核心组件 (参考专业的轨道设计)。
        *   支持多轨道 (Video, Audio, Subtitle).
        *   Clip 拖拽、缩放长度。
*   **Features:**
    *   实现 Drag & Drop: 从素材库拖入时间轴。
    *   图生视频 (I2V) 参数配置面板 (Motion Prompt 输入)。
    *   时间轴游标同步播放。
    *   导出渲染进度展示。

## 4. 组件库建设 (Shared UI - packages/ui)
需要优先抽离的通用业务组件：

*   `LoadingOverlay`: 全局加载遮罩。
*   `ImageWithFallback`: 图片加载失败处理。
*   `StatusBadge`: 状态标签 (Draft/Generating/Done).
*   `PromptInput`: 带有 AI 辅助提示的输入框。

## 5. 开发顺序建议

1.  **Setup:** 配置路由与 Layout。
2.  **Auth & Projects:** 完成登录与项目列表 (Phase 1)。
3.  **Assets:** 角色管理与定妆 (Phase 2)。
4.  **Storyboard:** 分镜列表与生成 (Phase 3)。
5.  **Video:** 时间轴与剪辑 (Phase 4 - 复杂度最高，最后攻克)。
