# Brand Voice / Brand Kit UX ของคู่แข่งระดับโลก (Canva, Jasper, Hootsuite, Buffer, Later, Planoly)

> ค้นคว้าเมื่อ 2026-10-08 · หมายเหตุวิธีการ: หน้า official ของ canva.com, jasper.ai, help.jasper.ai และ planoly.com ถูก egress proxy บล็อก และ Apify ติดโควตา concurrent runs จึงอ่านหน้าเต็มไม่ได้ ข้อมูลทั้งหมดมาจาก WebSearch ที่สรุป/อ้างข้อความจากหน้าเหล่านั้น
> **VERIFIED** = ข้อความที่ผลค้นหาอ้างจากโดเมน official ของ vendor (help center / product page / press release ของบริษัทเอง) · **INFERRED** = มาจากบุคคลที่สาม หรือเป็นการตีความของผู้เขียน

## สรุป
ทั้ง 6 เจ้าเก็บ "brand voice" ใน 3 รูปแบบ: (1) **ข้อความอิสระสั้นๆ** ที่ผูกกับ Brand Kit (Canva, จำกัด ~500 ตัวอักษร), (2) **เรียนรู้จากตัวอย่าง/โพสต์เก่า** แล้วสรุปเป็นคำอธิบายสไตล์ที่แก้ได้ (Jasper ≤ 8 ตัวอย่าง, Hootsuite ต่อ social profile, Later จากโพสต์เก่า) และ (3) **เลือก tone/persona ต่อโพสต์** โดยไม่บันทึกโปรไฟล์ (Buffer, Planoly) การ "บังคับให้ on-brand" ใช้ guardrail เชิงกระบวนการ (ล็อกสี/ฟอนต์, approval ก่อนเผยแพร่) และ Jasper เป็นเจ้าเดียวที่ **flag ถ้อยคำ off-brand พร้อมเสนอคำแทน** — ไม่พบเจ้าใดแสดง **คะแนน on-brand แบบตัวเลข** ต่อสาธารณะ ดังนั้น Brand-fit score (GEN-6) ของ PANGLAB เป็นจุดต่างที่ยังว่างอยู่

## Canva (Brand Kit, Magic Studio, Brand Voice, Content Planner)
**Brand Kit** เก็บโลโก้ สี ฟอนต์ และ asset อื่น (ภาพถ่าย ภาพประกอบ ไอคอน กราฟิก) รวมถึง brand guidelines สร้างได้หลาย kit ต่อทีม/ลูกค้า/แคมเปญ (VERIFIED, canva.com/help/find-and-manage-brand-assets, canva.com/pro/brand-kit) มีฟีเจอร์ "Replace across designs" เปลี่ยนโลโก้แล้วแทนที่ในงานเก่า (INFERRED — มาจาก transcript บุคคลที่สาม)

**Brand Voice** เป็นช่องข้อความอิสระใต้ Brand Kit → "Add your brand voice" ให้ "อธิบายบุคลิกแบรนด์และวิธีพูดกับกลุ่มเป้าหมาย" แล้วบันทึก ใช้กับ Magic Write (รวมถึง shortcut `/`) ถ้าผลลัพธ์ไม่ตรงแบรนด์ให้กลับไปแก้ guideline เอง; แก้ได้เฉพาะ owner / admin / brand designer (org brand designer แก้ได้ทุกทีม); มีให้ Pro, Teams, Education, Nonprofits (VERIFIED, canva.com/help/brand-voice) **ข้อขัดแย้ง:** help center ระบุจำกัด **500 ตัวอักษร** แต่ newsroom ของ Magic Write เขียนว่า "สูงสุด 500 คำ" — เชื่อ help center มากกว่า ภาษาที่รองรับมีรายการกำหนด (อังกฤษ สเปน ฝรั่งเศส เยอรมัน ญี่ปุ่น จีน ฯลฯ) **ไม่ยืนยันว่ามีภาษาไทย**

