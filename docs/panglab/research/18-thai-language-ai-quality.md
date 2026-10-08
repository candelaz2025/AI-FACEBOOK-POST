# คุณภาพภาษาไทยของ AI, การตัดคำไทยสำหรับ text overlay และฟอนต์ไทย OFL

> รายงานวิจัย #18 ของ PANGLAB · ค้นคว้าเมื่อ 2026-10-08 · ป้ายกำกับ: **VERIFIED** = อ่านจากหน้าแหล่งที่มาหรือบทสรุปอย่างเป็นทางการ, **INFERRED** = ข้อสรุปของผู้วิจัยหรือมาจากแหล่งทุติยภูมิที่ยังไม่ได้ยืนยัน

## สรุป
ยังไม่มีตัวเลข benchmark ภาษาไทยรุ่นปี 2026 ที่ยืนยันได้ (leaderboard ของ SEA-HELM และ HELM ThaiExam ถูก egress proxy บล็อก) ตัวเลขที่ยืนยันได้มีแค่ ThaiExam ยุค 2024 ซึ่งตอนนั้นโมเดลไทยแบบ open (Typhoon 1.5X 70B ได้ 61.7%, OpenThaiGPT 1.5 72B ได้ 63.89%) ทำได้พอ ๆ กับหรือดีกว่า GPT-4 Turbo/Claude 3 Sonnet และมีรายงานข่าวปี 2026 ที่ Google สนับสนุนว่า Gemini อันดับหนึ่งบน SEA-HELM ดังนั้น PANGLAB ควรใช้ Gemini เป็นตัวหลักต่อไป แต่ต้องมีชุดทดสอบภาษาไทยของเราเองและ “Thai style linter” ฝั่ง post-processing เพราะปัญหาที่เห็นจริงคือ “สำนวนแปล” มากกว่าความรู้ภาษา ส่วนข้อความบนภาพ หลักฐานยืนยันว่าโมเดลสร้างภาพต่างประเทศยังวาดสระ/วรรณยุกต์ไทยพลาดบ่อย จึงต้องยึด GEN-7 (overlay layer) ด้วยฟอนต์ OFL ที่ shape ผ่าน HarfBuzz และใช้ `Intl.Segmenter` หรือ ICU หาจุดตัดบรรทัด

## 1. Benchmark คุณภาพภาษาไทยของ LLM

| Benchmark | ผู้จัดทำ | วัดอะไร | ผลที่ยืนยันได้ | สถานะ |
|---|---|---|---|---|
| **ThaiExam** (บน HELM) | SCB 10X + SCBX + Stanford CRFM (ก.ย. 2024) | ข้อสอบปรนัย ONET, TGAT, TPAT-1, A-Level, Investment Consultant (IC) | 34 โมเดลไทยที่โดดเด่น: Typhoon 1.5X Instruct 70B ได้ 61.7% ชนะ GPT-4 Turbo และ Claude 3 Sonnet | VERIFIED (ผ่านบทสรุปของ SCB/CRFM; หน้า crfm.stanford.edu ถูกบล็อก) |
| **SEA-HELM** | AI Singapore (arXiv 2502.14301) | 5 เสาหลัก: NLP classics, LLM-specific, SEA linguistics, SEA culture, safety; รองรับ Thai, Filipino, Indonesian, Tamil, Vietnamese | มี leaderboard แยกตามภาษา (leaderboard.sea-lion.ai) แต่เข้าไม่ได้; SEA-LION v4.8 ใช้ SEA-HELM เวอร์ชันอัปเดต | VERIFIED (ระเบียบวิธี); ไม่มีตัวเลขไทยล่าสุด |
| ข่าว Gemini บน SEA-HELM | รายงานการใช้งาน Gemini ของ Google (ก.ค. 2026, ผ่านสื่อไทย) | — | อ้างว่า SEA-HELM จัด Gemini เป็น LLM ที่ทำได้ดีที่สุดโดยรวมในภาษา SEA รวมถึงไทย | INFERRED (แหล่งที่ Google สนับสนุน, ยังไม่ได้ยืนยันกับ leaderboard) |
| M3Exam / ชุดประเมินภายใน | OpenThaiGPT | — | OpenThaiGPT 1.5 72B: ThaiExam 63.89%, M3Exam 70.39% (รายงานเอง) | VERIFIED (ตัวเลขที่รายงานเอง ใช้ setup ต่างกัน จึงเทียบกับ 61.7% ตรง ๆ ไม่ได้) |

