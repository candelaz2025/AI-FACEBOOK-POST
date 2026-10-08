# คู่แข่งในไทย: AI content tools และ social/chat management tools

> Research subagent 4/30 · ข้อมูล ณ 2026-10-07/08 · egress proxy บล็อกเว็บเป้าหมายทุกเว็บ จึงอ่านหน้าเว็บผ่าน Apify (`web-fetch`, `rag-web-browser`) · **ไม่ได้ login ไม่ได้สมัคร และไม่ได้ submit ฟอร์มใด ๆ**
>
> แท็ก: **VERIFIED** = อ่านจากหน้าเว็บทางการโดยตรง · **SNIPPET** = อ่านจากคำอธิบายผลค้นหาของ Google (ไม่ได้เปิดหน้าจริง) · **INFERRED** = อนุมาน · ราคาทุกตัวเป็นราคาที่หน้าเว็บแสดง ณ วันที่อ่าน ไม่ได้ระบุว่ารวม VAT หรือไม่ ยกเว้นที่ระบุไว้

## สรุป

คู่แข่งที่ใกล้ PANGLAB ที่สุดในไทยไม่ใช่ POPCONT เพียงรายเดียว **GenLabs** (genlabs.in.th) มีสินค้าแทบเหมือน PANGLAB ทุกส่วน (Brand Kit, แคมเปญ, ภาพสินค้า, วิดีโอที่ใช้นักแสดง AI คนไทย, ตั้งเวลาโพสต์, PromptPay) และขายแบบ subscription เริ่ม ฿599/เดือนสำหรับ 80 เครดิต (1 เครดิต = 1 ภาพ) ซึ่งตกราว ฿7.5 ต่อภาพ ถูกกว่าราคาเครดิตที่ PRD เสนอ (฿21.8–29.9) หลายเท่า **PostPung** ครองฝั่ง "โพสต์หลายแพลตฟอร์ม + AI caption" ที่ราคา ฿199–899/เดือน ส่วนเครื่องมือฝั่ง chat และ social commerce (Zwiz.ai, Page365, ChatCone) เป็นตลาดที่อิ่มตัวแล้ว PANGLAB ไม่ควรลงไปแข่งในส่วน inbox

## 1. ภาพรวมผู้เล่น

| ผู้เล่น | กลุ่ม | จุดยืน (ตามที่เว็บเขียน) | ราคาเริ่มต้น | สถานะข้อมูล |
|---|---|---|---|---|
| **GenLabs** (genlabs.in.th) | AI content + โพสต์ | "เอเจนซีการตลาดในรูปแบบซอฟต์แวร์ — AI การตลาดสำหรับแบรนด์ไทย ทำโพสต์ โฆษณา และวิดีโอจากรูปสินค้าของคุณ" | ฟรี 10 เครดิต แล้ว ฿599/เดือน | VERIFIED |
| **PostPung** (postpung.com) | Scheduler + AI caption | "โพสต์ทีเดียว ลงทุกช่องทาง… ลดเวลาโพสต์ 80%" | ทดลอง 7 วัน แล้ว ฿199/เดือน | VERIFIED |
| **Prompt D** (promptdaff.com) | บอททำคลิปขายของ TikTok | "ศูนย์รวมบอท AI สำหรับคนขายของออนไลน์ … คลิกเดียวได้เป็นร้อยคลิป … ปักตะกร้าให้เอง" | ฿990/เดือน หรือ ฿1,990 จ่ายครั้งเดียว | VERIFIED |
| **GEN.TH** (thai.dev) | AI campaign media | "GEN.TH helps Thai businesses create ads, social posts, product visuals, and campaign media with guided AI workflows." | ไม่ทราบ | SNIPPET เท่านั้น เว็บตอบ 404 `DEPLOYMENT_NOT_FOUND` |
| **Zwiz.ai** | AI chatbot + รวมแชท | "ระบบเอไอแชทบอท วิเคราะห์ข้อมูลเชิงลึก และช่วยปิดการขาย" | ฟรี (Basic) แล้ว ฿4,999/ปี | VERIFIED |
| **Page365** | Social commerce (แชท + บิล + ไลฟ์) | ระบบหลังร้านสำหรับคนขายผ่าน FB/IG/LINE | ฿799/เดือน (Solo) | VERIFIED |
| **ChatCone** (MakeWebEasy) | รวมแชท + chatbot | "Respond to customer from different communication services in one screen" | ฟรี 90 วัน แล้ว ฿7,500/ปี | VERIFIED |
| **PRIMO** (Primo World Co., Ltd.) | AI Loyalty CRM ระดับองค์กร | "AI-Powered Loyalty CRM ครบวงจรที่ขับเคลื่อนด้วย Autonomous AI" | ไม่เปิดเผย (ให้ติดต่อปรึกษา) | VERIFIED (หน้าแรก) |

