# Multi-agent Architecture สำหรับ PANGLAB: Orchestrator, Critic Loop, LLM-as-Judge, Observability, Evals

> Research report 28/30 · 2026-10-08 · ป้ายกำกับ: **VERIFIED** = อ่านจากหน้าต้นทางหรือสรุปของแหล่งทางการ · **INFERRED** = อนุมานหรือมาจากแหล่งรอง
> ข้อจำกัด: proxy บล็อก `google.github.io` (ADK docs) และ `developers.googleblog.com` ข้อมูลส่วน Google ADK จึงมาจากผลค้นหาและแหล่งรอง

## สรุป
แนวปฏิบัติจาก Anthropic ชี้ว่าระบบที่ดีส่วนใหญ่เป็น **workflow ที่กำหนด code path ไว้** มากกว่า agent อิสระ และ multi-agent กิน token ราว 15 เท่าของ chat ดังนั้น ARCHITECTURE.md §3 ควรเรียก Quick Post ว่าเป็น prompt chain + evaluator-optimizer ไม่ใช่ orchestrator แบบ dynamic และใช้ LLM วางแผนเฉพาะตอนสร้าง Campaign จุดที่เสี่ยงที่สุดคือ **QA Critic ที่ให้คะแนน brand_fit 0–100 ด้วยโมเดลตระกูลเดียวกับ Copywriter** ซึ่งเจอทั้ง self-preference bias, คะแนนสเกลกว้างที่แกว่ง และการแก้ตัวเองที่ไม่ได้ผลถ้าไม่มี feedback ภายนอก ควรเปลี่ยนเป็น checklist แบบ pass/fail รายเกณฑ์ (deterministic ก่อน แล้วจึงใช้ LLM) ที่ calibrate กับป้ายกำกับจากคน แล้วค่อยคำนวณเป็นคะแนน 0–100 สำหรับแสดงผล

## 1. Orchestrator / Planner-Worker patterns

Anthropic "Building effective agents" (19 ธ.ค. 2024) แยก **workflow** (LLM กับ tool ทำงานตาม code path ที่เขียนไว้) ออกจาก **agent** (LLM เลือกขั้นตอนและ tool เอง) และให้ 5 รูปแบบ ดังตาราง (VERIFIED) บทความแนะนำให้ "หาทางที่ง่ายที่สุดก่อน แล้วเพิ่มความซับซ้อนเมื่อจำเป็นเท่านั้น" และให้เพิ่มความซับซ้อน "เฉพาะเมื่อมันทำให้ผลลัพธ์ดีขึ้นอย่างพิสูจน์ได้" นอกจากนี้ยังเตือนว่า framework อาจซ่อน prompt และ response จนดีบักยาก จึงแนะนำให้เริ่มจากเรียก API ตรง (VERIFIED)

| Pattern (Anthropic) | ใช้เมื่อ | ตรงกับส่วนไหนของ PANGLAB |
|---|---|---|
| Prompt chaining | งานแบ่งเป็นขั้นตายตัว ยอมแลก latency เพื่อความแม่น | Quick Post: copy → brief → image → overlay → review |
| Routing | input แบ่งเป็นหมวดได้ หรือส่งงานง่ายไปโมเดลถูก | เลือกโมเดลตาม format/tier (Flash vs Pro image) |
| Parallelization (sectioning / voting) | งานย่อยอิสระ หรืออยากได้หลายมุมมอง | fan-out ต่อ plan item, caption variants, judge หลายเกณฑ์พร้อมกัน |
| Orchestrator-workers | งานย่อยคาดเดาล่วงหน้าไม่ได้ | สร้าง ContentPlan ของ Campaign (จำนวน/ชนิดโพสต์ขึ้นกับ goal) |
| Evaluator-optimizer | มีเกณฑ์ประเมินชัดเจน และการแก้ซ้ำช่วยได้จริง | QA Critic → revise |