**วิวัฒนาการของ Typhoon (SCB 10X)** Typhoon 1 (ธ.ค. 2023, 7B) อ้างว่าเทียบเท่า GPT-3.5 ในภาษาไทย และตัด token ไทยได้มีประสิทธิภาพกว่า 2.62 เท่า ในตาราง ThaiExam ของ paper นั้น Typhoon-7B ได้ 0.442, SeaLLM-7B 0.366, OpenThaiGPT-beta-7B 0.286 และ SEA-LION-7B 0.217 (VERIFIED) ต่อมา Typhoon 2 (ม.ค. 2025) ออก 5 ขนาด context 128K และประเมินด้วย ThaiExam กับ M3Exam (VERIFIED ผ่านสรุปผลค้นหา; บล็อก scb10x.com ถูกบล็อก) รุ่นล่าสุดที่พบคือ **Typhoon2.5-Qwen3-4B** (Apache 2.0, 256K context, รองรับ function calling) แต่ไม่พบตัวเลข benchmark ภาษาไทย (VERIFIED เฉพาะ spec จาก model card บน HF)

**ข้อสรุปสำหรับ PANGLAB (INFERRED)** ตัวเลขทั้งหมดเป็นการวัด *ความรู้/ความเข้าใจ* (ข้อสอบปรนัย) ไม่ได้วัด *ความเป็นธรรมชาติของการเขียน copy* ซึ่งเป็นงานหลักของเรา benchmark สาธารณะจึงใช้ได้แค่คัดโมเดลขั้นต้น ส่วนการเลือกโมเดลจริงต้องใช้ชุด eval ของเราเอง (golden set แคปชั่นไทยที่คนไทยให้คะแนน) Typhoon/OpenThaiGPT แบบ open-weight เหมาะเป็นตัวเลือกสำรองหรือ self-host (เช่น ใช้ทำ style rewrite/คัดกรองราคาถูก) มากกว่าจะแทน Gemini ตัวหลัก

## 2. ข้อผิดพลาดของ AI ในการเขียน copy ภาษาไทย

หลักฐานที่ยืนยันได้: ประชาชาติธุรกิจรายงานว่าแม้ GPT จะอัปเกรดจาก 3/3.5 ไปจนถึง 4/4o ผู้ใช้ไทยก็ยังพบว่าการเรียบเรียงภาษาไทย “ไม่ลื่นไหล” และนี่เป็นแรงผลักให้องค์กรไทยพัฒนาโมเดลของตัวเอง (VERIFIED) งานวิจัยใน ThaiJO ที่เทียบการแปลอังกฤษเป็นไทยของ ChatGPT กับของนักศึกษาพบความคลาดเคลื่อนแบบ “ปัญหาการแปล” ทั้งสองฝั่ง (VERIFIED เฉพาะข้อค้นพบระดับหัวข้อ; ไม่มีสัดส่วน) และงานด้านวัจนปฏิบัติ (เช่น การใช้คำว่า “ไม่เป็นไร”) ชี้ว่าการใช้คำให้เหมาะกับบริบทสังคมเป็นจุดอ่อน (VERIFIED ระดับหัวข้อ)

รูปแบบที่ควรตรวจในแคปชั่น (INFERRED ซึ่งรวบรวมจากประสบการณ์ ยังไม่ได้วัดเชิงปริมาณ):

