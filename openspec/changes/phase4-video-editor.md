# Phase 4 Implementation Notes: Video Editor & Synthesis

## 1. Overview
Completed Phase 4 (Video Editor), enabling the "Image -> Video" workflow. This phase introduces Image-to-Video (I2V) generation, TTS (Text-to-Speech) synthesis, and a basic timeline editor.

## 2. Database Schema Updates
*   **Storyboard Model**: Added `videoUrl` and `audioUrl` fields to store generated media assets.
    *   `videoUrl`: Stores the URL of the generated video clip (Doubao-Video).
    *   `audioUrl`: Stores the URL of the generated TTS audio (Volcengine TTS).

## 3. Backend API Implementation
### 3.1 AI Service (Mock)
*   `generateVideo(imageUrl, motionPrompt)`: Simulates I2V generation using Doubao-Video logic. Returns a placeholder video URL.
*   `generateTTS(text)`: Simulates TTS generation. Returns a placeholder audio URL.

### 3.2 Video Logic (`StoryboardsService`)
*   **Generate Video (`generateVideo`)**:
    *   Accepts `storyboardId` and `motionPrompt`.
    *   Calls AI Service to generate video from the storyboard's `imageUrl`.
    *   Updates `videoUrl` and `status` in the database.
*   **Generate TTS (`generateTTS`)**:
    *   Iterates through all storyboards in an episode.
    *   Generates audio for storyboards with `dialogue`.
    *   Updates `audioUrl` in the database.
*   **Export Video (`exportVideo`)**:
    *   Aggregates all video clips in an episode.
    *   (Mock) Simulates FFmpeg concatenation and returns a final export URL.

### 3.3 Endpoints
*   `POST /storyboards/:id/video/generate`: Generate video for a single storyboard.
*   `POST /episodes/:id/tts`: Batch generate TTS for an episode.
*   `POST /episodes/:id/export`: Export the final video.

## 4. Frontend Implementation
### 4.1 Video Editor Page (`ProjectEditingPage`)
*   **Layout**: Three-pane layout (Asset Library, Preview, Timeline).
*   **Asset Library (Left)**:
    *   Lists all storyboards from the selected episode.
    *   Shows thumbnails and status tags (Image/Ready).
    *   Clicking an asset opens the "Generate Video" modal.
*   **Preview Area (Top Center)**:
    *   Video player to preview generated clips.
*   **Timeline (Bottom)**:
    *   Horizontal scrollable list of clips.
    *   Visual indicators for Video and Audio presence.
    *   **Actions**:
        *   **Generate Video**: Trigger I2V generation.
        *   **Batch TTS**: Generate audio for all clips.
        *   **Export**: Render final video.

### 4.2 Interaction Flow
1.  Select a storyboard from the Asset Library or Timeline.
2.  Enter a "Motion Prompt" (e.g., "Slow zoom in").
3.  Click "Generate". The status updates to "Ready" upon completion.
4.  Click the clip in the Timeline to preview.
5.  Use "Batch TTS" to add voiceovers.
6.  Click "Export" to download the final result.

## 5. Next Steps
*   **Real AI Integration**: Replace Mock `AiService` with actual Doubao-Video and Volcengine TTS API calls.
*   **Advanced Timeline**: Implement drag-and-drop reordering, trimming, and multi-track support (using libraries like `dnd-kit` or `wavesurfer.js`).