บทความ "How we built our multi-agent research system" (13 มิ.ย. 2025) ให้ตัวเลขต้นทุนว่า agent ใช้ token ราว **4 เท่า** และ multi-agent ราว **15 เท่า** ของ chat และระบุว่า multi-agent ไม่เหมาะกับงานที่ทุก agent ต้องแชร์ context เดียวกันหรือพึ่งพากันมาก (VERIFIED) งานเขียนโพสต์หนึ่งชิ้นเข้าข่ายนี้ เพราะ caption, ภาพ และ overlay ต้องสอดคล้องกัน จึงควรเป็น workflow แบบลำดับขั้นมากกว่า agent ที่คุยกันเอง (INFERRED)

Google ADK มี workflow agent พื้นฐาน 3 ตัว ได้แก่ `SequentialAgent` (ลำดับตายตัว), `ParallelAgent` (รันพร้อมกันแล้วรอทุก branch) และ `LoopAgent` (วนจนเข้าเงื่อนไขหยุด ใช้ทำ critique-refine) แหล่งรองเตือนว่า sub-agent ที่รันขนานกันแชร์ session state จึงควรเขียนผลลง key แยกกันเพื่อกัน race condition ส่วนการหยุด loop ด้วย `max_iterations` และ `escalate` มาจากความรู้เดิมของผลค้นหา ยังไม่ได้ยืนยันกับเอกสารทางการ (INFERRED เพราะ proxy บล็อกหน้า docs) สำหรับ PANGLAB ซึ่งใช้ TypeScript + Inngest อยู่แล้ว `step.run` / `step.invoke` ให้ทั้ง durability, retry และ fan-out ครบ จึงไม่จำเป็นต้องใช้ ADK แต่ยืม pattern มาได้ (INFERRED)

## 2. Critic / Reviewer (Evaluator-Optimizer) loops

| งานวิจัย | ข้อค้นพบ | สถานะ |
|---|---|---|
| Self-Refine (Madaan et al., NeurIPS 2023) | ให้โมเดลเดียวกันเขียน วิจารณ์ และแก้ซ้ำ ได้ผลดีขึ้นราว 20% absolute เฉลี่ยใน 7 งาน และคนชอบผลลัพธ์มากกว่าการเขียนรอบเดียว | VERIFIED (abstract) |
| LLMs Cannot Self-Correct Reasoning Yet (Huang et al., ICLR 2024) | การแก้ตัวเองแบบ intrinsic (ไม่มี feedback ภายนอก) มักไม่ช่วย และบางครั้งทำให้ผลแย่ลง ผลบวกบางส่วนในงานก่อนหน้ามาจากการใช้ oracle label | VERIFIED (abstract) / รายละเอียด INFERRED |
| Anthropic | evaluator-optimizer เหมาะเมื่อ "มีเกณฑ์ประเมินชัดเจน" และการแก้ซ้ำช่วยได้อย่างวัดผลได้ | VERIFIED |

สำหรับ PANGLAB ข้อสรุปคือ loop จะคุ้มเมื่อ critic ส่ง **feedback ที่เจาะจงและมาจากภายนอก** กลับไป เช่น "ใช้คำต้องห้าม 'รักษาหาย' ในบรรทัด 2", "ไม่มี CTA", "ราคาไม่ตรงกับ products.price" ไม่ใช่สั่งว่า "ทำให้ตรงแบรนด์ขึ้น" การจำกัดไว้ 1 รอบตาม ARCHITECTURE.md ถือว่าสมเหตุสมผลด้านต้นทุน แต่ควรเก็บสถิติว่ารอบที่แก้ทำให้ผ่านจริงกี่เปอร์เซ็นต์ (INFERRED)

## 3. LLM-as-Judge reliability สำหรับ brand-fit scoring

Zheng et al. (NeurIPS 2023, MT-Bench/Chatbot Arena) รายงานว่า judge ที่แข็งแรงอย่าง GPT-4 เห็นตรงกับคน **เกิน 80%** ซึ่งใกล้ระดับที่คนเห็นตรงกันเอง (VERIFIED จาก abstract) แต่ก็พบ bias หลายแบบ ตัวเลขในตารางมาจากแหล่งรอง ต้องตรวจกับตัว paper ก่อนอ้างต่อ

