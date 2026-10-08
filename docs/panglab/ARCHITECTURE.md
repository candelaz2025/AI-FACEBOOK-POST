# PANGLAB — Technical Architecture & Build Plan

> สถานะ: **Draft v0.2** · 2026-10-08 · อ่านคู่กับ [PRD.md](./PRD.md) · v0.2 ปรับตาม [research/00-SYNTHESIS.md](./research/00-SYNTHESIS.md) (`[NN]` = รายงาน `research/NN-*.md`)

## 1. Tech Stack (คำแนะนำ)

| Layer | เลือก | เหตุผล | ทางเลือกอื่น |
|---|---|---|---|
| Frontend + BFF | **Next.js (App Router) + React 19 + TypeScript** | SSR สำหรับ landing/SEO, server actions เก็บ API key ไว้ฝั่ง server, ทีมใช้ React อยู่แล้ว | Vite SPA + Hono API |
| UI | **Tailwind CSS v4 (build-time) + Radix primitives + Pang UI tokens** | เลิกใช้ Tailwind CDN ที่ไม่เหมาะกับ production | shadcn/ui |
| DB / Auth / Storage | **Supabase** (Postgres + RLS, Auth, Storage) | multi-tenant ด้วย RLS, มี Storage สำหรับไฟล์สื่อ ⚠️ LINE web login เซ็น token ด้วย HS256 จึงอาจผ่าน custom OIDC (JWKS) ไม่ได้ ต้องทำ spike ก่อน ถ้าไม่ผ่านให้เขียน callback เองแล้ว verify ที่ LINE `/oauth2/v2.1/verify` [27] | Neon + Clerk + R2 |
| Background jobs / Scheduler | **Inngest** (durable steps + `step.sleepUntil` + retries) | agent pipeline หลายขั้นที่เวลาส่วนใหญ่รอ AI ซึ่ง Inngest คิดเงินตาม step จึงถูกกว่า Trigger.dev ที่คิดตามเวลา container (~$99/1M steps) [27] | Trigger.dev (plan B), pg-boss |
| AI | **Google Gemini API (paid tier เท่านั้น)** ผ่าน `@google/genai` ฝั่ง server + model registry + structured output ด้วย `responseJsonSchema` จาก Zod [14][28] | ต่อยอดจาก codebase เดิม | Vertex AI asia-southeast1 (ถ้าต้องการ data residency) + fallback adapter ภายนอก (Seedance/Kling สำหรับวิดีโอ) [16] |
| Image post-processing | `sharp` + HarfBuzz shaping (เช่น `harfbuzzjs`) + `Intl.Segmenter('th')`/ICU4X สำหรับ overlay ภาษาไทย, เขียน IPTC `DigitalSourceType` กลับลงไฟล์ [18][11] | IG รับเฉพาะ JPEG และ image model ยังวาดภาษาไทยไม่ได้ [15] | Satori / resvg |
| Payments | **`PaymentProvider` abstraction** → Stripe (PromptPay สำหรับแพ็กครั้งเดียว, บัตรสำหรับ auto-refill) | PromptPay ตัดเงินอัตโนมัติรายเดือนไม่ได้ทั้ง Stripe และ Opn [22] | Opn/Omise (ค่าธรรมเนียมเท่ากัน) |
| Tax invoice | ผู้ให้บริการ e-Tax ภายนอก (FlowAccount / PEAK API) | ไม่ต้องทำ e-Tax เอง [22] | ออกเอง (PDF/A-3) |
| Brand scan | Firecrawl `branding` + Brandfetch Logo API (ฟรี 500k/เดือน) + Color Thief | ห้าม scrape FB/IG [17] | Gemini URL context |
| Hosting | Vercel **pin ไว้ที่ `sin1`** (ค่าเริ่มต้นคือ iad1/US) + Supabase `ap-southeast-1`, ย้ายสื่อไป R2 เมื่อ egress สูง [27] | ใกล้ผู้ใช้ไทย, PDPA ไม่ได้บังคับให้ข้อมูลอยู่ในไทยแต่ต้องมีฐานตาม ม.28/29 | Cloudflare |
| Observability / Evals | Sentry + Langfuse (MIT, OTel) trace ต่อ agent run โดย mask PII + Thai golden set 30–50 brief เป็น CI gate [28] | ต้องเห็นต้นทุนต่อเครดิตและกันคุณภาพตกเมื่อเปลี่ยน model | Helicone |

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