**Brand Controls** (Teams/Business admin, desktop เท่านั้น): toggle *Color control* (ใช้ได้เฉพาะสีแบรนด์), *Font control* (เฉพาะฟอนต์แบรนด์), *Design approval* (ห้าม publish ถ้ายังไม่อนุมัติ) ตั้งได้ระดับ folder; การกำหนด approver รายกลุ่ม/รายคนเป็น Enterprise เท่านั้น (VERIFIED, canva.com/help/brand-control) **Magic Design** สร้างชุดดีไซน์แล้ว "apply สีและฟอนต์จาก Brand Kit ในคลิกเดียว" และ Canva AI ใช้ Brand Templates ใน Brand Kit เพื่อให้ผลตรงแบรนด์ (VERIFIED, canva.com/magic-design, canva.com/help/create-on-brand-designs) **Content Planner** ตั้งเวลาโพสต์ลง Facebook Pages/Groups, Instagram Business, X, LinkedIn, Pinterest, TikTok; IG ต้องตั้งจาก desktop (VERIFIED, canva.com/help/content-planner)

กลไก on-brand ของ Canva จึงเป็น **"กันไว้ก่อน" (constraint + approval)** ไม่ใช่การให้คะแนน

## Jasper Brand Voice / Brand IQ
**สร้าง Brand Voice จากตัวอย่าง:** อัปโหลดได้ **สูงสุด 8 รายการ** (ข้อความ, ไฟล์ .txt/.pdf/.docx, URL) → Jasper วิเคราะห์ tone, style, ลักษณะเด่น แล้วได้ **คำอธิบายสไตล์ (written description) + excerpts** จากเนื้อหาจริง ซึ่งเพิ่ม/ลบ excerpt ได้ และการเปิด excerpts ช่วยเพิ่มความแม่น ตั้งเป็น private หรือแชร์ทั้ง workspace (VERIFIED, help.jasper.ai Brand Voice)
**ทดสอบ:** "Preview Brand Voice" เลือกชนิดงาน (blog / LinkedIn post / product description) + หัวข้อ → แสดง **2 เวอร์ชันเทียบกัน: มีกับไม่มี brand voice** (VERIFIED)
**ใช้งาน:** ใน Agents, doc editor, Jasper Chat; ตั้งเป็น **workspace default** ให้คอนเทนต์ใหม่ใช้อัตโนมัติ (VERIFIED)
**Brand IQ** ประกอบด้วย Brand Voice (tone), **Style Guide** (กฎไวยากรณ์/การจัดรูปแบบที่ admin กำหนด), **Audience profile**, **Product IQ** (ความถูกต้องของข้อมูลสินค้า), **Knowledge Base** (FAQ, positioning, key messaging) และ Visual Guidelines (สี/เลย์เอาต์) — generation หนึ่งดึงทุกชิ้นพร้อมกัน (VERIFIED, jasper.ai/brand-iq, help.jasper.ai Product IQ)
**การบังคับ on-brand:** "flags brand violations and suggests on-brand replacements" และ "flags instances where the tone is off-brand and provides recommended adjustments" (VERIFIED, jasper.ai/brand-iq, jasper.ai/jasper-iq) — **ไม่พบเอกสารเรื่องคะแนนตัวเลข/threshold** คำว่า "Memories" ไม่พบในแหล่งที่ค้นได้

## Hootsuite OwlyWriter AI
OwlyWriter ให้ **เลือก tone ต่อโพสต์**, เช็กสะกด/ไวยากรณ์, ปรับ tone/CTA, ปรับความยาว; เปิดจากไอคอนดาวใน Composer ข้าง emoji/hashtag (VERIFIED, hootsuite.com/platform/owly-writer-ai, whats-new 2024) ใน OwlyGPT (beta, อัปเดต มิ.ย. 2025) ตั้ง **brand voice ผูกกับ social profile** เพื่อดึง voice/tone จากโพสต์เก่าของ profile นั้นมาใช้ (VERIFIED, hootsuite.com/whats-new/personalize-owlygpt-responses-with-your-brand-voice-beta) การรับประกัน on-brand อาศัย **approval workflow เดิมของ Hootsuite** ก่อน publish (VERIFIED) คำอ้างว่า OwlyWriter วิเคราะห์ bio + ประวัติโพสต์ มาจากเว็บรีวิวบุคคลที่สาม (INFERRED)

