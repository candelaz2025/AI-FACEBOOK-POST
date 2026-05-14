# CLAUDE.md — AI Facebook Post Automator

Guidance for AI assistants working in this codebase.

## Project Overview

**AI Facebook Post Automator** is a Thai-first React web app that automates Facebook and Instagram post creation using Google AI services (Gemini, Imagen, Veo). It generates captions from user-supplied data, creates/uploads media, and publishes directly to Facebook and Instagram via the Graph API.

- Deployment target: Google AI Studio (`aistudiocdn.com` CDN)
- UI language: Thai (ภาษาไทย) — keep all user-facing strings in Thai
- No backend; all state lives in the browser (localStorage)

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19.1 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 (CDN, configured inline in `index.html`) |
| AI / LLM | Google Gemini 2.5-Flash (`@google/genai` 1.17) |
| Image Generation | Google Imagen 4.0 (`imagen-4.0-generate-001`) |
| Video Generation | Google Veo 2.0 (`veo-2.0-generate-001`) |
| Social API | Facebook Graph API v20.0 |
| Module System | ES Modules via import maps (loaded from `aistudiocdn.com`) |

---

## Repository Structure

```
/
├── App.tsx                  # Root component (1,276 lines); all app state and business logic
├── index.tsx                # ReactDOM entry point
├── index.html               # HTML shell — Tailwind CDN, Google Fonts (Kanit), import maps
├── types.ts                 # Shared TypeScript interfaces
├── vite.config.ts           # Vite config; injects GEMINI_API_KEY env var; @/ path alias
├── tsconfig.json            # TS config (target ES2022, path alias @/ → root)
├── package.json
├── metadata.json            # AI Studio metadata
│
├── components/
│   ├── Card.tsx             # Generic card wrapper
│   ├── Button.tsx           # Button with loading state
│   ├── TextInput.tsx        # Labelled input with optional end adornment
│   ├── Checkbox.tsx
│   ├── ImageUploader.tsx    # Handles image + video file selection → base64
│   ├── PostPreview.tsx      # Facebook-style post preview with carousel navigation
│   ├── LogHistory.tsx       # Post history list with status badges and countdown timer
│   ├── ApiKeyModal.tsx      # Google AI API key setup modal
│   ├── InstructionsModal.tsx
│   ├── ChatModal.tsx        # Gemini chat assistant UI (Thai system prompt)
│   ├── LineQrModal.tsx      # LINE QR code display
│   ├── SaveTemplateModal.tsx
│   ├── ManageTemplatesModal.tsx
│   └── icons/               # 21 inline SVG icon components
│
└── services/
    └── geminiService.ts     # All Google AI API calls (module-level singleton)
```

---

## Key Conventions

### State Management
- **No Redux/Zustand/Context.** All shared state is lifted into `App.tsx` via `useState`/`useCallback`.
- **Persistence** uses `localStorage` with the prefix `aiPostAutomator_`:
  - `aiPostAutomator_theme` — `'light' | 'dark'`
  - `aiPostAutomator_googleApiKey` — stored API key string
  - `aiPostAutomator_fbPostHistory` — `JSON.stringify(LogEntry[])`, capped at 50 entries
  - `aiPostAutomator_promptTemplates` — `JSON.stringify(PromptTemplate[])`

### Styling
- Tailwind utility classes only — no CSS modules or styled-components.
- Dark mode via `dark:` prefix; toggled by adding/removing the `dark` class on `<html>`. The Tailwind config sets `darkMode: 'class'` in `index.html`.
- Responsive breakpoints use `sm:` prefix.
- Primary color: indigo (`indigo-500/600`). Semantic: green (success), red (error), yellow (warning), purple (AI features).
- Font: Kanit (300, 400, 500, 700) loaded from Google Fonts in `index.html` and registered as the default `sans` family.
- Animated gradient text for the app title uses a custom `@keyframes` animation in `index.html`.

### Components
- Functional components only; React hooks for all state/effects.
- Props typed inline or with interfaces in `types.ts`.
- Icons are standalone TSX files in `components/icons/` — add new icons there.
- Keep modals as separate components; open/close state is managed in `App.tsx`.

### TypeScript
- Path alias `@/` resolves to the project root (e.g., `import { LogEntry } from '@/types'`).
- Shared types belong in `types.ts`.
- Avoid `any`; prefer explicit interfaces.

### AI Service (`services/geminiService.ts`)
- All Google AI SDK calls are isolated here — **do not call `@google/genai` directly from components**.
- Uses a **module-level singleton** (`let ai: GoogleGenAI | null = null`). The client is initialized once when `verifyApiKey()` succeeds, and reused for all subsequent calls. It is not passed per-call.
- Key exports:
  - `verifyApiKey(apiKey)` — validates key with a lightweight test call; sets the module-level `ai` client on success
  - `generatePost(sheetData, media, postType, customPrompt, temperature, maxTokens, captionLanguage)` — Gemini 2.5-Flash caption generation with thinking budget (`thinkingBudget = maxTokens / 2`)
  - `generateImage(prompt)` — Imagen 4.0, 1:1 PNG, marketing style with enhanced prompt
  - `generateVideo(prompt, aspectRatio, onProgress, apiKeyForFetch, image?)` — Veo 2.0 with polling loop (10s intervals), optional reference image; downloads via raw `fetch` with API key appended
  - `createChatSession()` — starts a Gemini 2.5-Flash chat session with Thai system prompt (assistant name: "Candelaz AI"); takes no arguments