| Pitfall | ตัวอย่าง/อาการ | วิธีป้องกันใน PANGLAB |
|---|---|---|
| สำนวนแปล | “การ…/ความ…” ซ้อนกัน, “ซึ่ง”, “ทั้งนี้”, “เป็นการ…”, ประโยคขึ้นต้นด้วยประธานยาว | few-shot จากโพสต์จริงของแบรนด์ (BRAND-6) + linter นับคำต้องห้าม |
| ระดับภาษาไม่ตรงโทน | ใช้ภาษาทางการในเพจกันเอง หรือ “ครับ/ค่ะ” ปนกัน | ล็อกคำลงท้าย/สรรพนามใน Brand DNA (เช่น เรา/แอดมิน, ค่ะ) |
| แปลสำนวนอังกฤษตรงตัว | “Game changer”, “Level up” ที่แปลตรงตัวแบบแข็ง ๆ | ให้รายการคำทับศัพท์ที่อนุญาต |
| Emoji/แฮชแท็กเกิน และ hook แบบเดิมซ้ำ | “🔥✨ มาแล้ว!!” ทุกโพสต์ | จำกัดจำนวนและตรวจซ้ำกับ 20 โพสต์ล่าสุด |
| ข้อกล่าวอ้างเกินจริง | “ดีที่สุด 100%”, “หายขาด” (อาหารเสริม/เครื่องสำอาง) | GEN-10 + รายการคำต้องห้ามตามแนว อย./สคบ. |
| ตัวเลข/ราคา/วันที่ผิด | ใช้ปี ค.ศ. ปน พ.ศ., ราคาที่โมเดลแต่งขึ้นเอง | ราคาและวันที่ต้องดึงจาก product catalog (BRAND-4) เท่านั้น ห้ามให้ LLM แต่ง |
| ไม้ยมก/การเว้นวรรค | “ดีๆ” กับ “ดี ๆ” ไม่สม่ำเสมอ, เว้นวรรคผิดที่ | normalize ตามแบบที่แบรนด์เลือก |

## 3. การตัดคำ/ขึ้นบรรทัดภาษาไทยสำหรับข้อความบนภาพ

ภาษาไทยไม่เว้นวรรคระหว่างคำ ดังนั้นการตัดบรรทัดบน canvas หรือใน server renderer จึงต้องหา “จุดตัดคำ” ได้เอง เพราะ `fillText()` ไม่ตัดบรรทัดให้ (INFERRED จากพฤติกรรม API มาตรฐาน)

| ตัวเลือก | ทำงานที่ไหน | วิธีการ | สถานะ/ข้อสังเกต |
|---|---|---|---|
| `Intl.Segmenter('th', {granularity:'word'})` | Browser ยุคใหม่ / Node (ICU เต็ม) | ICU dictionary | Firefox test suite ทดสอบ word segmentation ภาษาไทย และระบุว่า word boundary ไม่ขึ้นกับ locale (VERIFIED) — ไม่ต้องลง dependency เพิ่ม |
| ICU (C/Java) ThaiBreakEngine | Server | Dictionary + heuristics, trigger ด้วย Line_Break=Complex_Context | VERIFIED; มีข้อบกพร่องที่รู้กันคือไม่เว้นหน้าไม้ยมก (U+0E46) ตามธรรมเนียมการเรียงพิมพ์ไทย จึงอาจตัดบรรทัดผิด |
| ICU4X `LineSegmenter` | Rust/WASM/TS bindings | โหลด data ไทย (dictionary หรือ LSTM) อัตโนมัติ | VERIFIED; แยก line segmenter ออกจาก word segmenter |
| PyThaiNLP `newmm` | Python | Maximal matching + Thai Character Cluster | VERIFIED; ในตัวอย่างของเอกสาร newmm กับ ICU ตัดคำต่างกัน |
| nlpO3 | Rust + Node bindings | newmm-style, เร็วกว่า Python ราว 2.5 เท่า; ใช้ dictionary `words_th.txt` (~62k คำ, CC0) | VERIFIED |
| `wordcut` (npm) | Node | Dictionary | v0.9.1 อัปเดตครั้งสุดท้าย ก.ย. 2020 → ไม่แนะนำ (VERIFIED) |

