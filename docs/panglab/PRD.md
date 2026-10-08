# PANGLAB (ปังแล็บ) — Product Requirements Document

> สถานะ: **Draft v0.2** · 2026-10-08 · Owner: Product (Keng) · เอกสารประกอบ: [DESIGN.md](./DESIGN.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [RESEARCH.md](./RESEARCH.md), [research/00-SYNTHESIS.md](./research/00-SYNTHESIS.md)
>
> **v0.2 เปลี่ยนอะไร:** เอกสารนี้ปรับตามรายงานวิจัย 30 ฉบับใน `research/` ประเด็นหลัก: (1) ลดราคาเครดิตและเพิ่ม auto-refill (2) ปรับ KPI ให้ตรง benchmark (3) analytics เปลี่ยนเป็น Views/Viewers ตามที่ Meta ปรับ (4) เพิ่ม requirement ด้าน compliance ไทย (สคบ./อย./PDPA) (5) เพิ่ม onboarding, eval และ partner program ข้อความที่อ้าง `[NN]` หมายถึงรายงาน `research/NN-*.md`

## 1. สรุป

PANGLAB คือ **AI Marketing Agent ภาษาไทย** สำหรับ SME และเอเจนซี่ ระบบจำ Brand DNA ของแบรนด์ แล้วสร้าง caption, ภาพ (รวมถึงภาพที่ใส่สินค้าจริง), อัลบั้ม และวิดีโอสั้น จากนั้นวางแผนปฏิทินและโพสต์ลง Facebook / Instagram อัตโนมัติ ขายเป็นเครดิตแบบซื้อครั้งเดียวที่ไม่มีวันหมดอายุ และมีตัวเลือก auto-refill รายเดือนสำหรับคนที่โพสต์สม่ำเสมอ

เป้าหมายแรกคือ **feature parity กับ POPCONT (popcont.ai)** ซึ่งเป็น reference product (ดู §4) ราคาต้องสู้กับ GenLabs และฟรีแลนซ์ราคาถูกได้ด้วย (ดู §7) จุดต่างที่งานวิจัยยืนยันว่าคู่แข่งยังไม่มี:

| จุดต่าง | หลักฐานว่าคู่แข่งยังไม่มี |
|---|---|
| **Brand-fit score ที่อธิบายเหตุผลได้** (คิดคะแนนจากเกณฑ์ pass/fail) | ไม่มีคู่แข่งรายไหนใน 6 รายที่เปิดเผยคะแนนเป็นตัวเลข [06] |
| **อนุมัติผ่าน LINE** + ระดับความอัตโนมัติที่ปลดล็อกตามความเชื่อใจ | Ocoya ไม่มีลิงก์อนุมัติแบบไม่ต้อง login สำหรับลูกค้าภายนอก [05] |
| **ข้อความไทยบนภาพที่ถูกต้อง 100%** (overlay ด้วยฟอนต์จริง) | ยังไม่มี image model ตัวไหนวาดภาษาไทยได้น่าเชื่อถือ [15][18] |
| **Compliance ไทยในตัว** (ป้าย AI ตาม สคบ., คำต้องห้าม อย.) | กฎหมายบังคับใช้แล้วในปี 2026 [11][23] |
| **Learning loop** นำ Insights มาปรับแผนรอบถัดไป | – |

## 2. ปัญหาและโอกาส

| ปัญหาของ SME ไทย | หลักฐาน / ที่มา |
|---|---|
| ไม่มีทีมคอนเทนต์ แต่ต้องโพสต์สม่ำเสมอ | POPCONT วาง positioning ตรงนี้: "ไม่มีทีมคอนเทนต์ … ช่วยได้" ([popcont.ai](https://popcont.ai/)) |
| อุปสรรคหลักคืองบประมาณ ความยากในการใช้ และทักษะของพนักงาน | สำรวจ สสว. 2025 (2,704 ราย) [20] |
| SME ส่วนใหญ่ยังอยู่ขั้นทดลอง AI และการตลาดเป็นงานที่ใช้ AI มากที่สุด (39.21%) | สำรวจ สดช. ก.ค. 2026 [19] |
| ค่าจ้างคนทำคอนเทนต์: สั่งภาพกับ caption แยก ~฿850–1,600/โพสต์, ฟรีแลนซ์เหมาเดือน ~฿3,000 (โพสต์ทุกวัน), แอดมินประจำ ฿12,000–30,000/เดือน | Fastwork, JobsDB [20] |
| ตลาดใหญ่: social media 56.6M คน, FB ad reach 51.5M, IG 20.6M (+13.9%/ปี), SME 3.28M ราย | DataReportal Digital 2026 [19], สสว. |

## 3. กลุ่มผู้ใช้ (Personas)

| Persona | ใคร | Job-to-be-done | แพ็กที่น่าจะใช้ |
|---|---|---|---|
| **น้องเมย์ — เจ้าของร้านคนเดียว** | คาเฟ่/เบเกอรี่/ออนไลน์ช็อป 1 สาขา | "อยากมีโพสต์สวยๆ ตรงแบรนด์ 4–5 โพสต์ต่อสัปดาห์ โดยใช้เวลาวันละไม่ถึง 5 นาที" | Shop + auto-refill |
| **พี่โอ๊ต — Marketing in-house** | แบรนด์ขนาดกลาง ทีม 1–3 คน | "อยากวางแผนทั้งเดือนในครั้งเดียว แล้วให้หัวหน้าอนุมัติได้ง่าย" | Growth / Pro |
| **คุณแนน — เอเจนซี่เล็ก** | ดูแลลูกค้า 5–30 แบรนด์ | "อยากผลิตงานหลายแบรนด์ แยก Brand DNA ชัดเจน และให้ลูกค้าอนุมัติเองโดยไม่ต้อง login" | Agency + Partner program |

## 4. Reference product teardown: POPCONT

สรุปจากหน้า public, `robots.txt`, JS bundle สาธารณะ และวิดีโอสอนใช้งานของ POPCONT เอง [01][02][03] ไม่ได้ login เข้าระบบ

| ด้าน | POPCONT (ยืนยันแล้ว) | ที่มา |
|---|---|---|
| บริษัท | บริษัท ซิกชีทเทค จำกัด จดทะเบียน 1 มิ.ย. 2569 ทุน 1 ล้านบาท แตกตัวมาจาก Sixsheet Group (ธุรกิจ photobooth) ไม่พบข่าวระดมทุน | [03] |
| Workflow | Plan → Create → Publish → Optimize, Brand wizard มี 3 คำถาม + 5 ขั้นตอน | [02] |
| Modules | Brand DNA, Content Plan / Campaign, Content Studio (โพสต์เดี่ยว / อัลบั้ม / วิดีโอ / หลายโพสต์พร้อมกัน), AI Edit Image, คลังคอนเทนต์ + ปฏิทินที่มีวันเทศกาล, Social connect, Analytics | [02] |
| Routes | `/dashboard /brands /create /campaign /creative /posts /social /analytics /credits /billing /checkout /workspace /settings /affiliate /how-to` | robots.txt [01] |
| Auth | NextAuth: Google, LINE, email+password (ขั้นต่ำ 12 ตัวอักษร), ต้องยืนยันอีเมลก่อนจึงใช้เครดิตได้ | [01] |
| ชำระเงิน | บัตร, Thai QR (หมดอายุใน 15 นาที), โอนแล้วแนบสลิป (ทีมงานเพิ่มเครดิตให้เอง), มี promo code | [01] |
| ราคา | Free 3 เครดิต · ฿349/10 · ฿990/30 · ฿3,000/100 · ฿5,600/200 · ฿12,500/500 (+VAT), เครดิตไม่มีหมดอายุ, ไม่คืนเงิน | [01] |
| การคิดเครดิตในแอป | caption 0.1 · ภาพ 1 · อัลบั้ม 3 · วิดีโอ 3.2 | [02] |
| Traction | ทุกช่องทางโซเชียลมีผู้ติดตามไม่ถึง 100 แต่หน้าเว็บอ้างว่ามี 159 แบรนด์ / 211K คอนเทนต์ | [02] |

### Parity matrix

| ความสามารถ | POPCONT | PANGLAB MVP | PANGLAB V1+ |
|---|---|---|---|
| Brand DNA | ✅ wizard กรอกเอง | ✅ + สแกนจาก URL เว็บ + ดึงจากเพจที่เชื่อมแล้ว | ✅ เรียนรู้จากตัวอย่างโพสต์ |
| หลายแบรนด์ต่อบัญชี | ✅ | ✅ | ✅ + client portal |
| Caption + ภาพ | ✅ | ✅ (caption เขียนหลังเห็นภาพ, 2–3 ตัวเลือก) | ✅ |
| ใส่สินค้าจริงลงในภาพ | ✅ | ✅ + ตรวจความตรงของสินค้า | ✅ |
| อัลบั้ม / carousel | ✅ | ✅ ตั้งเป็นรูปแบบแนะนำ | ✅ |
| วิดีโอสั้น / Reels | ✅ | ⏳ ต้น V1 | ✅ |
| แก้ภาพด้วย AI | ✅ | ⏳ | ✅ |
| Campaign / Content Plan | ✅ | ✅ | ✅ + learning loop |
| ตั้งเวลาโพสต์ FB / IG | ✅ | ✅ | ✅ |
| TikTok / LINE OA | ประกาศไว้ | ❌ | ✅ Phase 3 |
| Analytics | ✅ | ✅ Views/Viewers | ✅ best-time + pillar |
| ระบบอนุมัติ / ทีม | ไม่พบข้อมูล | ✅ | ✅ อนุมัติผ่าน LINE + ลิงก์ลูกค้า |
| Brand-fit score | ไม่พบข้อมูล | ✅ | ✅ |
| ป้าย AI / compliance ไทย | ไม่พบข้อมูล | ✅ | ✅ |
| Affiliate / Partner | มี route | ❌ | ✅ (P1) |

## 5. Goals & Success Metrics

ปรับเป้าจาก v0.1 ให้ตรงกับ benchmark: activation ของ SaaS เฉลี่ย 36% และ MarTech 24% (Lenny, Userpilot) ส่วน free→paid ที่ถือว่า "ดี" อยู่ที่ 3–5% [26]

| Metric | นิยาม | เป้า 90 วันหลัง launch |
|---|---|---|
| Activation · Setup | % สมัครแล้วสร้าง Brand DNA สำเร็จ | ≥ 60% |
| Activation · Aha | % สมัครแล้วได้ draft แรกที่อนุมัติภายใน 24 ชม. | 35–40% (stretch 50%) |
| Activation · Habit | % ที่อนุมัติ ≥ 3 โพสต์ในสัปดาห์แรก | ≥ 20% |
| Time-to-first-post | sign up → draft แรก | P50 ≤ 3 นาที, P90 ≤ 10 นาที |
| Connect rate | % ผู้ใช้ active ที่เชื่อม Meta สำเร็จ | ≥ 40% |
| Paid conversion | % free ที่ซื้อครั้งแรก (วัดแบบ cohort) | 3–4% ใน 14 วัน, 6–8% ใน 90 วัน |
| Approved-without-edit | % draft ที่อนุมัติโดยไม่แก้เลย | ≥ 40% (วัดคู่กับ approval rate เพราะ IKEA effect ดัน approval rate ให้สูงเกินจริง [25]) |
| Publish success | % โพสต์ตั้งเวลาที่ขึ้นสำเร็จ | ≥ 99% |
| Gross margin ต่อเครดิต | (ราคาขาย − ต้นทุน AI + infra) / ราคาขาย | ≥ 75% (คำนวณด้วยราคา Gemini ปี 2027) |

**Non-goals (MVP):** โฆษณาแบบเสียเงิน, ตอบแชต/คอมเมนต์ (ตลาดอิ่มตัวแล้ว [04]), TikTok/LINE publishing, แอป native และ**การ scrape หน้า Facebook/Instagram ทุกกรณี** รวมถึงหน้าคู่แข่ง [17]

## 6. Functional Requirements

Priority: **P0** = MVP ต้องมี · **P1** = V1 · **P2** = ภายหลัง · 🆕 = เพิ่มใน v0.2 · ✏️ = แก้ใน v0.2

### 6.1 Auth, Onboarding & Workspace
| ID | Requirement | P |
|---|---|---|
| AUTH-1 ✏️ | สมัคร/เข้าระบบด้วย Google, LINE Login (OIDC + `bot_prompt=aggressive` เพื่อชวนเพิ่ม OA เป็นเพื่อน) และ Email OTP, `users.email` ต้องเป็น nullable เพราะ LINE อาจไม่ส่งอีเมล [13][27] | P0 |
| AUTH-1a 🆕 | **Spike:** ทดสอบ LINE web login (token เซ็นด้วย HS256) กับ Supabase custom OIDC ถ้าไม่ผ่านให้เขียน callback เองแล้วตรวจ token ผ่าน `/oauth2/v2.1/verify` [27] | P0 |
| AUTH-2 | Workspace มีได้หลายแบรนด์ สลับด้วย brand switcher | P0 |
| AUTH-3 | Roles: Owner, Editor, Approver, Viewer (สิทธิ์แยกตามแบรนด์), แก้ Brand DNA ได้เฉพาะ Owner/Editor [06] | P1 |
| AUTH-4 | Client portal สำหรับลูกค้าของเอเจนซี่ | P2 |
| ONB-1 🆕 | เลื่อนการยืนยัน OTP/อีเมลและการเชื่อม Meta ไปไว้หลังได้ draft แรก (ตอนสมัครยังไม่บังคับ) [26] | P0 |
| ONB-2 🆕 | Checklist "3 ขั้นถึงโพสต์แรก" และฟอร์มแบรนด์ที่ AI กรอกให้ล่วงหน้า ผู้ใช้ไม่ต้องเขียน prompt เอง [20][26] | P0 |

### 6.2 Brand DNA
| ID | Requirement | P |
|---|---|---|
| BRAND-1 ✏️ | ข้อมูลแบรนด์: ชื่อ, ธุรกิจ, จุดขาย, persona, น้ำเสียง (4 แกนของ NN/g + ลักษณะเฉพาะภาษาไทย: สรรพนาม, คำลงท้าย, ความถี่อีโมจิ), ช่องอธิบายน้ำเสียงแบบอิสระ ≤500 ตัวอักษร, persona preset ภาษาไทย, คำที่ต้องใช้/ห้ามใช้, CTA, hashtag [06][17] | P0 |
| BRAND-2 ✏️ | โลโก้ + สีแบรนด์ (≤5) + ฟอนต์จาก whitelist ฟอนต์ OFL ภาษาไทยที่ผ่านการทดสอบแล้ว + brand lock (ล็อกโลโก้/สี/ฟอนต์ในภาพ) [18][06] | P0 |
| BRAND-3a ✏️ | **สแกนเว็บไซต์**: Firecrawl `branding` + Brandfetch Logo API → ร่าง Brand DNA ภายใน ≤ 60 วินาที (background job), cache ต่อโดเมน 30 วัน [17][26] | P0 |
| BRAND-3b 🆕 | **ดึงจากเพจที่เชื่อมแล้ว** ผ่าน Graph API เท่านั้น (ห้าม scrape), ไม่เก็บคอมเมนต์และชื่อลูกค้า (PDPA) [17] | P0 |
| BRAND-3c 🆕 | ทางสำรองเมื่อสแกนไม่ได้: วางโพสต์เก่า 3–5 ชิ้น / อัปโหลด screenshot / ตอบ 3 คำถาม [05][26] | P0 |
| BRAND-4 | Product catalog: ชื่อ, ราคา, รายละเอียด, รูปสินค้า (ตัดพื้นหลังอัตโนมัติ), ใช้เป็นภาพอ้างอิงทุกครั้งที่สร้างภาพ [15] | P0 |
| BRAND-5 | Content pillars ค่าเริ่มต้น: ให้ความบันเทิง/DIY/how-to ≥ 50%, โปรโมชัน ≤ 30% (engagement ของโพสต์โปรในไทย −18%, DIY +32% [30]) | P1 |
| BRAND-6 | ทุก field มี `provenance` (มาจาก scan/user/AI) + `confidence`, เก็บเป็น JSON แบบมี version และตั้งค่าแยกตามช่องทางได้ [17][06] | P0 |
| BRAND-7 🆕 | เรียนรู้น้ำเสียงจากตัวอย่าง ≤ 8 ชิ้น (ข้อความ/ไฟล์/URL) → ได้คำอธิบายน้ำเสียงภาษาไทยที่แก้ไขได้ [06] | P1 |
| BRAND-8 🆕 | Preview "มี/ไม่มี Brand voice" ระหว่าง onboarding [06] | P1 |

### 6.3 Content Generation
| ID | Requirement | P |
|---|---|---|
| GEN-1 ✏️ | **Quick Post**: ไอเดีย/สินค้า → ภาพ แล้วเขียน caption หลังเห็นภาพ ได้ 2–3 ตัวเลือก, autosave draft [05] | P0 |
| GEN-2 | เสนอหัวข้อจาก Brand DNA + ปฏิทินเทศกาลไทย ผู้ใช้ไม่ต้องเขียน prompt | P0 |
| GEN-3 | **Product Shot**: วางสินค้าจริงในฉากโดยรักษารูปทรง โลโก้ และสีไว้ | P0 |
| GEN-4 ✏️ | **Album/Carousel** 2–10 สไลด์ ตั้งเป็นรูปแบบแนะนำ (IG carousel ได้ engagement 0.50–0.55% ซึ่งสูงที่สุด [30]) | P0 |
| GEN-5 | Regenerate แยกส่วน + rewrite chips ที่คืนผล 3 แบบตามช่องทาง [06] | P0 |
| GEN-6 ✏️ | **Brand-fit score 0–100 คำนวณในโค้ด** จากเกณฑ์ pass/fail: ตรวจด้วยโค้ดก่อน (คำต้องห้าม, คำ อย., ราคาตรงกับ catalog, มี CTA, ความยาวตามช่องทาง) แล้วใช้ LLM rubric ตรวจน้ำเสียง (critic ใช้คนละ model กับ copywriter) **ห้ามให้ LLM ตอบเป็นตัวเลขเอง** แสดงผลเป็น flag ที่กดแก้ได้ [28][06] | P0 |
| GEN-7 ✏️ | ข้อความไทยบนภาพทำผ่าน overlay layer ทั้งหมด: HarfBuzz shaping, ตัดบรรทัดด้วย `Intl.Segmenter`/ICU4X, normalize เป็น NFC, ปรับขนาดอัตโนมัติ, ใช้ฟอนต์ไฟล์เดียวกันทั้ง preview และ server, มี visual regression test สำหรับสระซ้อนและวรรณยุกต์ [18][15] | P0 |
| GEN-8 ✏️ | วิดีโอสั้น 9:16 ใช้รูปสินค้าเป็นเฟรมแรก: Lite 720p / 1080p / Fast (ดู §7.1), รันเป็น background job แล้วแจ้งเตือนเมื่อเสร็จ [16][25] | P1 |
| GEN-9 | Inpaint / แก้บางส่วนของภาพ (POPCONT มีแล้ว [02]) | P1 |
| GEN-10 ✏️ | Compliance ตามหมวดสินค้า: อาหาร/อาหารเสริม/เครื่องสำอาง (คำต้องห้ามตามกฎ อย. 28 ก.ค. 2026 + ช่องกรอกเลขอนุญาตโฆษณา), แอลกอฮอล์ (ห้ามสร้างโฆษณา ตาม ม.32/1), ยา/เครื่องมือแพทย์ (บล็อก) และให้ผู้ใช้ยืนยันพร้อมเก็บ log [11][23] | P0 |
| GEN-11 🆕 | Thai copy linter: สำนวนแปลที่ห้ามใช้, ความสม่ำเสมอของคำลงท้ายและสรรพนาม, เพดานอีโมจิและ hashtag, รูปแบบปี พ.ศ./ค.ศ., ราคาตรงกับ catalog (ผลส่งเข้า GEN-6) [18] | P0 |
| GEN-12 🆕 | **ติดป้าย AI เป็นค่าเริ่มต้น**: เขียน IPTC `DigitalSourceType` กลับลงไฟล์หลัง overlay/JPEG, ส่ง `is_ai_generated=true` ให้ IG (กรณี carousel ตั้งที่ parent) และใส่บรรทัดเปิดเผยว่าใช้ AI ใน caption ของ FB feed ตามประกาศ สคบ. [11][23][09] | P0 |
| GEN-13 🆕 | ตรวจว่าสินค้าในภาพตรงกับรูปจริง (รูปทรง/สี/จำนวน) ก่อนอนุมัติ ตามประกาศ สคบ. [23] | P0 |
| GEN-14 🆕 | แสดงความคืบหน้าตามขั้นตอนจริงเป็นภาษาไทย (ห้ามหน่วงเวลาปลอม), แผน Campaign ตรวจทีละการ์ดได้ [25] | P0 |

### 6.4 Campaign Studio
| ID | Requirement | P |
|---|---|---|
| CAMP-1 | ใส่เป้าหมาย + ช่วงเวลา + สินค้า + ความถี่ → ได้ Content Plan (ไม่ตัดเครดิต) ค่าเริ่มต้น FB 4–5 / IG 3–4 โพสต์ต่อสัปดาห์ [30] | P0 |
| CAMP-2 | แก้แผนได้ก่อนสร้างจริง | P0 |
| CAMP-3 | แสดงเครดิตรวม (รวมกรณีแย่สุดที่ต้องแก้ 1 รอบ) ก่อนยืนยัน [28] | P0 |
| CAMP-4 | ผลลัพธ์ลงปฏิทินสถานะ "รออนุมัติ" | P0 |
| CAMP-5 | Learning loop: ทดลอง A/B ช่วงเช้ากับช่วงเย็นต่อเพจ แล้วปรับ pillar mix จาก Insights [30] | P1 |

### 6.5 Calendar, Approval & Library
| ID | Requirement | P |
|---|---|---|
| CAL-1 | ปฏิทิน Month/Week/List, ลากเพื่อเลื่อนเวลา, แสดงช่องเวลาแนะนำบนปฏิทิน [25] | P0 |
| CAL-2 ✏️ | สถานะ: Draft → Pending approval → Scheduled → Publishing → Published / Failed, **การตั้งเวลาโพสต์ = ส่งให้อนุมัติ**, ถ้ายังไม่อนุมัติจะไม่โพสต์ [05][25] | P0 |
| CAL-3 ✏️ | Approval queue: อนุมัติทีละหลายชิ้น, เรียงตาม brand-fit จากต่ำไปสูง, ปุ่ม "อนุมัติ / แก้ / ขอแก้ / สร้างใหม่", ยกเลิกการอนุมัติได้ [25] | P0 |
| CAL-4 | แจ้งเตือนผ่าน Email + Web push | P0 |
| CAL-5 ✏️ | **อนุมัติใน LINE**: Flex Message + postback (≤300 ตัวอักษร), ตรวจ webhook signature และ userId ของผู้อนุมัติ, มีตัวเลือก digest วันละครั้ง [13] | P1 |
| CAL-6 🆕 | ระดับความอัตโนมัติ L1 (อนุมัติทุกชิ้น) → L2 (อนุมัติอัตโนมัติถ้า brand-fit ผ่านเกณฑ์ และมีช่วงเวลาให้ veto) → L3 (Autopilot) ปลดล็อกตามประวัติการใช้งาน ผู้ใช้ต้องเลือกเปิดเอง [25] | P1 |
| CAL-7 🆕 | ลิงก์อนุมัติสำหรับลูกค้าภายนอก ไม่ต้อง login และไม่นับเป็น seat [05] | P1 |
| CAL-8 🆕 | ช่องเวลาเริ่มต้น 09:00 และ 19:00 (จ–ศ, Asia/Bangkok) แหล่งข้อมูลไทยยังขัดกันเรื่องเวลาที่ดีที่สุด จึงให้ CAMP-5 ทดลองต่อเพจ [30] | P0 |
| LIB-1 | คลังคอนเทนต์ + ค้นหา/กรอง + ทำซ้ำเป็นโพสต์ใหม่ | P0 |

### 6.6 Publishing
| ID | Requirement | P |
|---|---|---|
| PUB-1 ✏️ | Facebook Login for Business (`config_id`) ดึงเพจจาก `/me/accounts` และ Business Manager, ใช้ Instagram Login (ไม่ต้องมีเพจ) เป็นตัวเลือก P1 [08][09][07] | P0 |
| PUB-2 | FB: ข้อความ, ภาพเดี่ยว, หลายภาพ (upload แบบ `published=false` ซึ่งหมดอายุใน ~24 ชม. แล้วใช้ `attached_media`) [08] | P0 |
| PUB-3 | IG: ภาพเดี่ยว (แปลงเป็น JPEG), carousel ≤ 10, เตรียม container ล่วงหน้า ~5 นาที (container หมดอายุใน 24 ชม.), signed URL มีอายุ ≥ 1 ชม. [09] | P0 |
| PUB-4 | Scheduler ฝั่ง server เป็นของเราเองทั้ง FB และ IG (IG ไม่มี native scheduling) [09] | P0 |
| PUB-5 ✏️ | อ่าน quota จาก `content_publishing_limit` (`quota_total`) ตอน runtime ค่าเริ่มต้น 50 พร้อม soft cap ฝั่งเรา, FB Reels ≤ 30/Page/24 ชม., มีตัวกันโพสต์ซ้ำและสแปม [09][08][11] | P0 |
| PUB-6 ✏️ | แบ่ง error เป็น 4 ประเภท: retry (backoff) / refresh token / disconnect / bad body พร้อมข้อความภาษาไทย (reuse `translateFacebookError`) [07] | P0 |
| PUB-7 ✏️ | Token health: ตรวจด้วย `debug_token` และ error 190 ทุกวัน ไม่ใช้วิธีนับถอยหลังวันหมดอายุ [08] | P0 |
| PUB-8 ✏️ | FB/IG Reels พร้อมตรวจ spec (9:16, 3–90 วินาที, 24–60 fps) **เลื่อนมาไว้ต้น V1** [08][30] | P1 |
| PUB-9a 🆕 | TikTok: เริ่มจาก Upload-to-inbox แล้วค่อยเปิด Direct Post หลังผ่าน audit, ต้องมี composer ตามกติกา TikTok (ไม่มี privacy default, เปิดเผยว่าเป็นเนื้อหาเชิงพาณิชย์), จำกัด 15 โพสต์/วัน และ 6 init/นาที [12] | P2 |
| PUB-9b 🆕 | LINE OA broadcast: ลูกค้าเชื่อม Messaging API channel ของตัวเอง แล้วค่อยสมัครเป็น Module channel partner ทีหลัง [13] | P2 |

### 6.7 Analytics
| ID | Requirement | P |
|---|---|---|
| ANA-1 ✏️ | ใช้ **Views / Viewers** (`page/post_media_view`, `*_total_media_view_unique`) และ IG `views`/`reach`/`total_interactions` แทน impressions/reach เดิมที่ Meta ถอดไปแล้ว, เก็บชื่อ metric ใน registry, แสดงจุดที่ Meta เปลี่ยนวิธีนับบนกราฟ, ดึงทุก 6 ชม. ใน 7 วันแรก (ข้อมูลอาจช้าถึง 48 ชม.) [08][09] | P0 |
| ANA-2 | Dashboard: KPI tiles, top posts, แสดงช่วง benchmark พร้อมแหล่งที่มา (FB ~0.05–0.15%) เพื่อไม่ให้ SME ตกใจกับตัวเลขต่ำ [30] | P0 |
| ANA-3 | Best-time heatmap + pillar performance | P1 |
| ANA-4 | AI summary รายสัปดาห์ | P1 |

### 6.8 Credits & Billing
| ID | Requirement | P |
|---|---|---|
| BILL-1 ✏️ | เครดิตที่ซื้อ**ไม่มีวันหมดอายุ**ตราบที่บัญชียัง active, เครดิตฟรีหมดใน 30 วัน, โบนัสหมดใน 90 วัน, การันตีราคาเดิม (price-lock) ให้เครดิตที่ซื้อไปแล้ว [01][21][29] | P0 |
| BILL-2 ✏️ | ชำระผ่าน `PaymentProvider` abstraction: PromptPay QR สำหรับแพ็กครั้งเดียว, บัตรสำหรับ auto-refill, ผู้ใช้ PromptPay ได้ QR ใหม่ทาง LINE/อีเมลเมื่อถึงรอบ [22] | P0 |
| BILL-3 | Credit ledger แยกประเภทเครดิตและวันหมดอายุ | P0 |
| BILL-4 | Reserve เครดิตก่อนเริ่มงาน แล้วคืนอัตโนมัติเมื่อล้มเหลวจากฝั่งระบบ และแสดงใน ledger ทันที | P0 |
| BILL-5 ✏️ | Billing profile (เลขผู้เสียภาษี, สาขา, ที่อยู่) + ออกใบกำกับภาษีผ่านผู้ให้บริการ e-Tax (FlowAccount/PEAK) และแสดงราคารวม VAT [22] | P0 |
| BILL-6 ✏️ | **Partner program** (เลื่อนเป็น P1): เอเจนซี/สำนักงานบัญชีใช้ฟรี + ส่วนแบ่ง, ลูกค้าที่ถูกแนะนำได้เครดิตทดลอง (โมเดลแบบ FlowAccount) [29] | P1 |
| BILL-7 🆕 | Auto-refill รายเดือน: +20% เครดิต, rollover ได้สูงสุด 2 เท่า [21] | P0 |
| BILL-8 🆕 | ชำระด้วยใบแจ้งหนี้ + โอนเงินสำหรับ B2B: รับยอดสุทธิหลังหัก ณ ที่จ่าย 3%/1%, อัปโหลดหนังสือรับรอง 50 ทวิ, admin ยืนยันแล้วจึงเพิ่มเครดิต [22] | P1 |
| BILL-9 🆕 | Header meter แสดง "X เครดิต ≈ Y โพสต์" และราคาบนปุ่ม generate ทุกปุ่ม [25][21] | P0 |
| BILL-10 🆕 | แพ็ก 6/12 เดือนที่ออกใบกำกับได้ + ขึ้นทะเบียน dSURE / Thailand Digital Catalog เพื่อเปิดช่องทาง depa voucher [29] | P2 |

### 6.9 Compliance & Legal 🆕
| ID | Requirement | P |
|---|---|---|
| LEGAL-1 | DPA ภาษาไทย + รายชื่อ sub-processor สาธารณะ (PANGLAB เป็น processor ของข้อมูลร้านค้า) [23] | P0 |
| LEGAL-2 | Privacy policy ที่ระบุขั้นตอนขอลบข้อมูล + Meta data-deletion callback + ฐานการส่งข้อมูลข้ามประเทศตาม ม.28/29 [10][27] | P0 |
| LEGAL-3 | ใช้ Gemini แบบ paid tier เท่านั้น (free tier นำข้อมูลไปใช้ได้) [14][23] | P0 |
| LEGAL-4 | Locale ภาษาอังกฤษแบบซ่อนสำหรับ Meta reviewer + reviewer kit (บัญชีทดสอบ, เพจทดสอบ, สคริปต์ screencast) [10] | P0 |
| LEGAL-5 | ปฏิทิน compliance รายปี (Data Use Checkup / Data Access Renewal ของ Meta) [10] | P1 |

## 7. Pricing (v0.2)

### 7.1 อัตราเครดิตต่อชิ้นงาน

1 เครดิตตั้งไว้ใกล้กับต้นทุนภาพ 1K หนึ่งภาพจาก `gemini-nano-banana-2.1` (~$0.034 [15]) บวก caption ใช้ราคา Gemini ปี 2027 ($1.50/$7.50 ต่อ 1M tokens [14]) ในการคิดต้นทุน

| ชิ้นงาน | เครดิต | ต้นทุน AI โดยประมาณ* |
|---|---|---|
| Quick Post (ภาพ 1K + caption 2–3 ตัวเลือก) | 1 | ~$0.04 |
| Eco image (1K, Lite) | 0.5 | ~$0.02 |
| Product Shot (มีภาพอ้างอิง) | 1 | ~$0.04 |
| Album (ต่อสไลด์) | 1 สำหรับสไลด์แรก + 0.5 ต่อสไลด์ถัดไป | ~$0.034/สไลด์ |
| Regenerate caption | ฟรี 3 ครั้ง/ชิ้น แล้วครั้งละ 0.1 | < $0.005 |
| Regenerate ภาพ | 0.5 | ~$0.034 |
| Brand DNA scan ครั้งแรก | 0 | < $0.07 [17] |
| วิดีโอ 8 วินาที Lite 720p / 1080p / Fast 1080p | 5 / 8 / 12 | ~$0.40 / $0.64 / $0.96 [16] |
| Content / Campaign plan | 0 | < $0.01 |

\* ต้นทุนเหล่านี้ประเมินจากราคาที่ subagent อ่านได้ระหว่างการวิจัย บางส่วนมาจากสรุปผลค้นหา **ต้องยืนยันกับหน้า pricing จริงก่อนตั้งราคา**

### 7.2 แพ็กเครดิต (ราคารวม VAT)

ราคาตั้งต่ำกว่า POPCONT ราว 40–55% แต่ยังไม่ลงไปแข่งราคาต่อภาพกับ GenLabs (~฿7.5) ตรงๆ จะขายด้วยคุณค่าที่ GenLabs ไม่มี ได้แก่ caption + ภาพในโพสต์เดียว, overlay ภาษาไทย, ระบบอนุมัติ และ compliance [04][21]

| แพ็ก | ราคา | เครดิต | ฿/โพสต์ | เทียบกับ |
|---|---|---|---|---|
| ทดลองฟรี | ฿0 | 5 (หมดใน 30 วัน) | – | POPCONT ให้ 3 |
| Starter | ฿199 | 10 | 19.9 | POPCONT ฿349/10 |
| Shop | ฿690 | 40 | 17.3 | ~เท่าค่าโพสต์ทุกวัน 1 เดือน |
| Growth ⭐ | ฿1,690 | 110 | 15.4 | |
| Pro | ฿2,990 | 220 | 13.6 | |
| Agency | ฿6,990 | 560 | 12.5 | POPCONT ฿12,500/500 |
| Auto-refill (ทุกแพ็ก) | ราคาแพ็กเดิม/เดือน | +20% เครดิต | ลดลง ~17% | ตัดผ่านบัตร |
| Enterprise | ติดต่อทีมขาย | custom | – | SSO, subdomain, DPA เฉพาะ |

ทุกแพ็กได้ฟีเจอร์เหมือนกัน ต่างกันแค่จำนวนเครดิต ยกเว้น Agency ที่ได้ CAL-7 กับ client portal ส่วน gross margin ที่ ฿12.5/เครดิตยังเหลือ ~80% เมื่อเทียบต้นทุนประมาณ ~฿1.5–2.5/เครดิต (ประเมินเอง)

> **Behavioral note:** แสดงยอดคงเหลือเป็น "≈ Y โพสต์" ไม่ใช่จำนวนเครดิต ให้ regenerate caption ได้ฟรีบางครั้ง และเทียบราคากับค่าจ้างคนที่มีแหล่งอ้างอิงชัด เช่น "สั่งฟรีแลนซ์ทำภาพ + caption แยก ~฿850+/โพสต์ (ราคาบน Fastwork ณ ต.ค. 2026)" [20] โดยต้องเก็บ screenshot พร้อมวันที่ไว้ก่อนนำไปใช้ในโฆษณา ไม่พึ่ง decoy pricing เพราะผลการทดลองซ้ำไม่ค่อยได้ผล [21] ตัวเลข "฿300–500 ต่อโพสต์" ใน v0.1 ถูกลบออกเพราะไม่มีแหล่งอ้างอิง

## 8. Non-functional Requirements

| ด้าน | Requirement |
|---|---|
| Performance | Quick Post P50 ≤ 20 วินาที, P95 ≤ 45 วินาที, Brand scan ≤ 60 วินาที |
| Reliability | โพสต์ภายใน ±2 นาทีจากเวลาที่ตั้ง, uptime 99.5%, มี job คอยตรวจโพสต์ที่พลาด |
| Security | ไม่มี API key ใน browser, Meta token เข้ารหัส AES-256-GCM, เปิด RLS ทุกตาราง |
| Privacy / PDPA | DPA, ลบข้อมูลได้ภายใน 30 วัน, ข้อมูลอยู่ที่ Singapore (ap-southeast-1 / sin1) [27] |
| Meta compliance | Business Verification → Tech Provider → App Review โดยยื่น permission เป็นรอบ: publishing ก่อน แล้วค่อย insights [10] |
| Platform versions | เก็บ Graph API version ไว้ใน config + smoke test ก่อนทุกวันที่ Meta บังคับใช้ (เช่น v26 วันที่ 27 ต.ค. 2026) [08] |
| Model lifecycle | model registry + fallback, ตรวจหน้า deprecations รายสัปดาห์ [14][15] |
| Cost | infra (ไม่รวม AI) ≤ $250/เดือนที่ 1k ผู้ใช้, ≤ $900 ที่ 10k [27] |
| Quality | Thai golden set 30–50 brief เป็น CI gate ทุกครั้งที่เปลี่ยน prompt หรือ model [18][28] |
| Licensing | license check ใน CI, ห้ามนำโค้ด AGPL (เช่น Postiz) เข้ามา [07] |
| Accessibility / Localization | WCAG 2.2 AA, ภาษาไทยเป็นหลัก, Asia/Bangkok, พ.ศ./ค.ศ. |
| Observability | Langfuse trace ต่อ agent run (mask PII), cost/latency ต่อเครดิต, alert เมื่อ publish fail > 2% [28] |

## 9. Release Plan (v0.2)

| Phase | ระยะเวลา (ประเมิน) | Scope | Exit criteria |
|---|---|---|---|
| **0 · Foundation** | 2 สัปดาห์ | จดนิติบุคคล + **Meta Business Verification (สัปดาห์ 0–1)**, monorepo, Supabase/Vercel ที่ SG, spike LINE auth (AUTH-1a), model registry, overlay ภาษาไทย (GEN-7) | Login ได้, overlay ผ่าน visual test |
| **1 · MVP (Closed beta)** | 6 สัปดาห์ | Brand DNA scan, Quick Post, Product Shot, Album, compliance (GEN-10..13), Calendar + Approval, FB/IG publish, credits + PromptPay + auto-refill, Views analytics | 20 แบรนด์ beta, publish success ≥ 99% |
| **Meta Tech Provider + App Review** | เริ่มเมื่อ flow โพสต์ทำงานจริง (~สัปดาห์ 5) เผื่อ 6–10 สัปดาห์และถูกปฏิเสธ 1–2 รอบ | screencast UI ภาษาอังกฤษ, ยื่น publishing scopes ก่อน | ได้ Advanced Access |
| **2 · V1 (Public launch)** | 6 สัปดาห์ | Reels + วิดีโอ, Campaign + learning loop, LINE approval, autonomy levels, client approval link, Partner program | Activation (Aha) ≥ 35% |
| **3 · Expansion** | ต่อเนื่อง | TikTok, LINE OA broadcast, client portal, dSURE/depa, Enterprise | – |

ระหว่างรอ App Review ให้ beta tester ใช้ในฐานะ tester ของแอป และมีโหมด "ดาวน์โหลด + คัดลอก caption" สำรองไว้

## 10. Risks & Mitigations

| ความเสี่ยง | ผลกระทบ | การรับมือ |
|---|---|---|
| คู่แข่งไทยตัดราคา (GenLabs ~฿7.5/ภาพ, ฟรีแลนซ์เหมา ~฿60–120/โพสต์) [04][20] | ขายยาก | ราคา v0.2 + auto-refill + ขายจุดต่าง (overlay ไทย, approval, compliance) |
| Model ถูกปิดเร็ว (Imagen 4, Veo 2 ปิดแล้ว, NB2 มีข่าวว่าจะปิด 29 ต.ค. 2026, Sora API ปิดแล้ว) [15][16] | ฟีเจอร์พัง | model registry + fallback + monitor deprecations |
| Meta ถอด metric / มี breaking change [08][09] | dashboard ผิด, โพสต์ล้ม | metric registry, เก็บ Graph version ใน config, smoke test |
| App Review ช้าหรือถูกปฏิเสธ (~20 วัน/รอบ) [10] | เปิดตัวช้า | เริ่ม Business Verification ทันที, reviewer kit, ยื่นเป็นรอบ |
| LINE Login ใช้กับ Supabase ไม่ได้ [27] | แผน auth ต้องเปลี่ยน | spike AUTH-1a ใน Phase 0 |
| ลูกค้าผิดประกาศ สคบ./กฎ อย. [11][23] | ลูกค้าโดนปรับ, เสียชื่อเสียง | GEN-10..13 + ToS ที่ระบุความรับผิดชอบ + log การยืนยัน |
| PDPC ปรับ processor ที่ไม่มี DPA [23] | ค่าปรับ | LEGAL-1..3 |
| ต้นทุน Gemini ขึ้น 2 เท่าในปี 2027 [14] | margin ลด | คิดราคาด้วยราคาปี 2027 ตั้งแต่ตอนนี้, Batch API สำหรับงานกลางคืน, cache Brand DNA |
| ภาพสินค้าผิดรูป | เสียความเชื่อใจ + ผิดประกาศ สคบ. | ส่งภาพอ้างอิงทุกครั้ง + GEN-13 |
| ถูกมองว่าลอกแบบคู่แข่ง | ปัญหากฎหมาย/แบรนด์ | ใช้ชื่อ แบรนด์ ข้อความ และงานออกแบบของเราเองทั้งหมด ห้าม copy asset/โค้ดของ POPCONT หรือโค้ด AGPL |

## 11. Open Questions

| # | คำถาม | ใครตัดสิน |
|---|---|---|
| 1 | ทดสอบโมเดลราคา (แพ็กครั้งเดียว vs auto-refill vs subscription) กับ SME จริง 10–20 รายก่อน launch | Product |
| 2 | NB2 ปิด 29 ต.ค. จริงหรือไม่ (กระทบแอปเดิมด้วย) ต้องตรวจหน้า deprecations โดยตรง | Tech lead |
| 3 | IG quota เป็น 50 หรือ 100: ทดสอบกับบัญชีทดสอบ | Tech lead |
| 4 | เลขที่และบทลงโทษของประกาศ สคบ. เรื่องภาพ AI | Legal |
| 5 | ใช้ Gemini ผ่าน Vertex (asia-southeast1) หรือ AI Studio | Tech lead + Legal |
| 6 | จด `panglab.ai` และยื่นเครื่องหมายการค้า "PANGLAB/ปังแล็บ" (Nice 9/35/42) เมื่อไร (ไทยให้สิทธิ์ผู้ยื่นก่อน) [24] | Founder |
