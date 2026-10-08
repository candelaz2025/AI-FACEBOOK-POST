# 11 — นโยบาย Meta ต่อ AI-generated content, Community Standards, Branded Content, Platform Terms และข้อจำกัดในไทย

> ค้นคว้าเมื่อ 2026-10-08 · subagent 11/30
> **หมายเหตุวิธีการ:** about.fb.com และ developers.facebook.com ถูก egress proxy บล็อก และ Apify web-fetch เต็มโควตา concurrent จึงอ่านหน้าเต็มของ Meta ไม่ได้ ข้อมูลทั้งหมดมาจากผลค้นหา (search excerpt) ของหน้าทางการ ข่าว และสำนักกฎหมาย
> ป้ายกำกับ: **VERIFIED-S** = อ่านจาก excerpt ของหน้าทางการ (Meta/Google/ราชกิจจาฯ ผ่าน law firm) แต่ไม่ได้เปิดหน้าเต็ม · **REPORTED** = สื่อหรือ law firm รายงาน · **INFERRED** = ข้อสรุปของผู้วิจัย

## สรุป
Meta ไม่ได้ห้ามคอนเทนต์ AI แต่บังคับให้ "เปิดเผย" ด้วยป้าย **AI info** ระบบตรวจได้เองจาก metadata มาตรฐาน C2PA/IPTC ส่วนวิดีโอหรือเสียงสมจริงต้อง self-disclose ตั้งแต่ 22 มิ.ย. 2026 Instagram Content Publishing API มี parameter `is_ai_generated` ทำให้ PANGLAB ติดป้ายผ่าน API ได้โดยตรง ฝั่งไทยมีกฎใหม่หลายฉบับที่กระทบโพสต์ organic โดยตรง ได้แก่ ประกาศ สคบ. เรื่องโฆษณาที่ใช้ภาพ AI (บังคับติดป้าย AI และภาพต้องตรงกับของจริง) พ.ร.บ.ควบคุมเครื่องดื่มแอลกอฮอล์ ฉบับที่ 2 (มีผล 8 พ.ย. 2025) การขออนุญาตโฆษณากับ อย. และร่าง พ.ร.บ.คุ้มครองผู้บริโภคที่จะบังคับ influencer ให้เปิดเผยว่าเป็นโฆษณา PANGLAB จึงควรมี "AI disclosure by default" และ compliance pre-check แบบไทยตั้งแต่ MVP

## 1. AI info labels บน Facebook / Instagram

| ช่วงเวลา | การเปลี่ยนแปลง | สถานะ |
|---|---|---|
| ก.พ. 2024 | Meta ประกาศว่าจะติดป้ายภาพ AI จาก Google, OpenAI, Microsoft, Adobe, Midjourney, Shutterstock โดยตรวจจาก metadata มาตรฐาน C2PA และ IPTC ภาพจาก Meta AI ติดป้าย "Imagined with AI" อยู่แล้ว | REPORTED (siliconangle, the-decoder, NPR/WHYY) |
| ก.พ.–เม.ย. 2024 | ผู้ใช้**ต้อง** self-disclose เมื่อโพสต์ organic ที่มี **photorealistic video หรือ realistic-sounding audio** ที่สร้างหรือดัดแปลงด้วยดิจิทัล ถ้าไม่ทำอาจถูกลงโทษ (penalties) คอนเทนต์ที่ "high risk of materially deceiving the public" จะได้ป้ายที่เด่นกว่าปกติ | REPORTED (หลายสำนักอ้าง Meta newsroom) |
| ก.ค. 2024 | เปลี่ยนป้ายจาก "Made with AI" เป็น **"AI info"** หลังช่างภาพร้องเรียนว่าภาพจริงที่ retouch เล็กน้อยก็โดนติดป้าย และ Meta หยุดลบคอนเทนต์ด้วยเหตุ manipulated media เพียงอย่างเดียว | REPORTED (fonearena, mobilemarketingmagazine) |
| ก.ย. 2024 | คอนเทนต์ที่ "**แก้ไข**ด้วย AI" ย้ายป้ายไปอยู่ในเมนู (⋯) ส่วนคอนเทนต์ที่ "**สร้างทั้งหมด**ด้วย AI" ยังแสดงป้ายใต้ชื่อผู้โพสต์ | REPORTED (TechCrunch 2024-09-12, PetaPixel) |
| 22 มิ.ย. 2026 | **Instagram Content Publishing API** เพิ่ม `is_ai_generated=true` บน media container เพื่อติดป้าย AI info ตอน publish รองรับทั้ง IG API with Facebook Login และ Instagram Login (carousel ให้ตั้งที่ carousel container เท่านั้น) และอ่านค่ากลับได้ด้วย `GET /{ig_media_id}?fields=is_ai_generated` | VERIFIED-S (IG Platform changelog) |
| ปัจจุบัน | **FB Page video stories** มี flag `is_ai_generated` (optional, default false) ส่วน FB Page photo/feed post **ยังไม่พบ** parameter เทียบเท่า มีเพียงแหล่งที่สาม (Zernio) ที่อ้างว่า video ใช้ `video_labels: ["LABELED_AI_GENERATED"]` | VERIFIED-S (Page Stories doc) / ไม่ยืนยัน (Zernio) |

