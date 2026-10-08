# 27 — Tech Stack Validation: Next.js/Vercel + Supabase + Inngest

## สรุป
Stack ใน ARCHITECTURE.md (Next.js บน Vercel + Supabase Singapore + Inngest) ใช้ได้กับ PANGLAB และต้นทุน infra ต่ำเมื่อเทียบกับค่า AI (ประมาณ 170–250 USD/เดือนที่ 1k users และ 600–900 USD/เดือนที่ 10k users ไม่รวม Gemini/Imagen/Veo) แต่มีจุดเสี่ยงสำคัญ 3 จุด จุดแรก LINE Login แบบ web ออก ID token เป็น **HS256** ซึ่ง Supabase custom OIDC (ตรวจด้วย JWKS) น่าจะตรวจไม่ผ่าน จึงต้อง spike ก่อน และอาจต้องเขียน LINE callback เอง จุดที่สอง Vercel functions รันที่ `iad1` (สหรัฐฯ) เป็นค่าเริ่มต้น ต้องตั้ง `sin1` เอง จุดที่สาม PDPA ไม่บังคับเก็บข้อมูลในไทย แต่การส่งข้อมูลไป Singapore/US ต้องมีฐานตาม ม.28/29 และต้องมี DPA กับผู้ให้บริการทุกเจ้า

## 1. Vercel (Next.js hosting)

| หัวข้อ | ข้อมูล | สถานะ |
|---|---|---|
| ราคา Pro | 20 USD/seat/เดือน รวม usage credit 20 USD ต่อ seat; Fast Data Transfer 1 TB และ Edge Requests 10M ไม่หักจาก credit; เกิน 1 TB คิด 0.15 USD/GB | INFERRED (makerkit.dev, ยังไม่ได้อ่านหน้า vercel.com/pricing) |
| Fluid compute | Active CPU 0.128 USD/CPU-hour, Provisioned Memory 0.0106 USD/GB-hour คิด CPU เฉพาะตอนโค้ดรัน ช่วงรอ I/O (เช่นรอ Gemini) คิดแค่ memory | INFERRED (makerkit.dev) |
| Max duration | Pro + fluid: default 300s, สูงสุด 800s (GA), 1800s เป็น beta และต้องตั้ง `maxDuration` ราย function; เกินเวลาได้ 504 `FUNCTION_INVOCATION_TIMEOUT` | VERIFIED (vercel.com/docs/functions/limitations, search summary) |
| Region | `sin1` = Singapore (ap-southeast-1) แต่ functions **default ที่ `iad1`** ต้องตั้ง region เอง; ราคา sin1 แยกตาม regional pricing และใช้ได้เฉพาะ Pro | VERIFIED (vercel.com/docs/regions, /docs/pricing/regional-pricing/sin1) |

เมื่อใช้คู่กับ Inngest ทุก step จะเป็นการเรียก HTTP เข้า Vercel function หนึ่งครั้ง ดังนั้นแต่ละ step ต้องจบภายใน 800s งาน Veo ที่ใช้เวลาหลายนาทีจึงควรเขียนเป็น loop ของ `step.sleep` + `step.run(poll)` ไม่ใช่ poll ค้างใน step เดียว (INFERRED)

## 2. Supabase (RLS, Auth + LINE, Storage, Singapore)

