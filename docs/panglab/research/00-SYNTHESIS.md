# PANGLAB Research Synthesis (30 subagents · 2026-10-08)

รวบรวมจากรายงาน 30 ฉบับในโฟลเดอร์นี้ (01–30) ข้อจำกัดของการเก็บข้อมูลมีดังนี้ egress proxy ของ environment บล็อกเว็บทางการหลายแห่ง (popcont.ai, ai.google.dev, developers.facebook.com, developers.line.biz, rd.go.th, stripe.com, ฯลฯ) ส่วน Apify ก็ชนเพดาน 5 runs พร้อมกันระหว่างการวิจัย ข้อเท็จจริงจำนวนมากจึงมาจากสรุปผลค้นหาที่อ้างหน้าทางการ ไม่ได้มาจากการเปิดอ่านหน้าเต็ม แต่ละรายงานติดแท็ก VERIFIED / INFERRED ไว้แล้ว **ตัวเลขใดที่จะใช้ตั้งราคา ใช้ทางกฎหมาย หรือใช้เลือก model ต้องตรวจซ้ำกับหน้าจริงก่อน**

## Executive summary

PANGLAB ยังสร้างตามแผนเดิมได้ แต่ต้องแก้ 4 เรื่องใหญ่ก่อนเริ่มเขียนโค้ด

1. **ราคา:** ที่ตั้งไว้ ฿21.8–29.9/เครดิต สูงเกินตลาดไทย GenLabs ขาย ~฿7.5/ภาพ และฟรีแลนซ์ราคาถูกบน Fastwork เหมาเดือนตกแค่ ~฿60–120/โพสต์
2. **Model:** stack ที่เลือกไว้ล้าสมัยภายในไม่กี่สัปดาห์ ทั้งตัวที่ตั้งเป็นค่าเริ่มต้นและตัว fallback (Nano Banana 2 มีข่าวว่าจะปิด 29 ต.ค. 2026, `gemini-2.5-flash` จำกัดการเข้าถึง, Veo 3.1 Fast เป็น GA แล้ว, Sora API ปิดไปแล้ว)
3. **Meta:** analytics ต้องเปลี่ยนจาก reach/impressions เป็น Views/Viewers, IG publishing quota อาจเหลือ 50 ไม่ใช่ 100, ต้องติดป้าย AI ด้วย `is_ai_generated` และขั้นตอน Business Verification → Tech Provider → App Review ใช้เวลา 6–10 สัปดาห์
4. **กฎหมายไทย:** มีผลบังคับแล้วทั้งประกาศ สคบ. เรื่องภาพ AI ในโฆษณา (ต้องติดป้ายและสินค้าต้องตรงของจริง) และกฎโฆษณาอาหารของ อย. ฉบับ 28 ก.ค. 2026

ส่วนจุดต่างที่ยังใช้ได้จริงคือ Brand-fit score ที่เป็นตัวเลข (ไม่มีคู่แข่งรายไหนใน 6 รายที่ศึกษามี), การอนุมัติผ่าน LINE, ภาษาไทยเป็นภาษาหลัก (Predis/Ocoya ไม่รองรับภาษาไทย) และ overlay ข้อความไทยที่ถูกต้อง (ยังไม่มี image model ตัวไหนวาดภาษาไทยได้น่าเชื่อถือ)

## 10 ข้อค้นพบสำคัญที่สุด