## Buffer AI Assistant
อยู่ใน composer: regenerate, **rephrase / shorten / expand**, เปลี่ยน tone ให้ casual ขึ้นหรือ formal ขึ้น แล้วกด Insert; **channel-aware** เช่นโพสต์ IG จะมี "Rephrase/Shorten/Expand for Instagram" ที่คุมไม่ให้เกิน 2,200 ตัวอักษร; แนะนำให้ระบุกลุ่มเป้าหมายและ tone ใน prompt; ใช้โมเดล GPT-5-mini (VERIFIED, support.buffer.com "Using Buffer's AI Assistant") หน้า buffer.com/ai พูดถึง "tweak the structure to match your brand's voice" และบทความเปิดตัว 2023 กล่าวถึงการตั้ง guideline เรื่อง tone/style (VERIFIED แต่เป็นเนื้อหาสมัย beta) — **ไม่พบโปรไฟล์ brand voice แบบบันทึกถาวร** (INFERRED จากการไม่พบเอกสาร)

## Later และ Planoly
**Later Caption Writer:** เปิดจาก caption area ข้าง Saved Captions/Hashtag Suggestions, ป้อนคำอธิบายภาพ/วิดีโอ **≤ 80 ตัวอักษร**, ได้ **สูงสุด 3 caption**, และ "learn to match a brand's tone of voice based on the language used in previous posts" (VERIFIED, businesswire press release ก.พ. 2023, later.com video) ไม่พบหน้าตั้งค่า voice แบบบันทึก — ปรับผ่าน prompt (VERIFIED, later.com/caption-writer)
**Planoly AI Caption Writer:** ต้องใช้แผนเสียเงิน (trial ได้), กรอก 2 ช่องบังคับ **"โพสต์เกี่ยวกับอะไร" + "กลุ่มเป้าหมายคือใคร"**, เลือก **tone/persona สำเร็จรูป** (เช่น *Corporate Slay* "polished and knowledgeable, yet down-to-earth", *Quiet Luxury*) หรือ **Custom**, ได้ **3 ตัวเลือก** (VERIFIED, help.planoly.com, planoly.com/help) บล็อก Planoly แนะนำให้นิยาม voice ด้วย **คำคุณศัพท์ (personality, perspective, tone) + ตัวอย่างคอนเทนต์** (VERIFIED, planoly.com/blog/brand-voice-ai) — แต่ไม่พบโปรไฟล์ voice ที่บันทึกในแอป (INFERRED)

## ตารางเปรียบเทียบฟิลด์และกลไก on-brand

| เครื่องมือ | รูปแบบเก็บ voice | ฟิลด์/อินพุตหลัก | ขอบเขต (scope) | กลไก enforce / score | สถานะข้อมูล |
|---|---|---|---|---|---|
| Canva | Free-text ใน Brand Kit | บุคลิก + วิธีพูดกับลูกค้า (≤500 chars), โลโก้, สี, ฟอนต์, asset, guidelines, Brand Templates | ต่อ Brand Kit (หลาย kit ได้) | ล็อกสี/ฟอนต์, design approval, role-based edit; ไม่มีคะแนน | VERIFIED |
| Jasper | เรียนจากตัวอย่าง → คำอธิบาย + excerpts | ≤8 ตัวอย่าง (text/file/URL), Style Guide, Audience, Product IQ, Knowledge Base, Visual Guidelines | private / workspace / workspace default | Preview มี-vs-ไม่มี voice; flag off-brand + เสนอคำแทน; ไม่พบคะแนนตัวเลข | VERIFIED |
| Hootsuite | เลือก tone ต่อโพสต์ + voice ต่อ social profile (beta) | tone, CTA, ความยาว, โพสต์เก่าของ profile | ต่อ social profile | approval workflow | VERIFIED (beta) |
| Buffer | ไม่มีโปรไฟล์ถาวร (พบ) | prompt + ปุ่ม tone casual/formal, rephrase/shorten/expand | ต่อโพสต์, channel-aware | จำกัดความยาวตาม channel | VERIFIED / INFERRED |
| Later | เรียนจากโพสต์เก่า (อัตโนมัติ) | คำอธิบายสื่อ ≤80 ตัวอักษร | ต่อบัญชี | ไม่มี | VERIFIED (2023) |
| Planoly | Persona preset / Custom ต่อโพสต์ | "เกี่ยวกับอะไร", "กลุ่มเป้าหมาย", persona | ต่อโพสต์ | ไม่มี | VERIFIED |