ข้อสังเกตเรื่องการตั้ง flag ภายหลัง: Inrō (แหล่งที่สาม) อ้างว่าตั้ง `is_ai_generated` ได้ตอนสร้าง container เท่านั้น เพราะ update endpoint รับแค่ `comment_enabled` ถ้าจริง การติดป้ายย้อนหลังผ่าน API ทำไม่ได้ **(REPORTED, ยังไม่ยืนยันกับ reference ทางการ)**

## 2. C2PA / IPTC metadata และ SynthID

| สัญญาณ | Meta ใช้ตรวจหรือไม่ | ผลต่อ PANGLAB |
|---|---|---|
| IPTC `DigitalSourceType = trainedAlgorithmicMedia` | ใช้ (Meta ใช้ field นี้กับภาพ Meta AI ของตัวเองด้วย) | REPORTED (iptc.org) |
| C2PA manifest (Content Credentials) | ใช้ | REPORTED |
| Invisible watermark ของ Meta และ classifier ภายใน | ใช้กับภาพ Meta AI และกำลังพัฒนา classifier ที่ตรวจได้แม้ไม่มี marker | REPORTED |
| **SynthID** (Google) | **ไม่มีหลักฐานว่า Meta อ่าน SynthID** ตัวตรวจ SynthID เป็นของ Google DeepMind (SynthID Detector, Gemini app) | INFERRED |

ฝั่ง Google, Imagen และ Veo ฝัง SynthID (Veo ทำทีละเฟรม) **(REPORTED, แหล่งรอง)** ส่วน Google ยืนยันเองว่าฝัง C2PA กับ Nano Banana Pro (Gemini 3 Pro Image) ใน Gemini app, Vertex AI และ Google Ads **(VERIFIED-S, blog.google)** แต่**ยังไม่ยืนยัน**ว่าไฟล์จาก Gemini API (Imagen 4 / Veo) มี C2PA หรือ IPTC มาด้วย

ประเด็นสำคัญเชิงสถาปัตยกรรม: IPTC ระบุว่า metadata มักหลุดระหว่างทาง และ pipeline ของ PANGLAB เองก็จะทำให้หลุด (resize, แปลงเป็น JPEG ตาม PUB-3, overlay ข้อความไทยตาม GEN-7) **(INFERRED)** ดังนั้น**ไม่ควรพึ่ง Meta ให้ตรวจเจอเอง** ควรใช้ทั้ง (ก) flag `is_ai_generated` ผ่าน API และ (ข) เขียน IPTC/XMP `DigitalSourceType` กลับเข้าไฟล์สุดท้ายก่อนอัปโหลด ซึ่งเป็น "belt and braces"

## 3. Community Standards ที่เกี่ยวข้องกับ AI marketing agent

| นโยบาย | สาระที่กระทบ PANGLAB | สถานะ |
|---|---|---|
| Inauthentic Behavior | ห้ามใช้ fake accounts, "artificially boost the popularity of content" และ misrepresent ตนเอง กฎนี้ใช้ไม่ว่าเนื้อหาจะเป็นอะไร | VERIFIED-S (transparency.meta.com) |
| Spam | เป็นหมวดแยกใน Community Standards แหล่ง vendor บอกว่าคอมเมนต์ซ้ำ ๆ ถี่ ๆ หรือคอมเมนต์บนเพจคนอื่นจำนวนมากถูกมองเป็น fake engagement | VERIFIED-S (มีหมวดนี้จริง) / REPORTED (รายละเอียดจาก vendor) |
| Unoriginal content (14 ก.ค. 2025) | บัญชีที่ repost งานคนอื่นซ้ำ ๆ โดยไม่เครดิตหรือไม่เพิ่มคุณค่า จะถูกตัด monetization และลด distribution ทุกโพสต์ duplicate video ถูกลดการมองเห็น สื่อตีความว่ารวมถึง "AI slop" แต่ Meta ไม่ได้ระบุ AI ตรง ๆ | REPORTED (medianama, tubefilter) |
| Restricted Goods & Services | ยาที่ไม่ใช่ทางการแพทย์ห้ามโปรโมต ยาตามใบสั่งแพทย์โปรโมตได้แบบมีเงื่อนไข | REPORTED (Oversight Board) |
| Manipulated media | ตั้งแต่ ก.ค. 2024 ไม่ลบเพียงเพราะเป็น manipulated media อีกแล้ว แต่ติดป้ายแทน ยกเว้นผิดมาตรฐานอื่น | REPORTED |