| Bias | อาการ | ผลต่อ brand_fit ของ PANGLAB | วิธีลด |
|---|---|---|---|
| Position bias | เอนเอียงไปทางคำตอบที่อยู่ก่อน | ตอนเลือก caption variant A/B | สลับลำดับแล้วตัดสินสองครั้ง ถ้าไม่ตรงกันให้นับเสมอ (ข้อเสนอใน paper) |
| Verbosity bias | ชอบคำตอบที่ยาวกว่า แม้เนื้อหาเท่าเดิม | caption ยาวได้คะแนนสูงเกินจริง | กำหนดเกณฑ์ความยาวแบบ deterministic แยกออกมา |
| Self-enhancement | ให้คะแนนผลงานของตัวเองสูงกว่า (แหล่งรองรายงาน GPT-4 ราว +10%, Claude-v1 ราว +25%) | Critic และ Copywriter เป็น Gemini Flash ทั้งคู่ | ใช้ judge ต่างรุ่น/ต่างตระกูล หรือ calibrate กับคน |
| Limited reasoning | ตรวจคณิต/ตรรกะพลาด | ตรวจราคา โปรโมชัน ส่วนลด % | ใช้ reference-guided หรือตรวจด้วยโค้ด |

**สเกลคะแนน:** Hamel Husain (สรุปโดย Simon Willison, ต.ค. 2024) แนะนำว่าไม่ควรใช้สเกล 1–5 แต่ให้ใช้ **pass/fail + critique เขียนอธิบาย** โดยมี domain expert คนเดียวเป็นผู้ให้ป้ายกำกับ (critique shadowing) แล้วนำ critique ไปทำ few-shot ให้ judge และวัด agreement กับ expert (INFERRED เพราะอ่านจากบทสรุป ไม่ใช่โพสต์ต้นฉบับ) ข้อโต้แย้งคือมีงานวิจัยปี 2026 (arXiv 2601.03444) รายงานว่าสเกล 0–5 ให้ alignment กับคนดีที่สุดเมื่อรวมหลายงาน (INFERRED จากผลค้นหา) ข้อสรุปที่ปลอดภัยคือให้ทดลองกับป้ายกำกับของตัวเอง แต่ **สเกล 0–100 ที่ LLM พ่นออกมาตรง ๆ เป็นตัวเลือกที่แกว่งที่สุด** (INFERRED) Anthropic เองพบว่า judge ที่ให้คะแนน 0.0–1.0 พร้อม pass/fail ในการเรียกครั้งเดียวตาม rubric ให้ผลสม่ำเสมอและใกล้คนที่สุด แต่ judge ทำงานได้ดีที่สุดเมื่อมีคำตอบที่ถูกชัดเจน (VERIFIED) ส่วน "ตรงแบรนด์" เป็นเรื่องอัตวิสัย จึงต้องแตกเป็นเกณฑ์ย่อยที่ตอบได้ชัด

**โครง brand-fit ที่เสนอ (INFERRED):**

| ชั้น | ตรวจอะไร | วิธี | ผล |
|---|---|---|---|
| L0 Deterministic | dont_words, คำต้องห้าม อย./โฆษณาเกินจริง, ความยาว, จำนวน hashtag, มี CTA, ราคา/ชื่อสินค้าตรง DB | regex/โค้ด | fail = revise ทันทีพร้อมเหตุผลเจาะจง |
| L1 LLM rubric | voice ตรง Brand DNA, audience, USP, ความเป็นธรรมชาติของภาษาไทย, hook | judge 1 call, structured output, pass/fail ต่อเกณฑ์ + เหตุผล | เหตุผล 1–3 ข้อแสดงใน UI (GEN-6) |
| L2 Vision | สินค้าในภาพตรงต้นฉบับ, ข้อความ overlay อ่านออก, สีตรง palette | vision judge + (อนาคต) image similarity กับ cutout | flag ให้คนตรวจ |
| คะแนน | 0–100 = ผลรวมถ่วงน้ำหนักของเกณฑ์ที่ผ่าน | โค้ด | ทำซ้ำได้ อธิบายได้ |

## 4. Structured outputs