| # | ข้อค้นพบ | ผลกระทบ | ความมั่นใจ | รายงาน |
|---|---|---|---|---|
| 1 | GenLabs ขาย ฿599/เดือน ได้ 80 เครดิต (~฿7.5/ภาพ), PostPung ฿199–899/เดือน, ฟรีแลนซ์เหมาเดือน ~฿3,000 (โพสต์ทุกวัน) | ต้องลดราคาเครดิตลงและเพิ่มตัวเลือกรายเดือน | กลาง–สูง | [04](./04-thai-competitors.md), [20](./20-thai-sme-painpoints.md), [21](./21-pricing-credits.md) |
| 2 | ในแอปจริง POPCONT คิดเครดิตเป็นทศนิยม (caption 0.1 / ภาพ 1 / อัลบั้ม 3 / วิดีโอ 3.2) เครดิตไม่หมดอายุ จ่ายได้ด้วยบัตร, Thai QR และโอนพร้อมแนบสลิป | การคิดเครดิตถ่วงน้ำหนักไม่ใช่จุดต่างแล้ว | สูง | [01](./01-popcont-faq-auth-payment.md), [02](./02-popcont-social-demos.md) |
| 3 | `gemini-nano-banana-2.1` ออก 6 ต.ค. 2026 ราคา $0.034/ภาพ 1K (ครึ่งหนึ่งของ NB2) มีข่าวว่า NB2 จะปิด 29 ต.ค. 2026 และไม่มี model ตัวไหนวาดภาษาไทยได้น่าเชื่อถือ | เปลี่ยน default image model และยืนยันว่าต้องใช้ text overlay | กลาง | [15](./15-image-models.md), [18](./18-thai-language-ai-quality.md) |
| 4 | Meta ยกเลิก `page_impressions*` และ reach ของ Page ไปแล้ว (2025-11 / ~2026-06) ให้ใช้ `*_media_view` และ `*_total_media_view_unique` แทน, IG ใช้ `views` แทน impressions/plays | ต้องเขียน ANA-1 ใหม่ | กลาง | [08](./08-meta-pages-api.md), [09](./09-meta-instagram-api.md) |
| 5 | IG publishing quota ในเอกสาร Meta ขัดกันเอง (100 vs 50) endpoint `content_publishing_limit` ตอบ 50 ส่วน FB Reels ได้ 30/Page/24 ชม. และ TikTok ~15/วัน | อ่าน quota ตอน runtime และตั้ง soft cap ฝั่งเรา | กลาง | [09](./09-meta-instagram-api.md), [08](./08-meta-pages-api.md), [12](./12-tiktok-api.md) |
| 6 | ประกาศ สคบ. (มี.ค. 2026): โฆษณาที่ใช้ภาพ AI ต้องระบุว่า "สร้าง/แก้ไขด้วย AI" และสินค้าในภาพต้องตรงของจริง ส่วน IG API มี `is_ai_generated` ตั้งแต่ 22 มิ.ย. 2026 | ต้องติดป้าย AI เป็นค่าเริ่มต้นและตรวจความตรงของสินค้า | กลาง | [11](./11-meta-ai-content-policy.md), [23](./23-legal-pdpa-fda.md) |
| 7 | ลำดับขั้น Meta: Business Verification → Tech Provider → App Review (~20 วันต่อรอบ มักโดนปฏิเสธอย่างน้อย 1 ครั้ง) และต้องทำ screencast เป็น UI ภาษาอังกฤษ | ต้องจดนิติบุคคลก่อน และเผื่อเวลา 6–10 สัปดาห์ | กลาง | [10](./10-meta-app-review.md) |
| 8 | Activation benchmark: SaaS เฉลี่ย 36% / MarTech 24%, free→paid ที่ถือว่า "ดี" คือ 3–5% | เป้า KPI ใน PRD §5 สูงเกินจริง | กลาง | [26](./26-onboarding-activation.md) |
| 9 | LINE web login เซ็น token ด้วย HS256 จึงอาจผ่าน Supabase custom OIDC (ที่ตรวจด้วย JWKS) ไม่ได้ และ Vercel รัน function ที่ iad1 เป็นค่าเริ่มต้น | ต้องทำ spike ก่อนเริ่ม build และ pin region ไว้ที่ sin1 | กลาง | [27](./27-tech-stack.md), [13](./13-line-api.md) |
| 10 | Postiz เป็น license AGPL-3.0 (copy เข้า SaaS แบบปิดไม่ได้) ส่วน Graph API ล่าสุดคือ v26.0 ซึ่งบังคับใช้ breaking changes กับทุกเวอร์ชันในวันที่ 27 ต.ค. 2026 | เขียน Meta client เองแบบ clean-room และเก็บ version ไว้ใน config | กลาง | [07](./07-open-source-schedulers.md), [08](./08-meta-pages-api.md) |

## ข้อมูลที่ขัดแย้งกัน / ต้องยืนยัน

