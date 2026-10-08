# Teardown คู่แข่งระดับโลก: Predis.ai และ Ocoya

> วิธีเก็บข้อมูล (retry run, 2026-10-08): ใช้ WebSearch เท่านั้น เพราะ egress proxy บล็อกทั้ง predis.ai และ help.ocoya.com จึงอ่านหน้าทางการตรงไม่ได้ ข้อมูลที่ tag **VERIFIED** มาจากสรุปผลค้นหาที่ชี้ไปยังหน้าทางการ (predis.ai/pricing, ocoya.com/pricing, help.ocoya.com) ข้อมูลที่ tag **INFERRED** มาจากรีวิวหรือไดเรกทอรีของบุคคลที่สาม หรือเป็นการคำนวณของเราเอง ถ้าแหล่งขัดกันจะระบุไว้

## สรุป
Predis.ai เป็นเครื่องมือแนว "generation-first" คือใส่ไอเดีย, URL สินค้า หรือ brief แล้วได้ภาพ, carousel, วิดีโอ, caption และ hashtag ตาม brand kit ที่เรียนรู้จาก URL เว็บไซต์ ระบบคิด credit ตามต้นทุนจริง (ภาพ 15 credits, วิดีโอคิดตามวินาที) ขายเป็นแผนรายเดือน Core/Rise/Enterprise+ ส่วน Ocoya เป็นแนว "scheduler-first" ที่มี AI copywriter (Travis AI, 26 ภาษา) และมี Canva/VistaCreate ฝังอยู่ในตัว ขายตามจำนวน seat/profile/workspace และให้ AI credits เป็นโควตารายเดือน approval ของ Ocoya ทำงานภายใน workspace ผ่านบทบาท "Approver" ซึ่งเรียบง่ายแต่ไม่มีลิงก์ให้ลูกค้าภายนอกกดอนุมัติ ทั้งสองเจ้ายังไม่มีหลักฐานว่ารองรับภาษาไทยหรือ PromptPay ซึ่งเป็นช่องว่างที่ PANGLAB ใช้ได้

## Predis.ai

### Onboarding และ Brand kit / Brand voice
หน้าทางการ (predis.ai/ai-social-media-post-generator) ระบุว่าผู้ใช้ "ชี้ไปที่เว็บไซต์หรือโพสต์เก่าสองสามโพสต์" แล้วระบบจะเรียนรู้ tone, คำศัพท์ที่ใช้, สี, ฟอนต์ และโลโก้ (**VERIFIED** ผ่าน search summary) ระบบรองรับหลายแบรนด์ในบัญชีเดียว และแต่ละแบรนด์มี voice แยกกัน จึงเหมาะกับเอเจนซี่ (**VERIFIED**) tutorial ของบุคคลที่สามบรรยายลำดับขั้นไว้ว่า สมัคร → เชื่อม social ในแท็บ Integrations → ตั้ง Brand Kit (palette, fonts, logo) → อัปโหลดโลโก้ความละเอียดสูง (ถ้าความละเอียดต่ำ ภาพที่ได้ในหลาย aspect ratio จะแตก) → ตั้ง timezone สำหรับโพสต์ (**INFERRED**, aiindigo.com) API ของ Predis ใช้ "brand ID" (help.dartai.com) แสดงว่าโครงสร้างข้อมูลผูกกับแบรนด์ ไม่ได้ผูกกับผู้ใช้ (**INFERRED**)

### Generation flow
Input มีสามแบบ คือ topic สั้น ๆ, product URL หรือ content brief ส่วน output คือ image post, carousel (multi-slide), video, caption และ hashtag ที่ใช้สีและฟอนต์จาก brand kit (**VERIFIED**) จุดเด่นทาง UX คือระบบสร้างภาพก่อน แล้ว "อ่านภาพที่ตัวเองสร้าง" เพื่อเขียน caption ให้ตรงกับภาพ (**VERIFIED**) จากนั้นผู้ใช้แก้ใน editor ที่มี template แล้วตั้งเวลาโพสต์ไป IG, LinkedIn, FB และ TikTok ได้ รีวิวผู้ใช้ชี้ว่าระบบต้องใช้เวลาเรียนรู้สไตล์ช่วงแรก และควรตั้ง brand kit ก่อน generate (Capterra, **INFERRED**)