Google ประกาศ (พ.ย. 2025) ว่า Gemini API รองรับ **JSON Schema** บนทุกโมเดลที่ยังให้บริการ ทำให้ใช้ Zod/Pydantic ได้ตรง รองรับ `anyOf`, `$ref`, `minimum`/`maximum`, `additionalProperties`, `type: 'null'`, `prefixItems` และ Gemini 2.5 ขึ้นไปจะเรียงลำดับ key ตาม schema (VERIFIED จากสรุปบล็อกทางการ) เอกสาร Vertex เตือนว่า schema ที่ซับซ้อน (ชื่อ property ยาว, enum ยาว, optional เยอะ) อาจทำให้ได้ `400 InvalidArgument` และต้องตั้ง `response_mime_type: application/json` คู่กับ schema (VERIFIED จากสรุปเอกสารทางการ) ข้อแนะนำคือนิยาม schema ของทุก agent ด้วย Zod ที่เดียว แปลงเป็น JSON Schema ส่งให้โมเดล และ validate ซ้ำฝั่ง server เสมอ ถ้าไม่ผ่านให้ retry 1 ครั้งแล้ว fail พร้อมคืนเครดิต (INFERRED) ควรให้ field `reasons` อยู่ก่อน `verdict`/คะแนนใน schema ของ Critic เพื่อให้โมเดลเขียนเหตุผลก่อนตัดสิน ซึ่งทำได้เพราะลำดับ key ตาม schema (INFERRED)

## 5. Cost control

| กลไก | ข้อเท็จจริง | สถานะ | ใช้กับ PANGLAB |
|---|---|---|---|
| Batch API | ราคา 50% ของปกติ, เป้า turnaround 24 ชม., retry อัตโนมัติใน 24 ชม., JSONL สูงสุด 2GB | VERIFIED (Gemini optimization docs ผ่านผลค้นหา) | ใช้กับงานที่ไม่ต้องรอ เช่น สร้าง campaign ล่วงหน้าข้ามคืน และ eval offline **ห้าม**ใช้กับ Quick Post ที่ผู้ใช้รอดู |
| Implicit caching | cache hit อัตโนมัติเมื่อ prefix ซ้ำ บน Gemini 2.5+; ส่วนลดปัจจุบัน 90% (ประกาศแรกปี 2025 บอก 75%) | VERIFIED (ข้อมูลขัดกัน ใช้ตัวเลขใหม่) | วาง system prompt + Brand DNA เป็น prefix คงที่ ใส่ส่วนที่เปลี่ยนไว้ท้าย |
| Explicit caching | ส่วนลด 90% บน 2.5+ แต่มีค่า storage | VERIFIED | อาจคุ้มกับ Campaign ที่ fan-out หลายโพสต์ต่อแบรนด์เดียว |
| Batch + cache | ส่วนลดไม่ทบกัน cache hit ได้ราคา cache | VERIFIED (Vertex docs) | คิดต้นทุนแบบไม่ทบ |
| ขนาดขั้นต่ำของ cache | 1,024–4,096 token แล้วแต่โมเดล (ตัวเลขเปลี่ยนบ่อย) | INFERRED | Brand DNA สั้นอาจไม่ถึงเกณฑ์ ต้องวัดจริง |
| Multi-agent overhead | multi-agent ใช้ token ~15 เท่าของ chat | VERIFIED (Anthropic) | อย่าเพิ่ม agent ที่ไม่มีหน้าที่ชัด |

Worst case ของ Quick Post 1 ชิ้นคือ copy (2 variants) + brief + image + review + revise 1 รอบ (copy/image ซ้ำ) + review ซ้ำ ดังนั้นตอน reserve เครดิตต้องคิดเผื่อ worst case ส่วนต้นทุนจริงต่อ run บันทึกใน `agent_runs.cost_usd` แล้ว reconcile รายสัปดาห์กับราคาเครดิต (INFERRED)

## 6. Observability (Langfuse ฯลฯ)