**การ shape อักษร** สระบน/ล่างและวรรณยุกต์ไทยต้องวางตาม GPOS mark positioning ของฟอนต์ ส่วน HarfBuzz Thai shaper แยกสระอำ (decompose) และจัดลำดับ mark ใหม่เอง (VERIFIED) มีรายงานบั๊กใน Figma ที่ canvas label แสดงสระ/วรรณยุกต์หลุดจากพยัญชนะ โดยคาดว่าเกิดจากไม่ได้ใช้ GPOS (VERIFIED ว่ามีรายงาน แต่สาเหตุเป็นแค่สมมติฐาน) ข้อแนะนำ (INFERRED): วาดทีละ *ข้อความ* ไม่วาดทีละตัวอักษร, normalize เป็น NFC ก่อน render, ถ้า render ฝั่ง server ด้วย Pillow ต้องเปิด raqm, หรือใช้ Skia/resvg/Chromium headless ที่มี HarfBuzz และต้องมี visual regression test ที่ครอบคลุมคำอย่าง “กี่”, “ปั้น”, “น้ำ”, “ฤๅ”, “ญี่ปุ่น”

**ข้อความที่โมเดลวาดลงภาพเอง** Marketing Oops ทดสอบ 5 โมเดลบน AiPASS ได้ผลว่า GPT-Image 2.0 อันดับ 1, Nano Banana Pro อันดับ 2, Nano Banana อันดับ 3 ส่วน Seedream ทั้งสองรุ่นอ่านไม่ออก แต่ทดสอบแค่ prompt เดียว รันครั้งเดียว (VERIFIED พร้อมข้อจำกัด) iApp (ก.ย. 2026) อ้างว่าโมเดลของตนวาดข้อความไทยถูก 33/34 ภาพ และโมเดล open ต่างชาติ 5 ตัว “ไม่มีภาพใดถูกครบ” แต่เป็นข่าวประชาสัมพันธ์ (VERIFIED ว่าอ้างไว้ ยังไม่ได้ตรวจสอบอิสระ) สรุปได้ว่าทิศทาง GEN-7 ถูกต้อง

## 4. ฟอนต์ไทย OFL บน Google Fonts สำหรับ marketing overlay

| ฟอนต์ | ผู้ออกแบบ | License | น้ำหนัก | บุคลิกสำหรับโฆษณา | หลักฐาน |
|---|---|---|---|---|---|
| **Kanit** | Cadson Demak | OFL | 100–900 + italic | หัวโฆษณาแบบไม่มีหัว ดูโมเดิร์น หนักแน่น (ใช้อยู่ใน app ปัจจุบัน) | VERIFIED (METADATA.pb, เพิ่ม 2015-12-07) |
| **Prompt** | Cadson Demak | OFL | 100–900 + italic | ไม่มีหัว กลมกว่า Kanit เหมาะกับราคา/CTA | VERIFIED (2016-06-20) |
| **Anuphan** | Cadson Demak | OFL | variable `wght` 100–700 | ไม่มีหัว ใช้ได้ทั้งหัวเรื่องและเนื้อความ, variable จึงไฟล์เล็ก | VERIFIED (2023-02-23) |
| **IBM Plex Sans Thai** (+Looped) | Mike Abbink, Bold Monday | OFL | หลายน้ำหนัก | corporate/tech | VERIFIED (2021-06-18) |
| **Noto Sans Thai Looped** | Google | OFL-1.1 | หลายน้ำหนัก | มีหัว อ่านง่าย เหมาะกับข้อความยาว/กลุ่มผู้ใหญ่ | VERIFIED (Fontsource) |
| **Sarabun, Bai Jamjuree, Chakra Petch, K2D, KoHo, Kodchasan, Mali, Niramit, Srisakdi** | ชุด National Fonts (ราชการไทยใช้ตั้งแต่ 2007) | อยู่ใน Google Fonts ตั้งแต่ 2019 | หลายน้ำหนัก | Mali = ลายมือ/น่ารัก, Chakra Petch = เทค/เกม, Sarabun = ทางการ | VERIFIED (ว่าอยู่ใน Google Fonts); license รายตัวยังไม่ได้ตรวจทีละ METADATA (INFERRED ว่าเป็น OFL) |