| ประเด็น | แหล่ง A | แหล่ง B | แนวทาง |
|---|---|---|---|
| IG publishing limit | 100/24 ชม. (หัวข้อ Rate Limit ในเอกสาร Meta, RESEARCH.md เดิม) | 50 (หัวข้อ Carousel และ endpoint `quota_total`) | อ่าน `content_publishing_limit` ตอน runtime ค่าเริ่มต้น 50 |
| ราคา Nano Banana 2.1 ที่ 4K | $0.113 (หน้า pricing) | $0.0756 (ข่าว) | ใช้ 1K เป็นค่าเริ่มต้น และตรวจราคาอีกครั้งก่อนเปิด 4K |
| `gemini-2.5-flash` | ปิด 2026-10-16 (tracker ภายนอก) | ไม่ได้ deprecate แต่จำกัดเฉพาะผู้ใช้เดิม (หน้า deprecations) | ไม่ใช้เลย |
| ราคาเครดิตใน PRD เดิม | ฿21.8–29.9 | GenLabs ~฿3.1–7.5/ภาพ, ฟรีแลนซ์เหมา ~฿60–120/โพสต์ | ลดราคาตาม §การเปลี่ยนแปลงด้านล่าง |
| "ฟรีแลนซ์โพสต์ละ ฿300–500" (PRD §7.2) | ไม่มีแหล่งอ้างอิง | สั่งแยกต่อชิ้น ~฿850–1,600, แพ็กเหมาราคาถูก ~฿60–120 | ลบออก แล้วใช้ตัวเลขจากรายงาน 20 พร้อมระบุแหล่ง |
| Activation 50% / Paid 8% (PRD §5) | เป้าที่ตั้งเอง | benchmark 24–37% / 3–5% | ปรับลง |
| Stripe fixed fee | ฿10 | ฿11 (DHL) | ตรวจกับ Stripe TH ตอนสมัคร |
| e-Tax by Time Stamp | มีเพดาน ฿30M | ไม่มีเพดาน (PEAK FAQ) | ใช้ผู้ให้บริการ e-Tax ภายนอก |

## การเปลี่ยนแปลงที่แนะนำใน PRD