**แพทเทิร์นที่ใช้ได้กับ PANGLAB (INFERRED):** voice ที่ดีที่สุดคือ "ตัวอย่างจริง → AI สรุปเป็นคำอธิบายที่คนอ่านและแก้ได้ → ทดสอบแบบ A/B ทันที" (Jasper) ผสม "กรอกน้อยแต่มี preset ให้เลือก" (Planoly) และ "ล็อก visual + approval" (Canva) ส่วนการ score เป็นช่องว่างของตลาด

## ผลต่อ PRD
1. **BRAND-1 (ปรับ):** นอกจาก slider และคำต้องใช้/ห้ามใช้ ให้เพิ่มช่อง **"คำอธิบายน้ำเสียงแบรนด์" แบบข้อความอิสระ (≤ 500 ตัวอักษร)** และ **Thai persona presets** 4–6 แบบ (เช่น "แม่ค้าออนไลน์เป็นกันเอง", "หรูเรียบ Quiet Luxury", "ผู้เชี่ยวชาญสายรู้ลึก", "วัยรุ่นสนุก") ให้เลือกเป็นจุดเริ่มแล้วปรับต่อ — ลดเวลา onboarding (เทียบ Planoly)
2. **BRAND-6 → ยกเป็น P0 บางส่วน + BRAND-7 (ใหม่, P0):** "Voice from examples": รับ **สูงสุด 8 ตัวอย่าง** (วางข้อความ / URL เพจหรือเว็บ / ไฟล์) หรือดึงโพสต์เก่า แล้ว Gemini สร้าง **voice description + excerpts ภาษาไทย** ที่ผู้ใช้แก้/ลบ excerpt ได้ ต่อยอดจาก BRAND-3 auto-scan
3. **BRAND-8 (ใหม่, P1):** **Preview A/B** แสดง caption เดียวกันแบบ "ไม่มี Brand DNA" vs "มี Brand DNA" ในขั้นสุดท้ายของ onboarding — เป็น aha-moment ที่ Jasper ใช้ (เชื่อมกับรายงาน 26-onboarding-activation)
4. **GEN-6 Brand-fit score (คงไว้เป็นจุดต่าง แต่ปรับ spec):** คะแนน 0–100 ต้องมาพร้อม **inline flags ที่คลิกแก้ได้** (คำต้องห้าม, CTA/hashtag หลักหาย, tone ผิด, ความยาวเกิน channel) และปุ่ม "แก้ให้ตรงแบรนด์" แบบ Jasper; แยกเป็น **rule checks แบบ deterministic** (คำห้ามใช้, hashtag, ความยาว, emoji) + **LLM critic** สำหรับ tone เพื่อให้คะแนนอธิบายได้และไม่แกว่ง
5. **BRAND-2 (เสริม) + Approval:** เพิ่ม **"Brand lock"** ให้ image generation ใช้เฉพาะสี/ฟอนต์/โลโก้ใน Brand DNA (เทียบ Canva color/font control) และให้ตั้ง **"ต้องอนุมัติก่อนโพสต์" ต่อแบรนด์** สำหรับ persona เอเจนซี่ (คุณแนน); สิทธิ์แก้ Brand DNA จำกัดที่ owner/admin/brand editor (เพิ่มใน AUTH)
6. **GEN quick actions (ใหม่, P1):** ปุ่ม "สั้นลง / ยาวขึ้น / ทางการขึ้น / กันเองขึ้น / เปลี่ยน CTA" ที่ **channel-aware** (IG ≤ 2,200 ตัวอักษร, FB ตัดบรรทัดแรกให้เป็น hook) และส่งออก **3 ตัวเลือก** ต่อครั้ง (มาตรฐานตลาด Later/Planoly)
7. **Architecture:** เก็บ voice เป็น JSON มีเวอร์ชัน `{presetId, sliders, freeText, mustUse[], banned[], cta, hashtags[], examples[], generatedDescription, excerpts[], channelOverrides{fb,ig}}` inject เป็น system instruction ของ Gemini + few-shot จาก excerpts; รองรับ **override ต่อช่องทาง** (Hootsuite ผูก voice ต่อ profile) เป็น P2

