# Gemini API Text Models (ตุลาคม 2026)

## สรุป
ณ 8 ต.ค. 2026 โมเดล text หลักของ Gemini API ฝั่ง Flash คือ `gemini-3.8-flash` (GA 2 ก.ย. 2026) ราคาโปรโมชัน $0.75/$3.75 ต่อ 1M tokens ถึง 31 ธ.ค. 2026 และขึ้นเป็น $1.50/$7.50 ตั้งแต่ 1 ม.ค. 2027 ส่วนตัวเลือกต้นทุนต่ำคือ `gemini-3.1-flash-lite` (GA 7 พ.ค. 2026, $0.25/$1.50) Batch API ลด 50% และ context caching มีเฉพาะ paid tier ส่วน `gemini-2.5-flash` ยังเรียกได้แต่จำกัดเฉพาะผู้ใช้เดิม และอาจมี shutdown date (ข้อมูลยังขัดกัน) ด้าน "Gemini Omni" มีจริง แต่เป็นโมเดลสร้างสื่อ (video-first) สถานะ preview ไม่ใช่โมเดล text สำหรับเขียน caption

ระดับความเชื่อมั่น: **medium** เพราะ ai.google.dev, blog.google และ 9to5google ถูก egress proxy บล็อกในรอบนี้ ตัวเลขราคาจึงมาจาก (ก) การอ่านหน้า pricing ทางการผ่าน Apify ในรอบก่อน (หน้า last updated 2026-10-07) และ (ข) search summary ที่อ้าง Google Cloud docs, DeepMind model card และ Antigravity blog ซึ่งตรงกันทั้งหมด

## รายชื่อโมเดลและ Model ID

| โมเดล | Model ID | สถานะ / วันที่ | Context / Output | สถานะการตรวจสอบ |
|---|---|---|---|---|
| Gemini 3.8 Flash | `gemini-3.8-flash` | Stable/GA, 2 ก.ย. 2026 (มีรุ่น 3.8 Flash Cyber แต่จำกัดเฉพาะภาครัฐและพาร์ทเนอร์) | 1,048,576 in / 65,536 out, knowledge cutoff มี.ค. 2026 | VERIFIED (หัวข้อโพสต์ blog.google + DeepMind model card จาก search) |
| Gemini 3.7 Flash | `gemini-3.7-flash` | GA, 13 ส.ค. 2026 | 1,048,576 / 65,536 | VERIFIED (Google Cloud docs "Launch stage: GA, Release date: August 13, 2026") |
| Gemini 3.6 Flash | `gemini-3.6-flash` | GA, 21 ก.ค. 2026 | 1M | INFERRED (แหล่งรอง เช่น chatbase, datacamp) |
| Gemini 3.5 Flash | `gemini-3.5-flash` | 19 พ.ค. 2026 (I/O) | 1M | INFERRED (แหล่งรอง) |
| Gemini 3.5 Flash-Lite | `gemini-3.5-flash-lite` | 21 ก.ค. 2026 | — | INFERRED |
| Gemini 3.1 Flash-Lite | `gemini-3.1-flash-lite` | GA 7 พ.ค. 2026 ส่วน `-preview` เลิกให้บริการบน Vertex 9 ก.ค. 2026 | — | VERIFIED (Vertex AI docs จาก search) |
| Gemini 3 Flash | `gemini-3-flash-preview` | Preview, 17 ธ.ค. 2025 **ยังไม่เคยมี GA ID `gemini-3-flash`** | 1M | VERIFIED (deprecations page จาก search) |
| Gemini 2.5 Flash | `gemini-2.5-flash` | Legacy จำกัดเฉพาะผู้ใช้เดิม | 1M | VERIFIED (deprecations page) แต่ข้อมูลยังขัดกัน ดูด้านล่าง |
| Gemini Omni Flash | `gemini-omni-flash-preview` และ `gemini-omni-1.1-flash-preview` (27 ส.ค. 2026) | Preview, generative media (video-first) | — | INFERRED (แหล่งรองทั้งหมด) |

สรุปการยืนยันตามโจทย์มีดังนี้ `gemini-3.8-flash` และ `gemini-3.7-flash` ถูกต้อง ส่วน "gemini-3-flash" **ต้องแก้** เป็น `gemini-3-flash-preview` เพราะไม่เคยมี stable ID ที่ไม่มี suffix และ GitHub Copilot deprecate "Gemini 3 Flash" ไปแล้วเมื่อ 31 ก.ค. 2026 โดยแนะนำ 3.6 Flash แทน `gemini-3.1-flash-lite` ถูกต้องในฐานะ GA ID แต่ห้ามใช้ `-preview` สำหรับ "Gemini Omni" มีจริง (ประกาศที่ I/O 19 พ.ค. 2026) แต่ไม่ใช่ text model