PRIMO ไม่ใช่เครื่องมือ social posting แต่เป็นระบบสมาชิกและสะสมแต้มสำหรับแบรนด์ใหญ่ (ผลงานที่อ้างถึงได้แก่ NESCAFÉ, The 1, M150) จึงเป็นเพียงตลาดข้างเคียง ไม่ใช่คู่แข่งตรง — VERIFIED

## 2. AI content tools (คู่แข่งตรง)

### 2.1 GenLabs — คู่แข่งที่ใกล้ที่สุด

หน้าแรกของ GenLabs ระบุว่า "700+ ธุรกิจไทยจ่ายเงินใช้ GenLabs แล้ว" และแสดงตัวเลข "500K+ ครั้งที่สร้างผลงาน · 8,000+ ลูกค้า · TH + EN" ฟีเจอร์ที่ประกาศไว้ ได้แก่ ชุดแบรนด์ (Brand Kit: ข้อมูล สี โลโก้), แคมเปญที่ภาพเข้าชุดกันจากบรีฟเดียว, ภาพสินค้า, วิดีโอ UGC และวิดีโอโฆษณาที่ใช้ "นักแสดง AI คนไทย", ปฏิทิน, ตั้งเวลาโพสต์, กล่องข้อความ, วิเคราะห์ผล, แก้ไขภาพ/ลบพื้นหลัง/ปรับขนาด และ "ตรวจข้อความไทยและรายละเอียดสินค้าก่อนนำไปใช้" ทั้งหมดนี้ทำได้ "โดยไม่ต้องเขียนพร้อมท์เอง" — VERIFIED

| แผน | ราคา | เครดิต/เดือน | ฿/เครดิต | บัญชีโซเชียล |
|---|---|---|---|---|
| ทดลอง | ฟรี | 10 (ไม่ต้องใช้บัตร) | – | – |
| Startup | ฿599/เดือน | 80 | 7.49 | 1 |
| Pro | ฿1,990/เดือน | 400 | 4.98 | ไม่จำกัด |
| Business | ฿4,990/เดือน | 1,600 | 3.12 | ไม่จำกัด |
| เครดิตเติม | เริ่ม ฿490 | – | – | ไม่หมดอายุ, ใช้หลังเครดิตในแผน |

อัตราแลกเครดิตคือ "1 เครดิต = 1 ภาพ" และ "15 เครดิต = 1 วิดีโอ (10–15 วินาที)" (บนหน้ามีเลข 40 อยู่หน้า 15 ซึ่งน่าจะเป็นราคาเดิมที่ถูกขีดฆ่า — INFERRED) ทุกแผนได้ฟีเจอร์ครบเหมือนกัน การชำระเงินมี 2 แบบ คือ บัตรแบบตัดรายเดือน หรือ **PromptPay สำหรับสิทธิ์ 30 วัน** (ไม่ต่ออายุอัตโนมัติ) — VERIFIED

ฟีเจอร์ที่น่าสนใจคือ **โหมด Relax**: สร้างภาพได้ไม่จำกัดโดยไม่ใช้เครดิต แต่ทำได้ครั้งละ 1 ภาพในคิวรวม และรอคิวได้สูงสุด 5 งานต่อผู้ใช้ ข้อมูลบนหน้าเว็บขัดกันเอง ส่วนบรรยายฟีเจอร์เขียนว่า "Pro และ Business มีโหมด Relax" แต่การ์ดราคาแสดงโบนัสนี้ในแผน Startup ด้วย — VERIFIED (ข้อขัดแย้ง)

### 2.2 PostPung — scheduler ราคาถูกที่มี AI caption

