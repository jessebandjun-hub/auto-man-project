# AI Storyboard Studio - Development Plan

> 基于 `product.md` 和 `openspec/api_design.md` 的分阶段实施计划。

## Phase 1: 基础设施与项目管理 (Foundation & Project Hub)
**目标:** 搭建多租户项目结构，实现基础的数据流转。

### 1.1 数据库架构升级
- [ ] 更新 `schema.prisma`，添加 `Project`, `Episode` 模型。
- [ ] 执行数据库迁移 (`prisma migrate`).

### 1.2 后端 API 开发 (Projects)
- [ ] 创建 `ProjectsModule`。
- [ ] 实现 CRUD 接口: Create, Read (List/Detail), Update, Delete。
- [ ] 单元测试与接口测试。

### 1.3 前端页面开发
- [ ] **Dashboard:** 项目列表页 (Grid view).
- [ ] **Project Detail:** 项目详情页结构 (侧边栏导航: 设定/分镜/剪辑)。
- [ ] **Episode Manager:** 集数增删改查 UI。

---

## Phase 2: 设定室与角色一致性 (Asset Studio)
**目标:** 实现“剧本 -> 角色 -> 定妆”的核心资产生产流程。

### 2.1 数据库架构升级
- [ ] 添加 `Character` 模型 (包含 `tags`, `avatarUrl`, `description`).
- [ ] 添加 `script` 字段到 Project 或独立表。

### 2.2 AI 模型集成 (Doubao SDK/API)
- [ ] 封装 `AiService`，对接 Doubao-seed (文本) 和 Doubao-Image (绘图)。
- [ ] 实现 Prompt 优化与参数配置。

### 2.3 角色生产流程开发
- [ ] **剧本生成:** API `POST /script/generate`。
- [ ] **角色提取:** API `POST /characters/extract` (LLM 解析剧本)。
- [ ] **定妆照生成:** API `POST /avatar/generate` (T2I)。
- [ ] **锁定逻辑:** 实现“保存当前 Tag + 图片 URL”的后端逻辑。

### 2.4 前端设定室 UI
- [ ] 剧本编辑器 (Markdown/Rich Text).
- [ ] 角色卡片列表 (展示头像、名字、描述).
- [ ] 角色详情/定妆弹窗 (生成、选择、锁定交互).

---

## Phase 3: 分镜台与画面生成 (Storyboard Lab)
**目标:** 实现“剧本 -> 分镜图”的转化，并确保角色一致性。

### 3.1 数据库架构升级
- [ ] 添加 `Storyboard` 模型 (Shot, Action, Dialogue, Prompt, ImageUrl).

### 3.2 核心业务逻辑 (Consistency Engine)
- [ ] **自动拆解:** Doubao-seed 将剧本段落拆解为分镜列表。
- [ ] **Prompt 组装器:** 编写逻辑，将 `Character Tags` + `Action` + `Environment` 组合成最终 Prompt。
- [ ] **垫图控制:** 集成 Doubao-Image Image-to-Image 接口，传入 `Character.avatarUrl` 作为参考。

### 3.3 分镜交互 UI
- [ ] 分镜列表视图 (瀑布流或网格).
- [ ] 自动生成/批量生成按钮。
- [ ] **精修弹窗:** 聊天式修改 (Chat-to-Edit) 界面。

---

## Phase 4: 剪辑台 (Video Editor)
**目标:** 让分镜动起来，并合成视频。

### 4.1 视频模型集成
- [ ] 对接 `doubao-seedance-1-0-pro-fast-251015` 模型。
- [ ] 实现 `POST /video/generate` 接口。

### 4.2 剪辑功能开发
- [ ] **时间轴数据结构:** 设计后端存储 Timeline 数据 (Tracks, Clips).
- [ ] **配音 (TTS):** 集成 **火山引擎 TTS V3 接口** (WebSocket/HTTP)。
    - 参考: `https://www.volcengine.com/docs/6561/1257584?lang=zh`
- [ ] **导出:** 使用 FFmpeg (或云端转码服务) 合成最终 MP4。

### 4.3 剪辑台 UI
- [ ] 简单的多轨道时间轴 (Timeline) 组件。
- [ ] 视频预览播放器。
- [ ] 导出配置弹窗。

---

## 进度规划建议

| 阶段 | 周期估算 | 重点难点 |
| :--- | :--- | :--- |
| **Phase 1** | 3 天 | 基础架构搭建，熟悉 Monorepo |
| **Phase 2** | 5 天 | AI 接口联调，角色一致性数据结构设计 |
| **Phase 3** | 7 天 | Prompt 组装逻辑，垫图效果调优 |
| **Phase 4** | 5 天 | 视频生成耗时处理，时间轴交互复杂 |