## ราคา (Pricing)
ราคาเป็น USD ต่อ 1M tokens ของ paid tier แบบ Standard โดย output รวม thinking tokens

| โมเดล | Input | Output | Batch | Context caching | Free tier |
|---|---|---|---|---|---|
| `gemini-3.8-flash` | $0.75 → $1.50 (ตั้งแต่ 1 ม.ค. 2027) | $3.75 → $7.50 | −50% | มี (paid) | มีตามรายงานของ Lindy (INFERRED) |
| `gemini-3.7-flash` / `gemini-3.6-flash` | $0.75 → $1.50 | $3.75 → $7.50 | −50% | มี | ไม่ยืนยัน |
| `gemini-3.5-flash` | $1.50 | $9.00 | −50% | มี | ไม่ยืนยัน |
| `gemini-3.5-flash-lite` | $0.30 | $2.50 | −50% | มี | ไม่ยืนยัน |
| `gemini-3.1-flash-lite` | $0.25 (audio $0.50) | $1.50 | $0.125 / $0.75 | $0.025 + storage $1.00/1M tok/ชม. (batch $0.0125, storage $0.50) | มี (input/output ฟรี แต่ไม่มี caching และ grounding) |
| `gemini-3-flash-preview` | $0.50 | $3.00 | −50% | มี | legacy |
| `gemini-2.5-flash` | $0.30 | $2.50 | −50% | มี | จำกัด |
| Gemini Omni Flash (preview) | $1.50 | text $9.00, video $17.50 (≈$0.10/วินาที) | ไม่มีตอน launch | — | ไม่มี |

ข้อความจากหน้า pricing ทางการ (VERIFIED ในรอบก่อน) ระบุว่าราคา 3.8, 3.7 และ 3.6 Flash เป็นอัตราชั่วคราวถึง 31 ธ.ค. 2026 และบางแหล่งแสดง $1.50/$7.50 เป็นราคาปกติที่ถูกขีดฆ่า ราคาของ 3.1 Flash-Lite, caching และ batch มาจาก search summary ของหน้า pricing ทางการ โดย batch table ที่เห็นผูกกับรุ่น preview (VERIFIED บางส่วน) Grounding with Google Search ให้ใช้ฟรี 5,000 prompts ต่อเดือน (บางรายการระบุว่าแชร์ร่วมกันทั้งตระกูล Gemini 3) จากนั้นคิด $14 ต่อ 1,000 queries ส่วนราคา Omni มาจาก eesel.ai และ aireiter.com (INFERRED) และ reseller บางราย (APIsRouter) ขาย 3.8 Flash ที่ $0.60/$3 ซึ่งไม่ใช่ราคาทางการ

## Deprecation / Shutdown

| โมเดล | สถานะ | หมายเหตุ |
|---|---|---|
| `gemini-2.5-flash` | **ขัดกัน** | tracker ภายนอกระบุ shutdown บน Gemini Developer API วันที่ 16 ต.ค. 2026 (Vertex 20 ต.ค. 2026) และให้ใช้ `gemini-3.5-flash` แทน แต่ snapshot ที่ใหม่กว่าของ deprecations page ระบุว่า 2.5 "not deprecated, served until further notice" และจำกัดการเข้าถึงเฉพาะผู้ใช้ที่เคยใช้มาก่อน |
| `gemini-2.5-flash-image` | ปิดแล้ว 2 ต.ค. 2026 (Gemini API) | บน Vertex ยังใช้ได้ถึง 15 มี.ค. 2027 ส่วน replacement เดิม `gemini-3.1-flash-image-preview` ปิดไปแล้วตั้งแต่ 25 มิ.ย. 2026 |
| `gemini-3-flash-preview` | ยังไม่ประกาศ shutdown | แนะนำให้ย้ายไป 3.5 หรือ 3.6 Flash |
| `gemini-3.1-flash-lite-preview` | ปิดบน Vertex 9 ก.ค. 2026 | ให้ใช้ GA ID แทน |

Google ระบุว่าวัน shutdown คือ "earliest possible date" จึงอาจเลื่อนออกไปได้ แต่ห้ามสมมติว่าจะเลื่อน