PostPung เปิดตัวราว ม.ค. 2569 ("หลังจากพัฒนาเสร็จ (ม.ค. 69) ก็เริ่มใช้เอง") จุดขายคือโพสต์วิดีโอได้ 6 แพลตฟอร์ม (YouTube, TikTok, Facebook, Instagram, X, LinkedIn) และโพสต์รูปได้ 5 แพลตฟอร์มในคลิกเดียว AI caption ทำงานแบบ "เลือกหมวด กดปุ่ม ได้เลย ไม่ต้องพิมพ์ prompt ยาวๆ" (หมวดเช่น ขายของ, โปรโมชั่น, ให้ความรู้) และมีประวัติแคปชั่นกับแฮชแท็กเก่าไว้กันการใช้คำซ้ำ นอกจากนี้มี Content Calendar, Analytics (Best Time, ER%) สำหรับ FB/YT/TikTok และ workflow **อนุมัติโพสต์** ตั้งแต่แผน Growth ขึ้นไป — VERIFIED

| แผน | รายเดือน | รายปี | Post credits | AI Caption | แพลตฟอร์ม/ครั้ง | ทีม (พนักงาน + ผู้อนุมัติ) |
|---|---|---|---|---|---|---|
| Trial 7 วัน | ฟรี | – | 10 | 10 | – | – |
| Starter | ฿199 | ฿1,990 | 50 | 60 | 4 | 1 + 0 |
| Growth | ฿399 | ฿3,990 | 120 | 180 | 4 | 1 + 1 |
| Pro ⭐ | ฿599 | ฿5,990 | 220 | 350 | 5 | 3 + 1 |
| Business | ฿899 | ฿8,990 | 300 | 600 | 6 | 4 + 2 |

กติกาเครดิตที่ควรนำมาใช้: "1 เครดิต = 1 คอนเทนต์ ไม่ว่าจะโพสต์ไปกี่แพลตฟอร์ม" และ AI credits นับแยกจากเครดิตโพสต์ หน้าเว็บมีตัวคำนวณ ROI ("1 คอนเทนต์ = 45 นาที… ค่าจ้างลูกน้อง ฿1,687/เดือน (ค่าแรง ฿300 × 5.6 วัน)") และใช้ OAuth โดยไม่เก็บรหัสผ่านโซเชียลของผู้ใช้ — VERIFIED ข้อสังเกตคือ PostPung **ไม่สร้างภาพหรือวิดีโอ** ทำเฉพาะ caption, hashtag และการโพสต์ — INFERRED จากรายการฟีเจอร์

### 2.3 Prompt D — บอทผลิตคลิปจำนวนมากสำหรับ TikTok affiliate

Prompt D ขายเป็นบอทหรือ extension ที่ติดตั้งบนเครื่อง ("โหลด PD App แล้วกรอกคีย์" — "1 คีย์ ใช้ได้ 2 เครื่อง") ไม่ได้เป็น SaaS บนเว็บ ฟีเจอร์คือสร้างคลิปขายของจากรูปสินค้าพร้อมพากย์ ซับ และเพลง แล้วโพสต์ลง TikTok/Facebook/YouTube/Shopee และ "ปักตะกร้า" ให้อัตโนมัติ 24 ชม. เว็บอ้างว่า "10 ล้าน+ คลิปที่บอทผลิตให้ลูกค้า" และ "เจ้าแรกบอท TikTok ในไทย" มีระบบ affiliate ให้ค่าคอมมิชชัน และยังขาย "บอทเทรดทอง JSP EA" ด้วย — VERIFIED

| แพ็ก | ราคา (ราคาขีดฆ่า) |
|---|---|
| PD Auto Flow รายเดือน | ฿990/เดือน (฿1,990) |
| PD Auto Flow Lifetime | ฿1,990 (฿2,990) อัปเดต 12 เดือน |
| PD Auto Flow VIP Lifetime | ฿2,990 (฿4,990) |
| บอทแยก (Cartoon Story, Auto Footage) | เริ่ม ฿490/เดือน |
| PD Story mix | เริ่ม ฿690/เดือน |
| PD App เหมาทุกบอท | ส่วนบนของหน้าเขียน "฿4,490 (฿5,990)" แต่ส่วนล่างเขียน "เริ่ม ฿4,990" — **ข้อมูลขัดกัน** |

หน้าเพจ Facebook "Prompt D Ai - Generator" (โพสต์ 7 ส.ค. 2025) ลิงก์ไปที่ promptdee.net ซึ่งเป็นเครื่องมือสร้าง prompt แยกต่างหาก ส่วนเว็บนั้นเปิดผ่าน Apify ไม่ได้ — VERIFIED (โพสต์) / ไม่ได้อ่านเว็บ promptdee.net