ข้อแนะนำ (INFERRED): ชุด preset เริ่มต้นสำหรับ BRAND-2 ควรมี 6–8 ฟอนต์ แบ่งตามบุคลิก ได้แก่ หนักแน่น (Kanit), เป็นมิตร (Prompt/Anuphan), ทางการ (Sarabun/IBM Plex Sans Thai), มีหัวอ่านง่าย (Noto Sans Thai Looped), สนุก (Mali), เทค (Chakra Petch) ควร self-host ไฟล์ฟอนต์ให้ renderer ฝั่ง server ใช้ไฟล์เดียวกับ preview ฝั่ง browser เพื่อให้ผลลัพธ์ตรงกันทุกพิกเซล และ OFL อนุญาตให้ฝัง/แจกจ่ายไปกับซอฟต์แวร์ได้ แต่ห้ามขายฟอนต์แยกเดี่ยว ๆ

## ผลต่อ PRD

| ID | การเปลี่ยนแปลงที่แนะนำ |
|---|---|
| **GEN-7** (P0) | ระบุ spec ให้ชัด: (1) render overlay ด้วย engine ที่มี HarfBuzz (Chromium headless/Skia/resvg) และใช้ไฟล์ฟอนต์เดียวกับ preview, (2) หาจุดตัดบรรทัดด้วย `Intl.Segmenter('th')` หรือ ICU4X แล้ววัดความกว้างด้วย measureText แบบ greedy โดยห้ามตัดกลางคำ, (3) normalize NFC, (4) auto-fit ลดขนาดตัวอักษรก่อนแล้วค่อยตัดบรรทัด, (5) ผู้ใช้แทรกจุดตัดเองได้ (ZWSP/Shift+Enter), (6) visual regression test ด้วยชุดคำทดสอบสระ/วรรณยุกต์ซ้อน |
| **BRAND-2** | เปลี่ยน “ฟอนต์ที่ใช้ในภาพ” ให้เป็นการเลือกจาก whitelist ฟอนต์ OFL ที่ทดสอบแล้ว (ตารางในหัวข้อ 4) ส่วนฟอนต์ที่ผู้ใช้อัปโหลดเองให้เป็น P2 และต้องยืนยันสิทธิ์การใช้ |
| **ใหม่: GEN-11 Thai copy QA** (P0) | linter หลังการ generate: คำต้องห้ามสำนวนแปล, ความสม่ำเสมอของคำลงท้าย/สรรพนาม, จำนวน emoji/แฮชแท็ก, ปี พ.ศ./ค.ศ., ราคาต้องตรงกับ catalog ผลที่ได้ป้อนเป็นส่วนหนึ่งของ **GEN-6** Brand-fit score |
| **ใหม่: NFR model eval** | สร้าง golden set ประมาณ 100 brief × 5 อุตสาหกรรม ให้คนไทยให้คะแนนความเป็นธรรมชาติ ใช้เป็น gate ก่อนเปลี่ยนรุ่น Gemini หรือก่อนเพิ่ม Typhoon/OpenThaiGPT เป็น fallback ไม่ควรเลือกโมเดลจาก ThaiExam/SEA-HELM อย่างเดียว |
| **BRAND-6 / GEN-5** | few-shot ด้วยโพสต์จริงของเพจ และเพิ่ม rewrite chip “ภาษาคนไทย/ลดสำนวนแปล” |
| **ARCHITECTURE** | แยก `overlay-renderer` service (เช่น Chromium headless/Satori+resvg) ที่ deterministic และ cache ได้ แยกจากการเรียกโมเดลภาพ ส่วนการเรียก LLM ยังอยู่ใน service layer เดียวตามแนวของ `geminiService.ts` |

## คำถามที่ยังเปิด
อันดับภาษาไทยปัจจุบันบน SEA-HELM และ HELM ThaiExam (ปี 2026) เป็นอย่างไร และ Gemini รุ่นที่เราจะใช้อยู่ตรงไหนเทียบกับ Typhoon 2.x? ต้องเปิด leaderboard.sea-lion.ai จากเครือข่ายที่ไม่ถูกบล็อก ส่วนเรื่องอื่นที่ยังไม่รู้: Typhoon 2.5 มีรุ่นใหญ่กว่า 4B หรือ API เชิงพาณิชย์พร้อม SLA หรือไม่ ราคาเท่าไร; ข้อเสนอ CLDR `th-u-lb-nodict` และปัญหาไม้ยมกใน ICU แก้แล้วหรือยัง และ Chrome/Safari ตัดบรรทัดไทยต่างกันมากแค่ไหน (ต้องทดสอบจริง); Satori ที่ใช้ Yoga + opentype.js shape อักษรไทยครบ GPOS หรือไม่ (ยังไม่ได้ตรวจสอบ ต้องทำ spike); ฟอนต์ชุด National Fonts ทุกตัวเป็น OFL จริงหรือไม่ (ตรวจ METADATA.pb ทีละตัว); และควรมี gate ให้คนตรวจ (human-in-the-loop) สำหรับอุตสาหกรรมที่ต้องผ่าน อย. หรือไม่

