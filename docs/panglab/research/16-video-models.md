# Short-form Video Generation APIs สำหรับ PANGLAB (สถานะ ต.ค. 2026)

## สรุป
ตัวเลือกที่คุ้มที่สุดสำหรับคลิป 9:16 ยาว 8 วินาทีที่สร้างจากรูปสินค้า ยังเป็น **Veo 3.1 Lite** (ประมาณ $0.40 ต่อคลิปที่ 720p และ $0.64 ที่ 1080p) รองลงมาคือ **Veo 3.1 Fast** ($0.80–0.96) ส่วน Veo 3.1 Standard แพงกว่าประมาณ 8 เท่า ($3.20) ฝั่งที่ไม่ใช่ Google ได้แก่ Seedance 2.0 (Fast/Mini) และ Kling 3.0 ราคาใกล้กับ Veo Fast แต่ราคาที่เจอมาจาก reseller เกือบทั้งหมดและตัวเลขไม่ตรงกัน **Sora 2 API ปิดไปแล้วเมื่อ 24 ก.ย. 2026** จึงตัด Sora ออกจากตัวเลือก

> หมายเหตุวิธีวิจัย: proxy บล็อกหน้าทางการทุกหน้าที่ลองเปิด (ai.google.dev, docs.cloud.google.com, blog.google, docs.dev.runwayml.com) และ Apify ใช้ไม่ได้เพราะเกินโควตา concurrent run ตัวเลขทั้งหมดจึงมาจาก **snippet ของ search engine** ที่อ้างหน้าทางการ (ติด VERIFIED-snippet) หรือมาจากบทความ third-party/reseller (ติด INFERRED) ต้องเปิดหน้าทางการยืนยันอีกครั้งก่อนตั้งราคาจริง

## Google Veo 3.1 (Gemini API / Vertex AI)

| Tier | Model ID | ราคา/วินาที (มี audio) | คลิป 8s | 9:16 | Image-to-video | สถานะ |
|---|---|---|---|---|---|---|
| Veo 3.1 Standard | `veo-3.1-generate-001` (Vertex GA 17 พ.ย. 2025) | $0.40 (720p/1080p), $0.60 (4K) | $3.20 / $4.80 | ✅ | ✅ + reference images (เฉพาะคลิป 8s) | GA |
| Veo 3.1 Fast | `veo-3.1-fast-generate-001` (Vertex GA) | $0.10 (720p), $0.12 (1080p), $0.30 (4K) | $0.80 / $0.96 / $2.40 | ✅ (16:9, 9:16; 24fps) | ✅ | GA, ลดราคาเมื่อ 7 เม.ย. 2026 |
| Veo 3.1 Lite | `veo-3.1-lite-generate-preview` (Gemini API), `veo-3.1-lite-generate-001` (Vertex) | $0.05 (720p), $0.08 (1080p), ไม่มี 4K | $0.40 / $0.64 | ✅ (ยืนยันจากโพสต์เปิดตัวของ Google) | ✅ (T2V + I2V) | Preview ตั้งแต่ 31 มี.ค./2 เม.ย. 2026 |

ราคาทั้งสาม tier เป็น VERIFIED-snippet จาก ai.google.dev/gemini-api/docs/pricing (ผ่าน search ไม่ได้เปิดหน้าเอง) ตรงกับ tracker benchlm.ai ที่อัปเดต 11 ก.ย. 2026 ส่วน model ID ฝั่ง Vertex และวันที่ GA เป็น VERIFIED-snippet จาก docs.cloud.google.com ID `veo-3.1-lite-generate-preview` มาจาก snippet ของ Gemini API changelog (VERIFIED-snippet) Vertex เตือนว่า endpoint preview บางตัวจะถูกถอดตั้งแต่ 2 เม.ย. 2026 ดังนั้น `veo-3.1-fast-generate-preview` ที่ ARCHITECTURE.md ใช้อยู่**น่าจะเลิกใช้แล้ว** (INFERRED)

