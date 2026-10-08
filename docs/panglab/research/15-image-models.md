# AI Image Models สำหรับภาพสินค้าการตลาด (Nano Banana 2.1 / 2 / 2 Lite / Pro vs GPT Image 2, Seedream 5.0, FLUX Kontext/FLUX.2)

## สรุป
ตระกูล Gemini "Nano Banana" ครบที่สุดสำหรับ PANGLAB: Nano Banana 2.1 (`gemini-nano-banana-2.1`, เปิดตัว 6 ต.ค. 2026) ถูกกว่า Nano Banana 2 ครึ่งหนึ่ง (~$0.0336/ภาพ 1K) และ Google จะปิด Nano Banana 2 (`gemini-3.1-flash-image`) ใน Gemini API วันที่ 29 ต.ค. 2026 จึงต้องไม่ hard-code model ID เดิม ส่วน Nano Banana Pro (`gemini-3-pro-image`) ยังเป็นตัวเลือกพรีเมียมสำหรับข้อความในภาพยาว ๆ และ non-Latin script. ไม่พบ benchmark การเรนเดอร์ภาษาไทยจากแหล่งใดเลย ข้อความไทยที่ต้องถูกต้อง 100% (ราคา, ชื่อสินค้า, คำเตือน อย.) ควร overlay ด้วยโค้ด/ฟอนต์ไทย ไม่ใช่ให้โมเดลวาด

## Gemini image models: IDs และราคา
ราคาด้านล่างมาจากหน้า pricing ทางการ `ai.google.dev/gemini-api/docs/pricing` (Last updated 2026-10-07) ที่อ่านได้ในรอบก่อน (VERIFIED, รอบนี้ ai.google.dev ถูก proxy บล็อกจึงตรวจซ้ำไม่ได้)

| ชื่อ | Model ID | Standard ต่อภาพ | Batch ต่อภาพ | สถานะ |
|---|---|---|---|---|
| Nano Banana 2.1 | `gemini-nano-banana-2.1` | 1K $0.0336 / 2K $0.0504 / 4K $0.113 | 1K $0.0168 / 2K $0.0252 / 4K $0.0567 | GA 6 ต.ค. 2026 (VERIFIED via ข่าวหลายแหล่ง) |
| Nano Banana 2 | `gemini-3.1-flash-image` (เดิม `-preview`) | 0.5K $0.045 / 1K $0.067 / 2K $0.101 / 4K $0.151 | 0.5K $0.022 / 1K $0.034 / 2K $0.050 / 4K $0.076 | ปิดใน Gemini API 29 ต.ค. 2026 (ข่าวรอง, ยังไม่เห็นหน้า deprecation ทางการ) |
| Nano Banana 2 Lite | `gemini-3.1-flash-lite-image` | 1K เท่านั้น $0.0336 | 1K $0.0168 | ใช้งานได้ (ราคายืนยันซ้ำโดย Google Cloud pricing + OpenRouter/Vercel) |
| Nano Banana Pro | `gemini-3-pro-image` (เดิม `-preview`) | 1K/2K $0.134 / 4K $0.24 | 1K/2K $0.067 / 4K $0.12 | ใช้งานได้ |
| Nano Banana (v1) | `gemini-2.5-flash-image` | $0.039 | — | legacy |

ข้อขัดแย้ง: ข่าวรอง (tech-insider, felloai ฯลฯ) ระบุราคา 4K ของ 2.1 = $0.0756 ซึ่งไม่ตรงกับ $0.113 จากหน้า pricing ทางการ ให้ยึดหน้าทางการ. Imagen ไม่ปรากฏในหน้า pricing ปัจจุบัน (INFERRED: ถูก deprecate แล้ว ซึ่งกระทบโค้ดเดิม `generateImage()` ที่ใช้ Imagen 4.0)

## ความสามารถที่เกี่ยวกับภาพสินค้า