| หัวข้อ | ข้อมูล | สถานะ |
|---|---|---|
| Pro | 25 USD/org/เดือน รวม compute credit 10 USD (พอสำหรับ Micro 1 GB RAM หนึ่งตัว), 100k MAU, DB disk 8 GB/project, file storage 100 GB, egress 250 GB; ไม่ scale-to-zero | INFERRED (หลายแหล่งตรงกัน: makerkit, jetadmin, activepieces; supabase.com ถูก proxy บล็อก) |
| Overage | MAU 0.00325 USD, disk 0.125 USD/GB, file storage ~0.021 USD/GB, egress 0.09 USD/GB, Edge Functions 2 USD/M, Realtime 2.5 USD/M; Small instance ≈ 15 USD (เหลือจ่าย 5 USD หลังหัก credit) | INFERRED (แหล่งขัดกันเรื่อง storage 0.021 vs 0.125/GB และ credit ต่อ org หรือต่อ project) |
| Spend cap | เปิดเป็นค่าเริ่มต้นบน Pro ต้องปิดถ้าจะยอมให้เกิน quota | INFERRED (search summary) |
| Custom OIDC provider | ตั้งด้วย issuer URL, ดึง `{issuer}/.well-known/openid-configuration`, identifier ต้องขึ้นต้น `custom:`, เพิ่ม `openid` scope ให้อัตโนมัติ, **ตรวจ ID token กับ JWKS ของ provider**; Free ได้ 3 providers, Pro ไม่จำกัด; มี type `oauth2` สำหรับ provider ที่ไม่มี discovery (ระบุ authorize/token/userinfo เอง) | VERIFIED (supabase.com/docs/guides/auth/custom-oauth-providers ผ่าน search summary) |
| LINE issuer | `https://access.line.me`; discovery ระบุเฉพาะ ES256, `jwks_uri` = `https://api.line.me/oauth2/v2.1/certs` | VERIFIED (developers.line.biz) |
| **LINE web login = HS256** | ID token จาก web login เซ็นด้วย HS256 (key = channel secret) ส่วน native/SDK/LIFF เป็น ES256; `kid` มีเฉพาะ ES256 | VERIFIED (developers.line.biz/verify-id-token, classmethod) |
| ผลต่อ Supabase | กระทู้ชุมชน Supabase วิเคราะห์ว่า verifier รับเฉพาะ RS/ES/PS/EdDSA และ LINE web login (HS256) ตรวจผ่าน discovery ไม่ได้ "ไม่มี toggle หรือ config ไหนแก้ได้" | INFERRED (community post ไม่ใช่เอกสารทางการ, ยังไม่ได้ทดสอบเอง) |
| Email | LINE ให้ email เฉพาะเมื่อยื่นขอสิทธิ์และผู้ใช้ยินยอม จึงต้องรองรับบัญชีที่ไม่มี email | VERIFIED (report 13, developers.line.biz) |

ทางเลือกสำหรับ LINE (ต้อง spike ภายใน 1–2 วันแรกของ Track A): (a) ลอง provider type `oauth2` ที่ใช้ userinfo แทนการตรวจ ID token; (b) เขียน Route Handler `/api/auth/line/callback` เอง ตรวจ token ด้วย `POST https://api.line.me/oauth2/v2.1/verify` แล้วสร้าง/ผูก user ใน Supabase ผ่าน admin API และออก session (INFERRED ต้องออกแบบกลไกออก session ให้ปลอดภัย); (c) ใช้ Auth.js/NextAuth ซึ่งมี LINE provider สำเร็จรูป (`@auth/core/providers/line`) แบบเดียวกับที่ report 01 พบว่า POPCONT ใช้ แต่จะเสีย RLS แบบ `auth.uid()` ตรง ๆ ต้องส่ง JWT ที่เซ็นด้วย Supabase JWT secret เอง ซึ่งเพิ่มความซับซ้อน แนะนำ (b) เป็น fallback หลักถ้า (a) ไม่ผ่าน และคง Google + Email OTP ไว้บน Supabase Auth ตามเดิม

RLS ยังเป็นเหตุผลหลักที่ควรคง Supabase ไว้ (multi-tenant ด้วย `workspace_id` + policy) และ Storage ใช้ signed URL ให้ Meta ดึงรูปได้ตาม ARCH §4

## 3. Inngest vs Trigger.dev

