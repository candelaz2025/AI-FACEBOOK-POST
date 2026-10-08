# PANGLAB — Research Notes

> **อัปเดต 2026-10-08:** ไฟล์นี้เป็นบันทึกรอบแรก (3 subagents) ส่วนผลวิจัยเชิงลึก 30 หัวข้อและบทสรุปอยู่ใน [research/](./research/00-SYNTHESIS.md) ข้อมูลที่ถูกแก้ภายหลังมีหมายเหตุ ✏️ กำกับไว้

> รวบรวมโดย research subagents เมื่อ 2026-10-07 · popcont.ai ถูก egress proxy ของ environment บล็อก จึงดึงหน้าเว็บผ่าน Apify rag-web-browser (รันจากภายนอก) และใช้ WebSearch summaries · **ไม่ได้ login หรือเข้าดู `/dashboard` จริง** · ข้อมูลที่จะใช้ตั้งราคาหรือใช้ทางกฎหมายต้องตรวจกับหน้าจริงอีกครั้ง

## 1. POPCONT (popcont.ai) — Verified facts

| หัวข้อ | ข้อมูล | ที่มา |
|---|---|---|
| ชื่อบริษัท | Sixsheet Tech Co., Ltd. (sxtech.me) | JSON-LD บน [popcont.ai](https://popcont.ai/) |
| Title | "POPCONT — AI สร้าง Content + ภาพ ตรงแบรนด์ พร้อมโพสต์" | popcont.ai |
| Hero | "ไม่มีทีมคอนเทนต์ … ช่วยได้" / "จำแบรนด์คุณได้ ใส่สินค้าจริงของคุณลงในรูป แล้วตั้งเวลาโพสต์ขึ้น Facebook, IG, TikTok, LINE ให้เลย" | popcont.ai |
| Positioning | "Prompt Engine จาก Creative Agency" / "ไม่ต้อง Prompt เอง แต่ได้ Results เทียบเท่าการจ้างเอเจนซี่โฆษณา" | popcont.ai |
| featureList | AI Caption Generation, AI Image Generation (1024×1024), Brand DNA Management, Social Media Auto-Publishing, Campaign Studio, Multi-platform Scheduling (Instagram, Facebook), Analytics Dashboard, Credits-based pricing | JSON-LD |
| Workflow | Plan → Create → Publish → Optimize | popcont.ai |
| Formats | ทีละโพสต์ (1 รูป + แคปชัน), อัลบั้มหลายสไลด์, วิดีโอสั้น, สร้างหลายโพสต์พร้อมกัน | popcont.ai |
| App routes | `/dashboard /brands /creative /campaign /create /posts /credits /checkout /subscribe /billing /workspace /settings /social /analytics /affiliate /how-to /login /admin /api/` | [robots.txt](https://popcont.ai/robots.txt) |
| Pricing | Free ฿0/3 · แพ็กเปิดใจ ฿349/10 · Starter ฿990/30 · Growth ฿3,000/100 · Pro ฿5,600/200 · Business ฿12,500/500 · Enterprise custom · +VAT 7% · "1 Credit = 1 Content" | popcont.ai |
| Free plan | 1 แบรนด์, Brand DNA, ไม่มี IG + FB + LINE Publishing | popcont.ai |
| Social proof | 159 แบรนด์ · 211K คอนเทนต์ · 12K รูปภาพ | popcont.ai |
| FAQ (เฉพาะคำถาม) | ใช้ได้ไหมถ้าไม่เคยใช้ AI / ความปลอดภัยข้อมูล / วิธีทดลอง / platform ที่รองรับ / ค่าใช้จ่ายอื่น / 1 คอนเทนต์ใช้กี่เครดิต | popcont.ai |
| Tech (อนุมาน) | Next.js, Cloudflare, DigitalOcean App Platform | response headers |
| ข้อมูลที่ยังขาด | คำตอบ FAQ, auth providers, payment methods, หน้า dashboard จริง, โมเดล AI ที่ใช้, approval flow | – |

## 2. Competitors

| Product | จุดเด่น | ราคา (USD/เดือน เว้นแต่ระบุ) | ที่มา |
|---|---|---|---|
| Predis.ai | posts/carousel/video + scheduling | Core $24–32 · Rise $55–79 · Enterprise $212–249 (แหล่งข้อมูลขัดกัน) | [predis.ai/pricing](https://predis.ai/pricing/) |
| Ocoya | copy + design + schedule + AI credits | $15 / $39 / $79 / $159 | [ocoya.com/pricing](https://ocoya.com/pricing) |
| Buffer | AI Assistant ทุกแพ็ก | Free · $5/channel · $10/channel | [socialbu](https://socialbu.com/blog/buffer-pricing) |
| Hootsuite | OwlyWriter / OwlyGPT | $99 / $199 / $399 ต่อ user | [influencermarketinghub](https://influencermarketinghub.com/hootsuite/) |
| Canva | Magic Studio, Brand Kit, Content Planner | Pro $18 · Business $25 ต่อคน | [piktochart](https://piktochart.com/blog/canva-pricing-2026-costs-raised/) |
| Jasper | Brand Voice | Pro $69/seat | [eesel](https://eesel.ai/blog/jasper-ai-pricing) |
| Postiz | open source (AGPL-3.0), 14 networks | self-host ฟรี · cloud $29–99 | [postplanify](https://postplanify.com/postiz-pricing) |
| Metricool | scheduling + analytics | Free · Starter $20–25 | [socialpilot](https://www.socialpilot.co/insights/metricool-pricing) |

ในตลาดไทยยังไม่พบ SaaS ตัวอื่นที่ทำ brand-aware caption และ auto-post FB/IG ครบเหมือน POPCONT นอกจาก GEN.TH ([thai.dev](https://thai.dev/en)) และ Prompt D ([promptdaff.com](https://www.promptdaff.com/)) ซึ่งทำได้บางส่วน สรุปนี้หมายถึง "ไม่พบ" ไม่ได้ยืนยันว่า "ไม่มี"

## 3. Meta Graph API constraints

| ข้อกำหนด | รายละเอียด | ที่มา |
|---|---|---|
| FB Page publish | `pages_manage_posts`, `pages_read_engagement` + Page token, native schedule 10 นาที–30 วัน | [Pages API Posts](https://developers.facebook.com/docs/pages-api/posts) |
| IG publish | บัญชี Professional, container → `media_publish`, JPEG เท่านั้น, carousel ≤ 10 | [IG Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) |
| IG rate limit | 100 โพสต์ที่ publish ผ่าน API / 24 ชม. / บัญชี ✏️ เอกสาร Meta ขัดกันเอง ส่วน endpoint `content_publishing_limit` ตอบ 50 ดู [research/09](./research/09-meta-instagram-api.md) | เอกสารเดียวกัน |
| App Review | ต้องได้ Advanced Access + screencast ต่อ permission + Business Verification | [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/app-review/introduction) |

## 4. Thai market

| Metric | ค่า | ที่มา |
|---|---|---|
| Internet users | 67.8M (94.7%) | [DataReportal Digital 2026 Thailand](https://datareportal.com/reports/digital-2026-thailand) via [Elite Asia](https://www.eliteasia.co/digital-and-social-media-trends-in-thailand-in-2026/) |
| Social media identities | 56.6M (79.1%) | DataReportal |
| Facebook ad reach | 51.5M (71.9%) | Kepios via Elite Asia |
| Instagram users | 22.72M (May 2026) | [NapoleonCat](https://stats.napoleoncat.com/social-media-users-in-thailand/2026/) |
| LINE MAU | 54M (Mar 2026, ตัวเลขของ LINE เอง) | [Relevant Audience](https://www.relevantaudience.com/digital-marketing-en/line-thailand-business-solutions-2026/) |
| Thai SMEs | 3.28M ราย | [Thai Post (สสว.)](https://www.thaipost.net/economy-news/1065606/) |
| PromptPay | 82.21M registrations | [Juspay](https://juspay.io/blog/promptpay-reshaping-thailand-s-financial-landscape) |
| Stripe TH | PromptPay 1.65%, บัตรในประเทศ 3.65% + ฿10 | [stripe.com/en-th/pricing](https://stripe.com/en-th/pricing) |
| Opn (Omise) | PromptPay 1.65%, บัตร 3.65% | [omise.co/pricing](https://www.omise.co/en/pricing/thailand) |

## 5. Google AI models (ณ 2026-10-07, จาก WebSearch summaries ของหน้าทางการ)

| Use | Model | ราคา | หมายเหตุ |
|---|---|---|---|
| Text | `gemini-3.8-flash` | $0.75 / $3.75 ต่อ 1M tokens (ถึง 31 ธ.ค. 2026) → $1.50 / $7.50 | [model page](https://ai.google.dev/gemini-api/docs/models/gemini-3.8-flash) |
| Image | `gemini-3.1-flash-image` (Nano Banana 2) | $0.067 / ภาพ 1K | ใช้แทน Imagen 4 ([deprecations](https://ai.google.dev/gemini-api/docs/deprecations)) ✏️ มีรุ่นใหม่ `gemini-nano-banana-2.1` ($0.034) และมีข่าวว่า NB2 จะปิด 29 ต.ค. 2026 ดู [research/15](./research/15-image-models.md) |
| Image premium | `gemini-3-pro-image-preview` (Nano Banana Pro) | $0.134 / ภาพ 1K–2K | – |
| Video | `veo-3.1-lite-generate-preview` | $0.05/วินาที (720p) | – |
| Video | `veo-3.1-fast-generate-preview` | $0.10/วินาที (720p) | ✏️ เป็น GA แล้วในชื่อ `veo-3.1-fast-generate-001` ดู [research/16](./research/16-video-models.md) |
| **ปิดแล้ว** | `imagen-4.0-generate-001` (ปิด 17 ส.ค. 2026), `veo-2.0-generate-001` (ปิด 30 มิ.ย. 2026) | – | ทั้งสองตัวยังถูกใช้อยู่ใน `services/geminiService.ts` ของแอปปัจจุบัน |
| **จำกัด** | `gemini-2.5-flash` ใช้ได้เฉพาะผู้ใช้เดิมตั้งแต่ 18 ก.ย. 2026 | – | – |
