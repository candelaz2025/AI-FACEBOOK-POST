# PANGLAB — Design Plan (UX/UI)

> สถานะ: **Draft v0.2** · 2026-10-08 · อ่านคู่กับ [PRD.md](./PRD.md) และ [ARCHITECTURE.md](./ARCHITECTURE.md) · v0.2 ปรับตาม [research/00-SYNTHESIS.md](./research/00-SYNTHESIS.md)

## 1. ชื่อแบรนด์ (Naming)

### ชื่อที่เลือก: **PANGLAB — ปังแล็บ**

**Tagline (TH):** "แล็บ AI ที่ทำให้แบรนด์คุณปังทุกวัน"
**Tagline (EN):** "Your brand's always-on AI content lab."

คำว่า "ปัง" เป็นสแลงไทยที่แปลว่าดังหรือได้ผลดีเกินคาด ชื่อนี้จึงสื่อถึง **ผลลัพธ์** ที่ลูกค้าอยากได้ ไม่ได้พูดถึงฟีเจอร์ ส่วน "LAB" สื่อว่าระบบได้ทดลอง เรียนรู้ และปรับปรุงไปเรื่อยๆ ซึ่งตรงกับ Agent loop ใน PRD (Generate → Publish → Measure → Learn) ในเชิงจิตวิทยา ชื่อที่บอกผลลัพธ์เป็นคำพูดติดปากจะดึง **identity-based motivation** ได้ดีกว่าชื่อเชิงฟังก์ชัน เจ้าของ SME อยากเป็น "แบรนด์ที่ปัง" ไม่ได้อยากเป็น "คนใช้ caption generator" ชื่อนี้ยังแยกตัวจาก POPCONT ได้ชัด ทั้งตัวอักษร เสียง และคำ จึงลดความเสี่ยงสับสนเชิงเครื่องหมายการค้า

### ชื่อสำรอง

| ชื่อ | ความหมาย / มุม | จุดแข็ง | จุดอ่อน |
|---|---|---|---|
| **PANGLAB (เลือก)** | ปัง + Lab | สื่อผลลัพธ์, จำง่าย, ไทยแท้แต่อ่านเป็นอังกฤษได้ | คนต่างชาติไม่เข้าใจคำว่า "ปัง" |
| SAENG (แสง) | แสงส่องแบรนด์ | สั้น ดูพรีเมียม | ผูกกับ "content" ได้ไม่ชัด และเป็นคำทั่วไปที่หลายบริษัทใช้อยู่แล้ว (`saeng.co` ถูกจดแล้ว) [24] |
| TAMJAI (ตามใจ) | AI ที่ทำตามใจแบรนด์ | เน้นความเป็น brand-aware | ชนกับแบรนด์อาหารที่มีอยู่แล้ว |
| JAIBRAND (**สำรองอันดับ 1**) | ใจ + Brand | อบอุ่น เป็นมิตร, `.com/.ai/.co/.app` ยังว่าง และไม่พบบริษัทที่ใช้ชื่อนี้ [24] | ยาวและธรรมดา |

> **สถานะการตรวจชื่อ (2026-10-08, [research/24](./research/24-naming-trademark.md)):** registry lookup พบว่า `panglab.ai`, `.app`, `.co`, `.io`, `.studio` และ `getpanglab.com` ยังว่าง ส่วน `panglab.com` มีคนจดแล้ว (ไม่ทราบว่าใครหรือใช้ทำอะไร) ค้นเว็บไม่พบบริษัทหรือผลิตภัณฑ์ชื่อ PangLab/ปังแล็บ ในวงการ software/marketing (เจอแค่แล็บวิจัยในมหาวิทยาลัย) และ aggregator เครื่องหมายการค้าก็ไม่พบ PANGLAB ส่วน PANLABS (USPTO) ถูกยกเลิกไปแล้วตั้งแต่ 2014
>
> ⚠️ **ยังไม่ใช่ trademark clearance:** ยังไม่ได้ค้นฐานข้อมูล DIP/WIPO โดยตรง และยังไม่ได้เช็ก `.co.th` กับ handle `@panglab` เพราะถูก proxy บล็อก ไทยให้สิทธิ์เครื่องหมายการค้ากับผู้ยื่นก่อน จึงควรจด `panglab.ai` และยื่นเครื่องหมายการค้า (Nice 9/35/42) โดยเร็ว อีกเรื่องคือคำว่า "ปัง" ยังแปลว่าขนมปังด้วย ในหมวดอาหารจึงน่าจะมีชื่อที่ขึ้นต้นด้วย ปัง อยู่มาก

