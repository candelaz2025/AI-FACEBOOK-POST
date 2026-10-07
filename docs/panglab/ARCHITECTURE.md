# PANGLAB — Technical Architecture & Build Plan

> สถานะ: Draft v0.1 · 2026-10-07 · อ่านคู่กับ [PRD.md](./PRD.md)

## 1. Tech Stack (คำแนะนำ)

| Layer | เลือก | เหตุผล | ทางเลือกอื่น |
|---|---|---|---|
| Frontend + BFF | **Next.js (App Router) + React 19 + TypeScript** | SSR สำหรับ landing/SEO, server actions เก็บ API key ไว้ฝั่ง server, ทีมใช้ React อยู่แล้ว | Vite SPA + Hono API |
| UI | **Tailwind CSS v4 (build-time) + Radix primitives + Pang UI tokens** | เลิกใช้ Tailwind CDN ที่ไม่เหมาะกับ production | shadcn/ui |
| DB / Auth / Storage | **Supabase** (Postgres + RLS, Auth, Storage) | multi-tenant ด้วย RLS, มี Storage สำหรับไฟล์สื่อ, ตั้งค่า LINE Login ผ่าน OIDC ได้ | Neon + Clerk + R2 |
| Background jobs / Scheduler | **Inngest** (durable functions + cron + retries) | agent pipeline หลายขั้นและ scheduled publish ต้อง retry ได้และ idempotent | Trigger.dev, pg-boss |
| AI | **Google Gemini API** ผ่าน `@google/genai` (ฝั่ง server เท่านั้น) + model registry | ต่อยอดจาก codebase เดิม | Vertex AI (ใช้ตอนต้องการ SLA/region) |
| Image post-processing | `sharp` (แปลง PNG→JPEG สำหรับ IG, resize, วาง text overlay ด้วยฟอนต์ไทย) | IG รับเฉพาะ JPEG | Satori / resvg |
| Payments | **Stripe Checkout** (PromptPay + บัตร) | dev tooling ดี, PromptPay 1.65% | Opn/Omise (ค่าธรรมเนียมเท่ากัน) |
| Hosting | Vercel (web) + Supabase Cloud (region Singapore) | ใกล้ผู้ใช้ไทย | Cloudflare |
| Observability | Sentry + OpenTelemetry traces ต่อ agent run + Langfuse สำหรับ prompt/cost | ต้องเห็นต้นทุนต่อเครดิต | Helicone |

## 2. System Overview

```
┌──────────────────────────── Browser (Next.js client) ────────────────────────────┐
│  Pang UI · Brand DNA · Create · Campaign Studio · Calendar · Insights · Billing   │
└───────────────▲──────────────────────────────────────────────┬───────────────────┘
                │ RSC / server actions (ไม่มี API key ใน client)  │ realtime (Supabase)
┌───────────────┴──────────────────────────────────────────────▼───────────────────┐
│ Next.js server (BFF)                                                               │
│  auth guard · credit check/reserve · enqueue jobs · Meta OAuth callback · webhooks │
└───────┬──────────────────────┬──────────────────────────┬─────────────────────────┘
        │                      │ events                    │
┌───────▼──────┐   ┌───────────▼──────────────────────┐   ┌▼──────────────────────┐
│ Supabase     │   │ Inngest workers                   │   │ Stripe                │
│ Postgres+RLS │◄──┤  • agent.run (Orchestrator)       │   │  checkout · webhook   │
│ Storage      │   │  • post.publish (cron ทุกนาที)    │   └───────────────────────┘
│ Auth         │   │  • insights.sync (ทุก 6 ชม.)       │
└──────────────┘   │  • token.health (รายวัน)          │──► Meta Graph API (FB/IG)
                   └───────────┬──────────────────────┘
                               └──► Gemini API (text / image / video)
```

## 3. Agent Architecture: Orchestrator + Subagents

นี่คือหัวใจของ "AI Marketing Agent" Orchestrator เป็นตัววางแผนและแจกงาน ส่วน subagent แต่ละตัวมีหน้าที่แคบและผลลัพธ์มี schema ชัดเจน (structured output) จึงทดสอบและเปลี่ยนโมเดลได้ทีละตัว