| มิติ | Inngest | Trigger.dev |
|---|---|---|
| โมเดลการรัน | โค้ดอยู่ใน Next.js app, Inngest เรียกผ่าน HTTP ทีละ step, retry ราย step, `step.sleep` ได้นานสุด 14 วัน, มี integration กับ Vercel โดยตรง | รันใน container ของ Trigger.dev เอง (ไม่ติด timeout ของ Vercel), wait > 5s ถูก checkpoint ไม่คิดเงิน |
| Free | 50k executions(steps)/เดือน, concurrency 5, เกินแล้วหยุด (ไม่มี overage), เก็บ history 7 วัน | 10k runs/เดือน, history 14 วัน |
| Paid | Pro 99 USD/เดือน รวม 1M executions, concurrency 100, overage 50 USD/1M, +25 concurrent = 25 USD (แหล่งอื่นบอก 75 หรือ 50 USD) | Hobby 10 / Pro 50 USD (เป็น usage credit), compute Small 1x 0.0000338 USD/s + 0.000025 USD/run, Pro concurrency 200 (+50 = 10 USD) |
| สิ่งที่นับเงิน | จำนวน step ไม่ใช่จำนวน function run | วินาทีที่ container รัน + จำนวน run |
| License/self-host | Server เป็น SSPL แล้ว relicense เป็น Apache 2.0 แบบหน่วงเวลา, SDK Apache 2.0; self-host ได้ตั้งแต่ 1.0 แต่ dashboard ไม่มี auth ต้องใส่ gateway เอง | Apache 2.0 ทั้งหมด, Docker/K8s; ต้องมี Postgres + Redis, ขั้นต่ำ ~4 GB RAM; บางฟีเจอร์ (warm starts) มีเฉพาะ cloud |
| สถานะข้อมูล | ราคา INFERRED (budgetforge.dev ก.ค. 2026; inngest.com ถูกบล็อก) | ราคา VERIFIED (trigger.dev/pricing ผ่าน search summary ในรอบก่อน) |

ข้อสังเกตเรื่องต้นทุน (INFERRED): งานของ PANGLAB ส่วนใหญ่คือ "รอ API ของ Google" Trigger.dev คิดเงินทุกวินาทีที่ container รันรวมเวลารอ HTTP (ถ้า step ละ ~20s, 330k runs = 6.6M s ≈ 220 USD/เดือนที่ 1k users) ขณะที่ Inngest + Vercel Fluid คิด CPU เฉพาะตอนประมวลผลและคิด memory ระหว่างรอซึ่งถูกกว่ามาก ดังนั้น **คง Inngest เป็นตัวหลัก** และใช้ Trigger.dev เป็นทางหนีเมื่อต้องการงานยาวเกิน 800s ต่อ step หรือต้องการ self-host แบบ Apache 2.0

## 4. ประมาณการค่าใช้จ่ายรายเดือน (1k / 10k users)

สมมติฐาน (INFERRED ทั้งหมด): ผู้ใช้เฉลี่ย 30 โพสต์/เดือน, 1 โพสต์ ≈ 11 Inngest steps (agent pipeline 8 + publish 3), cron publish ทุกนาที = 43,200 runs/เดือน, รูป 2 MB/โพสต์ ถูกเปิดดู/ดึงเฉลี่ย 3 ครั้ง, ทีม dev 2 seats, ไม่รวมค่า Gemini/Imagen/Veo, Stripe, LINE OA (ดู report 13, 21)

| รายการ | 1k users (~30k โพสต์) | 10k users (~300k โพสต์) |
|---|---|---|
| Vercel Pro (2 seats + Fluid compute sin1) | 40–60 USD | 100–250 USD |
| Supabase Pro + compute | 25 USD (Micro) | 25 + Small/Medium compute ~15–60 USD |
| Supabase Storage (โต ~60 GB / ~600 GB ต่อเดือน) | 0–5 USD (เกิน 100 GB ในเดือนที่ 2 ถ้าไม่ลบ) | ~13 USD ต่อ 600 GB สะสม |
| Supabase egress (~180 GB / ~1.8 TB) | 0 USD | ~140 USD |
| Inngest (~0.4M / ~3.4M steps) | 99 USD (Pro) | 99 + 3×50 ≈ 250 USD |
| Sentry/Langfuse (ระดับเริ่มต้น) | 0–50 USD | 50–150 USD |
| **รวม infra** | **~170–250 USD** (~6–9k บาท) | **~600–900 USD** (~21–32k บาท) |

ตัวขับต้นทุนที่ 10k users คือ egress ของสื่อและจำนวน Inngest steps ลดได้โดย (1) ตั้ง retention ให้ลบต้นฉบับความละเอียดสูงหลังโพสต์ 30–90 วัน, (2) ย้ายสื่อไป object storage ที่ไม่คิด egress เช่น Cloudflare R2 (ตามทางเลือกใน ARCH §1; INFERRED ยังไม่ได้ตรวจราคาในรอบนี้), (3) รวม step ที่ไม่ต้อง retry แยกกัน และให้ cron publish หยิบงานเป็น batch