| Section | ปัจจุบัน | เสนอให้เปลี่ยนเป็น | เหตุผล | รายงาน |
|---|---|---|---|---|
| §5 Metrics | Activation ≥50%, Paid ≥8% ใน 14 วัน | Activation 35–40% (stretch 50%) แยกเป็น Setup/Aha/Habit, Paid 3–4% ใน 14 วัน / 6–8% ใน 90 วัน, TTFP P90 ≤10 นาที, วัด approved-without-edit คู่กับ approval rate | benchmark | 26, 25 |
| §7 Pricing | ฿299/10 … ฿10,900/500 (฿21.8–29.9/เครดิต) | แพ็กซื้อครั้งเดียวที่ ฿12.5–19.9/โพสต์ + auto-refill รายเดือน (+20% เครดิต, rollover ได้สูงสุด 2 เท่า) + ภาพแบบ "Eco" 0.5 เครดิต, แสดงยอดคงเหลือเป็น "โพสต์" ไม่ใช่เครดิต | คู่แข่งไทยและฟรีแลนซ์ | 04, 20, 21 |
| BILL-1 | เครดิตอายุ 12 เดือน | เครดิตที่ซื้อไม่หมดอายุ (ตาม POPCONT/GenLabs), เครดิตฟรีหมดใน 30 วัน, โบนัสหมดใน 90 วัน | norm ของตลาด | 01, 21 |
| BILL-2 | PromptPay + บัตร | PromptPay สำหรับแพ็กครั้งเดียว, บัตรสำหรับ auto-renew, ใบแจ้งหนี้ + โอนเงินพร้อมหัก ณ ที่จ่าย สำหรับ B2B | PromptPay ตัดเงินอัตโนมัติรายเดือนไม่ได้ | 22 |
| BILL-5 | ใบกำกับภาษีเต็มรูป | billing profile (เลขผู้เสียภาษี/สาขา) + ผู้ให้บริการ e-Tax ภายนอก, แสดงราคารวม VAT | กฎสรรพากร | 22 |
| BRAND-1/3 | กรอกเอง + auto-scan | 3a สแกนเว็บ (Firecrawl branding + Brandfetch Logo), 3b ดึงเฉพาะเพจที่เชื่อมผ่าน Graph API, **ห้าม scrape FB/IG**, SLA ≤60 วินาที, ทุก field มี provenance + confidence | ToS ของ Meta | 17, 26 |
| BRAND (ใหม่) | – | BRAND-7 เรียนรู้น้ำเสียงจากตัวอย่างไม่เกิน 8 ชิ้น, BRAND-8 preview with/without voice, เพิ่มลักษณะเฉพาะภาษาไทย (สรรพนาม, คำลงท้าย, ความถี่อีโมจิ) | Jasper/Predis | 06, 05, 17 |
| GEN-1/5 | caption + ภาพ | เขียน caption หลังเห็นภาพที่สร้างแล้ว, ให้ 2–3 ตัวเลือก, autosave | Predis + เสียงบ่นของผู้ใช้ Ocoya | 05 |
| GEN-4 | Album P0 | ตั้ง Album/Carousel เป็นรูปแบบเริ่มต้นที่แนะนำ | IG carousel 0.50–0.55% engagement | 30 |
| GEN-7 | overlay ข้อความไทย | ใช้ HarfBuzz shaping + `Intl.Segmenter`/ICU4X ตัดบรรทัด, normalize เป็น NFC, ใช้ฟอนต์จาก whitelist OFL, ทำ visual regression test | ภาษาไทยในภาพ AI ยังไม่น่าเชื่อถือ | 18, 15 |
| GEN-10 | content safety | แยก compliance ตามหมวด: อย. (อาหาร/อาหารเสริม/เครื่องสำอาง, ช่องกรอกเลขอนุญาตโฆษณา), แอลกอฮอล์ (ห้ามโฆษณา), ยา/เครื่องมือแพทย์ (บล็อก) | กฎหมายที่มีผลแล้ว | 11, 23 |
| GEN (ใหม่) | – | GEN-11 Thai copy linter, GEN-12 ติดป้าย AI เป็นค่าเริ่มต้น (IPTC `DigitalSourceType` + `is_ai_generated`), GEN-13 ตรวจว่าสินค้าในภาพตรงของจริง | สคบ. + Meta | 11, 18, 23 |
| GEN-8 | วิดีโอ 5 เครดิต | Lite 720p 5 / 1080p 8 / Fast 12 เครดิต, ใช้รูปสินค้าเป็นเฟรมแรก | ราคา Veo 3.1 | 16 |
| CAL-2/3 | approval queue | การตั้งเวลา = ส่งให้อนุมัติ, อนุมัติทีละหลายชิ้น, เรียงตาม brand-fit ต่ำสุดก่อน, มีปุ่ม "ขอแก้", ยกเลิกการอนุมัติได้, ไม่โพสต์ถ้ายังไม่อนุมัติ | Buffer/Sprout/Ocoya | 25, 05 |
| CAL (ใหม่) | – | CAL-6 ระดับความอัตโนมัติ L1/L2/L3 ที่ปลดล็อกตามประวัติ, CAL-7 ลิงก์อนุมัติสำหรับลูกค้าภายนอกแบบไม่ต้อง login, CAL-8 ช่องเวลาเริ่มต้น 09:00/19:00 จ–ศ | trust calibration, benchmark ไทย | 25, 30 |
| CAL-5 | อนุมัติผ่าน LINE (P1) | Flex Message + postback, ตรวจ webhook signature, มีตัวเลือก digest วันละครั้ง, ใช้ OA แพ็ก Pro ฿1,780/เดือน | LINE API | 13 |
| PUB-1 | Meta OAuth | Facebook Login for Business (`config_id`), ดึงเพจจาก Business Manager ด้วย, Instagram Login เป็นตัวเลือก P1 สำหรับลูกค้าที่ไม่มีเพจ | Meta docs + Postiz | 08, 09, 07 |
| PUB-5 | quota 100 | อ่าน `quota_total` ตอน runtime (ค่าเริ่มต้น 50) + soft cap ฝั่งเรา, FB Reels 30/Page/24 ชม. | เอกสาร Meta ขัดกัน | 09, 08 |
| PUB-6/7 | retry + token health | แบ่ง error เป็น 4 ประเภท (retry / refresh / disconnect / bad-body), ตรวจ token ด้วย `debug_token` ทุกวัน, เตรียม container IG ล่วงหน้า ~5 นาที | Postiz + Meta | 07, 08, 09 |
| PUB-8 | Reels P1 | เลื่อนเป็นต้น V1 พร้อมตรวจ spec (9:16, 3–90 วินาที) | benchmark | 30, 08 |
| PUB-9 | TikTok/LINE P2 | 9a TikTok: เริ่มจาก Upload-to-inbox แล้วค่อย Direct Post หลังผ่าน audit, ต้องมี composer + approval ของตัวเอง · 9b LINE OA: ลูกค้าเชื่อม Messaging API channel ของตัวเอง | กฎของ TikTok/LINE | 12, 13, 19 |
| ANA-1 | reach/impressions/clicks | Views/Viewers (`*_media_view`) + total_interactions, เก็บชื่อ metric ใน registry, แสดง benchmark range พร้อมแหล่ง | Meta deprecations | 08, 09, 30 |
| AUTH-1 | Google/LINE/OTP | SPIKE-AUTH-LINE (P0), LINE OIDC + `bot_prompt=aggressive`, `users.email` เป็น nullable | HS256 | 27, 13 |
| ONB (ใหม่) | – | ONB-1 เลื่อนการยืนยัน OTP และการเชื่อม Meta ไปไว้หลัง draft แรก, ONB-2 checklist "3 ขั้นถึงโพสต์แรก" | PLG benchmark | 26 |
| GTM (ใหม่) | Affiliate P2 | PARTNER-1..3 (P1): โปรแกรมเอเจนซี/สำนักงานบัญชีแบบ FlowAccount, แพ็ก 6/12 เดือนที่ออกใบกำกับได้, ขึ้นทะเบียน dSURE/Digital Catalog เพื่อใช้ depa voucher | GTM ไทย | 29 |
| LEGAL (ใหม่) | – | DPA ภาษาไทย + รายชื่อ sub-processor สาธารณะ, ใช้ Gemini paid tier เท่านั้น, privacy policy มีขั้นตอนลบข้อมูล + data-deletion callback, ใช้ UI ภาษาอังกฤษในโหมด reviewer | PDPA + Meta | 23, 10, 27 |
| §9 Release | App Review คู่ขนานจากสัปดาห์ 3 | จดนิติบุคคล + Business Verification สัปดาห์ 0–1, Tech Provider, App Review เมื่อ flow โพสต์ทำงานจริงแล้ว (เผื่อ 6–10 สัปดาห์) | ขั้นตอนของ Meta | 10 |
| §10 Risks | – | เพิ่ม: model ถูกปิดภายในไม่กี่สัปดาห์, metric ของ Meta ถูกถอด, LINE+Supabase ใช้ด้วยกันไม่ได้, กฎหมายโฆษณาไทย, คู่แข่งตัดราคา | หลายรายงาน | 04, 08, 15, 23, 27 |