### 2.4 GEN.TH (thai.dev) — สถานะไม่ชัดเจน

Google ยังแสดงคำอธิบาย "AI campaign media for Thai businesses — GEN.TH helps Thai businesses create ads, social posts, product visuals, and campaign media with guided AI workflows." แต่เมื่อเปิดหน้าจริงทั้ง `thai.dev` และ `www.thai.dev` ได้ Vercel 404 `DEPLOYMENT_NOT_FOUND` แปลว่า ณ วันที่อ่าน deployment ถูกลบหรือย้ายไปแล้ว — VERIFIED (404) / SNIPPET (คำอธิบาย) ยังไม่มีหลักฐานว่า GEN.TH กับ GenLabs เกี่ยวข้องกัน ถึงชื่อและ positioning จะคล้ายกัน — INFERRED ต้องตรวจสอบต่อ

## 3. Social/chat management tools (ตลาดข้างเคียง)

| | Zwiz.ai | Page365 | ChatCone |
|---|---|---|---|
| ช่องทาง | FB, IG, LINE, TikTok (Beta: ตอบคอมเมนต์), WhatsApp | FB, IG, LINE OA (ตอบผ่าน LINE มีค่าใช้จ่ายเพิ่ม), เว็บ Page365 Store | LINE, FB Messenger, web chat |
| แผน/ราคา | Basic ฟรี · Premium ฿4,999/ปี (฿417/เดือน) · Advanced ฿8,999/ปี (฿750/เดือน) · Business ฿19,999/ปี (฿1,667/เดือน) · Enterprise ติดต่อ | Solo ฿799/เดือน (฿4,990/ปี) · Pro ฿1,499 (฿8,990/ปี) · ProLive ฿2,999 (฿18,990/ปี) · SME ฿5,999 (฿39,900/ปี) · Enterprise ฿150,000/ปี | Free (90 วัน, 500 คน, 2 ช่องทาง) · Smart1 ฿7,500/ปี (20,000 คน, 3 ช่องทาง) · Smart2 ฿12,500/ปี (50,000 คน, ไม่จำกัดช่องทาง) · Enterprise ติดต่อ |
| ฟีเจอร์ AI | Chatbot, AI สรุปแชท, AI จับคู่ลูกค้าข้ามแพลตฟอร์ม, AI แปลภาษา, Follow-up Agents, ZPT (Generative AI ช่วยปิดการขาย), AI ตรวจสลิป | AI ดึงชื่อ/ที่อยู่/เบอร์จากแชทลงบิล, chatbot คำถามยอดฮิต | AI chatbot ที่ train ได้ (Smart1 ขึ้นไป), auto greeting |
| จุดแข็งอื่น | ร้านค้าในแชท, broadcast, custom audience ไป Meta/LINE, ตรวจสลิป (เติมโควตา ฿150/500 สลิป ถึง ฿9,000/50,000 สลิป) | ดูด CF ตอนไลฟ์, บิล, สต็อก, ขนส่ง, ตรวจสลิป ฿0.20/ครั้ง, SLA 98–99% ในแผนสูง | ผูกกับ MakeWebEasy store |
| Trust signals | พาร์ทเนอร์ Meta, LINE, TikTok, Microsoft · Thailand's MarTech Awards 2025 และ 2026 · NIA Awards 2022/2024 | โลโก้ลูกค้า เช่น Pizza Hut, ICHITAN, NISSAN · "ศูนย์ข้อมูลสิงคโปร์" | บริษัทแม่ MakeWebEasy |
| สร้างโพสต์/ภาพด้วย AI | ไม่พบบนหน้าเว็บ | ไม่พบ | ไม่พบ |

ทุกช่องในตารางนี้ VERIFIED จากหน้า pricing ทางการ ยกเว้นแถว "สร้างโพสต์/ภาพด้วย AI" ที่เป็นการอนุมานจากการไม่พบฟีเจอร์ (INFERRED) มีข้อขัดแย้งหนึ่งจุด: หน้าแรกของ Zwiz เขียนว่า "เริ่มต้นเพียง 500 บาท/เดือน" แต่หน้า pricing แสดงแผนเริ่มต้นที่ ฿417/เดือน (คิดจาก ฿4,999/ปี) ตัวเลข ฿500 อาจมาจากราคาแผน 3 เดือน ซึ่งหน้าเว็บไม่ได้แสดงตัวเลขไว้ — INFERRED