นี่คือหัวใจของ "AI Marketing Agent" **หลักการ v0.2:** ใช้ workflow ตายตัวทุกครั้งที่ลำดับงานแน่นอน และใช้ LLM orchestrator เฉพาะงานที่ต้องวางแผนจริงเท่านั้น ระบบ multi-agent ใช้ token ราว 15 เท่าของแชตทั่วไป จึงควรเพิ่มความซับซ้อนเมื่อวัดได้ว่าช่วยให้ผลดีขึ้นเท่านั้น [28] Orchestrator เป็นตัววางแผนและแจกงาน ส่วน subagent แต่ละตัวมีหน้าที่แคบและผลลัพธ์มี schema ชัดเจน (structured output) จึงทดสอบและเปลี่ยนโมเดลได้ทีละตัว

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
| **Orchestrator** (ใช้เฉพาะ Campaign) | goal, period, products, Brand DNA, insights ล่าสุด | `ContentPlan { items[]: {date, pillar, format, product_id, angle, platform} }` | `gemini-3.8-flash` (fallback `gemini-3.7-flash`) |
| **Brand DNA Analyst** | ผล deterministic extraction (Firecrawl/Brandfetch/Color Thief) + ข้อความเว็บ + โพสต์จากเพจที่เชื่อมแล้ว | `BrandDNA { voice, thai_traits, audience[], usp[], palette[], do_words[], dont_words[], products[] }` ทุก field มี `provenance` + `confidence` [17] | `gemini-3.8-flash` |
| **Copywriter** | plan item + Brand DNA + **ภาพที่สร้างเสร็จแล้ว** [05] | `Caption { hook, body, cta, hashtags[], variants[3] }` | `gemini-3.8-flash` (temp 0.8) · budget: `gemini-3.1-flash-lite` |
| **Art Director** | plan item + Brand DNA + รูปสินค้า (ส่งเป็น reference ทุกครั้ง) | `ImageBrief { prompt, aspect, overlay_text, layout }` → เรียก image model (prompt ห้ามมีข้อความไทย) | `gemini-nano-banana-2.1` ($0.034/1K) · premium: `gemini-3-pro-image` · eco: `gemini-3.1-flash-lite-image` (สูงสุด 1K) [15] |
| **Scheduler** | ประวัติ engagement, quota | `slot { publish_at, reason }` | rule-based + stats (ไม่ใช้ LLM ใน MVP) |
| **QA Critic** | caption + image + Brand DNA + ผลตรวจด้วยโค้ด | `Review { criteria[]: {id, pass, critique}, policy_flags[], product_match }` โดยให้**โค้ดเป็นตัวคำนวณ** `brand_fit` 0–100 จาก criteria ไม่ใช่ LLM [28] | ต้องใช้**คนละ model กับ Copywriter** (เช่น `gemini-3-pro-image` สำหรับ vision หรือ `gemini-3.7-flash`) และ calibrate กับ label จากผู้เชี่ยวชาญไทย |
| **Video Producer** (V1) | plan item + key image (เฟรมแรก) | วิดีโอ 9:16 | `veo-3.1-lite-generate-preview` (720p/1080p) · `veo-3.1-fast-generate-001` (GA) · fallback ภายนอก: Seedance/Kling [16] (Sora API ปิดแล้วตั้งแต่ 24 ก.ย. 2026) |