Langfuse เป็น open-source (core MIT) รวม tracing, prompt management, datasets และ evaluation ไว้ด้วยกัน self-host ได้ฟรีโดยไม่จำกัดฟีเจอร์ core สร้างบน OpenTelemetry trace ได้ทั้ง LLM call และ non-LLM step รวมต้นทุนต่อ session/user และรัน LLM-as-judge evaluator บน production trace ได้ (VERIFIED บางส่วนจากหน้า pricing-self-host ผ่านผลค้นหา ที่เหลือ INFERRED จากรีวิว) ข้อควรระวังคือ self-host ต้องใช้ web + worker + Postgres + ClickHouse + Redis/Valkey + S3 ซึ่งหนักสำหรับทีมเล็ก Langfuse Cloud คิดเงินตาม "unit" ไม่ใช่ trace และ agent run เดียวอาจกินหลาย unit ราคา tier จากเว็บรวบรวมข้อมูลขัดกัน ต้องเช็คหน้าทางการ (INFERRED) มีรายงานจากแหล่งรองว่า ClickHouse ซื้อกิจการ Langfuse ในปี 2026 และ core ยังเป็น MIT (INFERRED ยังไม่ยืนยัน)

| ตัวเลือก | จุดเด่น | จุดอ่อน | เหมาะกับ |
|---|---|---|---|
| Langfuse Cloud | เริ่มเร็ว, eval + prompt versioning ในตัว | billing ตาม unit, data อยู่นอก region SG? (ต้องเช็ค PDPA) | MVP |
| Langfuse self-host | ข้อมูลอยู่ในมือ, ไม่จำกัดฟีเจอร์ core | ops หนัก (ClickHouse ฯลฯ) | หลังมีรายได้/ลูกค้า enterprise |
| OTel → Sentry/Grafana อย่างเดียว | ใช้ของที่มีอยู่ | ไม่มี eval/prompt mgmt | ไม่พอสำหรับ GEN-6 |
| Helicone (ทางเลือกใน ARCH) | proxy-based ติดง่าย | ไม่ได้ค้นในรอบนี้ | — |

โครง trace ที่เสนอ (INFERRED): 1 trace = 1 `agent.run` (Inngest run id) · 1 span = 1 `step.run` · 1 generation = 1 model call พร้อม `model_id`, `prompt_version`, tokens, cost · tag ด้วย `workspace_id`, `brand_id`, `post_id` · score ของ Critic และผลอนุมัติของคน (approve/edit/reject) ส่งเป็น score กลับเข้า trace เดียวกัน · mask PII (เบอร์โทร, ชื่อลูกค้า) ก่อนส่ง Anthropic เองเลือก monitor รูปแบบการตัดสินใจโดยไม่อ่านเนื้อหาบทสนทนาแต่ละรายการเพื่อความเป็นส่วนตัว (VERIFIED) ซึ่งเป็นแนวที่ควรใช้ร่วมกับ PDPA

## 7. Evals

Anthropic เริ่ม eval ของ multi-agent research ด้วยเพียง **~20 query จากการใช้งานจริง** และย้ำว่ายังต้องมีคนทดสอบเพื่อจับ edge case (VERIFIED) แนวของ Hamel คือให้ expert ติดป้าย pass/fail พร้อม critique ก่อน แล้วจึงสร้าง judge และวัด agreement (INFERRED จากบทสรุป) แผนที่เสนอสำหรับ PANGLAB (INFERRED):

| ชั้น eval | ชุดข้อมูล | ตัววัด | ใช้เมื่อ |
|---|---|---|---|
| Golden set | 30–50 brief จริงจาก beta แยก 5–6 อุตสาหกรรม (อาหาร, ความงาม/อย., แฟชั่น, คลินิก ฯลฯ) | L0 pass rate, L1 rubric pass rate, schema validity | ทุกครั้งที่เปลี่ยน prompt หรือแถวใน `model_registry` (CI gate) |
| Judge calibration | 100–200 โพสต์ที่ expert ไทย 1 คนติดป้าย pass/fail + เหตุผล | agreement / Cohen's kappa ระหว่าง judge กับคน | ก่อนเปิด GEN-6 และทุกไตรมาส |
| Online signal | ทุกโพสต์ใน approval flow | approve-as-is rate, edit distance ระหว่าง caption ที่สร้างกับที่อนุมัติ, reject reason | dashboard รายสัปดาห์ |
| Business outcome | โพสต์ที่ publish แล้ว | engagement เทียบกับ brand_fit (score ทำนายผลได้หรือไม่) | Phase 2 |