ข้อสรุปของตลาดนี้คือร้านค้าไทยมีเครื่องมือฝั่ง "หลังโพสต์" (ตอบแชท ปิดการขาย ออกบิล) ที่ครบและราคาไม่แพงอยู่แล้ว แต่ยังไม่มีเจ้าไหนทำฝั่ง "ก่อนโพสต์" (คิดคอนเทนต์ ทำภาพ วางปฏิทิน) ช่องว่างนี้คือพื้นที่ของ PANGLAB และ PANGLAB ควรเชื่อมต่อกับเครื่องมือกลุ่มนี้แทนการสร้างเอง — INFERRED

## 4. เทียบราคาต่อหน่วย

| ผู้เล่น | หน่วย | ราคาต่อหน่วย (แผนเริ่ม → แผนสูง) | โมเดล |
|---|---|---|---|
| POPCONT | 1 content (caption + ภาพ + ตั้งเวลา) | ฿34.9 → ฿25 | แพ็กเครดิต ไม่มีรายเดือน (จาก PRD/RESEARCH เดิม) |
| PANGLAB (PRD ร่าง) | 1 Quick Post | ฿29.9 → ฿21.8 | แพ็กเครดิต |
| GenLabs | 1 ภาพ (caption AI รวมในแผน) | ฿7.5 → ฿3.1 | Subscription + top-up ไม่หมดอายุ |
| GenLabs | 1 วิดีโอ 10–15 วิ | ฿112 → ฿47 | 15 เครดิต |
| PostPung | 1 โพสต์ (ไม่มีภาพ AI) | ฿4.0 → ฿3.0 | Subscription |
| Prompt D | ไม่จำกัดคลิป (ทำงานบนเครื่องผู้ใช้) | ฿990/เดือน หรือ ฿1,990 ครั้งเดียว | License key |

ราคาต่อหน่วยคำนวณจากตาราง pricing ที่ VERIFIED (หารราคาด้วยจำนวนเครดิต) การเทียบนี้ไม่ใช่ apples-to-apples เพราะคุณภาพภาพ ความยาว caption และข้อจำกัดคิวของแต่ละเจ้าต่างกัน แต่ทิศทางชัดเจน: **ราคาที่ PRD ตั้งไว้แพงกว่า GenLabs ราว 3–9 เท่าต่อภาพ** และการอ้างว่า "ถูกกว่า POPCONT 10–14%" จะไม่ช่วยเมื่อลูกค้าเปิดเทียบกับ GenLabs — INFERRED

## ผลต่อ PRD

**1. Pricing (§7) — เพิ่ม subscription คู่กับแพ็กเครดิต** ตลาดไทยรับ subscription ระดับ ฿199–฿599/เดือนได้แล้ว (PostPung, GenLabs) แนะนำให้มีสองทาง (a) แผนรายเดือนที่มีเครดิตในตัว เช่น ฿590 / ฿1,490 / ฿3,990 และเติมเครดิตแบบไม่หมดอายุเริ่ม ฿290–490 (b) คงแพ็ก "จ่ายครั้งเดียว ไม่มีรายเดือน" ไว้แข่งกับ POPCONT จากนั้นตั้งเป้าต้นทุนต่อ Quick Post ที่ผู้ใช้จ่ายให้อยู่ในช่วง ฿8–15 แทน ฿21.8–29.9 แล้วตรวจ gross margin ≥ 80% (§KPI) ใหม่ด้วยต้นทุน AI จริง ถ้า margin ไม่ถึง ให้ขายด้วย value (Brand-fit score, Campaign Studio, Approval) และย้าย anchor เปรียบเทียบจาก POPCONT ไปเป็น "ค่าจ้างคน" ตามแบบตัวคำนวณ ROI ของ PostPung

**2. Billing (BILL-1, BILL-2) — แยก PromptPay ออกจากการต่ออายุอัตโนมัติ** GenLabs ใช้ "PromptPay สำหรับสิทธิ์ 30 วัน" คู่กับบัตรแบบตัดรายเดือน PANGLAB ควรออกแบบ subscription ให้รองรับ "30-day pass" สำหรับ PromptPay (ไม่ต่ออายุเอง แจ้งเตือนก่อนหมด) และให้บัตรเป็น recurring ต้องเพิ่ม state ใน ARCHITECTURE (`subscription.status = active | grace | expired` และ `renewal_method`)