## การเปลี่ยนแปลงที่แนะนำใน Architecture/Design

| Section | ปัจจุบัน | เสนอให้เปลี่ยนเป็น | เหตุผล | รายงาน |
|---|---|---|---|---|
| ARCH §3 models | `gemini-3.8-flash`, `gemini-3.1-flash-image`, Veo 3.1 preview IDs | text `gemini-3.8-flash` (fallback `gemini-3.7-flash`, budget `gemini-3.1-flash-lite`) · image `gemini-nano-banana-2.1` (fallback `gemini-3-pro-image`, ส่วน `gemini-3.1-flash-lite-image` ใช้ได้เฉพาะ 1K) · video `veo-3.1-lite-generate-preview` / `veo-3.1-fast-generate-001` · คำนวณต้นทุนด้วยราคาปี 2027 | deprecations + ราคา | 14, 15, 16 |
| ARCH §3 pipeline | Copy → Brief → Image → Review | Brief → Image → Copy (ดูภาพก่อนเขียน) → rule checks → LLM critic, ใช้ Batch API กับงาน campaign, cache Brand DNA | Predis + ต้นทุน | 05, 14, 28 |
| ARCH §1 hosting | Vercel + Supabase SG | pin Vercel ที่ `sin1`, Supabase ที่ `ap-southeast-1`, แผนย้ายสื่อไป R2 เมื่อ egress สูงขึ้น | default region เป็น US | 27 |
| ARCH §3.1 jobs | cron ทุกนาที | `step.sleepUntil` ต่อโพสต์ + sweep งานที่พลาด, poll Veo ด้วย `step.sleep`, ส่งเฉพาะ ID ใน event | ต้นทุน step ของ Inngest | 27, 07 |
| ARCH §5 Meta | scopes + v20 | `config_id`, ไม่ต้องใช้ `read_insights`, pin Graph version + smoke test ก่อนทุกวันบังคับใช้, เขียน client แบบ clean-room (ห้าม copy Postiz) | Meta/AGPL | 07, 08 |
| ARCH NFR | – | cost NFR (≤$250/เดือนที่ 1k ผู้ใช้, ≤$900 ที่ 10k ไม่รวม AI), license check ใน CI, ตรวจ DPA ของ vendor | ประมาณการต้นทุน | 27, 07 |
| DESIGN §6.2 fonts | Kanit + IBM Plex Sans Thai | เพิ่ม whitelist ฟอนต์ OFL สำหรับ overlay (Kanit, Prompt, Anuphan, IBM Plex Sans Thai, Noto Sans Thai Looped, Sarabun) | license | 18 |
| DESIGN §4 flows | approval loop | ระดับความอัตโนมัติ, ขั้นตอนความคืบหน้าจริง (ห้ามหน่วงเวลาปลอม), เครดิตแสดงเป็น "≈ Y โพสต์" | UX research | 25 |
| DESIGN §1 naming | ยังไม่ได้เช็ก | `panglab.ai/.app/.co/.io` ยังว่าง, `.com` มีคนจดแล้ว, ไม่พบเครื่องหมายการค้าซ้ำในการค้นเบื้องต้น, JAIBRAND เป็นชื่อสำรอง | registry lookup | 24 |

