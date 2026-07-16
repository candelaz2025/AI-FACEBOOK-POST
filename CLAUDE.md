# CLAUDE.md — AI Facebook Post Automator

Guidance for AI assistants working in this codebase.

## Project Overview

**AI Facebook Post Automator** is a Thai-first React web app that automates Facebook and Instagram post creation using Google AI services (Gemini, Imagen, Veo). It generates captions from user-supplied data, creates/uploads media, and provides a post preview workflow.

- Deployment target: Google AI Studio
- UI language: Thai (ภาษาไทย) — keep all user-facing strings in Thai
- No backend; all state lives in the browser (localStorage)

> **Note:** A separate full-stack automation system (Shopee affiliate product
> fetching → AI content → omnichannel posting → Google Sheets/Drive logging →
> LINE OA chatbot) is being built in the `candelaz2025/Post-OmniChannel` repo
> under `backend/`. Its Facebook/Instagram publisher is a server-side port of
> this app's `App.tsx` `handlePublish` flow. See
> `Post-OmniChannel/docs/PRD-shopee-affiliate-automation.md`. This repo's scope
> (Facebook/Instagram only, browser-only, no backend) is unchanged by that work.

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 19 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 6 |
| Styling | Tailwind CSS v4 (CDN) |
| AI / LLM | Google Gemini 2.5-Flash (`@google/genai` 1.17) |
| Image Generation | Google Imagen 4.0 |
| Video Generation | Google Veo 2.0 |
| Module System | ES Modules (browser-native via import maps) |

---

## Repository Structure

```
/
├── App.tsx                  # Root component (~1,276 lines); all app state lives here
├── index.tsx                # ReactDOM entry point
├── index.html               # HTML shell — Tailwind CDN, Google Fonts (Kanit), import maps
├── types.ts                 # Shared TypeScript interfaces
├── vite.config.ts           # Vite config; injects GEMINI_API_KEY env var
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
│   ├── PostPreview.tsx      # Facebook-style post preview with carousel
│   ├── LogHistory.tsx       # Post history list with countdown timer
│   ├── ApiKeyModal.tsx      # Google AI API key setup modal
│   ├── InstructionsModal.tsx
│   ├── ChatModal.tsx        # Gemini chat assistant UI
│   ├── LineQrModal.tsx      # LINE QR code display
│   ├── SaveTemplateModal.tsx
│   ├── ManageTemplatesModal.tsx
│   └── icons/               # 20 inline SVG icon components
│
└── services/
    └── geminiService.ts     # All Google AI API calls
```

---

## Key Conventions

### State Management
- **No Redux/Zustand/Context.** All shared state is lifted into `App.tsx` via `useState`/`useCallback`.
- **Persistence** uses `localStorage` with the prefix `aiPostAutomator_`:
  - `aiPostAutomator_theme` — `'light' | 'dark'`
  - `aiPostAutomator_googleApiKey` — stored API key string
  - `aiPostAutomator_fbPostHistory` — `JSON.stringify(LogEntry[])`
  - `aiPostAutomator_promptTemplates` — `JSON.stringify(PromptTemplate[])`

### Styling
- Tailwind utility classes only — no CSS modules or styled-components.
- Dark mode via `dark:` prefix; toggled by adding/removing the `dark` class on `<html>`.
- Responsive breakpoints use `sm:` prefix.
- Primary color: indigo (`indigo-500/600`). Semantic: green (success), red (error), yellow (warning), purple (AI features).
- Font: Kanit (300, 400, 500, 700) loaded from Google Fonts in `index.html`.

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
- Key exports:
  - `verifyApiKey(apiKey)` — validates key with a lightweight test call
  - `generatePost(params)` — Gemini 2.5-Flash caption generation (temp 0.7, maxTokens 400)
  - `generateImage(params)` — Imagen 4.0 (1:1 PNG, marketing style)
  - `generateVideo(params)` — Veo 2.0 with polling loop (10s intervals)
  - `createChatSession(apiKey)` — starts a Gemini chat session with Thai system prompt
- API key is passed per-call (not a module singleton), sourced from localStorage or env var.

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

## Data Types (types.ts)

```ts
UploadedImage {
  file: File;
  base64: string;
  mimeType: string;
  mediaType: 'image' | 'video';
}

LogEntry {
  id: string;
  timestamp: string;
  content: string;
  mediaType?: string;
  status: string;
  pageId?: string;
  scheduling?: string;
  privacy?: string;
}

PromptTemplate {
  name: string;
  value: string;
}
```

---

## What to Keep in Mind

1. **Thai strings**: All user-visible text (labels, errors, placeholders, AI prompts) is in Thai. Maintain this when adding features.
2. **No testing infrastructure**: There are no unit or integration tests. Be cautious with refactors and verify manually.
3. **Single large component**: `App.tsx` is ~1,276 lines. Prefer extracting new features into `components/` rather than growing `App.tsx` further.
4. **CDN-based modules**: React, ReactDOM, and `@google/genai` are loaded from CDN via import maps in `index.html` — they are not bundled by Vite. Do not import them as if they were bundled npm packages in new code without checking the import map.
5. **No CI/CD**: Deployments are manual. Do not assume automated pipelines.
6. **Video generation is async**: `generateVideo()` polls a long-running operation. Handle the promise carefully and surface loading state to the user.