## 2. หลักการออกแบบ (Design Principles)

| หลักการ | ความหมายในทางปฏิบัติ | อ้างอิงพฤติกรรม |
|---|---|---|
| **Outcome before Input** | หน้าแรกโชว์ "โพสต์ที่พร้อมลง" ก่อนเสมอ ไม่ใช่ฟอร์มว่าง | ลด blank-page anxiety (Hick's Law) |
| **Approve, don't Author** | ผู้ใช้เป็น "บรรณาธิการ" ที่กด ✅/✏️/🔄 ไม่ต้องเขียนเอง | Effort heuristic: ลดต้นทุนทางความคิด |
| **Brand DNA is visible** | ทุกชิ้นงานแสดงชิป "ตรงแบรนด์ 92%" พร้อมเหตุผล | Trust ต้องอธิบายได้ (explainable AI) |
| **Credits are calm** | ราคาเครดิตแสดงก่อนกด generate เสมอ ไม่มีการตัดเครดิตแบบไม่รู้ตัว | Loss aversion: ความโปร่งใสลดความรู้สึกเสีย |
| **Thai-first, mobile-first** | เจ้าของ SME ส่วนใหญ่อนุมัติงานผ่านมือถือ ทุก flow หลักต้องจบได้ใน 1 มือ | Context of use |
| **Progressive autonomy** | ระดับ L1 อนุมัติทุกชิ้น → L2 อนุมัติอัตโนมัติเมื่อผ่านเกณฑ์ (มีช่วง veto) → L3 Autopilot ปลดล็อกตามประวัติ และผู้ใช้ต้องเลือกเปิดเอง | Trust calibration (Lee & See 2004), levels of automation (Parasuraman 2000), Microsoft HAX G8/G9 [25] |
| **Honest progress** | แสดงขั้นตอนจริงของ agent เป็นภาษาไทย ห้ามหน่วงเวลาปลอม และใช้ percent-done เมื่อรอนานกว่า ~10 วินาที | Labor illusion (Buell & Norton 2011) ได้ผลก็ต่อเมื่อผลลัพธ์ดี, NN/g [25] |

## 3. Information Architecture

```
PANGLAB
├── 🏠 หน้าหลัก (Home / Today)        — โพสต์รออนุมัติ, คิววันนี้, เครดิตคงเหลือ, Insight สั้น
├── ✨ สร้างคอนเทนต์ (Create)
│   ├── Quick Post                   — 1 ไอเดีย → caption + ภาพ
│   ├── Product Shot                 — อัปโหลดรูปสินค้าจริง → ภาพโฆษณา
│   └── Campaign Studio              — Orchestrator วางแผน 7/14/30 วันทีเดียว
├── 📅 ปฏิทิน (Calendar)               — Month/Week/List, drag-to-reschedule
├── 🗂 คลังคอนเทนต์ (Library)          — ทุก draft/โพสต์แล้ว/ล้มเหลว, filter ตามสถานะ/ช่องทาง
├── 🧬 Brand DNA                      — โลโก้, สี, ฟอนต์, น้ำเสียง, คำต้องห้าม, สินค้า, กลุ่มเป้าหมาย
├── 📊 Insights                       — Engagement ต่อโพสต์, เวลาที่ดีที่สุด, pillar ที่เวิร์ก
├── 🔗 ช่องทาง (Channels)              — เชื่อม FB Page / IG Business (+TikTok, LINE OA ใน Phase 3)
└── ⚙️ ตั้งค่า                          — ทีม & สิทธิ์, เครดิต & การชำระเงิน, แบรนด์หลายแบรนด์
```

**Brand switcher** อยู่มุมซ้ายบนตลอดเวลา (สไตล์ Slack workspace) เพราะ 1 บัญชีมีได้หลายแบรนด์ (รองรับเอเจนซี)

## 4. Key User Flows

### 4.1 Onboarding: "ได้โพสต์แรกใน 3 นาที"

```
Sign up (Google / LINE / Email OTP)
  → [1] ใส่ URL เว็บ/เพจ FB/IG ของแบรนด์  (หรือ "ยังไม่มี" → ตอบ 5 คำถาม)
  → [2] Brand DNA Analyst agent สแกน → แสดง "นี่คือแบรนด์คุณใช่ไหม?" (สี, โทน, สินค้า, กลุ่มเป้าหมาย)
  → [3] ผู้ใช้แก้/ยืนยัน (inline edit)
  → [4] ระบบ generate 3 โพสต์ตัวอย่างฟรีทันที  ← "Aha moment"
  → [5] CTA: "เชื่อมเพจเพื่อโพสต์อัตโนมัติ" (เลื่อนได้)
```

ระบบให้ผลลัพธ์ก่อนแล้วค่อยขอให้เชื่อม Meta เพราะ OAuth คือจุดที่คนหลุดมากที่สุด การได้เห็นโพสต์ของตัวเองก่อนทำให้เกิด **IKEA effect / endowment** คือรู้สึกว่าเป็นเจ้าของงานแล้ว จึงยอมทำขั้นที่ยากกว่า

### 4.2 Approval loop (หัวใจของ daily use)

```
Push/LINE แจ้งเตือน "มี 3 โพสต์รออนุมัติ"
  → การ์ด swipe (mobile) / grid (desktop)
  → ✅ อนุมัติ → เข้าคิวตามเวลาที่ AI แนะนำ
  → ✏️ แก้ → inline editor + "ปรับให้..." (สั้นลง / ขายมากขึ้น / เป็นกันเองขึ้น)
  → 🔄 สร้างใหม่ → เลือกเฉพาะ caption / เฉพาะภาพ (คิดเครดิตตามส่วน)
```

### 4.3 Campaign Studio (Orchestrator-driven)

```
เป้าหมาย (ยอดขาย / รู้จักแบรนด์ / โปรโมชัน) + ช่วงเวลา + สินค้า
  → Orchestrator เสนอ Content Plan (pillar mix, จำนวนโพสต์, ตารางเวลา)  [ไม่ตัดเครดิต]
  → ผู้ใช้ปรับแผน → กด "สร้างทั้งแคมเปญ" (แสดงเครดิตรวมก่อน)
  → subagents ทำงานขนาน → ผลลัพธ์ลงปฏิทินสถานะ "รออนุมัติ"
```

## 5. Screen Inventory (MVP)

| # | Screen | Primary job | Key components |
|---|---|---|---|
| S1 | Landing page | แปลง visitor → sign up | Hero + live demo (ใส่ URL แล้วเห็นโพสต์), pricing, FAQ |
| S2 | Auth | เข้าระบบใน 1 tap | Google, LINE Login, Email OTP |
| S3 | Onboarding wizard | สร้าง Brand DNA + Aha moment | Stepper 4 ขั้น, Brand preview card |
| S4 | Home / Today | รู้ว่าวันนี้ต้องทำอะไร | Approval queue, Today timeline, Credit meter, Insight card |
| S5 | Create · Quick Post | สร้างชิ้นเดียว | Prompt box + ชิปไอเดีย, format picker (1:1, 4:5, 9:16), credit preview |
| S6 | Create · Product Shot | สินค้าจริงในฉากโฆษณา | Uploader, scene presets, before/after slider |
| S7 | Campaign Studio | วางแผนหลายโพสต์ | Goal form, plan table, pillar donut, bulk generate |
| S8 | Post Editor | ปรับงานก่อนอนุมัติ | Caption editor + rewrite chips, image regen/inpaint, platform preview tabs (FB/IG) |
| S9 | Calendar | มองภาพรวม/ย้ายเวลา | Month/Week/List, drag & drop, status color |
| S10 | Library | ค้นหา/นำกลับมาใช้ | Filters, bulk actions, duplicate-to-new |
| S11 | Brand DNA | แหล่งความจริงของแบรนด์ | Logo/color/font, voice sliders, do/don't words, product catalog, personas |
| S12 | Channels | เชื่อมบัญชี | Meta OAuth button, page/IG picker, token health |
| S13 | Insights | เรียนรู้ว่าอะไรเวิร์ก | KPI tiles, best-time heatmap, top posts, pillar performance |
| S14 | Billing & Credits | ซื้อเครดิต | Pack cards, PromptPay QR / card, usage ledger, ใบกำกับภาษี |
| S15 | Team & Settings | จัดการทีม | Roles (Owner/Editor/Approver/Viewer), multi-brand |

## 6. Design System — "Pang UI"

### 6.1 Color tokens

| Token | Light | Dark | ใช้กับ |
|---|---|---|---|
| `--pang-primary` | `#FF5A1F` (Pang Orange) | `#FF7A45` | CTA หลัก, active nav, โลโก้ |
| `--pang-primary-ink` | `#FFFFFF` | `#1A0F0A` | ตัวอักษรบน primary |
| `--pang-accent` | `#7C5CFF` (AI Violet) | `#9B83FF` | ทุกอย่างที่เป็น AI: ปุ่ม generate, chip "AI แนะนำ" |
| `--pang-surface` | `#FFFFFF` | `#14121A` | พื้นการ์ด |
| `--pang-bg` | `#F7F5F2` (warm paper) | `#0D0C11` | พื้นหลังหน้า |
| `--pang-ink` | `#1B1A1F` | `#F2F0F5` | ตัวอักษรหลัก |
| `--pang-muted` | `#6B6874` | `#A29FAB` | ตัวอักษรรอง |
| `--pang-border` | `#E7E3DD` | `#2A2733` | เส้นขอบ |
| `--pang-success` | `#12A150` | `#3CCB7F` | โพสต์สำเร็จ |
| `--pang-warning` | `#E8A100` | `#F5C04A` | รออนุมัติ, token ใกล้หมดอายุ |
| `--pang-danger` | `#E5383B` | `#FF6B6E` | โพสต์ล้มเหลว |

> Orange สื่อพลังงานและความ "ปัง" ส่วน Violet ใช้แยก AI action ออกจาก action ปกติ ผู้ใช้จะเรียนรู้ได้เองว่า "ม่วง = ใช้เครดิต" (consistent signifier) ก่อนใช้จริงต้องตรวจ contrast ให้ผ่าน WCAG 2.2 AA ทุกคู่

### 6.2 Typography

| Role | Font | Weight | Size (desktop / mobile) |
|---|---|---|---|
| Display | Kanit | 600 | 40 / 28 |
| H1–H3 | Kanit | 500 | 28 / 22 · 22 / 18 · 18 / 16 |
| Body | IBM Plex Sans Thai | 400 | 16 / 15, line-height 1.65 |
| UI label | IBM Plex Sans Thai | 500 | 14 |
| Mono / numbers | IBM Plex Mono | 500 | 13 |

Kanit คงไว้จากแอปเดิม (CLAUDE.md) เพื่อความต่อเนื่อง แต่ย้ายไปใช้กับหัวข้อเท่านั้น ส่วนเนื้อความใช้ IBM Plex Sans Thai ซึ่งอ่านภาษาไทยที่ขนาดเล็กได้ดีกว่า ทั้งสองฟอนต์มีบน Google Fonts

**Overlay font whitelist (ข้อความบนภาพโพสต์, ยืนยัน license OFL จาก METADATA.pb แล้ว [18]):** Kanit, Prompt, Anuphan, IBM Plex Sans Thai, Noto Sans Thai Looped, Sarabun, Bai Jamjuree, Chakra Petch และ Mali ทุกตัวต้องผ่าน visual regression test เรื่องสระซ้อน วรรณยุกต์ และไม้ยมก ก่อนเปิดให้เลือกใน Brand DNA

### 6.3 Spacing / Radius / Elevation

ใช้ spacing ฐาน 4px (4, 8, 12, 16, 24, 32, 48, 64) radius `sm 8 / md 12 / lg 16 / full` และเงา 3 ระดับเท่านั้น (`card`, `popover`, `modal`) ทั้งหมดเป็น CSS variables ที่ map เข้า Tailwind v4 `@theme`

### 6.4 Core components

| Component | Variants / states | หมายเหตุ |
|---|---|---|
| `Button` | primary, secondary, ghost, **ai** (violet + sparkle), danger · loading/disabled | ปุ่ม `ai` แสดงค่าเครดิตในปุ่มเสมอ เช่น "สร้าง · 1 เครดิต" |
| `PostCard` | draft, pending, scheduled, published, failed | มีชิปช่องทาง (FB/IG), Brand-fit score, เวลา |
| `CreditMeter` | normal, low (<20%), empty | แสดงเป็น "X เครดิต ≈ Y โพสต์" กดแล้วเปิด top-up / auto-refill sheet [25] |
| `ApprovalQueue` | batch, sort by brand-fit ↑, approve / edit / request-changes / regenerate, revert | ใช้แบบ swipe บนมือถือ [25] |
| `AutonomyLevel` | L1 / L2 / L3 + เงื่อนไขปลดล็อก | ผู้ใช้ต้องเปิดเอง (opt-in) |
| `AiLabel` | badge "สร้างด้วย AI" / "แก้ไขด้วย AI" | ตามประกาศ สคบ. [23] |
| `BrandFitChip` | 0–100 + รายการเกณฑ์ที่ไม่ผ่าน (กดแก้ได้) | คะแนนคำนวณในโค้ดจาก pass/fail ไม่ใช่ตัวเลขที่ LLM ให้มา [28] |
| `PlatformPreview` | FB feed, IG feed, IG story/reel | reuse แนวคิดจาก `components/PostPreview.tsx` เดิม |
| `AgentProgress` | queued → planning → writing → designing → reviewing → done | แสดงสถานะ subagent แบบ real-time (สร้างความรู้สึกว่ามี "ทีม" ทำงานให้: labor illusion) |
| `EmptyState` | first-use, no-results, error | ต้องมี CTA ไป action ถัดไปเสมอ |

### 6.5 Motion

ใช้ duration 150ms (micro), 250ms (panel), 400ms (page) easing `cubic-bezier(.2,.8,.2,1)` ใช้ skeleton shimmer ระหว่าง generate และใช้ confetti ขนาดเล็กเฉพาะ "โพสต์แรกสำเร็จ" กับ "แคมเปญแรกสำเร็จ" (peak-end rule) เคารพ `prefers-reduced-motion` ทุกที่

## 7. Accessibility & Localization

ตั้งเป้า WCAG 2.2 AA (contrast, focus ring ชัด, target ≥ 44px, รองรับ screen reader ภาษาไทย) ทุกข้อความ UI แยกเป็น i18n keys (`th` เป็นค่าเริ่มต้น, `en` เป็นภาษารอง) แสดงวันที่ตาม พ.ศ. และเลือก ค.ศ. ได้ เขตเวลาเริ่มต้น `Asia/Bangkok` และแสดงเงินเป็น ฿ พร้อม VAT 7% แยกบรรทัด

## 8. Design Deliverables & Next Steps

| ลำดับ | Deliverable | เครื่องมือ |
|---|---|---|
| 1 | Moodboard + logo exploration (3 directions) | Figma |
| 2 | Token library + core components | Figma variables → export เป็น CSS vars |
| 3 | Wireframes S3, S4, S5, S8, S9 (low-fi) | Figma |
| 4 | Hi-fi + clickable prototype ของ onboarding และ approval loop | Figma prototype |
| 5 | Usability test 5 คน (เจ้าของ SME ไทย) ที่ onboarding และ approval | Maze / ทดสอบสด |