## ความเสี่ยงใหม่

| ความเสี่ยง | โอกาส | ผลกระทบ | การรับมือ | รายงาน |
|---|---|---|---|---|
| คู่แข่งไทยตัดราคา (GenLabs ~฿7.5/ภาพ) | สูง | ขายยาก | ราคาใหม่ + ขายจุดต่าง (Thai overlay, approval, compliance) | 04, 21 |
| Model ถูกปิดภายในไม่กี่สัปดาห์ (NB2, Gemini 2.5) | สูง | ฟีเจอร์พัง | model registry + fallback + ติดตามหน้า deprecations | 14, 15 |
| Meta ถอด metric / มี breaking change (v26 วันที่ 27 ต.ค.) | สูง | dashboard ผิด | registry ของ metric + smoke test | 08, 09 |
| App Review ช้าหรือถูกปฏิเสธ | กลาง | เปิดตัวช้า | reviewer kit, UI อังกฤษ, ยื่นเป็นรอบ | 10 |
| LINE Login ใช้กับ Supabase ไม่ได้ | กลาง | ต้องเปลี่ยนแผน auth | spike + เขียน callback เอง | 27 |
| ผิดประกาศ สคบ./อย. เพราะภาพ AI | กลาง | ลูกค้าโดนปรับ | ติดป้าย AI เป็นค่าเริ่มต้น + linter ตามหมวดสินค้า + ให้ลูกค้ายืนยัน | 11, 23 |
| PDPC ปรับ processor ที่ไม่มี DPA (เคยปรับ 3 ล้านบาท) | กลาง | ค่าปรับ | DPA + รายชื่อ sub-processor | 23 |
| ต้นทุน AI ขึ้น 2 เท่าในปี 2027 (Gemini 3.x Flash) | สูง | margin ลด | คิดราคาด้วยราคาปี 2027 ตั้งแต่ตอนนี้ | 14 |

## คำถามที่ยังเปิด (จัดลำดับความสำคัญ)

1. **ราคา:** เลือกระหว่างแพ็กครั้งเดียวล้วน, แพ็ก + auto-refill หรือ subscription ต้องทดสอบกับ SME จริง 10–20 ราย
2. **Nano Banana 2 ปิด 29 ต.ค. จริงหรือไม่:** ต้องตรวจกับหน้า deprecations โดยตรง เพราะแอปเดิมจะพังด้วย
3. **LINE Login + Supabase:** ทดสอบด้วย spike 1 วัน
4. **IG quota 50 หรือ 100:** ทดสอบกับบัญชีทดสอบ
5. **เลขที่และบทลงโทษของประกาศ สคบ. เรื่องภาพ AI:** ต้องให้นักกฎหมายตรวจ
6. **Thai Accounts API ของ TikTok:** ยังไม่ยืนยัน
7. **ใช้ Gemini ผ่าน Vertex (asia-southeast1) หรือ AI Studio:** ขึ้นกับว่าต้องการ data residency แค่ไหน