## Structured Output, Batch API, Context Caching
Gemini 2.5 ขึ้นไปรองรับ JSON Schema เต็มรูปแบบผ่าน `generationConfig.responseJsonSchema` ซึ่งต้องคู่กับ `responseMimeType: application/json` และห้ามส่งพร้อม `responseSchema` แบบเก่าที่รองรับเพียง OpenAPI subset Google ขยาย JSON Schema ให้ครอบคลุมทุกโมเดลที่ยัง active ตั้งแต่ พ.ย. 2025 จึงใช้ร่วมกับ Zod หรือ Pydantic ได้ตรง ๆ (VERIFIED จาก blog.google และ Vercel AI SDK PR) Gemini 3 ยังใช้ structured output ร่วมกับ built-in tools ได้ ได้แก่ Search grounding, URL Context, Code Execution และ Function Calling แต่ตัวอย่างทางการใช้ Interactions API (`response_format`) และการผสม built-in tools กับ custom functions ยังเป็น Preview (VERIFIED จาก Gemini 3 Developer Guide และหน้า tools) ยังไม่พบแหล่งที่ยืนยันว่า 3.8 Flash รองรับ structured output แต่โดยหลักการควรรองรับในฐานะ active model (INFERRED)

Batch API คิดครึ่งราคาของ Standard ทั้ง input, output และ caching เหมาะกับงาน non-realtime เช่นการสร้าง content calendar ล่วงหน้า 30 วัน Context caching คิด 10% ของราคา input (เช่น 3.1 Flash-Lite คิด $0.025 เทียบกับ $0.25) บวก storage รายชั่วโมง และไม่มีใน free tier

## Free Tier และข้อจำกัด
Free tier ไม่คิดค่า input/output แต่ Google ใช้ข้อมูลจาก free tier ไปปรับปรุงผลิตภัณฑ์ ขณะที่ข้อมูลจาก paid tier ไม่ถูกนำไปใช้ (VERIFIED จากหน้า pricing) Free tier ไม่มี context caching และ grounding ส่วน rate limit ไม่ได้ระบุเป็นตัวเลขตายตัว เพราะ Google ให้ดูใน AI Studio และไม่รับประกัน รายงานจาก Lindy ระบุว่า 3.8 Flash ใช้ได้ใน free tier (INFERRED) ส่วน Omni ไม่มี free tier

ผลต่อ PANGLAB คือ production ซึ่งประมวลผล Brand DNA และข้อมูลลูกค้า **ต้องใช้ paid tier เท่านั้น** เพื่อให้สอดคล้องกับ PDPA และคำมั่นต่อลูกค้าว่าข้อมูลของเขาจะไม่ถูกนำไปใช้เทรนโมเดล

## ผลต่อ PRD
1. **ARCHITECTURE.md (บรรทัด ~63, 71) และ PRD.md (บรรทัด ~234):** คง `gemini-3.8-flash` เป็นโมเดลเขียน caption หลัก ใช้ `gemini-3.1-flash-lite` (หรือ `gemini-3.5-flash-lite`) สำหรับงานเบา เช่น จัดหมวดหมู่ แปล สร้าง hashtag และ moderation ส่วน **`gemini-2.5-flash` ต้องเอาออกจาก fallback** เพราะจำกัดเฉพาะผู้ใช้เดิม (project ใหม่อาจเรียกไม่ได้) และอาจถูกปิดตั้งแต่ 16 ต.ค. 2026 ให้ใช้ `gemini-3.7-flash` เป็น fallback แทน
2. **Credit pricing (ดู 21-pricing-credits):** ต้องคำนวณ COGS ด้วยราคาปี 2027 ($1.50/$7.50) ไม่ใช่ราคาโปร $0.75/$3.75 เพราะราคา Flash จะเพิ่มเป็น 2 เท่าในวันที่ 1 ม.ค. 2027 และควรเพิ่ม NFR ว่าตาราง cost ต่อ credit ต้องแก้ได้ผ่าน config โดยไม่ต้อง deploy ใหม่
3. **Content calendar ล่วงหน้า:** ใช้ Batch API เพื่อลดต้นทุน 50% สำหรับคำขอ "สร้างแผน 30 วัน" ที่ไม่ต้องได้ผลทันที (SLA ภายใน 24 ชม.) และใช้ context caching กับ Brand DNA, system prompt และตัวอย่างโพสต์ที่ถูกใช้ซ้ำทุกครั้ง
4. **Structured output:** กำหนดให้ทุกการเรียกที่ต้องคืน caption หรือ calendar ใช้ `responseJsonSchema` ที่ generate มาจาก Zod schema ตัวเดียวกับที่ frontend ใช้ validate และแยก Search grounding ออกเป็นอีกขั้นหากต้องใช้ร่วมกับ custom tools เพราะการผสมสองอย่างนี้ยังเป็น Preview
5. **Model registry:** เก็บ model ID ไว้ใน config กลางแห่งเดียว พร้อม job ที่เช็ค deprecations page ทุกสัปดาห์ เพราะในปี 2026 Google ออกรุ่น Flash ใหม่ทุก 3–4 สัปดาห์ (3.5 → 3.6 → 3.7 → 3.8) และรุ่น preview ถูกปิดเร็ว
6. **Gemini Omni:** ไม่ควรใช้สำหรับงาน text ให้พิจารณาเฉพาะใน roadmap ด้านวิดีโอ (ดู 16-video-models) ที่ราว $0.10/วินาที และยังเป็น preview ไม่มี free tier และไม่มี batch จึงไม่ควรเป็น dependency ของ MVP