- All user-facing errors are translated to Thai by `translateGeminiError()`.

---

## Features Overview

### Media Types
Three post formats supported (`postType` state):
- **`image`** — single image (upload or AI-generated via Imagen)
- **`video`** — single video (upload or AI-generated via Veo)
- **`carousel`** — up to 10 images (upload only)

### Media Sources (`mediaSourceTab`)
- **Upload** — file picker, converted to base64 via `FileReader`
- **Generate** — text prompt → Imagen (for image type) or Veo (for video type)

### Video Generation
- Aspect ratios: `16:9` or `9:16`
- Optional reference image (image-to-video)
- Progress messages shown via `videoGenerationStatusMessage` state
- Raw API key passed as `apiKeyForFetch` because the SDK client cannot be used for the binary video download

### Facebook/Instagram Publishing (`handlePublish`)
1. Exchange user token for page access token via Graph API
2. Post to Facebook (image/video/carousel with scheduling support)
3. Optionally post to Instagram Business (polls container status, up to 2 min timeout)
- API version: `v20.0`
- Video posts go to `graph-video.facebook.com`

### Post Scheduling & Privacy
- `scheduledTime` (ISO string) → converted to Unix timestamp for `scheduled_publish_time`
- `postPrivacy`: `'published'` | `'unpublished'`

### Link Types (`linkConfig`)
Four CTA link types appended to generated captions:
- `url` — e-commerce link (Shopee, Lazada, etc.)
- `phone` — phone number
- `line` — LINE ID
- `email` — email address

### Caption Controls
- `temperature` — Gemini sampling temperature (default 0.7)
- `maxTokens` — max output tokens (default 400)
- `captionLanguage` — language for caption (default `'Thai'`)

### Prompt Templates
- 16 built-in Thai templates (tone/style presets) stored in `initialPromptTemplates`
- User can save/manage custom templates; persisted to localStorage
- Managed via `SaveTemplateModal` and `ManageTemplatesModal`

### Connection Status Flow
- Google AI: `idle → verifying → success | error`
- Facebook: requires Page ID + User Access Token; verifies via Graph API
- Instagram: requires successful Facebook connection first; fetches linked Business account

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `GEMINI_API_KEY` | Google AI API key (also exposed as `process.env.API_KEY`) |

Set in `.env.local` for local development. Vite injects it at build time via `vite.config.ts`.

```
# .env.local
GEMINI_API_KEY=your_key_here
```

---

## Development Workflow

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

No test runner is configured. Manual testing via the Vite dev server is the current workflow.

---

## Data Types (`types.ts`)

```ts
interface UploadedImage {
  file?: File;           // Optional — absent for AI-generated media
  base64: string;        // Full data URL (includes mime prefix)
  mimeType: string;
  mediaType: 'image' | 'video';
}

interface LogEntry {
  id: string;
  timestamp: string;     // ISO string
  content: string;
  thumbnailUrl: string;  // Base64 JPEG thumbnail (128×128 max)
  mediaType: 'image' | 'video' | 'carousel';
  status: 'Generated' | 'Posted' | 'Scheduled' | 'Failed';
  pageId: string;
  scheduledTimestamp?: string;    // ISO string for scheduled posts
  facebookPostId?: string;        // ID returned by Graph API after posting
  privacy?: 'published' | 'unpublished';
}

interface PromptTemplate {
  name: string;
  value: string;
}
```

---

## What to Keep in Mind

1. **Thai strings**: All user-visible text (labels, errors, placeholders, AI prompts, system instructions) is in Thai. Maintain this when adding features.
2. **No testing infrastructure**: There are no unit or integration tests. Be cautious with refactors and verify manually.
3. **Single large component**: `App.tsx` is 1,276 lines. Prefer extracting new features into `components/` rather than growing `App.tsx` further.
4. **CDN-based modules**: React, ReactDOM, and `@google/genai` are loaded from `aistudiocdn.com` via import maps in `index.html` — they are not bundled by Vite. Do not import them as if they were bundled npm packages in new code without checking the import map first.
5. **No CI/CD**: Deployments are manual to Google AI Studio.
6. **Video generation is async**: `generateVideo()` polls a long-running operation with a 10s interval. Handle the promise carefully and surface loading state to the user via the `onProgress` callback.
7. **Gemini client is a singleton**: `services/geminiService.ts` holds a module-level `ai` instance. If `verifyApiKey()` has not been called successfully, all other service functions will throw. Never instantiate `GoogleGenAI` outside this file.
8. **Facebook token flow**: The app stores a User Access Token, then exchanges it for a Page Access Token at publish time. The Page Access Token is not persisted.
9. **History cap**: `logHistory` is trimmed to 50 entries before writing to localStorage.
10. **Carousel media**: Carousel posts upload each image as an unpublished Facebook photo first (to get a `media_fbid`), then create the feed post referencing those IDs. For Instagram carousels, a temporary unpublished photo upload is used to obtain a public URL.