**3. Free trial — เพิ่มจาก 5 เป็น 10 เครดิต ไม่ต้องผูกบัตร** ค่ามาตรฐานของตลาดคือ GenLabs 10 เครดิต และ PostPung 10 เครดิต + 10 AI caption (7 วัน) ถ้าให้ 5 เครดิตจะดูน้อยกว่าคู่แข่ง

**4. กติกาเครดิตข้ามช่องทาง** ให้เขียนชัดใน §7.1 ว่า "1 ชิ้นงาน = เครดิตเท่าเดิม ไม่ว่าจะโพสต์กี่ช่องทาง" (ตามแบบ PostPung) และ caption regenerate ไม่ควรกินเครดิตหลัก

**5. เพิ่ม "Relax / Slow lane" เป็น P1** ให้ regenerate ภาพแบบรอคิวได้ฟรี โดยใช้ Batch API หรือคิว off-peak (ARCHITECTURE มีแผนใช้ Batch API อยู่แล้ว) ฟีเจอร์นี้ตอบ GenLabs Relax mode ได้ตรง ๆ และไม่เพิ่ม burst cost

**6. Video (GEN-8) — พิจารณาเลื่อนเป็น P0.5 หรือต้น Phase 2** GenLabs มีวิดีโอ UGC และวิดีโอโฆษณาที่ใช้นักแสดง AI คนไทยแล้ว Prompt D ขายคลิปจำนวนมากให้สาย TikTok ถ้า PANGLAB ไม่มีวิดีโอใน 3 เดือนแรกหลัง launch จะเสียเปรียบในกลุ่ม beauty/fashion/F&B ต้องกำหนด policy เรื่อง AI presenter (ติดป้าย "AI-generated" และห้ามเลียนแบบบุคคลจริง) ไว้ใน GEN-10 ด้วย

**7. ช่องทางโพสต์ (Social publishing) — ให้ TikTok เป็น P1 โดยมี fallback** PostPung โพสต์ได้ 6 แพลตฟอร์ม ส่วนคู่แข่งกลุ่ม content โพสต์ได้อย่างน้อย FB/IG MVP ของ PANGLAB ควรมี "ดาวน์โหลด + คัดลอก caption" สำหรับ TikTok/LINE ตั้งแต่วันแรก และวาง TikTok Content Posting API ไว้ใน Phase 2

**8. ไม่ทำ inbox/chat ใน MVP แต่ทำ integration แทน** Zwiz, Page365 และ ChatCone ครองตลาดนี้ด้วยราคา ฿417–฿1,667/เดือน PANGLAB ควรมีเพียง (a) เทมเพลต CTA ที่ชี้ไป Messenger/LINE (b) export ข้อมูลโพสต์หรือแคมเปญให้ระบบแชทรู้ว่าลูกค้ามาจากโพสต์ไหน และ (c) สำรวจโปรแกรม partner ของ Zwiz (มีหน้า `zwiz.ai/th/partner`) เพื่อทำ co-marketing

**9. Vertical templates และ onboarding** GenLabs แยกหน้าตามธุรกิจ (บิวตี้, แฟชั่น, ร้านอาหาร, คลินิก, อสังหาฯ) และ PostPung ก็แยก persona ไว้ 12 กลุ่ม PANGLAB ควรเพิ่ม BRAND-7 (P1) ให้มี preset ของ Brand DNA และ content pillars ตามอุตสาหกรรม เริ่มจาก 5 กลุ่มที่ตรงกับ GenLabs เพื่อแข่งแบบตัวต่อตัว

**10. Trust signals บน landing (DESIGN)** คู่แข่งใช้ตัวเลขลูกค้า (GenLabs 8,000+/700+ จ่ายเงิน), badge พาร์ทเนอร์ Meta/LINE/TikTok และรางวัล (Zwiz) PANGLAB ควรวางแผนสมัคร Meta Business Partner หรือ Tech Provider หลังผ่าน App Review และเตรียมช่องสำหรับ social proof ที่ใช้ตัวเลขจริงเท่านั้น