## คำถามที่ยังเปิด
- `gemini-2.5-flash` จะถูกปิดบน Gemini Developer API วันที่ 16 ต.ค. 2026 จริงหรือไม่ เพราะ snapshot ของ deprecations page ขัดกัน ต้องเปิดหน้าทางการตรวจเองโดยตรง
- Free tier rate limits ของ `gemini-3.8-flash` (RPM/RPD) คือเท่าใด ซึ่งตรวจได้เฉพาะใน AI Studio
- ราคา batch และ caching ของ 3.8 Flash หลังปี 2027 ยังเป็น 50% และ 10% ตามเดิมหรือไม่
- 3.8 Flash รองรับ `responseJsonSchema` ร่วมกับ Search grounding บน `generateContent` (ไม่ใช่ Interactions API) หรือไม่
- คุณภาพภาษาไทยของ 3.8 Flash เทียบกับ 3.1 Flash-Lite (ดู 18-thai-language-ai-quality)
- ID ที่ใช้ได้จริงของ Omni คือตัวไหน ระหว่าง `gemini-omni-flash-preview` กับ `gemini-omni-1.1-flash-preview`

## แหล่งอ้างอิง
- https://ai.google.dev/gemini-api/docs/pricing (อ่านรอบก่อนผ่าน Apify, last updated 2026-10-07; รอบนี้ถูกบล็อก)
- https://ai.google.dev/gemini-api/docs/deprecations (ผ่าน search summary)
- https://ai.google.dev/gemini-api/docs/changelog
- https://ai.google.dev/gemini-api/docs/latest-model
- https://ai.google.dev/gemini-api/docs/interactions/gemini-3
- https://ai.google.dev/gemini-api/docs/tools?hl=en
- https://blog.google/innovation-and-ai/models-and-research/gemini-models/3-8-flash-and-3-8-flash-cyber/
- https://blog.google/technology/developers/gemini-api-structured-outputs/
- https://deepmind.google/models/model-cards/gemini-3-8-flash/
- https://antigravity.google/blog/gemini-3-8-flash-in-google-antigravity/
- https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/gemini/3-7-flash?hl=es
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-1-flash-lite
- https://9to5google.com/2026/09/02/gemini-3-8-flash-launch/
- https://www.thurrott.com/a-i/340992/google-releases-gemini-3-8-flash-and-cyber-variant
- https://eesel.ai/blog/gemini-3-8-flash-pricing
- https://aireiter.com/blog/gemini-3-8-flash-pricing-review
- https://apisrouter.com/models/gemini-3-8-flash
- https://www.lindy.ai/blog/gemini-3-8-flash
- https://www.chatbase.co/blog/gemini-3-6-flash
- https://www.datacamp.com/blog/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber
- https://github.blog/changelog/2026-07-31-gemini-2-5-pro-and-gemini-3-flash-deprecated
- https://www.digitalapplied.com/blog/gemini-2-5-flash-image-retirement-october-2-api-vertex
- https://github.com/vercel/ai/pull/18325
- https://decrypt.co/368393
- https://rits.shanghai.nyu.edu/ai/google-introduces-gemini-omni-and-gemini-3-5-at-i-o/
- https://www.eesel.ai/blog/gemini-omni-flash-pricing
- https://www.eesel.ai/blog/gemini-omni-1-1-flash-pricing
- https://aireiter.com/blog/gemini-omni-flash-pricing-api-guide