### Calendar, approval, analytics และ competitor analysis
Predis มี calendar แบบ drag-and-drop ที่ผู้ใช้ GetApp ชมว่าใช้ง่าย แต่มีบ่นว่าโพสต์ตรงไปบางแพลตฟอร์มไม่ได้ (**INFERRED**, ข้อมูลรีวิวปี 2021–2023) ฟีเจอร์ Competitor analysis/monitoring เป็นจุดขายที่ชัด โดย 77% ของผู้ใช้ 22 คนบน GetApp ให้คะแนนว่าสำคัญ (**INFERRED**) Approval มีอยู่แต่ข้อมูลบาง คือมีการแชร์โพสต์ภายในแพลตฟอร์มเพื่อรับ feedback แต่บทเปรียบเทียบหนึ่งมองว่ายังไม่พร้อมสำหรับเอเจนซี่ใหญ่เมื่อเทียบกับ Hootsuite หรือ Metricool (**INFERRED**) Analytics อยู่ในแพ็กเดียวกัน แต่ไม่พบรีวิวที่ลงรายละเอียดเชิงลึก

### Credit model และราคา
| รายการ | ค่า | สถานะ |
|---|---|---|
| ภาพ (ad creative / social post / photoshoot) | 15 credits ต่อภาพ | VERIFIED (predis.ai/pricing ผ่าน search) |
| Multi-slide post (carousel) | 15 credits ต่อสไลด์ | VERIFIED |
| Standard / UGC video | 200 credits ต่อ 8 วินาที | VERIFIED |
| Faceless video | 5 credits ต่อ 10 วินาที | VERIFIED |
| ตัวอย่างบนหน้า pricing | 1 social post (15) + 10s voiceover video (4) = 19 credits | VERIFIED |
| Core | $32/เดือน หรือ $230/ปี, 1,300 credits | INFERRED (admakeai.com อ้างว่าอ่านหน้า pricing เมื่อ 27 ส.ค. 2026) |
| Rise | $79/เดือน, 3,200 credits (~213 ภาพ, ~22 วิดีโอ) | INFERRED |
| Enterprise+ | $249/เดือน, 10,000 credits (~666 ภาพ, ~71 วิดีโอ) | INFERRED |
| Extra credits | add-on $29/เดือน | INFERRED |
| Free | ~15 posts/เดือน, มี watermark, ไม่มีสิทธิ์ใช้เชิงพาณิชย์ (บางแหล่งบอกว่ามี trial 7 วัน) | INFERRED, แหล่งขัดกัน |
| Refund | ไม่คืนเงินทุกกรณี | INFERRED |

ราคาจากแหล่งต่าง ๆ ขัดกัน inmagic.ai ระบุ Core $19 (ราคาโปร) และ Rise ~$40, Capterra ยังใช้ชื่อแผนเก่า "Lite $32" (60 posts/เดือน, 5 channels), bityclips ใช้ชื่อ Lite/Starter/Agency ซึ่งน่าจะเก่าแล้ว นอกจากนี้ในเดือนเมษายน 2026 Predis เคยประกาศ "Growth Fund" ที่ให้ credits เพิ่ม 40% บน Rise และ Enterprise (predis.frill.co) ไม่พบหลักฐานว่าโปรนี้ยังมีอยู่

**คำนวณ (INFERRED):** ทุกแผนตกราว $0.37 ต่อภาพ ($32/86, $79/213, $249/666) แปลว่า Predis ให้ส่วนลดตามปริมาณผ่าน "ราคาแผน" ไม่ใช่ผ่าน "ราคาต่อ credit" วิดีโอ standard 8 วินาทีบนแผน Core ตกราว $4.9 ต่อคลิป

### ภาษา
ไดเรกทอรีหลายแห่งระบุว่า Predis รองรับ "18+" หรือ "19+" ภาษา แต่รายการ 18 ภาษาบน Capterra **ไม่มีภาษาไทย** (**INFERRED**, รายการนี้อาจเก่า) และไม่พบหน้าทางการที่ยืนยันว่ารองรับภาษาไทย