| คุณสมบัติ | Nano Banana 2.1 | Nano Banana 2 | NB2 Lite | Nano Banana Pro |
|---|---|---|---|---|
| ภาพอ้างอิงสูงสุด | 14 (คง 4 ตัวละคร + 10 วัตถุ) | 14 (แหล่งรองแบ่งไม่ตรงกัน: 10 วัตถุ+4 คน หรือ 5 คน+14 วัตถุ) | ไม่ยืนยัน | 14 (คง 5 คน; "6 วัตถุ" มีแหล่งเดียว) |
| Resolution | ถึง 4K | 512 / 1K / 2K / 4K | 1K เท่านั้น | 1K / 2K / 4K |
| Aspect ratio | ถึง 8:1 | 1:1, 3:2, 2:3, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9, 9:21, 1:4, 4:1, 1:8, 8:1 (Vertex docs) | ~14 ratio (Replicate/fal) | ชุดมาตรฐาน 10 ratio (INFERRED) |
| Text rendering | Google อ้างว่าดีขึ้นจาก NB2 | ดี แต่อ่อนกว่า Pro ในข้อความยาว/non-Latin (zilliz) | ไม่ยืนยัน | ดีที่สุดในตระกูล, รองรับ long passage + multilingual (OpenRouter) |
| Grounding Google Search | มี | มี | ไม่ยืนยัน | มี |
| SynthID | ทุกภาพ (INFERRED จากนโยบายตระกูล) | ทุกภาพ + C2PA Content Credentials (TechCrunch) | INFERRED | ทุกภาพ |

ด้าน benchmark: Google รายงาน Elo ภาพรวม NB 2.1 = 1050, NB2 = 990, NB Pro = 935 (ข่าวรอง, ไม่ได้อ่านต้นฉบับ). หมายความว่า 2.1 น่าจะเป็น default ที่คุ้มสุด แต่ Pro อาจยังดีกว่าในงานข้อความหนาแน่น/infographic. SynthID มีรายงานว่า bypass ได้บางกรณี (BBC Verify ผ่าน aiweekly, และบล็อก "Reverse-SynthID" ที่ยังเป็นข้อกล่าวอ้าง) จึงไม่ควรใช้เป็นกลไก compliance เพียงอย่างเดียว ควรติด label "AI-generated" ของ Meta ควบคู่

## ภาษาไทยในภาพ
ไม่พบแหล่งใดทดสอบภาษาไทยโดยตรง ทั้งกับ Nano Banana 2/Pro, GPT Image 2, Seedream หรือ FLUX. รายการภาษาที่ vendor อ้างถึงคือ ญี่ปุ่น จีน เกาหลี อาหรับ โดยไม่มีไทย. zilliz ระบุว่าคุณภาพแปรผันตาม script และ script ที่มี glyph ซับซ้อนมีความน่าเชื่อถือต่ำกว่า (INFERRED: ไทยมีสระ/วรรณยุกต์ซ้อนบน-ล่าง และไม่เว้นวรรคระหว่างคำ จึงเสี่ยงต่อการตกหล่นของสระหรือวรรณยุกต์). fal.ai แนะนำแนวทาง hybrid คือให้โมเดลสร้างภาพพื้นหลัง/สินค้า แล้วใส่ข้อความที่ต้องแม่นยำทีหลังด้วยฟอนต์จริง

## เปรียบเทียบคู่แข่งสำหรับ product shot

| โมเดล | ราคาโดยประมาณต่อภาพ | Product reference / fidelity | หมายเหตุ |
|---|---|---|---|
| Nano Banana 2.1 | $0.0336 (1K) | 14 refs, 10 วัตถุ | ถูกสุดในกลุ่มคุณภาพสูง, มี batch -50% |
| Nano Banana Pro | $0.134 (1K/2K) | 14 refs | ข้อความดีสุดของ Google, แพงกว่า 4 เท่า |
| OpenAI `gpt-image-2` | token-based: 1024² low ~$0.006 / medium ~$0.053 / high ~$0.211 (image in $8, out $30 ต่อ 1M token; batch ครึ่งราคา) | high-fidelity กับ input เป็นค่าเริ่มต้น, `input_fidelity` ใช้ไม่ได้ (ส่งแล้ว 400) ตาม OpenAI cookbook; แนะนำสำหรับ identity-sensitive edit/compositing | ตัวเลขจากเว็บรองที่อ้าง OpenAI pricing (ไม่ได้อ่านหน้าทางการ) |
| ByteDance Seedream 5.0 Pro (`seedream-5-0-pro-260628`, 8 ก.ค. 2026) | $0.045 (≤2.36MP) / $0.09 (>2.36MP); Lite $0.035 | 2–10 ภาพอ้างอิง; ref แรกฟรี, ถัดไป $0.003 | ข้อมูลส่วนใหญ่จาก reseller (Atlas Cloud) ไม่ใช่ BytePlus โดยตรง |
| FLUX.1 Kontext [pro]/[max] | $0.04 / $0.08 (BFL, 1 credit = $0.01) | เด่นด้าน edit ซ้ำหลายรอบโดยคงสินค้า เช่น เปลี่ยนพื้นหลังโดยไม่แตะตัวสินค้า | ไม่รองรับ fine-tune |
| FLUX.2 [pro]/[max]/[klein] | pro $0.03/MP (t2i), $0.045/MP (edit); max $0.07/MP; klein จาก $0.014 | pro 8 refs (BFL) หรือ 10 refs (Microsoft) — ขัดกัน; ภาพอ้างอิงคิดเงินเพิ่มตาม MP | ว่ากันว่าคุมสี hex ของแบรนด์ได้แม่น (แหล่งรอง) |