## ดัชนีรายงาน

| # | หัวข้อ | ไฟล์ | ความมั่นใจ |
|---|---|---|---|
| 01 | POPCONT: FAQ, Auth, Payment | [01-popcont-faq-auth-payment.md](./01-popcont-faq-auth-payment.md) | สูง |
| 02 | POPCONT: เดโมบนโซเชียล | [02-popcont-social-demos.md](./02-popcont-social-demos.md) | สูง |
| 03 | บริษัทซิกชีทเทค | [03-popcont-company.md](./03-popcont-company.md) | สูง |
| 04 | คู่แข่งไทย | [04-thai-competitors.md](./04-thai-competitors.md) | กลาง–สูง |
| 05 | Predis.ai / Ocoya | [05-global-competitors-predis-ocoya.md](./05-global-competitors-predis-ocoya.md) | กลาง |
| 06 | Brand voice UX | [06-global-competitors-brandvoice.md](./06-global-competitors-brandvoice.md) | กลาง |
| 07 | Open-source schedulers | [07-open-source-schedulers.md](./07-open-source-schedulers.md) | กลาง |
| 08 | Meta Pages API | [08-meta-pages-api.md](./08-meta-pages-api.md) | กลาง |
| 09 | Instagram API | [09-meta-instagram-api.md](./09-meta-instagram-api.md) | กลาง |
| 10 | Meta App Review | [10-meta-app-review.md](./10-meta-app-review.md) | กลาง |
| 11 | นโยบายคอนเทนต์ AI | [11-meta-ai-content-policy.md](./11-meta-ai-content-policy.md) | กลาง |
| 12 | TikTok API | [12-tiktok-api.md](./12-tiktok-api.md) | กลาง |
| 13 | LINE platform | [13-line-api.md](./13-line-api.md) | กลาง |
| 14 | Gemini text models | [14-gemini-text-models.md](./14-gemini-text-models.md) | กลาง |
| 15 | Image models | [15-image-models.md](./15-image-models.md) | กลาง |
| 16 | Video models | [16-video-models.md](./16-video-models.md) | กลาง–ต่ำ |
| 17 | Brand DNA extraction | [17-brand-dna-extraction.md](./17-brand-dna-extraction.md) | กลาง |
| 18 | คุณภาพภาษาไทยของ AI | [18-thai-language-ai-quality.md](./18-thai-language-ai-quality.md) | กลาง |
| 19 | ตลาดดิจิทัลไทย | [19-thai-digital-market.md](./19-thai-digital-market.md) | สูง (DataReportal) |
| 20 | Pain points ของ SME | [20-thai-sme-painpoints.md](./20-thai-sme-painpoints.md) | กลาง |
| 21 | Pricing / credits | [21-pricing-credits.md](./21-pricing-credits.md) | กลาง |
| 22 | Payments & tax | [22-payments-tax-th.md](./22-payments-tax-th.md) | กลาง |
| 23 | PDPA / อย. / สคบ. | [23-legal-pdpa-fda.md](./23-legal-pdpa-fda.md) | กลาง |
| 24 | ชื่อและเครื่องหมายการค้า | [24-naming-trademark.md](./24-naming-trademark.md) | กลาง (domain) / ต่ำ (TM) |
| 25 | UX approval & calendar | [25-ux-approval-calendar.md](./25-ux-approval-calendar.md) | กลาง |
| 26 | Onboarding benchmarks | [26-onboarding-activation.md](./26-onboarding-activation.md) | กลาง |
| 27 | Tech stack | [27-tech-stack.md](./27-tech-stack.md) | กลาง |
| 28 | Agent architecture | [28-agent-architecture.md](./28-agent-architecture.md) | ดูในรายงาน |
| 29 | GTM ไทย | [29-gtm-thailand.md](./29-gtm-thailand.md) | กลาง |
| 30 | Social benchmarks ไทย | [30-social-benchmarks-th.md](./30-social-benchmarks-th.md) | กลาง |