```
                         ┌──────────────────────────────┐
  user goal / idea ────► │  ORCHESTRATOR (Campaign Lead) │  ── วางแผน, แบ่งงาน, รวมผล, คุมงบเครดิต
                         └──┬───────┬────────┬────────┬──┘
                            │       │        │        │   (ขนานต่อโพสต์)
              ┌─────────────▼┐ ┌────▼─────┐ ┌▼───────┐ ┌▼──────────────┐
              │ Brand DNA    │ │Copywriter│ │  Art   │ │  Scheduler    │
              │ Analyst      │ │ (TH)     │ │Director│ │  (best time)  │
              └──────────────┘ └────┬─────┘ └───┬────┘ └───────────────┘
                                    └─────┬─────┘
                                   ┌──────▼───────┐
                                   │  QA Critic   │ ── Brand-fit score, policy/อย. check,
                                   │ (Reviewer)   │    ส่งกลับแก้ได้สูงสุด 1 รอบ
                                   └──────────────┘
```

| Agent | Input | Output (JSON schema) | Model (ค่าเริ่มต้น) |
|---|---|---|---|
| **Orchestrator** | goal, period, products, Brand DNA, insights ล่าสุด | `ContentPlan { items[]: {date, pillar, format, product_id, angle, platform} }` | Gemini Flash รุ่นล่าสุด (เช่น `gemini-3.8-flash`) |
| **Brand DNA Analyst** | URL / ข้อความที่ scrape มา / โพสต์เก่า | `BrandDNA { voice, audience[], usp[], palette[], do_words[], dont_words[], products[] }` | Gemini Flash |
| **Copywriter** | plan item + Brand DNA | `Caption { hook, body, cta, hashtags[], variants[2] }` | Gemini Flash (temp 0.8) |
| **Art Director** | plan item + Brand DNA + รูปสินค้า | `ImageBrief { prompt, aspect, overlay_text, layout }` → เรียก image model | `gemini-3.1-flash-image` (Nano Banana 2) · premium: `gemini-3-pro-image-preview` |
| **Scheduler** | ประวัติ engagement, quota | `slot { publish_at, reason }` | rule-based + stats (ไม่ใช้ LLM ใน MVP) |
| **QA Critic** | caption + image + Brand DNA | `Review { brand_fit: 0–100, reasons[], policy_flags[], verdict: pass/revise }` | Gemini Flash (vision) |
| **Video Producer** (Phase 2) | plan item + key image | วิดีโอ 9:16 | `veo-3.1-lite-generate-preview` / `veo-3.1-fast-generate-preview` |

