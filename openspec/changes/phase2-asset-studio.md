# Phase 2 Implementation Notes: Asset Studio & Character Consistency

## 1. Overview
Completed the development of the Asset Studio (Phase 2), focusing on the "Script -> Character -> Avatar" workflow. This phase introduces AI-assisted script generation, character extraction, and visual anchor (avatar) generation.

## 2. Database Schema Updates
*   **Project Model**: Added `script` field (String, optional) to store the project's script content.
*   **Character Model**: Created a new model to store character details.
    *   `id`, `name`, `description`, `projectId` (Relation to Project).
    *   `tags`: Stores visual tags/keywords for AI consistency.
    *   `avatarUrl`: Stores the locked URL of the character's visual anchor.

## 3. Backend API Implementation
### 3.1 AI Service (Mock)
*   Encapsulated in `AiModule` / `AiService`.
*   `generateScript(idea, genre)`: Returns a formatted script based on input.
*   `extractCharacters(script)`: Parses script to return a list of characters with descriptions and tags.
*   `generateAvatar(prompt)`: Generates a placeholder image URL based on character description.

### 3.2 Script Management (`/projects`)
*   `POST /projects/:id/script/generate`: Calls AI to generate a script outline.
*   `PATCH /projects/:id/script`: Saves manual edits to the script.
*   `GET /projects/:id/script`: Retrieves the current script.

### 3.3 Character Management (`/characters`)
*   `POST /projects/:projectId/characters/extract`: Extracts characters from the current project script.
*   `GET /projects/:projectId/characters`: Lists all characters in a project.
*   `POST /characters/:id/avatar/generate`: Generates a candidate avatar image.
*   `POST /characters/:id/lock`: Locks a selected image as the official `avatarUrl` and updates `tags`.
*   Standard CRUD endpoints (`create`, `update`, `delete`, `findOne`) implemented.

## 4. Frontend Implementation
### 4.1 Navigation
*   Updated `ProjectLayout` sidebar to include:
    *   **剧本创作 (Script)**: Links to `/projects/:id/script`
    *   **设定室 (Assets)**: Links to `/projects/:id/assets`

### 4.2 Script Editor (`ScriptEditorPage`)
*   **AI Generation**: Input idea and genre to auto-generate a script outline.
*   **Editor**: Text area for manual refinement and saving.

### 4.3 Asset Studio (`AssetStudioPage`)
*   **Layout**: Split view with Character List (Left) and Workspace (Right).
*   **Extraction**: "AI 提取" button to populate the list from the script.
*   **Character Details**: Form to edit Name, Description, and Tags.
*   **Avatar Studio**:
    *   Displays current or temporary avatar.
    *   "AI 生成/重绘" button to try new looks.
    *   "锁定为定妆照" button to save the current visual as the anchor.

## 5. Next Steps
*   **Phase 3 (Storyboard Lab)**: Will use the locked `avatarUrl` and `script` scenes to generate consistent storyboards.
*   **AI Integration**: Replace Mock `AiService` with actual Doubao SDK calls.