การอนุมัติหรือแก้ไขของผู้ใช้คือป้ายกำกับฟรี ควรเก็บ diff ไว้ทุกครั้ง (INFERRED)

## 8. วิจารณ์ ARCHITECTURE.md §3

| # | สิ่งที่ §3 เขียน | ประเด็น | ข้อเสนอ |
|---|---|---|---|
| 1 | "Orchestrator เป็นตัววางแผนและแจกงาน" ครอบทุก flow | Quick Post มีลำดับตายตัว (§3.1) จึงเป็น prompt chaining ไม่ใช่ orchestrator-workers ถ้าเรียก LLM Orchestrator ทุกครั้งจะเสียต้นทุนและ latency โดยไม่ได้อะไร | ใช้ LLM Orchestrator เฉพาะ Campaign (สร้าง `ContentPlan`) ส่วน Quick Post เป็น Inngest workflow ล้วน แก้คำอธิบายให้ตรง pattern ของ Anthropic |
| 2 | QA Critic = Gemini Flash (vision) เหมือน Copywriter | self-enhancement bias และ judge ที่ไม่ calibrate | แยก `model_registry.role = judge` ให้ใช้รุ่น/ตระกูลต่างจาก generator ได้ และ calibrate กับป้ายกำกับคนก่อนแสดงคะแนน |
| 3 | `brand_fit: 0–100` ให้ LLM ออกเลขเอง | สเกลกว้างแกว่ง ทำซ้ำไม่ได้ ผู้ใช้จะเห็นเลขเปลี่ยนทุกครั้งที่กด regenerate | checklist pass/fail รายเกณฑ์ → โค้ดคำนวณ 0–100 (ดู §3 ของรายงานนี้) เก็บ `review.criteria[]` ใน `posts.review` |
| 4 | "ส่งกลับแก้ได้สูงสุด 1 รอบ" | ถ้า feedback ไม่เจาะจง การแก้ตัวเองอาจไม่ช่วย (Huang et al.) | ส่งเฉพาะเกณฑ์ที่ fail พร้อมหลักฐานกลับไป · ถ้ายัง fail ให้ส่ง `pending_approval` พร้อม flag ไม่วนต่อ · วัด revise success rate |
| 5 | Critic ตรวจ "policy/อย." ด้วย LLM | ข้อบังคับที่เป็นรายการคำควรตรวจแบบ deterministic | L0 regex/คลังคำต้องห้ามก่อน LLM (เชื่อมกับรายงาน 23-legal-pdpa-fda) |
| 6 | `Caption.variants[2]` | ถ้าให้ judge เลือก variant จะเจอ position bias | ให้ผู้ใช้เลือก หรือใช้ pairwise judge แบบสลับลำดับ 2 ครั้ง |
| 7 | "ใช้ Gemini Batch API ลดต้นทุนครึ่งหนึ่ง" สำหรับงานไม่เร่ง | เป้า turnaround 24 ชม. ขัดกับ UX ที่ผู้ใช้รอดูผล | ระบุชัดว่าใช้ Batch เฉพาะ campaign ที่ตั้งเวลาข้ามคืนหรือ eval offline และแจ้ง ETA ใน UI · ส่วนลด batch ไม่ทบกับ cache |
| 8 | ไม่พูดถึง caching | Brand DNA + system prompt ซ้ำทุก call | จัด prompt ให้ prefix คงที่ (implicit caching) · พิจารณา explicit cache ต่อแบรนด์ใน Campaign |
| 9 | `agent_runs` มี model, cost, latency | ขาดข้อมูลที่ใช้ดีบักและ eval | เพิ่ม `prompt_version`, `trace_id`, `parent_run_id`, `step`, `tokens_in/out`, `cached_tokens`, `schema_valid`, `judge_scores jsonb` |
| 10 | Observability = Sentry + OTel + Langfuse (§1) | ไม่ได้กำหนด trace hierarchy, PII masking, และที่ตั้งข้อมูล | ใช้โครง trace ในส่วนที่ 6 · เริ่มด้วย Langfuse Cloud (เช็ค region/PDPA) · ย้ายไป self-host เมื่อจำเป็น |
| 11 | "structured output" | ไม่ระบุว่าจะ validate อย่างไร | Zod เป็นแหล่งเดียวของ schema → JSON Schema → `responseJsonSchema` + validate ซ้ำ · `reasons` ก่อน `verdict` |
| 12 | Scheduler แบบ rule-based ไม่ใช้ LLM | ดีแล้ว ตรงกับหลัก "ง่ายที่สุดก่อน" | คงไว้ |
| 13 | ไม่มีแผน eval | เปลี่ยน model ID (ซึ่ง §3 เตือนว่าเปลี่ยนบ่อย) แล้วไม่รู้ว่าคุณภาพตก | golden set + CI gate ก่อนสลับแถวใน `model_registry` |

