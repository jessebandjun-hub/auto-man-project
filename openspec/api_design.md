# AI Storyboard Studio - Backend API Design

> 基于 `product.md` 设计，遵循 NestJS + Prisma 架构。

## 1. 认证模块 (Auth) - *已存在*

| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/auth/register` | 用户注册 | `{ email, password, name? }` |
| POST | `/auth/login` | 用户登录 | `{ email, password }` |
| GET | `/auth/profile` | 获取当前用户信息 | - |

## 2. 项目管理 (Project Hub)

### Projects
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/projects` | 创建项目 | `{ name, description? }` |
| GET | `/projects` | 获取项目列表 | - |
| GET | `/projects/:id` | 获取项目详情 | - |
| PATCH | `/projects/:id` | 更新项目 | `{ name, description }` |
| DELETE | `/projects/:id` | 删除项目 | - |

### Episodes (集数)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/projects/:projectId/episodes` | 创建集数 | `{ title, sortOrder }` |
| GET | `/projects/:projectId/episodes` | 获取集数列表 | - |
| PATCH | `/episodes/:id` | 更新集数信息 | `{ title, sortOrder }` |
| DELETE | `/episodes/:id` | 删除集数 | - |

## 3. 设定室 (Asset Studio)

### Script (剧本)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/projects/:projectId/script/generate` | AI 生成剧本大纲 (Doubao-seed) | `{ idea, genre }` |
| PATCH | `/projects/:projectId/script` | 保存/更新剧本内容 | `{ content }` |
| GET | `/projects/:projectId/script` | 获取剧本 | - |

### Characters (角色)
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/projects/:projectId/characters/extract` | 从剧本提取角色列表 (Doubao-seed) | - |
| GET | `/projects/:projectId/characters` | 获取角色列表 | - |
| POST | `/characters` | 手动创建角色 | `{ name, description, gender }` |
| PATCH | `/characters/:id` | 更新角色信息 | `{ name, description, tags }` |
| POST | `/characters/:id/avatar/generate` | 生成角色定妆照 (Doubao-Image) | `{ prompt_adjustment? }` |
| POST | `/characters/:id/lock` | 锁定角色 (定妆) | `{ selectedImageUrl, finalTags }` |

## 4. 分镜台 (Storyboard Lab)

### Storyboards
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/episodes/:episodeId/storyboards/auto` | 自动拆解 (doubao-seed-1-8-251228) 并生成分镜 (doubao-seedream-4-0-250828) | - |
| GET | `/episodes/:episodeId/storyboards` | 获取分镜列表 | - |
| PATCH | `/storyboards/:id` | 更新分镜文本/属性 | `{ prompt, action, dialogue }` |
| POST | `/storyboards/:id/image/generate` | 生成/重绘分镜图 (doubao-seedream-4-0-250828) | `{ useRefImage: true }` |
| POST | `/storyboards/:id/refine` | 聊天式精修 (doubao-seedream-4-0-250828) | `{ instruction }` |
| DELETE | `/storyboards/:id` | 删除分镜 | - |

## 5. 剪辑台 (Video Editor)

### Video Generation
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| POST | `/storyboards/:id/video/generate` | 图生视频 (doubao-seedance-1-0-pro-fast-251015) | `{ motionPrompt, duration }` |
| GET | `/storyboards/:id/video/status` | 查询生成状态 | - |

### Timeline & Export
| Method | Endpoint | Description | Payload |
| :--- | :--- | :--- | :--- |
| GET | `/episodes/:episodeId/timeline` | 获取完整时间轴数据 | - |
| POST | `/episodes/:episodeId/export` | 导出最终视频 | `{ format, resolution }` |
| POST | `/episodes/:episodeId/tts` | 批量生成配音 (Volcengine TTS V3) | - |

---

## 数据模型概览 (Prisma Schema Draft)

```prisma
model Project {
  id          String    @id @default(uuid())
  name        String
  description String?
  userId      Int
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  episodes    Episode[]
  characters  Character[]
  script      String?   // 简化的剧本字段，实际可能需要单独表
}

model Episode {
  id          String       @id @default(uuid())
  title       String
  sortOrder   Int
  projectId   String
  project     Project      @relation(fields: [projectId], references: [id])
  storyboards Storyboard[]
}

model Character {
  id             String   @id @default(uuid())
  name           String
  description    String
  tags           String?  // 锁定的特征 Tags
  avatarUrl      String?  // 锁定的定妆照 (Visual Anchor)
  projectId      String
  project        Project  @relation(fields: [projectId], references: [id])
}

model Storyboard {
  id          String   @id @default(uuid())
  episodeId   String
  episode     Episode  @relation(fields: [episodeId], references: [id])
  sortOrder   Int
  
  // Content
  shotType    String?  // 景别
  action      String?  // 动作描述
  dialogue    String?  // 对白
  prompt      String?  // 实际绘画 Prompt
  
  // Media
  imageUrl    String?
  videoUrl    String?
  audioUrl    String?
  
  status      String   // DRAFT, GENERATING, DONE
}
```