## 5. Thai data residency (PDPA)

| ประเด็น | ข้อมูล | สถานะ |
|---|---|---|
| Localization | PDPA ไม่บังคับให้เก็บข้อมูลในไทย แต่คุมการ "ส่งหรือโอนไปต่างประเทศ" | VERIFIED (tilleke.com, linklaters.com) |
| ประกาศ ม.28/29 | PDPC ออกประกาศปลาย ธ.ค. 2023 มีผล 24 มี.ค. 2024; ม.28 = ปลายทางมีมาตรฐานเพียงพอ (พิจารณาเป็นรายกรณี ยังไม่พบรายชื่อประเทศ รวมถึง Singapore), ม.29 = ใช้มาตรการคุ้มครองที่เหมาะสม (BCR/สัญญา) หรือข้อยกเว้น เช่น ความยินยอมโดยชัดแจ้ง, การปฏิบัติตามสัญญา | VERIFIED (lawplusltd.com, securiti.ai; วันที่ออกประกาศแหล่งขัดกันเล็กน้อย 12 vs 25 ธ.ค. 2023) |
| Cloud | การเก็บข้อมูลในต่างประเทศที่ "ไม่มีบุคคลที่สามเข้าถึงได้" และการส่งผ่าน (transit) ไม่นับเป็นการโอน แต่การส่งให้ cloud provider ต่างประเทศเพื่อประมวลผลนับเป็นการโอน | VERIFIED (tilleke.com) |
| Vercel | functions default `iad1` (US) ต้องตั้ง `sin1` | VERIFIED |
| Inngest | event payload และ step output ถูกเก็บใน Inngest cloud (ตำแหน่งยังไม่ยืนยัน น่าจะเป็น US) | INFERRED |
| Gemini | Vertex AI รับประกัน ML processing ใน `asia-southeast1` สำหรับบางโมเดลเมื่อเรียก regional endpoint (ไม่ใช่ global) ส่วน Gemini API ผ่าน AI Studio ไม่มีการรับประกัน region | VERIFIED สำหรับ Vertex (cloud.google.com data-residency); Gemini API = INFERRED |

ข้อสรุปเชิงปฏิบัติ: วาง Supabase + Vercel functions ไว้ที่ Singapore ทั้งคู่ ส่งเฉพาะ ID (ไม่ส่ง PII หรือ token) ใน Inngest event, ทำ DPA กับ Supabase/Vercel/Inngest/Google/Stripe, เขียน Privacy Policy ให้ระบุประเทศปลายทางและฐาน ม.29 (สัญญา + มาตรการคุ้มครอง) ให้ครบ และเตรียมสลับไป Vertex AI `asia-southeast1` สำหรับลูกค้าองค์กรที่ต้องการ residency (สอดคล้องกับ report 23)

## ผลต่อ PRD

| ID / ส่วน | การเปลี่ยนแปลงที่แนะนำ |
|---|---|
| ARCH §1 Auth / AUTH-1 | เพิ่มงาน **SPIKE-AUTH-LINE (P0, สัปดาห์แรก)**: ทดสอบ LINE ผ่าน Supabase custom provider (`oidc` และ `oauth2`); ถ้าไม่ผ่านให้ใช้ Route Handler ของเราเองที่ตรวจ token ผ่าน LINE `/oauth2/v2.1/verify` แล้วผูก user ใน Supabase; ห้ามเชื่อ token ที่ client ส่งมา; schema `users` ต้องรองรับ email เป็น null (ผูกด้วย LINE `sub`) |
| ARCH §1 Hosting | ระบุชัดว่า Vercel function region = `sin1` (ตั้งใน `vercel.json`/project settings) และ Supabase = ap-southeast-1; เพิ่มการ log `VERCEL_REGION` ใน health check |
| ARCH §3.1 pipeline (`agent.run`) | ทุก `step.run` ต้องจบ < 300s (default) / 800s (max); Veo ใช้ `step.sleep` + poll step แยก; ตั้ง Inngest concurrency key ต่อ `workspace_id` และ throttle ต่อ Meta Page เพื่อกัน rate limit |
| ARCH §4 Scheduling | cron ทุกนาทีกิน ~43k steps/เดือนแม้ไม่มีงาน ให้ใช้ `step.sleepUntil(scheduled_at)` ต่อโพสต์ หรือ cron ทุก 5 นาที + batch แทน และคง idempotency key = `post_target_id` |
| NFR ต้นทุน (ใหม่) | งบ infra เป้าหมาย ≤ 250 USD/เดือนที่ 1k users และ ≤ 900 USD ที่ 10k users; เพิ่ม retention policy สื่อ (เช่นลบต้นฉบับหลัง 90 วัน) และทบทวนการย้ายสื่อไป R2 เมื่อ egress เกิน 250 GB |
| Legal / PDPA (report 23) | Privacy Policy ระบุผู้ประมวลผลต่างประเทศ (Supabase SG, Vercel SG/US, Inngest, Google, Stripe) พร้อมฐาน ม.29; ห้ามใส่ PII/token ใน Inngest event payload |
| ทางเลือกสำรอง | บันทึก Trigger.dev (Apache 2.0, ไม่มี timeout) เป็น plan B สำหรับงานยาว/self-host โดยไม่เปลี่ยนตัวหลัก |