## Ocoya

### Onboarding และ brand voice
tutorial ของบุคคลที่สามบอกว่าผู้ใช้ใหม่จะเจอ onboarding wizard ให้กำหนด brand voice และข้อมูลโปรไฟล์ แล้วจึงเชื่อม social accounts (**INFERRED**, aiindigo.com) ไดเรกทอรีหนึ่งบอกว่าผู้ใช้ "train AI agents ให้ตรงกับ brand voice" ได้ แต่ไม่มีรายละเอียดว่าทำอย่างไร (**INFERRED**, stork.ai) ไม่พบหลักฐานว่า Ocoya สแกน URL เพื่อดึงสี โลโก้ และฟอนต์แบบที่ Predis ทำ

### Generation flow
AI copywriter ชื่อ "Travis AI" มี template อยู่ที่แผงด้านซ้าย และเขียนได้ **26 ภาษา** (**VERIFIED**, help.ocoya.com article 7267036 ผ่าน search summary) ไดเรกทอรีหนึ่งระบุว่ามี template มากกว่า 100 แบบ รวมถึง framework อย่าง AIDA และ PAS (**INFERRED**) ฝั่งภาพมี editor กับ template 10,000+ แบบ และฝัง Canva กับ VistaCreate ไว้ในตัว ผู้ใช้จึงทำกราฟิกได้โดยไม่ต้องออกจากแพลตฟอร์ม (**INFERRED**, รีวิว GetApp/SoftwareAdvice) Flow ที่ผู้ใช้เล่าในรีวิวคือ ทำกราฟิกใน VistaCreate หรือ Canva ก่อน แล้วให้ Travis เขียน caption ทีหลัง ซึ่งเป็นลำดับกลับกับ Predis ที่เริ่มจากภาพ AI แล้วให้ AI อ่านภาพเพื่อเขียน caption มีรีวิวบ่นว่า Travis บางครั้งให้มาแค่ตัวเลือกเดียว ทั้งที่อยากได้ 2–3 ตัวเลือก และมีเคสที่ draft caption หายเมื่อหน้ารีเฟรช ผู้ใช้จึงขอระบบ autosave (**INFERRED**)

### Approval / collaboration (help article 8377143)
| ขั้น | รายละเอียด | สถานะ |
|---|---|---|
| 1. ตั้งผู้อนุมัติ | Admin เพิ่มสมาชิกใน Settings → Users แล้วกำหนดสถานะ "Approver" | VERIFIED (search summary ของ help article) |
| 2. ส่งอนุมัติ | การ schedule โพสต์จะทำให้โพสต์ค้างเป็น draft และส่งให้ Approver โดยอัตโนมัติ ไม่มีปุ่ม "ส่งอนุมัติ" แยก | VERIFIED |
| 3. ตรวจ | Approver ตรวจความถูกต้อง คุณภาพ และความสอดคล้องกับ guideline แก้โพสต์ได้เอง และคอมเมนต์ถึงผู้สร้างได้ | VERIFIED |
| 4. ตัดสิน | Approve หรือ Reject พร้อม feedback | VERIFIED |
| 5. เผยแพร่ | โพสต์ที่ approve แล้วจะโพสต์เองตามเวลาที่ตั้งไว้ | VERIFIED |

ข้อจำกัดคือ Approver ต้องเป็นสมาชิก workspace จึงกิน seat ไปด้วย และไม่พบหลักฐานว่ามีลิงก์ให้ลูกค้าภายนอกกดอนุมัติได้โดยไม่ต้อง login (**INFERRED** จากการที่ไม่พบข้อมูล) ขณะที่คู่แข่งอย่าง HeyOrca และ Posterly ทำ client review แบบไม่ต้อง login หรือยืนยันด้วย OTP ได้แล้ว นอกจากนี้ Ocoya ยังรองรับหลาย workspace (1/5/20/unlimited ตามแผน) เพื่อแยกแบรนด์หรือลูกค้าแต่ละราย