ความเสี่ยงหลักของ PANGLAB คือ **ปริมาณ** ไม่ใช่ความเป็น AI การปล่อยโพสต์หน้าตาคล้ายกันจำนวนมากหลายเพจพร้อมกัน (template ซ้ำ ภาพสต็อกเดียวกัน) อาจเข้าข่าย unoriginal หรือ spam ได้ **(INFERRED)**

## 4. Branded Content policy

ถ้าโพสต์แสดงหรือได้รับอิทธิพลจากแบรนด์โดยมี "exchange of value" (เงินหรือของฟรี) creator ต้องใช้ branded content tool เพื่อ tag แบรนด์ ป้าย "Paid partnership" ใช้ได้เมื่อทั้งสองฝ่ายได้รับอนุมัติเป็น partner ในระบบ Meta และมีรายการสินค้าที่ห้ามทำ branded content เช่น drugs และ drug-related products **(REPORTED: Search Engine Land อ้าง Meta blog, Oversight Board)** Oversight Board ยังพบว่าผู้ตรวจที่ทำงาน at scale มองไม่เห็นป้าย paid partnership จึงมีช่องโหว่ด้าน enforcement **(REPORTED)**

สำหรับ PANGLAB: แบรนด์ที่โพสต์บนเพจของตัวเองไม่ใช่ branded content แต่ลูกค้าเอเจนซีหรือ creator ที่รับจ้างโพสต์ให้แบรนด์อื่น (AUTH-4) **ต้อง**ติด paid partnership ยังไม่พบว่า Graph API ฝั่ง publishing รองรับการ tag sponsor หรือไม่ **(ยังเปิด)**

## 5. Platform Terms / Developer Policies — ข้อจำกัด automated posting

| ข้อจำกัด | รายละเอียด | สถานะ |
|---|---|---|
| IG publishing quota | หน้า Content Publishing บอก **100** API-published posts ต่อ 24 ชม. (rolling) แต่ reference `content_publishing_limit` บอก **50** (`quota_duration` 86400 วินาที) carousel นับเป็น 1 โพสต์ Meta แนะนำให้แอปบังคับ limit เองถ้ามีการตั้งเวลา | VERIFIED-S (ทั้งสองหน้าขัดกัน) |
| Graph API rate limits | token แบบ Page/system user ใช้ **Business Use Case (BUC)** rate limit ส่วน app/user token ใช้ Platform rate limit ถ้าใช้ได้ทั้งคู่ จะใช้ BUC เมื่อถูก throttle ฝั่ง Pages จะได้ error code 32 | VERIFIED-S (rate-limiting docs) |
| Developer Policies update (15 ต.ค. 2024) | เพิ่ม prohibited practices เช่น การจัดการแอปด้วย inauthentic accounts | VERIFIED-S (developers blog) |
| Automation clause | vendor อ้างว่า Platform Terms ไม่มี clause ห้าม automation โดยตรง ข้อจำกัดเรื่องความถี่ใช้ทั้งกับการโพสต์แบบ manual และ automated | REPORTED (ต้องตรวจต้นฉบับ) |

## 6. ข้อจำกัดเฉพาะประเทศไทย (organic posts)