ความเห็น (INFERRED): สำหรับ SME ไทยที่ขายเป็นเครดิต Nano Banana 2.1 คุ้มที่สุดต่อภาพ และอยู่ใน SDK `@google/genai` ที่โปรเจกต์ใช้อยู่แล้ว. FLUX Kontext [pro] เป็น fallback ที่ดีสำหรับ "เปลี่ยนฉากโดยไม่แตะสินค้า". GPT Image 2 เหมาะเป็น tier พรีเมียมเมื่อ fidelity ของฉลากสินค้าสำคัญที่สุด แต่ต้นทุน high quality สูงกว่า NB 2.1 ราว 6 เท่า. ยังไม่มีหลักฐานเชิงตัวเลขเปรียบเทียบ product-reference fidelity แบบ head-to-head จึงควรทดสอบเอง

## ผลต่อ PRD
1. **Model registry แทน hard-code** (ข้อเสนอ IMG-01, ใหม่): เก็บ model ID ใน config ฝั่ง server พร้อม fallback chain `gemini-nano-banana-2.1` → `gemini-3-pro-image` → `gemini-3.1-flash-lite-image`. ห้ามใช้ `gemini-3.1-flash-image` ในโค้ดใหม่ (ปิด 29 ต.ค. 2026) และต้องเลิกใช้ Imagen 4.0 ใน `services/geminiService.ts` เดิม
2. **ข้อความไทยเป็น overlay layer** (IMG-02): template ภาพโปรโมชันให้ AI สร้างเฉพาะภาพ/ฉาก แล้วเรนเดอร์ headline/ราคา/คำเตือน อย. ด้วยฟอนต์ไทย (เช่น Noto Sans Thai, Kanit) ฝั่ง client/server (canvas/Satori) แก้ไขได้ใน editor. ให้ Nano Banana Pro เขียนข้อความไทยในภาพได้เฉพาะเป็นตัวเลือก "ข้อความในภาพโดย AI (beta)" พร้อมคำเตือนให้ตรวจ
3. **ต้นทุนเครดิต** (ผูกกับ RESEARCH 21-pricing-credits): ตั้ง 1 เครดิต ≈ 1 ภาพ 1K NB 2.1 (~$0.034, ~1.2 บาท), 2K ≈ 1.5 เครดิต, 4K/Pro ≈ 4–7 เครดิต; งานตั้งเวลา/สร้างล่วงหน้าทั้งปฏิทินใช้ Batch API (-50%)
4. **Product reference workflow** (IMG-03): ให้ผู้ใช้อัปโหลดภาพสินค้า 1–3 มุมเก็บใน Brand DNA แล้วส่งเป็น reference ทุกครั้ง (ใช้โควตา ≤14 refs: สินค้า + โลโก้ + mood ref), พร้อม checklist ตรวจฉลาก/สี/รูปทรงก่อนอนุมัติ
5. **Aspect ratio presets**: 1:1 และ 4:5 (FB/IG feed), 9:16 (Stories/Reels/TikTok), 16:9 (cover/link) — ทุกโมเดลข้างต้นรองรับ
6. **AI disclosure**: SynthID/C2PA ติดมาอัตโนมัติ แต่ควรเปิด flag "AI-generated" ของ Meta และระบุใน ToS (เชื่อมกับ 11-meta-ai-content-policy) เพราะ SynthID มีรายงาน bypass ได้