### Calendar และ analytics
Ocoya มี calendar view ที่แสดงโพสต์ที่ตั้งเวลาไว้ทั้งหมด พร้อม collaborative workspace และ approval request (**INFERRED**, softwareadvice) จุดที่ผู้ใช้บ่นบ่อยที่สุดคือ analytics ซึ่งมีแค่ "Essential Analytics" ขาดข้อมูล demographics และ competitor benchmark และ reporting ขั้นสูงถูกล็อกไว้ในแผนที่แพงกว่า ผู้ใช้ยังขอ unified social inbox ด้วย (**INFERRED**, TechJockey/SoftwareAdvice) คะแนนรวมบน SoftwareAdvice อยู่ที่ 4.6/5 จาก 367 รีวิว

### Credit model และราคา
| แผน | ราคา/เดือน (annual) | ราคา/เดือน (monthly) | AI credits/เดือน | Social profiles | Users | Workspaces |
|---|---|---|---|---|---|---|
| Bronze | $15 | $19 | 100 | 5 | 1 | 1 |
| Silver | $39 | $49 | 500 | 20 | 5 | 5 |
| Gold | $79 | $99 | 1,500 | 50 | 20 | 20 |
| Diamond | $159 | $199 | Unlimited | 150 | 50 | Unlimited |
| Enterprise | custom | custom | – | – | – | – |

ราคาแบบ annual และจำนวน credits มาจาก ocoya.com/pricing (**VERIFIED** ผ่าน search summary) ส่วนราคา monthly มาจากเว็บรีวิว (**INFERRED**) help center ระบุว่าแผน Silver ขึ้นไปจึงจะได้ copywriting, AI art และ AI captions (Bronze ไม่มี) และแผน Gold เพิ่ม RSS feeds กับพื้นที่เก็บ 200GB (Silver ได้ 50GB) (**VERIFIED**, help article 8687006) แผนทั้งหมดมี trial 7 วัน แต่มีบางแหล่งบอก 14 วัน ข้อมูลที่ขัดกันอื่น ๆ ได้แก่ มีแหล่งหนึ่งให้ Gold 1,000 credits และ SoftwareAdvice แสดง Silver ราคา $59 (น่าจะเป็นข้อมูลเก่า) ไม่พบตารางว่างานแต่ละประเภทกินกี่ AI credits

## เปรียบเทียบ
| มิติ | Predis.ai | Ocoya | PANGLAB (PRD ปัจจุบัน) |
|---|---|---|---|
| แนวคิดหลัก | Generation-first (ภาพ/วิดีโอ AI) | Scheduler-first + AI copywriter | Brand DNA → แคมเปญ → auto-post |
| Brand setup | URL/โพสต์เก่า → tone, สี, ฟอนต์, โลโก้; หลายแบรนด์ | Onboarding wizard ตั้ง brand voice (ข้อมูลบาง) | BRAND-1..6 (มี URL auto-scan และเรียนรู้จากโพสต์เก่า) |
| Caption–ภาพ | AI อ่านภาพที่ตัวเองสร้างแล้วเขียน caption | ทำภาพใน Canva/VistaCreate แล้วให้ Travis เขียน caption | GEN-1 สร้างคู่กัน |
| Approval | มีแต่ข้อมูลน้อย | Approver role; การ schedule = ส่งอนุมัติ; แก้/คอมเมนต์/approve/reject | CAL-2/3/5 (รวมถึงอนุมัติใน LINE) |
| Analytics | รวมอยู่ในแพ็ก + competitor analysis | Essential analytics (เป็นจุดที่ถูกบ่น) | ANA-1..4 |
| หน่วยคิดเงิน | Credits ตามต้นทุน (ภาพ 15, วิดีโอตามวินาที) ในแผนรายเดือน | Seat/profile/workspace + โควตา AI credits | Credit pack ซื้อครั้งเดียว ถ่วงน้ำหนักตามต้นทุน |
| ต้นทุนต่อภาพของผู้ใช้ | ~$0.37 (INFERRED) | ไม่ทราบ | ฿21.8–29.9/credit ≈ $0.6–0.85 (INFERRED, สมมติ ~35 THB/USD) |
| ภาษาไทย | ไม่ยืนยัน (รายการบน Capterra ไม่มี) | ไม่ยืนยัน (26 ภาษา ไม่ได้ระบุรายการ) | Thai-first |