| กฎหมาย/ประกาศ | สาระ | มีผล | สถานะ |
|---|---|---|---|
| **ประกาศ สคบ. แนวทางโฆษณาที่ใช้ภาพ/วิดีโอสร้างหรือแก้ด้วย AI** (ออกตาม พ.ร.บ.คุ้มครองผู้บริโภค 2522) | ถ้าสินค้าในภาพอาจต่างจากของจริง (1) ต้องขออนุญาตหน่วยงานที่เกี่ยวข้องก่อนตามที่กฎหมายกำหนด (2) ขนาด ปริมาณ จำนวน และส่วนประกอบต้องตรงกับของจริง (3) **ต้องมีป้ายเปิดเผยว่าใช้ AI** (ไม่พบรูปแบบป้ายหรือบทลงโทษใน excerpt) | มีผลแล้ว (Tilleke 12 มี.ค. 2026) | REPORTED |
| ร่างแก้ไข พ.ร.บ.คุ้มครองผู้บริโภค | influencer, creator, affiliate และ "virtual online media operators" ที่ได้ค่าตอบแทนหรือของฟรี ต้องเปิดเผยว่าเป็นโฆษณาและบอกความสัมพันธ์กับแบรนด์ ให้นับ social media account เป็นสื่อโฆษณา | รับฟังความเห็นถึง **10 ต.ค. 2026** | REPORTED (Tilleke/Mondaq) |
| พ.ร.บ.ควบคุมเครื่องดื่มแอลกอฮอล์ (ฉบับที่ 2) พ.ศ. 2568 | ม.32/1 ห้ามโฆษณาแอลกอฮอล์ ยกเว้นข้อมูลข้อเท็จจริงหรือการให้ความรู้ตามเงื่อนไขของรัฐมนตรี ม.32/2 ห้ามคนมีชื่อเสียงหรือ influencer แสดงชื่อหรือโลโก้เพื่อประโยชน์ทางการค้า ผู้ผลิต ผู้นำเข้า หรือผู้ขายที่ฝ่าฝืนปรับได้ถึง 500,000 บาท บวกค่าปรับรายวันไม่เกิน 50,000 บาท ประกาศกระทรวงรายละเอียดออกได้ภายใน 1 ปี | 8 พ.ย. 2025 | REPORTED (Rajah & Tann, Tilleke, Paul Poole) |
| อย. — ยา/อาหารเสริม/อาหาร | โฆษณายาทุกชิ้นรวมถึงโพสต์โซเชียลต้องได้รับอนุมัติล่วงหน้า (ปรับถึง 100,000 บาทต่อครั้ง) ยาที่ต้องใช้ใบสั่งแพทย์ห้ามโฆษณาต่อสาธารณะ อาหารเสริมแม้มีเลข อย. แล้ว โฆษณาก็ยังต้องขออนุมัติ ต้นปี 2026 อย. เข้มงวดเรื่องเคลมรักษาโรค ลดน้ำหนักเร็ว และเสริมสมรรถภาพทางเพศ | ใช้อยู่ | REPORTED (Tilleke, Bangkok Post) |
| ประกาศ คณะกรรมการธุรกรรมทางอิเล็กทรอนิกส์ เรื่องมาตรการป้องกันอาชญากรรมทางเทคโนโลยีสำหรับสื่อสังคมออนไลน์ (ฉบับที่ 2) | แพลตฟอร์มต้องยืนยันตัวตนผู้ลงโฆษณา (KYC มีอายุ 1 ปี เก็บข้อมูลอย่างน้อย 90 วันหลังเลิกใช้บริการ) ใช้กับโฆษณาแบบจ่ายเงินเป็นหลัก ไม่ใช่โพสต์ organic | 1 พ.ย. 2026 | REPORTED (Tilleke, MLex) |
| ร่าง พ.ร.บ. AI (ETDA) | มีหน้าที่ติดป้ายคอนเทนต์ที่สร้างด้วย AI เปิดรับฟังความเห็นตั้งแต่ 2 ก.ค. 2026 ราว 30 วัน ยังไม่ทราบความคืบหน้า | ร่าง | REPORTED (lexbangkok) |
| พ.ร.บ.คอมพิวเตอร์ 2550, ป.อาญา ม.112, PDPA | โฆษณาที่หลอกลวงหรือก่อความเสียหายอาจเข้า พ.ร.บ.คอมฯ มีกรณีคอนเทนต์ influencer ถูกร้องด้วย ม.112 การใช้ภาพบุคคลจริงหรือข้อมูลส่วนบุคคลต้องเป็นไปตาม PDPA | ใช้อยู่ | REPORTED (Bangkok Post, galalaw) |

ไม่พบกฎหมายไทยที่บังคับ hashtag เฉพาะ เช่น #โฆษณา **(REPORTED, ค้นไม่เจอ)**

## ผลต่อ PRD