## แหล่งอ้างอิง
- https://crfm.stanford.edu/2024/09/04/thaiexam.html (ถูกบล็อก; ใช้บทสรุปจากผลค้นหา)
- https://www.scb.co.th/en/about-us/news/oct-2024/scb10x-standford
- https://arxiv.org/abs/2502.14301v2 (SEA-HELM)
- https://arxiv.org/pdf/2609.18310 (SEA-LION-v4.8 technical report)
- https://arxiv.org/pdf/2312.13951 (Typhoon)
- https://arxiv.org/pdf/2411.07238 (OpenThaiGPT 1.5)
- https://www.scb10x.com/en/blog/introducing-typhoon-2-thai-llm (ถูกบล็อก)
- https://huggingface.co/scb10x/typhoon2.5-qwen3-4b
- https://featherless.ai/models/scb10x/typhoon2-qwen2.5-7b-instruct/readme
- https://www.thestorythailand.com/?p=139163 (ข่าว Gemini/SEA-HELM; ถูกบล็อก ใช้บทสรุปจากผลค้นหา)
- https://www.thaipbs.or.th/now/content/4198
- https://www.prachachat.net/ict/news-1564369
- https://so04.tci-thaijo.org/index.php/joling/article/download/280774/190417/1254759
- https://so05.tci-thaijo.org/index.php/huru/article/view/277709
- https://lingo.dev/en/javascript-i18n/split-text-into-words
- https://searchfox.org/firefox-main/source/intl/lwbrk
- https://arai.searchfox.org/firefox-main/source/js/src/tests/non262/Intl/Segmenter/word.js
- https://git.saurik.com/apple/icu.git/blob/refs/heads/master:/icuSources/common/dictbe.h
- https://corp.unicode.org/pipermail/cldr-users/2014-April/000028.html
- https://corp.unicode.org/pipermail/cldr-users/2017-May/000646.html
- https://icu4x.unicode.org/2_2/cppdoc/classicu4x_1_1LineSegmenter.html
- https://depscope.dev/pkg/npm/wordcut
- https://pythainlp.readthedocs.io/en/latest/pythainlp-1-4-thai/
- https://github.com/PyThaiNLP/pythainlp/releases/tag/2.1.1
- https://lib.rs/crates/nlpo3
- https://forum.figma.com/report-a-problem-6/thai-script-rendering-broken-on-frame-names-vowels-and-tone-marks-detached-from-consonants-51323
- https://skia.googlesource.com/third_party/harfbuzz/+/0.9.5/src/hb-ot-shape-complex-misc.cc
- https://www.unicode.org/L2/L2018/18248-marks-for-thai.pdf
- https://www.relevantaudience.com/ai/th-ai-passport-aipass-image-models-thai-text-test/
- https://iapp.co.th/blog/iapp-image-generation-launch
- https://raw.githubusercontent.com/google/fonts/main/ofl/kanit/METADATA.pb
- https://raw.githubusercontent.com/google/fonts/main/ofl/prompt/METADATA.pb
- https://raw.githubusercontent.com/google/fonts/main/ofl/anuphan/METADATA.pb
- https://raw.githubusercontent.com/google/fonts/2796410152d4f9524b68ed46e69c1b60f8e0f7c3/ofl/ibmplexsansthai/METADATA.pb
- https://fontsource.org/fonts/noto-sans-thai-looped/about
- https://workspaceupdates.googleblog.com/2019/02/expanded-thai-fonts-editors.html