## ผลต่อ PRD
1. **BRAND-3 (Auto-scan)** ควรรับทั้ง URL เว็บไซต์ **และ** "โพสต์เก่าสองสามโพสต์" ตั้งแต่ P0 แบบเดียวกับ Predis และอาจดึงบางส่วนของ BRAND-6 (เรียนรู้จากโพสต์เก่า) ขึ้นเป็น P0 แบบเบา คือใช้ 3–5 โพสต์ที่ผู้ใช้วางเอง ไม่ต้องรอ Meta permission สำหรับดึง 20 โพสต์ล่าสุด และควรเพิ่มข้อกำหนดตรวจความละเอียดโลโก้ตอนอัปโหลด (BRAND-2) เพราะโลโก้ความละเอียดต่ำทำให้ภาพหลาย aspect ratio แตก
2. **GEN-1/GEN-5:** ใช้ pattern "image-aware caption" แบบ Predis คือส่งภาพที่สร้างเสร็จกลับเข้า Gemini (multimodal) เพื่อเขียนหรือปรับ caption ให้ตรงกับภาพ และควรให้ caption มา 2–3 ตัวเลือกเสมอ เพราะผู้ใช้ Ocoya บ่นเรื่องได้ตัวเลือกเดียว พร้อมเพิ่ม NFR เรื่อง **autosave ของ draft** (Ocoya ทำ draft หายเมื่อหน้ารีเฟรช)
3. **CAL-2/CAL-3:** ใช้หลักของ Ocoya ที่ว่า "ถ้า workspace เปิด approval ไว้ การตั้งเวลาเท่ากับการส่งอนุมัติ" เพื่อลดจำนวนปุ่ม และให้ Approver แก้ไขเองได้พร้อมคอมเมนต์ และควรยกระดับให้เหนือกว่า Ocoya ด้วยการเพิ่ม **CAL-6 (ใหม่, P1): ลิงก์อนุมัติสำหรับลูกค้าภายนอกที่ไม่ต้อง login และไม่กิน seat** (signed link + OTP หรือ LINE) ซึ่งต่อยอดจาก CAL-5 ได้ตรงกับเอเจนซี่ไทย
4. **ราคา §7.1/7.2:** ราคาต่อภาพของ PANGLAB (~$0.6–0.85) สูงกว่า Predis (~$0.37) ราว 2 เท่า (INFERRED) ถ้าจะสื่อสาร ต้องชูว่าหนึ่ง credit ได้ caption ไทย + ภาพ + Thai text overlay (GEN-7) + brand-fit score ครบ ไม่ได้ได้แค่ภาพ หรือพิจารณาลด ฿/credit ในแพ็ก Pro/Agency ส่วนการคิดวิดีโอตามวินาทีแบบ Predis (200 credits/8s ≈ 13 เท่าของภาพ) สนับสนุนการตั้งวิดีโอ = 5 credits ของเรา และควรระบุ "credits ต่อวินาที" ไว้ใน BILL-3 ledger เผื่อขยายความยาวคลิปในอนาคต
5. **BILL-1 / หน้า pricing:** ข้อดีของ PANGLAB ที่ควรเอาไปเทียบในหน้า pricing ได้แก่ credit ไม่หมดอายุรายเดือน (Predis และ Ocoya เป็น subscription), คืน credit อัตโนมัติเมื่อระบบล้มเหลว (BILL-4, ขณะที่ Predis ไม่คืนเงินเลย), ไม่มี watermark ในเครดิตฟรี และแพ็กราคาเดียวได้ทุกฟีเจอร์ (Ocoya ล็อก AI captions ไว้ที่ Silver ขึ้นไป)
6. **ANA (P1/P2):** Analytics เป็นจุดอ่อนที่ผู้ใช้ Ocoya บ่นมากที่สุด ส่วน competitor analysis เป็นฟีเจอร์ที่ผู้ใช้ Predis ให้ความสำคัญ จึงควรเพิ่ม **ANA-5 (P2): เปรียบเทียบเพจคู่แข่ง** (ภายใต้ข้อจำกัดของ Meta API) และทำให้ ANA-4 (AI summary ภาษาไทย) เป็นจุดขาย
7. **Workspace (6.1):** รองรับ "หลายแบรนด์ แต่ละแบรนด์มี voice แยก" ตั้งแต่ต้น (Predis มี brand ID, Ocoya มีหลาย workspace) เพื่อให้แพ็ก Growth ที่ระบุว่า "2–3 แบรนด์" ใช้ได้จริง