| ID | การเปลี่ยนแปลงที่แนะนำ | Priority |
|---|---|---|
| **GEN-10** (ขยาย) | แยก compliance pre-check ตามหมวดสินค้าใน BRAND-4 (แอลกอฮอล์ / ยา / อาหารเสริม / อาหาร / เครื่องสำอาง / การเงิน) ถ้าเป็นแอลกอฮอล์ให้บล็อก caption และภาพเชิงชวนดื่ม หรือแสดงคำเตือนว่า "เสี่ยงผิด ม.32/1" ถ้าเป็นยาหรืออาหารเสริมให้ถามเลขอนุญาตโฆษณา (ฆท./ฆอ.) และตรวจคำเคลมต้องห้าม (รักษาโรค ลดน้ำหนักเร็ว) | P0 |
| **GEN-11** (ใหม่) | **AI disclosure by default**: งานทุกชิ้นที่ใช้ภาพหรือวิดีโอ AI ตั้ง flag `ai_generated=true` ใน DB เป็นค่าเริ่มต้น ผู้ใช้ปิดได้เฉพาะเมื่อยืนยันว่าใช้รูปจริงเท่านั้น และเก็บ audit log | P0 |
| **GEN-12** (ใหม่) | เขียน IPTC/XMP `DigitalSourceType` (`trainedAlgorithmicMedia` หรือ `compositeWithTrainedAlgorithmicMedia` ถ้าเป็น product shot ตาม GEN-3) กลับเข้าไฟล์หลังทำ overlay และแปลง JPEG เพื่อให้ Meta ตรวจเจอเองได้ด้วย | P1 |
| **GEN-3** (เพิ่มเงื่อนไข) | Product Shot ต้องคงขนาดและสัดส่วนสินค้าจริง และใส่ข้อความ "ภาพประกอบสร้างด้วย AI" เป็นตัวเลือก overlay เพื่อให้ตรงประกาศ สคบ. | P0 |
| **PUB-3 / PUB-8** | ส่ง `is_ai_generated=true` ตอนสร้าง IG container (ทั้งภาพเดี่ยวและ carousel โดย carousel ตั้งที่ parent เท่านั้น) และ FB video story ส่วน FB feed photo ที่ยังไม่มี flag ให้ต่อท้าย caption ด้วยข้อความเปิดเผย เช่น "ภาพนี้สร้างด้วย AI" (ปรับได้) | P0 |
| **PUB-5** (แก้) | อย่า hardcode 100 ให้อ่าน `config.quota_total` จาก `GET /{ig-id}/content_publishing_limit` ก่อนตั้งเวลา และตั้ง soft cap ของเราเอง (เช่น ≤ 25 โพสต์ต่อวันต่อบัญชี) เพื่อลดความเสี่ยง spam | P0 |
| **PUB-10** (ใหม่) | Anti-spam guard: กันการโพสต์ข้อความหรือภาพที่เหมือนกันเกินเกณฑ์ข้ามหลายเพจในเวลาใกล้กัน ไม่มีฟีเจอร์ auto-comment บนเพจคนอื่น และใช้ BUC rate-limit header (`X-Business-Use-Case-Usage`) ในการ throttle | P1 |
| **AUTH-4 / CAL** | โหมดเอเจนซีหรือ creator: มีช่อง "โพสต์นี้เป็นงานรับจ้าง/ได้รับของฟรี" แล้วเตือนให้ติด Paid partnership และเพิ่มข้อความเปิดเผยความสัมพันธ์ตามร่าง พ.ร.บ.คุ้มครองผู้บริโภค | P1 |
| ToS ของ PANGLAB | ระบุว่าผู้ใช้รับผิดชอบการขออนุญาต อย. และการปฏิบัติตามกฎหมายแอลกอฮอล์ พร้อมเก็บ log การกดยืนยันก่อนโพสต์ | P0 |