## ผลต่อ PRD

ปรับ **GEN-6** (Brand-fit score) ให้ระบุว่าคะแนน 0–100 **คำนวณจาก checklist รายเกณฑ์** (deterministic + LLM rubric pass/fail) ไม่ใช่เลขที่ LLM ให้ตรง ๆ และเหตุผล 1–3 ข้อมาจากเกณฑ์ที่ fail หรือผ่านแบบเฉียดฉิว เงื่อนไขก่อนเปิดใช้ (P0) คือ judge ต้องมี agreement กับป้ายกำกับของ expert ไทยไม่ต่ำกว่าเกณฑ์ที่ทีมกำหนด (เสนอ kappa ≥ 0.6 ซึ่งเป็นค่าที่ INFERRED และต้องตกลงกัน) ข้อกำหนดใหม่ที่เสนอ (ตั้ง ID ใหม่ตามรูปแบบ PRD):

| ID ที่เสนอ | ข้อกำหนด | Priority |
|---|---|---|
| QA-1 | L0 deterministic checks (dont_words, คำต้องห้าม อย./โฆษณาเกินจริง, ราคาตรง DB, CTA, ความยาว) รันก่อน LLM judge ทุกชิ้น | P0 |
| QA-2 | Critic model แยก role ใน `model_registry` และต้องผ่าน calibration set ก่อนเปลี่ยนรุ่น | P0 |
| QA-3 | Revise loop สูงสุด 1 รอบ ส่งเฉพาะเกณฑ์ที่ fail · ถ้ายัง fail ให้เข้า approval พร้อม flag | P0 |
| EVAL-1 | Golden set 30–50 brief + CI gate ทุกครั้งที่แก้ prompt หรือ `model_registry` | P0 |
| EVAL-2 | เก็บ approve/edit/reject + diff ของ caption เป็น label · dashboard รายสัปดาห์ | P1 |
| OBS-1 | ทุก agent run มี trace (Langfuse) ที่มี cost, tokens, cached tokens, prompt_version, judge scores · mask PII | P0 (ขยายข้อ Observability เดิมใน PRD) |
| COST-1 | Reserve เครดิตตาม worst case (รวม revise) · Batch API เฉพาะงานที่ตั้งเวลา · prompt prefix คงที่เพื่อ caching | P1 |

ใน ARCHITECTURE.md ให้แก้ §3 ตามตารางวิจารณ์ข้อ 1–4, 7–9 และ 11 และเพิ่มคอลัมน์ใน `agent_runs` ตามข้อ 9

## คำถามที่ยังเปิด

1. Gemini Flash กับ Gemini Pro หรือโมเดลต่างตระกูลเป็น judge ภาษาไทย ตัวไหนให้ agreement กับคนไทยสูงกว่า ยังไม่มีข้อมูลเฉพาะภาษาไทย ต้องวัดเองใน beta
2. สเกลที่เหมาะกับ brand-fit คือ binary ต่อเกณฑ์หรือ 0–5 (หลักฐานขัดกันระหว่าง Hamel กับ arXiv 2601.03444) ต้องทดลองกับป้ายกำกับจริง
3. Langfuse Cloud มี data region ใดบ้าง และเข้ากับ PDPA หรือไม่ ราคา unit จริงต่อ agent run เป็นเท่าไร (ราคาจากเว็บรวบรวมข้อมูลขัดกัน)
4. ขนาดขั้นต่ำของ implicit cache บนโมเดลที่จะใช้จริง (มีรายงานว่าถึง 4,096 token ในรุ่นใหม่) Brand DNA ของ SME จะยาวพอหรือไม่
5. Vision judge ตรวจความเหมือนของสินค้าได้แม่นพอหรือไม่ หรือต้องใช้ image embedding similarity กับ cutout เสริม
6. พฤติกรรม `LoopAgent` (`max_iterations`, `escalate`) ใน ADK ยังไม่ได้ยืนยันจากเอกสารทางการ (หน้า docs ถูกบล็อก) แต่ไม่กระทบถ้าใช้ Inngest