> ⚠️ **Model IDs ต้องตรวจซ้ำตอนเริ่ม build** (ส่วนใหญ่มาจากสรุปผลค้นหาของหน้าทางการ [14][15][16]) ที่ปิดหรือจำกัดแล้ว: `imagen-4.0-generate-001` (ปิด 17 ส.ค. 2026), `veo-2.0-generate-001` (ปิด 30 มิ.ย. 2026), `gemini-2.5-flash` (จำกัดเฉพาะผู้ใช้เดิม) ส่วน `gemini-3.1-flash-image` (NB2) มีข่าวว่าจะปิดวันที่ 29 ต.ค. 2026 และ `gemini-3-flash` มีแค่ `-preview` เท่านั้น เก็บ model ID, ราคา และ capability (9:16, image-to-video, audio, max resolution) ไว้ในตาราง `model_registry` ห้าม hardcode และคิดต้นทุนด้วยราคาปี 2027 ($1.50/$7.50 ต่อ 1M tokens สำหรับ 3.x Flash)

### 3.1 Pipeline ของ Quick Post 1 ชิ้น (Inngest function `agent.run`)

Quick Post เป็น **step chain ตายตัว** ไม่ต้องให้ LLM orchestrator ตัดสินใจลำดับ [28] event ส่งเฉพาะ ID [27]

```
1. reserve credits (กรณีแย่สุด รวมรอบแก้ 1 รอบ) (ledger: status=reserved)
2. step.run("brief")   → Art Director (ImageBrief)
3. step.run("image")   → image model + product reference → Storage (PNG)
4. step.run("overlay") → sharp + HarfBuzz: โลโก้/ข้อความไทย/ราคา → JPEG + IPTC DigitalSourceType
5. step.run("copy")    → Copywriter (เห็นภาพแล้ว) → 3 variants
6. step.run("rules")   → ตรวจด้วยโค้ด: คำต้องห้าม, คำ อย., ราคาตรง catalog, CTA, Thai linter
7. step.run("critic")  → QA Critic (LLM rubric pass/fail + product_match)
8. ถ้ามีเกณฑ์ไม่ผ่าน → แก้เฉพาะส่วนที่ไม่ผ่าน 1 รอบ (copy หรือ image)
9. brand_fit = f(criteria) ในโค้ด → save post (pending_approval)
10. commit credits ตามที่ใช้จริง / refund ส่วนที่เหลือ → realtime notify
```

Campaign: ใช้ Orchestrator วางแผน แล้ว fan-out แต่ละ plan item ผ่าน `step.invoke` ไปยัง chain ข้างบน จำกัด concurrency ต่อ workspace ที่ 5 และต่อ social account เพื่อไม่ชน quota Batch API (ลด 50% แต่ต้องรอได้ถึง 24 ชม. และใช้ส่วนลดร่วมกับ cache discount ไม่ได้) ใช้เฉพาะงานกลางคืนและ eval [28] วิดีโอใช้ `step.sleep` แล้วค่อย poll ทีละ step แยกกัน [27]

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
agent_runs        (id, workspace_id, kind, input jsonb, output jsonb, model, prompt_version, trace_id,
                   cached_tokens, judge_scores jsonb, cost_usd, latency_ms, status)