## คำถามที่ยังเปิด
1. FB Page photo/feed post (`/{page-id}/photos`, `/feed`) มี parameter สำหรับติดป้าย AI แล้วหรือยัง และ `video_labels` ของ FB video หรือ Reels ใช้ได้จริงหรือไม่ ต้องเปิด Graph API reference ล่าสุดจากเครือข่ายที่ไม่ถูกบล็อก
2. IG quota ปัจจุบันเป็น 50 หรือ 100 ต้องทดสอบด้วยบัญชีจริง
3. ไฟล์จาก Gemini API (Imagen 4 / Veo / Nano Banana) มี C2PA หรือ IPTC มาด้วยหรือไม่ และ Meta อ่าน SynthID หรือไม่ (ไม่พบหลักฐาน)
4. รูปแบบป้าย AI ตามประกาศ สคบ. (ข้อความ ขนาด ตำแหน่ง) และบทลงโทษ ต้องอ่านราชกิจจานุเบกษาหรือบทความ Tilleke ฉบับเต็ม
5. ประกาศกระทรวงสาธารณสุขที่ขยายความ ม.32/1 ออกแล้วหรือยัง (กำหนดภายใน 8 พ.ย. 2026)
6. ร่าง พ.ร.บ. AI และร่างแก้ไข พ.ร.บ.คุ้มครองผู้บริโภค หลังปิดรับฟังความเห็นจะมีผลเมื่อไร และนับ "AI-generated brand persona" เป็น virtual influencer หรือไม่

## แหล่งอ้างอิง
- https://siliconangle.com/2024/02/06/meta-will-label-ai-generated-images-across-facebook-instagram-threads/
- https://the-decoder.com/meta-introduces-imagined-with-ai-labels-for-ai-generated-content-on-its-social-media-platforms/
- https://whyy.org/npr-story/meta-labeling-ai-generated-images-instagram-facebook-artificial-intelligence
- https://iptc.org/?p=6867
- https://www.fonearena.com/blog/427659/meta-ai-labeling-ai-info-enhanced-transparency.html/amp
- https://mobilemarketingmagazine.com/instagram-ai/
- https://techcrunch.com/2024/09/12/meta-is-making-its-ai-info-label-less-visible-on-content-edited-or-modified-by-ai-tools
- https://petapixel.com/2024/09/13/instagram-is-changing-how-it-labels-ai-content-again/
- https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/ (เข้าไม่ได้ — ถูกบล็อก)
- https://developers.facebook.com/documentation/instagram-platform/changelog
- https://developers.facebook.com/documentation/instagram-platform/reference/instagram-media
- https://developers.facebook.com/documentation/video-api/page-stories-api
- https://www.inro.social/glossary/ai-content-disclosure
- https://zernio.featurebase.app/p/feature-request-ai-generated-content-disclosure-for-facebook-and-pinterest
- https://developers.facebook.com/docs/instagram-platform/content-publishing
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit
- https://developers.facebook.com/docs/graph-api/overview/rate-limiting/
- https://developers.facebook.com/blog/post/2016/06/16/page-level-rate-limits/
- https://developers.facebook.com/blog/post/2024/10/15/platform-terms-and-developer-policies-updates/
- https://transparency.meta.com/policies/community-standards/inauthentic-behavior
- https://www.blotato.com/blog/ai-agent-social-media-ban-rules
- https://www.medianama.com/2025/07/223-meta-cracks-down-on-unoriginal-facebook-content/
- https://www.tubefilter.com/?p=187296
- https://searchengineland.com/meta-rolls-out-branded-content-on-reels-388801
- https://www.oversightboard.com/?p=5197
- https://blog.google/innovation-and-ai/products/ai-image-verification-gemini-app/
- https://sesamedisk.com/ai-content-detection-c2pa-synthid-2026/
- https://c2paviewer.com/articles/verify-ai-generated-image-c2pa-synthid
- https://www.tilleke.com/insights/thailands-advertising-guidelines-targeting-ai-generated-content/
- https://www.mondaq.com/new-technology/1759528/thailands-advertising-guidelines-targeting-ai-generated-content
- https://www.tilleke.com/insights/thai-consumer-protection-overhaul-to-address-digital-commerce-and-influencer-marketing
- https://www.rajahtannasia.com/?p=178681
- https://www.paulpoole.co.th/edm/sep25/thailand-introduces-stricter-alcohol-laws.php
- https://eucam.info/2025/09/15/new-alcohol-ad-rules-leave-industry-confused/
- https://www.bangkokpost.com/thailand/general/1931376/online-cases-spur-debate-over-alcohol-law
- https://www.tilleke.com/insights/online-pharmacies-in-thailand-insights-for-entrepreneurs-and-health-tech-enthusiasts/
- https://bangkokpost.com/life/social-and-lifestyle/2913156/profit-over-health
- https://www.tilleke.com/?p=69703
- https://www.mlex.com/mlex/articles/2525240
- https://lexbangkok.com/thailand-ai-act/
- https://blog.galalaw.com/post/102ky1l/thailand-viral-tiktok-cake-video-raises-regulatory-flags-over-deceptive-advertis
- https://bangkokpost.com/thailand/general/2306394