Lite รองรับความยาว 4/6/8 วินาที คิดราคาตามจำนวนวินาที และ Google วางตำแหน่งว่า "ราคาไม่ถึง 50% ของ Fast แต่เร็วเท่ากัน" (VERIFIED-snippet, blog.google) แหล่งข้อมูลยังขัดกันเรื่อง last-frame / reference images ของ Lite และเรื่องว่า audio ปิดได้หรือไม่ (INFERRED) มีกระทู้ใน discuss.ai.google.dev (พ.ค. 2026) ที่ผู้ใช้อ้างว่าโดนเก็บเงินค่า Lite สูงกว่าที่ UI แสดงถึง 8 เท่า ยังไม่ได้ยืนยัน แต่ควรเปรียบเทียบยอดใน billing กับที่ระบบคำนวณไว้ตั้งแต่สัปดาห์แรก

**Gemini Omni 1.1 Flash** (`gemini-omni-1.1-flash`) เป็นโมเดลวิดีโอตัวใหม่ของ Google รับ input เป็น text/image/video ออกคลิปยาว 3–10 วินาที และแก้ไขวิดีโอได้ ราคาราว $0.10/วินาทีที่ 720p ไม่มี free tier (INFERRED จาก eesel.ai, modelslab, muapi ซึ่งให้ตัวเลขต่างกันตั้งแต่ $0.10 ถึง $0.13 และมีบางแหล่งบอกว่าคิดราคาเป็น token) ต้นทุนใกล้กับ Veo Fast แต่ตัว Omni ยังใหม่มาก

## Kling / Seedance / Runway / Sora

| ผู้ให้บริการ | รุ่น | ราคา/วินาที | คลิป 8s (ประมาณ) | หมายเหตุ | ระดับข้อมูล |
|---|---|---|---|---|---|
| Kling (Kuaishou) | 3.0 Turbo (ราคาทางการ) | ¥0.8 (720p), ¥1 (1080p) | ≈ ¥6.4 ≈ $0.90 | ราคาเป็นหยวน ใช้กับ API ของจีน | INFERRED (อ้างถึงใน evolink) |
| Kling | 3.0 ผ่าน reseller | $0.08–0.12 (720p ปิด/เปิดเสียง, EvoLink) ถึง $0.18–0.27 (Krea std ปิด/เปิดเสียง) | $0.96–2.12 | เปิดเสียงแพงขึ้น +50%, รองรับ start/end frame แต่ไม่รองรับ reference images, ราคา 9:16 เท่ากับอัตราส่วนอื่น | INFERRED |
| Seedance (ByteDance/BytePlus ModelArk) | 2.0 / 2.0 Fast / 2.0 Mini | ทางการคิดเป็น **token** (คำนวณจากความยาว × กว้าง × สูง × fps ÷ 1024) คลิป 5s 720p ≈ $0.76 / $0.60 / $0.38 | ≈ $1.22 / $0.96 / $0.61 (คิดแบบแปรผันตามความยาว) | ไม่เก็บเงินถ้า gen ไม่สำเร็จหรือติด moderation, Seedance 2.5 ประกาศแล้ว | INFERRED (yingtu.ai อ้างหน้า BytePlus 5 ก.ค. 2026), สูตร billing เป็น VERIFIED-snippet |
| Seedance | 2.0 ผ่าน Atlas Cloud | $0.112 / $0.09 / $0.056 | $0.90 / $0.72 / $0.45 | reseller | INFERRED |
| Runway API | gen4_turbo | 5 credits/s × $0.01 = $0.05 | $0.40 (ความยาวจริงคือ 5 หรือ 10s, INFERRED) | ไม่มี audio | VERIFIED-snippet (docs.dev.runwayml.com) |
| Runway API | veo3.1 / veo3.1_fast (มีเสียง) | 40 / 15 credits/s = $0.40 / $0.15 | $3.20 / $1.20 | ปิดเสียงถูกลงครึ่งหนึ่ง, Fast ผ่าน Runway แพงกว่าเรียก Google ตรง | VERIFIED-snippet |
| Runway API | Gen-4.5 | 12 credits/s = $0.12 | $0.96 | ไม่อยู่ในตารางทางการที่ snippet แสดง | INFERRED |
| OpenAI | sora-2 / sora-2-pro | เคยเป็น $0.10 / $0.30–0.70 | — | **ประกาศปิด 24 มี.ค. 2026, แอปปิด 26 เม.ย., API ปิด 24 ก.ย. 2026** ไม่มีรุ่นทดแทน | VERIFIED-snippet (help.openai.com) + รายงานหลังวันปิด 1 แหล่ง |

## เปรียบเทียบต้นทุนต่อคลิป 8 วินาที (9:16, image-to-video จากรูปสินค้า)