model_registry    (role, model_id, params jsonb, price jsonb, capabilities jsonb, active, fallback_model_id, sunset_at)
metric_registry   (platform, logical_name, api_metric, valid_from, valid_to)   -- Meta ถอด/เปลี่ยน metric บ่อย [08][09]
billing_profiles  (workspace_id, legal_name, tax_id, branch, address)          -- ใบกำกับภาษี [22]
eval_cases        (id, brief jsonb, expected jsonb, labels jsonb)               -- Thai golden set [28]
```

ทุกตารางที่มี `workspace_id` หรือ `brand_id` เปิด RLS ด้วย policy "member of workspace" ส่วน `token_enc` เข้ารหัสด้วย key ใน KMS/secret ของ server ห้ามส่งค่านี้ไปยัง client

## 5. Meta Integration

| เรื่อง | การออกแบบ |
|---|---|
| Login | Facebook Login for Business (`config_id` แทน `scope`) → long-lived user token → Page tokens จาก `/me/accounts` + เพจใน Business Manager (`/me/businesses` → owned/client pages) และ IG business id · Page token ที่ได้จาก long-lived user token จะแสดงว่า "Expires: Never" แต่ใช้ไม่ได้เมื่อผู้ใช้ถอนสิทธิ์, เปลี่ยนรหัส หรือเสีย role [08][07] |
| Scopes | รอบ 1: `pages_show_list`, `pages_manage_posts`, `pages_read_engagement` (ใช้อ่าน Insights ได้ด้วย ไม่ต้องขอ `read_insights`), `instagram_basic`, `instagram_content_publish` · รอบ 2: `instagram_manage_insights`, `business_management` · การขอ `instagram_basic`/`business_management` ทำให้ต้องผ่าน Tech Provider verification [08][10] |
| FB publish | ภาพเดี่ยว `POST /{page}/photos` · หลายภาพ: upload `published=false` แล้ว `POST /{page}/feed` + `attached_media` (ย้ายตรรกะจาก `App.tsx:576-660` เดิมมาไว้ฝั่ง worker) |
| IG publish | สร้าง container ล่วงหน้า ~5 นาที: `POST /{ig}/media` (JPEG signed URL อายุ ≥1 ชม., `is_ai_generated=true`) → poll `status_code` ทุก ~1 นาทีนานสุด 5 นาที (IN_PROGRESS/FINISHED/ERROR/EXPIRED) → `POST /{ig}/media_publish` · carousel ≤10 (ตั้ง `is_ai_generated` ที่ parent) [09][11] |
| Scheduling | scheduler ของเราเองทั้ง FB และ IG: สร้าง Inngest function ต่อ `post_target` ที่ใช้ `step.sleepUntil(publish_at)` (ไม่ใช้ cron ทุกนาทีที่กิน ~43k steps/เดือนแม้ไม่มีงาน) + sweep job หาโพสต์ที่พลาด ทุก 15 นาที, idempotency แบบ arm → confirm → publish ด้วย key = `post_target_id` [27][07] |
| Quota | IG: อ่าน `quota_total` จาก `GET /{ig}/content_publishing_limit` (เอกสารขัดกันระหว่าง 100 กับ 50 ค่าเริ่มต้นจึงใช้ 50) · FB Reels 30/Page/24 ชม. · TikTok 15/วัน [09][08][12] |
| Errors | แบ่งเป็น 4 ประเภท: retry (exponential backoff) / refresh token / disconnect / bad body · token health ตรวจด้วย `debug_token` + error 190 ทุกวัน [07][08] |
| Insights | `page/post_media_view` (Views), `*_total_media_view_unique` (Viewers), IG `views`/`reach`/`total_interactions` ผ่าน `metric_registry` (impressions/reach เดิมถูกถอดไปแล้ว) [08][09] |
| Graph version | เก็บใน config (`META_GRAPH_VERSION`, ปัจจุบัน v26.0) + smoke test ก่อนทุกวันบังคับใช้ (v26 breaking changes มีผลกับทุกเวอร์ชันในวันที่ 27 ต.ค. 2026) [08] |
| Implementation | `packages/meta` **เขียนเองแบบ clean-room** ห้าม copy โค้ด Postiz (AGPL-3.0) [07] |

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
| A · Platform | Infra agent | monorepo, Supabase/Vercel ที่ SG, **spike LINE auth**, auth (Google/LINE/OTP), RLS, CI + license check | credits ledger, Stripe PromptPay | roles, client portal |
| B · Agents | AI agent | model registry, Thai overlay (HarfBuzz), Copywriter + Art Director, Thai golden set | Orchestrator, QA Critic, Brand DNA auto-scan, overlay | learning loop, video |
| C · Meta | Integration agent | จดนิติบุคคล + ยื่น Business Verification (สัปดาห์ 0–1), OAuth (`config_id`) | publish worker FB/IG, quota, retry, token health | Reels/Stories, insights sync |
| D · Frontend | UI agent | Pang UI tokens + components | onboarding, create, editor, calendar, approval | campaign studio, insights, LINE approval |
| E · QA | QA agent | test harness (Vitest + Playwright) | e2e: onboarding→publish (Meta test page) | load test scheduler |

**Definition of Done ทุก track:** typecheck + lint + unit test ผ่าน, ทุกข้อความ UI เป็นภาษาไทยผ่าน i18n, trace ของ agent มี cost/latency, ไม่มี secret ใน client bundle (ตรวจด้วย `grep` ใน CI), Thai golden set ไม่ถดถอย และ license check ผ่าน