**11. Affiliate (BILL-6) — เลื่อนจาก P2 เป็น P1** Prompt D ใช้ affiliate เป็นกลไกโตหลัก ("แนะนำเพื่อนซื้อแพ็ก รับค่าคอมมิชชั่นทุกยอด") และ POPCONT มี route `/affiliate` ตลาดไทยในกลุ่มนี้โตผ่าน creator และ course seller

**12. Positioning — ไม่เป็น "บอทปั๊มคลิป"** Prompt D เน้นปริมาณ ("คลิกเดียวได้เป็นร้อยคลิป", ทำงานบนเครื่อง 24 ชม.) ซึ่งเสี่ยงผิดนโยบายแพลตฟอร์ม (INFERRED) PANGLAB ควรวาง positioning เป็น "brand-safe, ผ่าน API ทางการ, มี approval" และเขียนเรื่องนี้ไว้ใน PRD §Positioning เพื่อดึงลูกค้าที่เป็นแบรนด์จริงจัง

## คำถามที่ยังเปิด

1. GEN.TH ปิดตัวแล้ว ย้ายโดเมน หรือ rebrand เป็น GenLabs? ควรตรวจ DNS/WHOIS, Wayback Machine และเพจ Facebook ของทั้งสองแบรนด์
2. คุณภาพจริงของภาพและ caption ไทยของ GenLabs/PostPung เทียบกับ PANGLAB เป็นอย่างไร? ต้องทำ blind test ด้วยบัญชีทดลองที่ทีมสมัครเอง (subagent นี้ไม่ได้สมัคร)
3. ราคาที่เห็นรวม VAT 7% หรือไม่ (ทุกเจ้าไม่ได้ระบุ)? ตัวเลข "เริ่ม ฿500/เดือน" ของ Zwiz มาจากแผนไหน? ราคา PD App ที่ถูกต้องคือ ฿4,490 หรือ ฿4,990?
4. โหมด Relax ของ GenLabs ใช้ได้ในแผน Startup หรือไม่ (หน้าเว็บเขียนขัดกันเอง)? และวิดีโอใช้ 15 หรือ 40 เครดิต?

## แหล่งอ้างอิง

- GenLabs หน้าแรก + pricing — https://genlabs.in.th/
- PostPung หน้าแรก + pricing — https://postpung.com/ (หน้า https://postpung.com/pricing ตอบ 404)
- Prompt D — https://www.promptdaff.com/
- Prompt D Ai - Generator, โพสต์ Facebook 7 ส.ค. 2025 — https://www.facebook.com/61577486498158/posts/%EF%B8%8F-%E0%B8%AD%E0%B8%B1%E0%B8%9B%E0%B9%80%E0%B8%94%E0%B8%95%E0%B9%80%E0%B8%A5%E0%B9%87%E0%B8%81-%E0%B9%86-%E0%B8%9A%E0%B8%99%E0%B9%80%E0%B8%A7%E0%B9%87%E0%B8%9A-prompt-d%E0%B8%95%E0%B8%AD%E0%B8%99%E0%B8%99%E0%B8%B5%E0%B9%89%E0%B9%83%E0%B8%99%E0%B9%80%E0%B8%A1%E0%B8%99%E0%B8%B9-%E0%B8%AA%E0%B8%A3%E0%B9%89%E0%B8%B2%E0%B8%87-template-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B8%AA%E0%B8%B2%E0%B8%A1%E0%B8%B2%E0%B8%A3%E0%B8%96%E0%B9%80%E0%B8%A5%E0%B8%B7%E0%B8%AD%E0%B8%81%E0%B9%84%E0%B8%94%E0%B9%89%E0%B9%81/122123148776916216/
- Prompt D Generator (อ้างถึง แต่เปิดไม่ได้) — https://www.promptdee.net/
- GEN.TH (404 DEPLOYMENT_NOT_FOUND) — https://thai.dev/ , https://www.thai.dev/
- Zwiz.ai หน้าแรก — https://zwiz.ai/
- Zwiz.ai pricing — https://zwiz.ai/th/pricing
- Page365 pricing — https://www.page365.net/pricing
- ChatCone (MakeWebEasy) — https://www.makewebeasy.com/en/chatcone
- PRIMO — https://primo.mobi/ (และผลค้นหา https://primo-dev.com/)
- PANGLAB PRD (ราคาเครดิตที่ใช้เทียบ) — `docs/panglab/PRD.md` §7