> ⚠️ **Model IDs ต้องตรวจซ้ำตอนเริ่ม build** ข้อมูลจาก subagent ที่ค้นหน้า [deprecations](https://ai.google.dev/gemini-api/docs/deprecations) ระบุว่า `imagen-4.0-generate-001` และ `veo-2.0-generate-001` ที่แอปเดิมใช้ **ปิดไปแล้ว** และ `gemini-2.5-flash` จำกัดเฉพาะผู้ใช้เดิม ข้อมูลนี้มาจากสรุปผลการค้นหา ไม่ได้เปิดอ่านหน้าเอกสารโดยตรง (proxy บล็อก) ต้องเก็บ model ID ไว้ในตาราง `model_registry` ห้าม hardcode

### 3.1 Pipeline ของ Quick Post 1 ชิ้น (Inngest function `agent.run`)

```
1. reserve credits (ledger: status=reserved)
2. step.run("copy")   → Copywriter
3. step.run("brief")  → Art Director (สร้าง ImageBrief)
4. step.run("image")  → image model → Storage (PNG ต้นฉบับ)
5. step.run("overlay")→ sharp: วางโลโก้/ข้อความไทย/ราคา → JPEG
6. step.run("review") → QA Critic → ถ้า verdict=revise ให้กลับไปข้อ 2 หรือ 3 (สูงสุด 1 รอบ)
7. save post (status=pending_approval) + brand_fit
8. commit credits (หรือ refund ถ้าล้มเหลวจากฝั่งระบบ)
9. realtime notify UI
```

Campaign ใช้ `step.invoke` แบบ fan-out ต่อ plan item โดยจำกัด concurrency ต่อ workspace ไว้ที่ 5 ส่วนงานที่ไม่เร่งรีบใช้ Gemini Batch API เพื่อลดต้นทุนลงครึ่งหนึ่ง

## 4. Data Model (Postgres)

```sql
workspaces        (id, name, owner_id, plan, created_at)
workspace_members (workspace_id, user_id, role)                -- owner|editor|approver|viewer
brands            (id, workspace_id, name, industry, dna jsonb, logo_url, palette text[], fonts jsonb)
products          (id, brand_id, name, price, description, image_url, cutout_url)
content_pillars   (id, brand_id, name, weight)
campaigns         (id, brand_id, goal, start_date, end_date, plan jsonb, status)
posts             (id, brand_id, campaign_id, format, caption jsonb, status, brand_fit, review jsonb,
                   scheduled_at, published_at, created_by, approved_by)
                   -- status: draft|pending_approval|scheduled|publishing|published|failed
post_assets       (id, post_id, kind, storage_path, mime, width, height, position)
social_accounts   (id, brand_id, platform, external_id, name, token_enc bytea, token_expires_at, scopes text[], status)
post_targets      (id, post_id, social_account_id, external_post_id, status, error jsonb, attempts)
post_metrics      (post_target_id, captured_at, reach, impressions, engagement, clicks, saves)
credit_ledger     (id, workspace_id, delta numeric, reason, ref_type, ref_id, status, created_at)
                   -- status: reserved|committed|refunded ; balance = SUM(committed + reserved)
orders            (id, workspace_id, pack, amount_thb, vat_thb, stripe_session_id, status, tax_info jsonb)
agent_runs        (id, workspace_id, kind, input jsonb, output jsonb, model, cost_usd, latency_ms, status)
model_registry    (role, model_id, params jsonb, active, fallback_model_id)
```

ทุกตารางที่มี `workspace_id` หรือ `brand_id` เปิด RLS ด้วย policy "member of workspace" ส่วน `token_enc` เข้ารหัสด้วย key ใน KMS/secret ของ server ห้ามส่งค่านี้ไปยัง client

## 5. Meta Integration

| เรื่อง | การออกแบบ |
|---|---|
| Login | Facebook Login for Business → ได้ user token → แลกเป็น long-lived → ดึง Page tokens (`/me/accounts`) และ IG business id (`/{page}?fields=instagram_business_account`) |
| Scopes | `pages_show_list`, `pages_manage_posts`, `pages_read_engagement`, `instagram_basic`, `instagram_content_publish`, `business_management` (+ `read_insights`/`instagram_manage_insights` สำหรับ analytics, ตรวจรายการสุดท้ายตอนยื่น App Review) |
| FB publish | ภาพเดี่ยว `POST /{page}/photos` · หลายภาพ: upload `published=false` แล้ว `POST /{page}/feed` + `attached_media` (ย้ายตรรกะจาก `App.tsx:576-660` เดิมมาไว้ฝั่ง worker) |
| IG publish | `POST /{ig}/media` (image_url จาก Supabase Storage signed URL, JPEG) → poll `status_code` → `POST /{ig}/media_publish` · carousel: children containers ≤10 |
| Scheduling | ใช้ scheduler ของเราเองทั้ง FB และ IG: Inngest cron ทุก 1 นาทีหยิบ `post_targets` ที่ถึงเวลา โดยใช้ idempotency key = `post_target_id` |
| Quota | เช็ก `GET /{ig}/content_publishing_limit` ก่อนตั้งเวลา (100 / 24 ชม.) |
| Graph version | กำหนดใน config (เช่น `META_GRAPH_VERSION`) ไม่ pin ไว้ในโค้ดเหมือนเดิม (v20.0) |

## 6. Security Checklist (แก้หนี้จาก codebase เดิม)

| ปัญหาเดิม | ที่ | แก้ใน PANGLAB |
|---|---|---|
| Gemini key เก็บใน localStorage และส่งใน query string | `App.tsx:341`, `geminiService.ts:263` | key อยู่ใน server env เท่านั้น ผู้ใช้ไม่ต้องใส่ key |
| `vite.config.ts` ฝัง `GEMINI_API_KEY` ลง bundle | `vite.config.ts` | ไม่มี `define` ของ secret ฝั่ง client |
| FB user token ให้ผู้ใช้วางเอง และส่งผ่าน GET query | `App.tsx:204-206` | OAuth + token เข้ารหัสฝั่ง server, เรียก Graph ฝั่ง server ด้วย header `Authorization` |
| ไม่มี tenant isolation | – | Supabase RLS + การทดสอบ policy |
| ใช้ Tailwind CDN / import map ซ้ำซ้อนกับ Vite | `index.html` | bundle ทั้งหมดผ่าน build |

## 7. Reuse จาก codebase เดิม

| ของเดิม | นำไปใช้ใน PANGLAB |
|---|---|
| `services/geminiService.ts` prompt ของ `generatePost` / `generateImage` | เป็นจุดตั้งต้นของ Copywriter / Art Director prompt (ต้องเปลี่ยน model ID) |
| `translateFacebookError` (`App.tsx:65-125`), Gemini error translator | ย้ายไป `lib/errors/th.ts` |
| ลำดับการ publish FB/IG (`App.tsx:576-768`) | ใช้อ้างอิงตอนเขียน worker `post.publish` |
| 16 tone templates (`App.tsx:35-52`) | ใช้เป็น voice presets ใน Brand DNA |
| `components/PostPreview.tsx` | พัฒนาเป็น `PlatformPreview` |
| `motion-prompt-lab-v3/` | ไม่เกี่ยวกับ PANGLAB เก็บไว้แยก |

## 8. Repository Layout (เป้าหมาย)

```
panglab/                       # แอปใหม่ (monorepo ด้วย pnpm workspaces)
├── apps/web/                  # Next.js
│   ├── app/(marketing)/       # landing, pricing
│   ├── app/(app)/             # dashboard, brands, create, campaign, calendar, library, insights, channels, billing, settings
│   └── app/api/               # meta/oauth, stripe/webhook, inngest
├── packages/agents/           # orchestrator + subagents + zod schemas + prompts (TH)
├── packages/meta/             # Graph API client (FB/IG publish, insights, token)
├── packages/ui/               # Pang UI tokens + components
├── packages/db/               # SQL migrations, generated types
└── packages/config/           # eslint, tsconfig, model registry seed
```

ทางเลือกเรื่องโค้ดเดิม: เก็บแอป Vite ไว้ที่ root จนกว่า PANGLAB จะใช้งานได้ แล้วค่อยย้ายเข้า `legacy/` เพื่อไม่ทำลายการ deploy บน AI Studio ที่มีอยู่

## 9. Build Plan: Orchestrator-driven Development

แบ่งงานพัฒนาให้ "subagent" (ทั้ง AI coding agents และ dev จริง) แต่ละ track ทำงานขนานกันได้ เพราะ contract ระหว่างกันกำหนดไว้แล้วด้วย zod schema และ SQL migration

| Track | Owner (agent/dev) | Sprint 1–2 (Foundation) | Sprint 3–5 (MVP) | Sprint 6–8 (V1) |
|---|---|---|---|---|
| A · Platform | Infra agent | monorepo, Supabase, auth (Google/LINE/OTP), RLS, CI | credits ledger, Stripe PromptPay | roles, client portal |
| B · Agents | AI agent | model registry, Copywriter + Art Director | Orchestrator, QA Critic, Brand DNA auto-scan, overlay | learning loop, video |
| C · Meta | Integration agent | ยื่น Business Verification, OAuth | publish worker FB/IG, quota, retry, token health | Reels/Stories, insights sync |
| D · Frontend | UI agent | Pang UI tokens + components | onboarding, create, editor, calendar, approval | campaign studio, insights, LINE approval |
| E · QA | QA agent | test harness (Vitest + Playwright) | e2e: onboarding→publish (Meta test page) | load test scheduler |

**Definition of Done ทุก track:** typecheck + lint + unit test ผ่าน, ทุกข้อความ UI เป็นภาษาไทยผ่าน i18n, trace ของ agent มี cost/latency และไม่มี secret ใน client bundle (ตรวจด้วย `grep` ใน CI)
