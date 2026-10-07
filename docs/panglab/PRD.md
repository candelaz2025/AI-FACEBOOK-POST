# PANGLAB (ปังแล็บ) — Product Requirements Document

> สถานะ: Draft v0.1 · 2026-10-07 · Owner: Product (Keng) · เอกสารประกอบ: [DESIGN.md](./DESIGN.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [RESEARCH.md](./RESEARCH.md)

## 1. สรุป

PANGLAB คือ **AI Marketing Agent ภาษาไทย** สำหรับ SME และเอเจนซี่ ระบบจำ Brand DNA ของแบรนด์ แล้วสร้าง caption, ภาพ (รวมถึงภาพที่ใส่สินค้าจริง), อัลบั้ม และวิดีโอสั้น จากนั้นวางแผนปฏิทินและโพสต์ลง Facebook / Instagram อัตโนมัติ คิดเงินเป็นเครดิตแบบซื้อครั้งเดียว ไม่มีรายเดือน

เป้าหมายแรกคือ **feature parity กับ POPCONT (popcont.ai)** ซึ่งเป็น reference product ที่ได้รับมอบหมายให้ศึกษา (ดูการวิเคราะห์ใน §4 และ [RESEARCH.md](./RESEARCH.md)) จุดที่ PANGLAB จะแตกต่างมี 3 เรื่อง:

1. **Approval loop ผ่าน LINE** อนุมัติโพสต์ได้จากในแชตเลย
2. **Brand-fit score ที่อธิบายเหตุผลได้** ผลิตโดย QA Critic agent
3. **Learning loop** นำ Insights กลับมาปรับแผนคอนเทนต์รอบถัดไปให้อัตโนมัติ

## 2. ปัญหาและโอกาส

| ปัญหาของ SME ไทย | หลักฐาน / ที่มา |
|---|---|
| ไม่มีทีมคอนเทนต์ แต่ต้องโพสต์ทุกวันเพื่อให้ยังถูกมองเห็น | POPCONT วาง positioning ตรงนี้: "ไม่มีทีมคอนเทนต์ … ช่วยได้" ([popcont.ai](https://popcont.ai/)) |
| ตลาดใหญ่ | ไทยมี SME 3.28 ล้านราย ([Thai Post อ้าง สสว.](https://www.thaipost.net/economy-news/1065606/)) Facebook ad reach 51.5 ล้านคน (71.9% ของประชากร) ([Kepios ผ่าน Elite Asia](https://www.eliteasia.co/digital-and-social-media-trends-in-thailand-in-2026/)) |
| เครื่องมือต่างประเทศไม่เข้าใจภาษาและวัฒนธรรมไทย และคิดเงินเป็น USD รายเดือน | Predis, Ocoya, Hootsuite ล้วนเป็น subscription USD (ดู RESEARCH.md §2) |
| การจ่ายเงินที่คนไทยคุ้น | PromptPay มี 82.21 ล้าน registrations ([Juspay](https://juspay.io/blog/promptpay-reshaping-thailand-s-financial-landscape)) |

## 3. กลุ่มผู้ใช้ (Personas)

| Persona | ใคร | Job-to-be-done | แพ็กที่น่าจะใช้ |
|---|---|---|---|
| **น้องเมย์ — เจ้าของร้านคนเดียว** | คาเฟ่/เบเกอรี่/ออนไลน์ช็อป 1 สาขา | "อยากมีโพสต์สวยๆ ตรงแบรนด์ทุกวัน โดยใช้เวลาวันละไม่ถึง 5 นาที" | Starter |
| **พี่โอ๊ต — Marketing in-house** | แบรนด์ขนาดกลาง ทีม 1–3 คน | "อยากวางแผนทั้งเดือนในครั้งเดียว แล้วให้หัวหน้าอนุมัติได้ง่าย" | Growth / Pro |
| **คุณแนน — เอเจนซี่เล็ก** | ดูแลลูกค้า 5–30 แบรนด์ | "อยากผลิตงานหลายแบรนด์ แยก Brand DNA ชัดเจน และให้ลูกค้าอนุมัติเอง" | Business / Enterprise |

## 4. Reference product teardown: POPCONT

สรุปจากหน้า public และ `robots.txt` ของ popcont.ai ที่ดึงมาเมื่อ 2026-10-07 ไม่ได้ login เข้าไปดู dashboard จริง หน้าจอหลัง login จึงอนุมานจากชื่อ route

| ด้าน | POPCONT (ยืนยันแล้ว) | ที่มา |
|---|---|---|
| Positioning | "AI Marketing Agent ที่สร้าง Caption + AI Image ตรงแบรนด์ พร้อมโพสต์ Instagram & Facebook อัตโนมัติ ทดแทนทีม Content ทั้งทีม" | meta description |
| Workflow | Plan → Create → Publish → Optimize | homepage |
| Modules | Brand DNA, Content Plan (รายสัปดาห์/รายเดือน), Ready to Post (โพสต์เดี่ยว / อัลบั้ม / วิดีโอ / หลายโพสต์พร้อมกัน), Social Media Connect, Analytics | homepage |
| Routes ใน dashboard | `/dashboard /brands /create /campaign /creative /posts /social /analytics /credits /billing /checkout /subscribe /workspace /settings /affiliate /how-to` | robots.txt |
| ช่องทาง | FB + IG ยืนยัน, TikTok และ LINE ถูกพูดถึงใน hero | homepage |
| ภาพ | 1024×1024 และใส่สินค้าจริงลงในรูปได้ | JSON-LD + hero |
| ราคา | Free 3 เครดิต · ฿349/10 · ฿990/30 · ฿3,000/100 · ฿5,600/200 · ฿12,500/500 · Enterprise (ทุกราคา + VAT 7%) · "1 Credit = 1 Content" | pricing section |
| Social proof | 159 แบรนด์ · 211K คอนเทนต์ · 12K รูป | homepage |
| Tech (อนุมาน) | Next.js + Cloudflare + DigitalOcean | response headers |

### Parity matrix

| ความสามารถ | POPCONT | PANGLAB MVP | PANGLAB V1+ |
|---|---|---|---|
| Brand DNA (ข้อมูลแบรนด์ / สินค้า / กลุ่มลูกค้า) | ✅ กรอกเอง | ✅ + **สแกนจาก URL เว็บ/เพจอัตโนมัติ** | ✅ เรียนรู้จากโพสต์เก่า |
| หลายแบรนด์ต่อบัญชี | ✅ | ✅ | ✅ + client portal |
| Caption + ภาพ 1 โพสต์ | ✅ | ✅ | ✅ |
| ใส่สินค้าจริงลงในภาพ | ✅ | ✅ (Product Shot) | ✅ + หลายมุม |
| อัลบั้ม / carousel | ✅ | ✅ (สูงสุด 10 ภาพ ตามข้อจำกัด IG) | ✅ |
| วิดีโอสั้น | ✅ | ⏳ Phase 2 | ✅ Reels / Stories |
| Campaign / Content Plan | ✅ | ✅ Campaign Studio (Orchestrator) | ✅ + learning loop |
| ตั้งเวลาโพสต์ FB / IG | ✅ | ✅ | ✅ |
| TikTok / LINE OA | ประกาศไว้ | ❌ | ✅ Phase 3 |
| Analytics | ✅ | ✅ Basic | ✅ Best-time + pillar insights |
| ระบบอนุมัติ / ทีม | ไม่พบข้อมูล | ✅ Roles + approval queue | ✅ อนุมัติผ่าน LINE |
| Brand-fit score | ไม่พบข้อมูล | ✅ | ✅ |
| Affiliate | มี route | ❌ | ✅ |
| How-to / Academy | มี route | ✅ (help center) | ✅ |

## 5. Goals & Success Metrics

| Metric | นิยาม | เป้า 90 วันหลัง launch |
|---|---|---|
| Activation | % สมัครแล้วได้ "โพสต์แรกที่อนุมัติ" ภายใน 24 ชม. | ≥ 50% |
| Time-to-first-post | ตั้งแต่ sign up ถึงได้ draft แรก (P50) | ≤ 3 นาที |
| Connect rate | % ผู้ใช้ active ที่เชื่อม Meta สำเร็จ | ≥ 40% |
| Paid conversion | % free ที่ซื้อแพ็กแรกภายใน 14 วัน | ≥ 8% |
| Approval rate | % draft ที่ถูกอนุมัติโดยไม่ต้อง regenerate | ≥ 60% |
| Publish success | % โพสต์ที่ตั้งเวลาไว้และขึ้นสำเร็จ | ≥ 99% |
| Gross margin ต่อเครดิต | (ราคาขาย − ต้นทุน AI + infra) / ราคาขาย | ≥ 80% |

> ตัวเลขเหล่านี้เป็น **เป้าที่ตั้งเอง** ไม่ใช่ benchmark จากตลาด ควรทบทวนอีกครั้งหลังได้ข้อมูล beta

**Non-goals (MVP):** โฆษณาแบบเสียเงิน (Ads Manager), ตอบแชต/คอมเมนต์อัตโนมัติ, TikTok/LINE publishing, แอป native

## 6. Functional Requirements

Priority: **P0** = MVP ต้องมี · **P1** = V1 · **P2** = ภายหลัง

### 6.1 Auth & Workspace
| ID | Requirement | P |
|---|---|---|
| AUTH-1 | สมัคร/เข้าระบบด้วย Google, LINE Login, Email OTP | P0 |
| AUTH-2 | Workspace มีได้หลายแบรนด์ สลับแบรนด์ด้วย brand switcher | P0 |
| AUTH-3 | Roles: Owner, Editor, Approver, Viewer (สิทธิ์แยกระดับแบรนด์) | P1 |
| AUTH-4 | Client portal ให้ลูกค้าเอเจนซี่เข้ามาอนุมัติได้โดยไม่เห็นแบรนด์อื่น | P2 |

### 6.2 Brand DNA
| ID | Requirement | P |
|---|---|---|
| BRAND-1 | กรอกข้อมูลแบรนด์: ชื่อ, ธุรกิจ, จุดขาย, กลุ่มลูกค้า (persona), น้ำเสียง (slider: ทางการ↔เป็นกันเอง, ขายตรง↔เล่าเรื่อง), คำที่ต้องใช้/ห้ามใช้, CTA, hashtag หลัก | P0 |
| BRAND-2 | อัปโหลดโลโก้ + เลือกสีแบรนด์ (สูงสุด 5) + ฟอนต์ที่ใช้ในภาพ | P0 |
| BRAND-3 | **Auto-scan**: ใส่ URL เว็บหรือเพจ ระบบดึงข้อความ สี และรูปสินค้า แล้วเสนอ Brand DNA ร่างให้ยืนยัน | P0 |
| BRAND-4 | Product catalog: ชื่อ, ราคา, รายละเอียด, รูปสินค้า (ตัดพื้นหลังอัตโนมัติ) | P0 |
| BRAND-5 | Content pillars (เช่น ให้ความรู้ 40% / โปรโมชัน 30% / เบื้องหลัง 30%) | P1 |
| BRAND-6 | เรียนรู้น้ำเสียงจากโพสต์เก่า 20 โพสต์ล่าสุดของเพจ | P1 |

### 6.3 Content Generation
| ID | Requirement | P |
|---|---|---|
| GEN-1 | **Quick Post**: ไอเดีย/สินค้า → caption + ภาพ 1 ภาพ (1:1, 4:5) | P0 |
| GEN-2 | ไม่ต้องเขียน prompt เอง: ระบบเสนอไอเดียหัวข้อจาก Brand DNA + ปฏิทินเทศกาลไทย (สงกรานต์, 11.11, เงินเดือนออก ฯลฯ) | P0 |
| GEN-3 | **Product Shot**: วางรูปสินค้าจริงในฉากโฆษณาโดยรักษารูปทรง โลโก้ และสีสินค้าไว้ | P0 |
| GEN-4 | **Album/Carousel** 2–10 สไลด์ ที่สไตล์ต่อเนื่องกัน | P0 |
| GEN-5 | Regenerate แยกส่วน (caption อย่างเดียว / ภาพอย่างเดียว) + rewrite chips (สั้นลง, ขายมากขึ้น, เป็นกันเองขึ้น, ใส่อีโมจิ) | P0 |
| GEN-6 | **Brand-fit score** 0–100 พร้อมเหตุผล 1–3 ข้อ ทุกชิ้นงาน | P0 |
| GEN-7 | ใส่ข้อความ/ราคา/โลโก้บนภาพด้วยฟอนต์ไทยที่ถูกต้อง โดยใช้ overlay layer ไม่พึ่งให้โมเดลวาดตัวอักษรไทยเอง | P0 |
| GEN-8 | วิดีโอสั้น 5–8 วินาที (9:16) พร้อม caption | P1 |
| GEN-9 | Inpaint / แก้บางส่วนของภาพด้วยข้อความ | P1 |
| GEN-10 | Content safety: กรองเนื้อหาผิดนโยบาย Meta และข้อกล่าวอ้างเกินจริง (เช่น อาหารเสริม/เครื่องสำอาง ตามแนว อย.) | P0 |

### 6.4 Campaign Studio (Orchestrator)
| ID | Requirement | P |
|---|---|---|
| CAMP-1 | ใส่เป้าหมาย + ช่วงเวลา (7/14/30 วัน) + สินค้า + ความถี่ → ได้ Content Plan ฟรี (ไม่ตัดเครดิต) | P0 |
| CAMP-2 | แก้แผนได้ (ลบ/เพิ่ม/ย้ายวัน/เปลี่ยน pillar) ก่อนกดสร้างจริง | P0 |
| CAMP-3 | แสดงเครดิตรวมก่อนยืนยัน แล้วสร้างทุกชิ้นแบบขนานพร้อมแสดงความคืบหน้า | P0 |
| CAMP-4 | ผลลัพธ์ลงปฏิทินในสถานะ "รออนุมัติ" | P0 |
| CAMP-5 | Learning loop: ใช้ Insights ของแคมเปญก่อนปรับ pillar mix และเวลาโพสต์ของแคมเปญถัดไป | P1 |

### 6.5 Calendar, Library & Approval
| ID | Requirement | P |
|---|---|---|
| CAL-1 | ปฏิทิน Month/Week/List, ลากเพื่อเปลี่ยนเวลา, สีตามสถานะ | P0 |
| CAL-2 | สถานะ: Draft → Pending approval → Scheduled → Publishing → Published / Failed | P0 |
| CAL-3 | Approval queue (การ์ด swipe บนมือถือ) อนุมัติ/แก้/สร้างใหม่ | P0 |
| CAL-4 | แจ้งเตือนผ่าน Email + Web push | P0 |
| CAL-5 | แจ้งเตือนและ**อนุมัติได้ใน LINE** (Flex Message + ปุ่มอนุมัติ) | P1 |
| LIB-1 | คลังคอนเทนต์ + ค้นหา/กรอง + ทำซ้ำเป็นโพสต์ใหม่ | P0 |

### 6.6 Publishing
| ID | Requirement | P |
|---|---|---|
| PUB-1 | เชื่อม Facebook Page + Instagram Professional ผ่าน Meta OAuth (Facebook Login for Business) | P0 |
| PUB-2 | โพสต์ FB: ข้อความ, ภาพเดี่ยว, หลายภาพ | P0 |
| PUB-3 | โพสต์ IG: ภาพเดี่ยว (แปลงเป็น JPEG อัตโนมัติ), carousel ≤10 | P0 |
| PUB-4 | Scheduler ฝั่ง server เป็นของเราเอง ใช้กับทั้ง FB และ IG ไม่พึ่ง native scheduling | P0 |
| PUB-5 | ตรวจ IG publishing quota (100 โพสต์ / 24 ชม. / บัญชี) ก่อนตั้งเวลา | P0 |
| PUB-6 | Retry อัตโนมัติ (exponential backoff) และแจ้งสาเหตุเป็นภาษาไทย (reuse `translateFacebookError` จากแอปเดิม) | P0 |
| PUB-7 | Token health: เตือนก่อน token หมดอายุ / สิทธิ์ถูกถอน | P0 |
| PUB-8 | IG Reels / FB Reels / Stories | P1 |
| PUB-9 | TikTok, LINE OA broadcast | P2 |

### 6.7 Analytics
| ID | Requirement | P |
|---|---|---|
| ANA-1 | ดึง reach, engagement, clicks ต่อโพสต์ (FB Page Insights / IG Insights) ทุก 6 ชม. ภายใน 7 วันแรกหลังโพสต์ | P0 |
| ANA-2 | Dashboard: KPI tiles, top posts, engagement ตามช่องทาง | P0 |
| ANA-3 | Best-time heatmap + pillar performance | P1 |
| ANA-4 | AI summary รายสัปดาห์ ("สัปดาห์นี้โพสต์แนวเบื้องหลังได้ engagement สูงกว่าค่าเฉลี่ย X%") | P1 |

### 6.8 Credits & Billing
| ID | Requirement | P |
|---|---|---|
| BILL-1 | เครดิตแบบซื้อครั้งเดียว ไม่หมดอายุภายใน 12 เดือน | P0 |
| BILL-2 | ชำระด้วย PromptPay QR และบัตร | P0 |
| BILL-3 | Credit ledger (ใช้ไปกับอะไร เมื่อไร โดยใคร) | P0 |
| BILL-4 | คืนเครดิตอัตโนมัติเมื่อ generate ล้มเหลวจากฝั่งระบบ | P0 |
| BILL-5 | ใบเสร็จ/ใบกำกับภาษีเต็มรูป (ชื่อบริษัท + เลขผู้เสียภาษี) | P0 |
| BILL-6 | Affiliate/referral: ให้เครดิตทั้งผู้แนะนำและผู้ถูกแนะนำ | P2 |

## 7. Pricing (ข้อเสนอเริ่มต้น)

### 7.1 อัตราเครดิตต่อชิ้นงาน

POPCONT ใช้ "1 Credit = 1 Content" PANGLAB เสนอให้**ถ่วงน้ำหนักตามต้นทุนจริง** เพื่อไม่ให้งานวิดีโอที่ต้นทุนสูงไปกินมาร์จินของงานภาพ

| ชิ้นงาน | เครดิต | ต้นทุน AI โดยประมาณ* |
|---|---|---|
| Quick Post (caption + ภาพ 1K) | 1 | ~US$0.07 |
| Product Shot | 1 | ~US$0.07–0.13 |
| Album (ต่อสไลด์) | 1 สำหรับสไลด์แรก + 0.5 ต่อสไลด์ถัดไป | ~US$0.07 ต่อภาพ |
| Regenerate เฉพาะ caption | 0 (ฟรี 3 ครั้ง/ชิ้น) แล้วครั้งละ 0.2 | < US$0.01 |
| Regenerate เฉพาะภาพ | 0.5 | ~US$0.07 |
| วิดีโอ 8 วินาที 720p (Phase 2) | 5 | ~US$0.40 (Veo 3.1 Lite) |
| Content Plan / Campaign plan | 0 | < US$0.01 |

\* ประเมินจากราคา Gemini API ในช่วงเขียนเอกสาร (Nano Banana 2 1K ≈ $0.067/ภาพ, Veo 3.1 Lite 720p ≈ $0.05/วินาที — [ai.google.dev/pricing](https://ai.google.dev/gemini-api/docs/pricing)) ต้องยืนยันราคาจริงอีกครั้งก่อนตั้งราคา

### 7.2 แพ็กเครดิต (+VAT 7%)

| แพ็ก | ราคา | เครดิต | ฿/เครดิต | เหมาะกับ |
|---|---|---|---|---|
| ทดลองฟรี | ฿0 | 5 (โพสต์ได้ 1 ช่องทาง) | – | ลองก่อนตัดสินใจ |
| Starter | ฿299 | 10 | 29.9 | ลองของจริง |
| Shop | ฿890 | 30 | 29.7 | ร้านเดียว โพสต์สัปดาห์ละหลายครั้ง |
| Growth ⭐ | ฿2,690 | 100 | 26.9 | โพสต์ทุกวัน / 2–3 แบรนด์ |
| Pro | ฿4,990 | 200 | 25.0 | ทีมคอนเทนต์ |
| Agency | ฿10,900 | 500 | 21.8 | เอเจนซี่ |
| Enterprise | ติดต่อทีมขาย | custom | – | SSO, subdomain, fine-tuned brand model |

ราคาตั้งต่ำกว่า POPCONT ประมาณ 10–14% ในทุกขั้น และให้เครดิตฟรีมากกว่า (5 เทียบกับ 3) ข้อเสนอทั้งหมดนี้ต้องทดสอบด้วย A/B test ที่หน้า pricing ช่วง beta ทุกแพ็กได้ฟีเจอร์เหมือนกัน ต่างกันแค่จำนวนเครดิต ยกเว้น Agency ที่ปลดล็อก client portal (P2)

> **Behavioral note:** ตั้ง Growth เป็น "Most popular" (decoy anchoring) แสดงราคาต่อโพสต์ ("เริ่มต้น ฿21.8 ต่อโพสต์") ไม่แสดงเป็นราคาแพ็ก และแสดงการเทียบ "ถูกกว่าจ้างฟรีแลนซ์โพสต์ละ ฿300–500" ตัวเลขฟรีแลนซ์ต้องหาแหล่งอ้างอิงก่อนใช้จริง

## 8. Non-functional Requirements

| ด้าน | Requirement |
|---|---|
| Performance | สร้าง Quick Post เสร็จ (caption + ภาพ) P50 ≤ 20 วินาที, P95 ≤ 45 วินาที |
| Reliability | Scheduler โพสต์ภายใน ±2 นาทีจากเวลาที่ตั้ง, uptime 99.5% |
| Security | ไม่มี API key ใดๆ อยู่ฝั่ง browser, Meta tokens เข้ารหัส (AES-256-GCM) ที่ rest, RLS ทุกตาราง |
| Privacy / PDPA | ขอความยินยอมตาม PDPA, ลบข้อมูลแบรนด์ได้ภายใน 30 วัน, DPA สำหรับลูกค้าองค์กร |
| Meta compliance | Business Verification + App Review สำหรับ `pages_manage_posts`, `pages_read_engagement`, `pages_show_list`, `instagram_basic`, `instagram_content_publish`, `business_management` |
| Accessibility | WCAG 2.2 AA |
| Localization | ไทยเป็นภาษาหลัก, อังกฤษรอง, Asia/Bangkok, พ.ศ./ค.ศ. |
| Observability | trace ทุก agent run (ต้นทุน, latency, model), alert เมื่อ publish fail rate > 2% |

## 9. Release Plan

| Phase | ระยะเวลา (ประเมิน) | Scope | Exit criteria |
|---|---|---|---|
| **0 · Foundation** | 2 สัปดาห์ | Next.js + Supabase skeleton, auth, design tokens, ย้าย AI call ไป server, อัปเดต model IDs | Login ได้, generate ผ่าน server |
| **1 · MVP (Closed beta)** | 6 สัปดาห์ | Brand DNA + auto-scan, Quick Post, Product Shot, Album, Calendar, Approval, FB/IG publish, Credits + PromptPay, Basic analytics | 20 แบรนด์ beta, publish success ≥ 99% |
| **Meta App Review** | ทำคู่ขนานตั้งแต่สัปดาห์ที่ 3 | Business Verification, screencasts | ได้ Advanced Access |
| **2 · V1 (Public launch)** | 6 สัปดาห์ | Campaign Studio + learning loop, วิดีโอ, LINE approval, roles, insights ขั้นสูง | Activation ≥ 50% |
| **3 · Expansion** | ต่อเนื่อง | TikTok, LINE OA broadcast, client portal, affiliate, Enterprise | – |

## 10. Risks & Mitigations

| ความเสี่ยง | ผลกระทบ | การรับมือ |
|---|---|---|
| Meta App Review ล่าช้าหรือไม่ผ่าน | ปล่อย auto-post ไม่ได้ | เริ่มยื่นเร็ว, ระหว่างรอให้ beta tester เป็น tester ของแอป, มีโหมด "ดาวน์โหลด + คัดลอก caption" สำรอง |
| Google ปลดระวาง model เร็ว (Imagen 4 ปิด 17 ส.ค. 2026, Veo 2 ปิด 30 มิ.ย. 2026) | ฟีเจอร์พัง | ใช้ model registry + config ฝั่ง server, มี fallback model, เฝ้าดูหน้า deprecations |
| ภาพ AI วาดตัวอักษรไทยเพี้ยน | งานดูไม่มืออาชีพ | วาดข้อความด้วย overlay layer (GEN-7) |
| สินค้าในภาพผิดรูป | เสียความเชื่อใจ | ใช้โหมด image-editing ที่อ้างอิงรูปสินค้า + QA Critic ตรวจความเหมือน |
| ต้นทุน AI ขึ้นราคา (เช่น Gemini 3.8 Flash ปรับราคาเป็น 2 เท่าตั้งแต่ 1 ม.ค. 2027) | margin ลด | เครดิตถ่วงน้ำหนัก, ใช้ Batch API สำหรับ campaign, cache |
| ถูกมองว่าลอกแบบคู่แข่ง | ปัญหาด้านกฎหมาย/แบรนด์ | ใช้ชื่อ แบรนด์ ข้อความ และงานออกแบบของเราเองทั้งหมด ไม่คัดลอก copy, asset หรือโค้ดของ POPCONT, ให้ที่ปรึกษากฎหมายตรวจก่อน launch |

## 11. Open Questions

| # | คำถาม | ใครตัดสิน |
|---|---|---|
| 1 | ใช้ Stripe (รองรับ PromptPay ใน TH) หรือ Opn/Omise เป็น payment หลัก? ค่าธรรมเนียม PromptPay เท่ากันที่ 1.65% | Product + Finance |
| 2 | เครดิตมีวันหมดอายุไหม (12 เดือน?) | Product + Legal |
| 3 | ต้องการ Gemini เท่านั้น หรือเปิดให้ใช้ multi-provider (เช่น Claude สำหรับ copywriting ภาษาไทย) | Tech lead |
| 4 | จด trademark "PANGLAB" ในประเทศไทยและต่างประเทศเมื่อไร | Founder |
| 5 | ทำ Brand DNA auto-scan จากเพจ FB ได้แค่ไหนก่อนได้ App Review | Tech lead |