## แหล่งอ้างอิง

- Anthropic, Building effective agents (2024-12-19): https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, How we built our multi-agent research system (2025-06-13): https://www.anthropic.com/engineering/multi-agent-research-system
- Google ADK docs, Loop agents (ถูกบล็อก ไม่ได้อ่าน): https://google.github.io/adk-docs/agents/workflow-agents/loop-agents/
- Google Developers Blog, Developer's guide to multi-agent patterns in ADK (ถูกบล็อก เห็นเฉพาะในผลค้นหา): https://developers.googleblog.com/en/developers-guide-to-multi-agent-patterns-in-adk/
- Google ADK and Agentic Design Patterns (แหล่งรอง): https://sendoamoronta.substack.com/p/google-adk-and-agentic-design-patterns
- Zheng et al., Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena: https://arxiv.org/html/2306.05685v4
- NeurIPS 2023 poster: https://neurips.cc/virtual/2023/poster/73434
- Hugging Face discussion ของ paper (แหล่งรองสำหรับตัวเลข bias): https://huggingface.co/datasets/rl-llm-wiki/knowledge-base/discussions/34
- Simon Willison, สรุปโพสต์ LLM-as-a-judge ของ Hamel Husain: https://simonwillison.net/2024/Oct/30/llm-as-a-judge
- Hamel Husain, Creating a LLM-as-a-Judge That Drives Business Results: https://pages.hamel.dev/posts/new-blog-post-creating-a-llm-as-a-judge-that-drives-business-results
- AINews summary (ขั้นตอน critique shadowing): https://buttondown.com/ainews/archive/ainews-creating-a-llm-as-a-judge
- arXiv 2601.03444 (สเกล 0–5 กับ human alignment, เห็นเฉพาะในผลค้นหา): https://arxiv.org/pdf/2601.03444v1
- Huang et al., Large Language Models Cannot Self-Correct Reasoning Yet: https://arxiv.org/abs/2310.01798v2
- Madaan et al., Self-Refine (NeurIPS 2023): https://proceedings.neurips.cc/paper_files/paper/2023/hash/91edff07232fb1b55a505a9e9f6c0ff3-Abstract.html
- Google, Improving Structured Outputs in the Gemini API: https://blog.google/technology/developers/gemini-api-structured-outputs/
- Google Cloud, Structured output (Vertex): https://docs.cloud.google.com/vertex-ai/generative-ai/docs/multimodal/control-generated-output
- Gemini API optimization (Batch, caching): https://ai.google.dev/gemini-api/docs/optimization
- Google Developers Blog, Batch Mode in the Gemini API: https://developers.googleblog.com/en/scale-your-ai-workloads-batch-mode-gemini-api/
- Google Developers Blog, Gemini 2.5 implicit caching: https://developers.googleblog.com/en/gemini-2-5-models-now-support-implicit-caching/
- Google Cloud, Context cache overview: https://docs.cloud.google.com/vertex-ai/generative-ai/docs/context-cache/context-cache-overview
- Google Cloud, Batch inference: https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/deploy/batch-inference
- memx.app, Gemini caching minimum tokens (แหล่งรอง): https://memx.app/blog/gemini-caching-trap-prompts-under-1024-tokens/
- Langfuse, Self-host pricing: https://langfuse.com/pricing-self-host.md
- Mastra, Langfuse vs LangSmith (แหล่งรอง): https://mastra.ai/articles/langfuse-vs-langsmith
- CostBench, Langfuse pricing (แหล่งรอง): https://costbench.com/software/ai-observability/langfuse/
- Latitude, Best Langfuse alternatives (แหล่งรอง): https://latitude.so/blog/best-langfuse-alternatives