| ตัวเลือก | 720p | 1080p | มี audio ในตัว | เหมาะกับ |
|---|---|---|---|---|
| Veo 3.1 Lite | **$0.40** | $0.64 | ✅ | ค่าเริ่มต้นสำหรับเครดิตแพ็กทั่วไป |
| Seedance 2.0 Mini (reseller) | ~$0.45–0.61 | — | ยังไม่ยืนยัน | ผู้ให้บริการสำรองที่ถูก |
| Veo 3.1 Fast | $0.80 | $0.96 | ✅ | tier "คมชัดขึ้น" |
| Gemini Omni 1.1 Flash | ~$0.80 | ~$1.56 (muapi) | ✅ (บอกว่า audio ไม่คิดเพิ่ม) | ทดลองใช้แก้ไข/รีมิกซ์วิดีโอ |
| Kling 3.0 | ~$0.90–2.12 | สูงกว่านี้ | ✅ (+50%) | ผู้ให้บริการสำรอง |
| Seedance 2.0 / Fast | ~$0.72–1.22 | ~$3.0 (คิดแปรผันจาก $1.87/5s) | ✅ (มีอัตราตาม audio) | ผู้ให้บริการสำรอง |
| Veo 3.1 Standard | $3.20 | $3.20 | ✅ | ไม่คุ้มสำหรับ SME |

ตัวเลขที่ระบุว่า "คลิป 8s" ได้มาจากการเอาราคาต่อวินาทีคูณ 8 (INFERRED) ทุกเจ้าคิดเงินจากวินาทีที่สร้างออกมา ส่วนอัตราส่วน 9:16 ไม่มีผลต่อราคาเลย

## ผลต่อ PRD
1. **GEN-8 / ตารางเครดิต (PRD.md บรรทัด ~182):** ตัวเลข "วิดีโอ 8s 720p = 5 เครดิต ≈ $0.40 (Veo 3.1 Lite)" ยังตรงกับราคาปัจจุบัน แนะนำให้แยกเพิ่มอีก 2 tier คือ "วิดีโอ HD 1080p (Lite)" ประมาณ 8 เครดิต ($0.64) และ "วิดีโอพรีเมียม (Fast 1080p)" ประมาณ 12 เครดิต ($0.96) ให้ระบุใน GEN-8 ด้วยว่าใช้ **image-to-video โดยเอารูปสินค้าเป็น first frame** และความยาวเลือกได้ 4/6/8 วินาที (ราคาลดตามความยาว)
2. **ARCHITECTURE.md บรรทัด 69 (Video Producer):** เปลี่ยน `veo-3.1-fast-generate-preview` เป็น ID ระดับ GA (`veo-3.1-fast-generate-001` บน Vertex หรือ ID ระดับ stable ที่ Gemini API ใช้อยู่ตอนนั้น) แล้วเก็บ `veo-3.1-lite-generate-preview` ไว้เป็นค่า default ใน `model_registry` พร้อมตั้ง flag ว่าเป็น preview และเพิ่มคอลัมน์ `price_per_sec`, `supports_9x16`, `supports_i2v`, `audio` เพื่อให้คิดเครดิตจากข้อมูลจริงได้
3. **Fallback provider:** เพิ่ม adapter สำรอง 1 เจ้าที่ไม่ใช่ Google (แนะนำ Seedance 2.0 Fast/Mini หรือ Kling 3.0 ผ่าน aggregator ตัวเดียว) ไว้ใช้ตอน Veo ล่มหรือโดนถอด ให้ลบ Sora ออกจากทุกแผน และใส่เรื่อง "Sora ถูกปิดภายใน 6 เดือน" ไว้ในตารางความเสี่ยง (PRD บรรทัด ~231) เป็นตัวอย่างที่ยืนยันว่าต้องมี model registry
4. **Billing safety:** จองเครดิตไว้ก่อนเรียก API แล้วตัดจริงเมื่อได้วิดีโอแล้วเท่านั้น (คืนเครดิตถ้า fail หรือติด moderation ซึ่งตรงกับวิธีคิดเงินของ Seedance) เก็บ log ว่าต้นทุนจริงต่อ job เป็นเท่าไรเพื่อจับกรณีที่ billing ไม่ตรง (เช่นกระทู้ Lite ที่อ้างว่าโดนคิด 8 เท่า) และตั้ง budget alert ใน GCP
5. **UX:** การสร้างวิดีโอเป็นงาน async (polling) ต้องมีสถานะ "กำลังสร้างวิดีโอ…" และแจ้งเตือนเมื่อเสร็จ แนะนำให้ค่าเริ่มต้นของเสียงเป็นดนตรีหรือ SFX บวก caption ภาษาไทยแบบ overlay แทนบทพูดภาษาไทยที่ AI สร้างเอง จนกว่าจะทดสอบคุณภาพเสียงพูดภาษาไทยผ่าน