## คำถามที่ยังเปิด
1. Supabase custom provider type `oauth2` (userinfo) ใช้กับ LINE web login ได้จริงหรือไม่ และ Supabase Auth ยอมสร้าง user ที่ไม่มี email จาก custom provider หรือไม่ ต้องทดสอบจริง
2. ราคา Inngest Pro ปัจจุบัน (99 / 75 / 50 USD) และ concurrency ที่รวมมา ต้องยืนยันจาก inngest.com/pricing (ถูก proxy บล็อก)
3. ราคา regional ของ Vercel `sin1` เทียบ `iad1` สูงกว่าเท่าไร และ credit 20 USD เป็นต่อ seat จริงหรือไม่
4. Inngest cloud เก็บข้อมูลที่ region ใด และมี DPA/region option หรือไม่
5. PDPC ประกาศรายชื่อประเทศที่มีมาตรฐานเพียงพอ (รวมถึง Singapore) แล้วหรือยัง

## แหล่งอ้างอิง
- https://supabase.com/docs/guides/auth/custom-oauth-providers
- https://supabase.com/blog/custom-oauth-oidc-providers
- https://supabase.com/contribute/u/Paco%20Cartones (community analysis LINE HS256)
- https://developers.line.biz/en/docs/line-login/verify-id-token
- https://dev.classmethod.jp/articles/line-login-id-token-hs256-vs-es256/
- https://cdn.jsdelivr.net/npm/@auth/core@0.34.3/src/providers/line.ts
- https://makerkit.dev/blog/saas/supabase-pricing
- https://www.jetadmin.io/blog/supabase-pricing-2026-guide-to-plans-limits-and-real-world-costs/
- https://www.activepieces.com/blog/supabase-pricing-free-tier-limits-pro-costs-egress.md
- https://makerkit.dev/blog/saas/vercel-cost
- https://makerkit.dev/pricing-calculator/vercel
- https://vercel.com/docs/functions/limitations
- https://vercel.com/changelog/vercel-functions-can-now-run-up-to-30-minutes
- https://vercel.com/docs/regions
- https://vercel.com/docs/pricing/regional-pricing/sin1
- https://www.budgetforge.dev/tools/inngest-pricing-2026
- https://automationatlas.io/answers/inngest-pricing-explained-2026/
- https://automationatlas.io/guides/trigger-dev-vs-inngest-2026-comparison/
- https://inngest.com/blog/inngest-1-0-announcing-self-hosting-support
- https://trigger.dev/pricing
- https://trigger.dev/docs/self-hosting/overview
- https://www.tilleke.com/insights/thailand-unveils-regulations-for-cross-border-personal-data-transfer/2/
- https://linklaters.com/insights/blogs/digilinks/2024/january/thailand---new-rules-for-transborder-dataflow
- https://www.lawplusltd.com/2024/02/pdpc-rules-on-personal-data-cross-border-transfer-from-thailand-to-recipient-without-adequate-personal-data-protection-standards/
- https://securiti.ai/thailand-cross-border-personal-data-transfer-overview/
- https://cloud.google.com/vertex-ai/generative-ai/docs/learn/data-residency