## คำถามที่ยังเปิด
- Canva brand voice รองรับภาษาไทยหรือไม่ (รายการภาษาใน help center ที่เห็นไม่มีไทย) — ถ้าไม่รองรับเป็นจุดขายตรงของ PANGLAB ควรตรวจในแอปจริง
- ขีดจำกัดจริงของ Canva brand voice: 500 ตัวอักษร (help) vs 500 คำ (newsroom)
- Jasper มีคะแนน on-brand ภายในผลิตภัณฑ์ที่ไม่ได้เปิดเผยหรือไม่ และ "Memories" ยังมีอยู่หรือถูกแทนด้วย Knowledge Base
- Later และ Buffer ปี 2026 มีโปรไฟล์ brand voice แบบบันทึกแล้วหรือยัง (เอกสารที่พบเป็นปี 2023)
- ควรให้ Brand-fit score ต่ำกว่าเกณฑ์ (เช่น < 60) บล็อกการตั้งเวลาโพสต์อัตโนมัติหรือแค่เตือน — ต้องทดสอบกับผู้ใช้ beta

## แหล่งอ้างอิง
- https://www.canva.com/help/brand-voice/
- https://www.canva.com/newsroom/news/magic-write-ai-text-generator/
- https://www.canva.com/sentence-rewriter/
- https://www.canva.com/help/find-and-manage-brand-assets/
- https://www.canva.com/help/brand-control/
- https://canva.com/learn/how-to-build-a-brand-kit/
- https://canva.com/pro/brand-kit/
- https://www.canva.com/en_in/business/features/brand/
- https://www.canva.com/magic-design/
- https://www.canva.com/help/create-on-brand-designs/
- https://www.canva.com/help/content-planner/
- https://gotranscript.com/public/unlock-your-teams-potential-with-canva-seamless-on-brand-content-creation
- https://help.jasper.ai/hc/en-us/articles/18618693085339-Brand-Voice
- https://help.jasper.ai/hc/en-us/articles/54277698302875-Product-IQ
- https://www.jasper.ai/brand-iq
- https://www.jasper.ai/jasper-iq
- https://www.jasper.ai/brand-voice
- https://hootsuite.com/platform/owly-writer-ai
- https://www.hootsuite.com/whats-new/personalize-owlygpt-responses-with-your-brand-voice-beta
- https://www.hootsuite.com/whats-new/optimize-captions-in-composer-with-owlywriter-ai-beta
- https://buildfastwithai.com/ai-tools/hootsuite-ai
- https://support.buffer.com/hc/en-us/articles/13802679839635-Using-Buffer-s-AI-Assistant
- https://buffer.com/ai
- https://buffer.com/resources/introducing-buffers-ai-assistant/
- https://later.com/caption-writer/
- https://later.com/social-media-ai-tools/
- https://later.com/resources/videos/laters-new-ai-caption-writer
- https://www.businesswire.com/news/home/20230222005041/en/Later-Launches-Integrated-AI-powered-Caption-Writer-for-Instagram
- https://help.planoly.com/knowledge/how-to-use-ai-caption-writer
- https://www.planoly.com/help/creating-content/ai-caption-writer
- https://planoly.com/blog/brand-voice-ai