## คำถามที่ยังเปิด
- ตอนนี้ Veo 3.1 Lite ใน Gemini API ยังเป็น preview อยู่หรือเป็น GA แล้ว และ ID ที่เสถียรคืออะไร (หน้า docs ถูก proxy บล็อก)
- audio ของ Lite ปิดได้ไหม และถ้าปิดจะถูกลงหรือเปล่า (Runway แสดงว่า Veo 3.1 แบบไม่มีเสียงถูกกว่าครึ่งหนึ่ง)
- Veo/Seedance/Kling สร้างบทพูด**ภาษาไทย**ได้ดีแค่ไหน และรักษาโลโก้/ฉลากสินค้าในภาพแรกได้แม่นแค่ไหน ต้องทดสอบจริง
- Lite รองรับ reference images (หลายภาพ) หรือ last frame หรือไม่ (แหล่งข้อมูลขัดกัน)
- ราคา Kling 3.0 สำหรับลูกค้านอกจีนและราคา Seedance 2.0 แบบ USD/วินาทีบน BytePlus หาจากหน้าทางการไม่ได้
- ราคาและ model ID ของ Gemini Omni 1.1 Flash ที่เป็นทางการ และเทียบกับ Veo Lite แล้วคุ้มกว่าหรือไม่

## แหล่งอ้างอิง
- https://ai.google.dev/gemini-api/docs/pricing (snippet ผ่าน search, fetch ตรงถูกบล็อก)
- https://ai.google.dev/gemini-api/docs/changelog (snippet)
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/veo/3-1-generate (snippet)
- https://blog.google/innovation-and-ai/technology/ai/veo-3-1-lite/ (snippet)
- https://9to5google.com/?p=710130
- https://benchlm.ai/media-pricing/veo
- https://discuss.ai.google.dev/t/misleading-ui-for-veo-3-1/147250
- https://www.glbgpt.com/hub/how-much-is-veo-3-1-subscription-cost/
- https://framesurfer.com/blogs/veo-3-pricing
- https://www.krea.ai/docs/api-reference/video/veo-31-lite.md
- https://www.mindstudio.ai/models/veo-3-1-lite
- https://www.cometapi.com/what-is-google-veo-3-1-lite/
- https://www.eesel.ai/blog/gemini-omni-1-1-flash-pricing
- https://modelslab.com/models/google/gemini-omni-image-to-video
- https://muapi.ai/playground/gemini-omni-text-to-video
- https://www.orcarouter.ai/blog/gemini-omni-1-1-flash-launch
- https://www.krea.ai/blog/kling-3-0-api-access-guide-pricing-code-examples-for-multi-shot-ai-video
- https://evolink.ai/kling-3-0-turbo
- https://evolink.ai/blog/kling-3-o3-api-official-discount-pricing-developers
- https://apiframe.ai/blog/kling-3-0-api-providers
- https://zalify.com/ai-models/kling-3-0
- https://docs.byteplus.com/docs/ModelArk/1544106 (snippet)
- https://yingtu.ai/en/blog/seedance-2-pricing-free-vs-paid-guide
- https://www.atlascloud.ai/blog/guides/seedance-2-cost-per-second
- https://www.atlascloud.ai/blog/guides/seedance-2-5-api-atlas-cloud-pricing-availability-quickstart
- https://docs.dev.runwayml.com/guides/pricing (snippet)
- https://creatify.ai/blog/runway-pricing-(2026)-plans-credits-and-what-you-ll-actually-pay
- https://help.openai.com/en/articles/20001152-what-to-know-about-the-sora-discontinuation (snippet)
- https://unifically.com/blogs/sora-api
- https://ecorpit.com/sora-2-videos-api-shutdown-migration-cost-2026/
- https://alternativeto.net/news/2026/3/openai-is-shutting-down-sora-its-ai-video-slop-app-less-than-six-months-after-launch