## คำถามที่ยังเปิด
- ราคาและ credits ของ Predis ณ ต.ค. 2026 ยังยืนยันจากหน้าทางการไม่ได้ (proxy บล็อก) และแหล่งข้อมูลยังขัดกันเรื่อง Core ($19 กับ $32), free plan กับ trial และชื่อแผน
- Predis และ Ocoya รองรับภาษาไทยในการเขียน caption หรือไม่ (ทดสอบในแอปจริงไม่ได้เพราะห้ามสมัครบัญชี)
- งานแต่ละประเภทของ Ocoya กินกี่ AI credits และ Diamond "unlimited" มี fair-use limit หรือไม่
- Ocoya มี client approval ผ่านลิงก์ภายนอก หรือเก็บ approval history/audit log หรือไม่ (help article ฉบับเต็มอ่านไม่ได้)
- ระดับความลึกของ analytics และ approval ปัจจุบันของ Predis (รีวิวบน GetApp เป็นข้อมูลปี 2021–2023)
- อัตรา THB/USD ที่ใช้เทียบราคาต่อภาพควรตกลงร่วมกับรายงาน 21-pricing-credits

## แหล่งอ้างอิง
- https://predis.ai/pricing/ (ถูกบล็อก ใช้ข้อมูลจาก search summary)
- https://predis.ai/ai-social-media-post-generator/
- https://predis.ai/social-media-management/
- https://predis.ai/resources/top-tools-for-multi-language-voiceovers-for-social-videos/
- https://predis.frill.co/announcements/were-investing-300000-in-high-potential-brands
- https://admakeai.com/alternatives-to/predis-ai/pricing
- https://www.capterra.com/p/231932/Predisai/pricing/
- https://www.capterra.com/p/231932/Predisai/reviews/?page=3
- https://www.capterra.ca/software/1014570/predisai
- https://inmagic.ai/predis-review/
- https://bityclips.com/tool/predis-ai/pricing
- https://www.stork.ai/tools/predis-ai
- https://aiindigo.com/tutorials/getting-started-with-predis-ai-automate-high-converting-social-content-workflows
- https://help.dartai.com/en/articles/11651984-predis-agent
- https://www.getapp.com/marketing-software/a/predisai/
- https://www.joinsecret.com/predis-ai/reviews
- https://ocoya.com/pricing
- https://help.ocoya.com/en/articles/8687006-what-are-the-plans-and-pricing
- https://help.ocoya.com/en/articles/8377143-post-approval-process-a-step-by-step-guide (ถูกบล็อก ใช้ข้อมูลจาก search summary)
- https://help.ocoya.com/en/articles/7267036-ai-copywriting-write-quality-social-media-copy-faster-and-easier
- https://toolradar.com/tools/ocoya/pricing
- https://www.socialchamp.com/blog/ocoya-pricing/
- https://www.stork.ai/en/ocoya
- https://aiindigo.com/tutorials/getting-started-with-ocoya-automate-social-content-from-idea-to-publish
- https://www.getapp.ca/reviews/2066694/ocoya
- https://www.softwareadvice.com.au/reviews/267588/ocoya
- https://www.softwareadvice.com/marketing/ocoya-profile
- https://www.techjockey.com/us/reviews/ocoya
- https://www.heyorca.com/heyorca-client-approval-workflow-software
- https://poster.ly/features/client-approvals