## คำถามที่ยังเปิด
- ราคา 4K ของ Nano Banana 2.1 ($0.113 จากหน้าทางการ vs $0.0756 จากข่าว) — ต้องเช็กหน้า pricing อีกครั้ง
- วันปิด Nano Banana 2 (29 ต.ค. 2026) ยังไม่เห็นในหน้า deprecations ทางการ
- คุณภาพภาษาไทย (สระ/วรรณยุกต์) ของแต่ละโมเดล — ต้องทำ eval ภายใน 30–50 prompt ให้คนไทยตรวจ
- Product-reference fidelity เชิงตัวเลข (เช่น label/logo preservation) ระหว่าง NB 2.1, GPT Image 2, FLUX Kontext — ไม่มี benchmark สาธารณะที่พบ
- ราคา Seedream 5.0 Pro จาก BytePlus ทางการ และความพร้อมให้บริการ/ข้อกำหนดข้อมูลสำหรับลูกค้าไทย
- Nano Banana Pro มีรุ่น 2.x/ราคาใหม่ตามมาหรือไม่หลัง 2.1

## แหล่งอ้างอิง
- https://ai.google.dev/gemini-api/docs/pricing (รอบก่อน; รอบนี้ถูกบล็อก)
- https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/3-1-flash-image
- https://ai.google.dev/gemini-api/docs/models/gemini-3.1-flash-lite-image
- https://cloud.google.com/gemini-enterprise-agent-platform/generative-ai/pricing
- https://tech.slashdot.org/story/26/02/26/2145253/google-launches-nano-banana-2-model-with-faster-image-generation
- https://aiweekly.co/node/8739
- https://pasqualepillitteri.it/en/news/909/reverse-synthid-broken-google-ai-watermark-spectral-analysis
- https://gori.me/google/google-news/163972
- https://campaignme.com/nano-banana-2-is-now-live-on-gemini-app-and-google-search/
- https://morphic.com/zh/resources/models/nano-banana-2
- https://the-decoder.com/googles-new-image-model-nano-banana-2-1-generates-better-images-for-less-money/
- https://tech-insider.org/nano-banana-2-1-launches-halves-image-price-2026/
- https://felloai.com/nano-banana-2-1/
- https://www.testingcatalog.com/new-google-flow-build-now-points-to-nano-banana-2-1/
- https://venturebeat.com/technology/google-unveils-nano-banana-2-lite-aka-gemini-3-1-flash-lite-for-low-cost-4-second-fast-enterprise-image-generations
- https://openrouter.ai/google/gemini-3.1-flash-lite-image
- https://replicate.com/google/nano-banana-2-lite
- https://fal.ai/models/google/nano-banana-2-lite
- https://zilliz.com/ai-faq/can-nano-banana-2-accurately-render-text-and-local-languages-within-images
- https://fal.ai/learn/tools/how-to-use-nano-banana-2
- https://openrouter.ai/google/gemini-3-pro-image-preview/activity
- https://morphic.com/kr/resources/models/nano-banana-pro
- https://www.cometapi.com/how-to-use-the-nano-banana-pro-api/
- https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide
- https://aireiter.com/blog/gpt-image-2-api-pricing
- https://gate.ai/blog/gpt-image-2-openai-specs-pricing-api-use-cases
- https://docs.apiyi.com/en/api-capabilities/gpt-image-2/overview.md
- https://www.atlascloud.ai/blog/ai-updates/seedream-5-0-pro-price
- https://mer.vin/2026/07/seedream-5-0-pro-api-on-byteplus-precision-image-generation-and-multi-reference-editing/
- https://www.heyuan110.com/posts/ai/2026-07-09-seedream-5-pro/
- https://bfl.ai/pricing
- https://docs.bfl.ai/quick_start/pricing
- https://help.bfl.ai/articles/7686530342-flux-2-pricing-guide
- https://docs.bfl.ai/guides/usecases_editing_product_consistency.md
- https://techcommunity.microsoft.com/blog/azure-ai-foundry-blog/-/4477561
- https://rangy.ai/blog/best-ai-for-product-photography
