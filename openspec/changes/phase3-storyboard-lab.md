# Phase 3 Implementation Notes: Storyboard Lab & Consistency

## 1. Overview
Completed Phase 3 (Storyboard Lab), enabling the "Script -> Storyboard -> Image Generation" workflow with character consistency enforcement.

## 2. Database Schema Updates
*   **Storyboard Model**: Added `Storyboard` table linked to `Episode`.
    *   Fields: `shotType`, `action`, `dialogue`, `prompt` (assembled), `imageUrl`, `status`.
    *   Relationship: Many-to-One with `Episode`.

## 3. Backend API Implementation
### 3.1 AI Service (Mock)
*   `splitScriptToStoryboards(script)`: Parses script into shot objects.
*   `generateStoryboardImage(prompt, refUrl)`: Simulates T2I generation (optionally using a reference image).
*   `refineStoryboardImage(prompt, instruction, refUrl)`: Simulates Chat-to-Edit refinement.

### 3.2 Storyboard Logic (`StoryboardsService`)
*   **Auto Split (`autoSplit`)**:
    *   Retrieves project script.
    *   Calls AI to split script into shots.
    *   Creates `Storyboard` records in DB.
*   **Image Generation (`generateImage`)**:
    *   **Consistency Engine**: Finds characters mentioned in the shot's `action`/`dialogue`.
    *   **Prompt Assembly**: Prefixes the prompt with `Character.tags`.
    *   **Visual Anchor**: Uses `Character.avatarUrl` as the reference image (ControlNet input simulation) if `useRefImage` is true.
    *   Updates `imageUrl` and `status`.
*   **Refine (`refineImage`)**:
    *   Takes user natural language instruction.
    *   Calls AI to modify the image while preserving context.

### 3.3 Endpoints (`/storyboards`)
*   `POST /episodes/:id/storyboards/auto`: Trigger script splitting.
*   `GET /episodes/:id/storyboards`: List shots.
*   `POST /storyboards/:id/image/generate`: Generate specific shot image.
*   `POST /storyboards/:id/refine`: Refine specific shot image.
*   CRUD operations.

## 4. Frontend Implementation
### 4.1 Storyboard Page (`ProjectStoryboardPage`)
*   **Episode Selector**: Switch between episodes to manage storyboards.
*   **Auto Split Button**: One-click generation of empty storyboard cards from script.
*   **Storyboard Grid**:
    *   Responsive grid layout of `ShotCard`s.
    *   **Visuals**: Displays generated image or placeholder.
    *   **Metadata**: Shows Shot Type, Sort Order, Action, Dialogue.
    *   **Actions**:
        *   ⚡ **Generate**: Triggers AI generation (with loading state).
        *   💬 **Refine**: Opens Chat-to-Edit modal.
        *   🗑️ **Delete**: Removes shot.

### 4.2 Refine Modal
*   Displays current image and prompt.
*   Text area for "Chat-to-Edit" instructions (e.g., "Make it raining").
*   Updates the image in place upon completion.

## 5. Next Steps
*   **Phase 4 (Video Editor)**: Use these generated storyboard images as keyframes for video generation.
*   **Real AI Integration**: Replace Mock `AiService` with real Doubao/Volcengine API calls for production.
