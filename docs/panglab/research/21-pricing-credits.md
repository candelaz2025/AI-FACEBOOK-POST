# กลยุทธ์ราคา PANGLAB: Credit packs vs Subscription

## สรุป
ตลาด AI SaaS กำลังย้ายไปใช้ credit และ hybrid (subscription + credit) อย่างรวดเร็ว คู่แข่งไทยที่ใกล้ที่สุดอย่าง GenLabs ขายรายเดือนที่ ฿3.1–7.5 ต่อภาพ ส่วน PRD ตั้งไว้ ฿21.8–29.9 ต่อเครดิต ซึ่งตามหลังคู่แข่งมาก PANGLAB ควรคง one-time pack ไว้เป็นข้อเสนอหลัก เพราะเป็นจุดต่างจากคู่แข่งรายเดือนและเข้ากับหลัก prepayment ใน mental accounting แต่ควรลดราคาต่อเครดิตลงมาอยู่ราว ฿12.5–19.9 และเพิ่มตัวเลือก "เติมอัตโนมัติรายเดือน" ที่ได้โบนัสเครดิต เพื่อเก็บกลุ่มผู้ใช้ที่ชอบจ่ายเหมาแบบ flat-rate หลักฐานโดยตรงว่าผู้บริโภคไทยชอบ one-time pack มากกว่ารายเดือนยังมีน้อย และงานวิจัยไทยชิ้นหนึ่งชี้ไปทางตรงข้าม จึงต้อง A/B test ช่วง beta

## Benchmark ราคา AI SaaS

### แนวโน้มโมเดลราคา
ตัวเลขชุดนี้มาจาก vendor blog และ survey ที่นิยามคำว่า "hybrid" ไม่ตรงกัน จึงใช้ดูทิศทางได้ แต่ไม่ควรอ้างเป็นตัวเลขแม่นยำ

| สัญญาณ | ตัวเลข | แหล่ง | สถานะ |
|---|---|---|---|
| Credit-based pricing ในบริษัท AI/SaaS 500 อันดับแรก | โต 126% ในปี 2025 เทียบปีก่อน (PricingSaaS) | HubSpot buyer's guide | SNIPPET (อ้างต่อจากแหล่งอื่น) |
| Seat-based vs hybrid (240 บริษัท) | seat ลดจาก 21% เหลือ 15% ส่วน hybrid เพิ่มจาก 27% เป็น 41% | Kyle Poyar / Growth Unhinged ผ่าน HubSpot | SNIPPET |
| SaaS ที่เพิ่ม GenAI แล้วใช้ hybrid | ~65% (Bain ต.ค. 2025, 30+ vendors) | HubSpot | SNIPPET |
| Median growth ของบริษัทที่ใช้ hybrid | 21% สูงกว่า pure subscription และ pure usage | Maxio 2025 | SNIPPET |
| ความกังวลของผู้ซื้อ | 78% ของ IT leaders เจอค่าใช้จ่าย AI ที่ไม่คาดคิด | HubSpot (vendor content) | SNIPPET |

สรุปได้ว่า credit เป็นหน่วยคิดเงินที่ผู้ใช้ AI tools คุ้นเคยแล้ว แต่ผู้ซื้อยังให้ความสำคัญกับ "ความคาดเดาได้" (predictability) ข้อนี้สนับสนุนการขายแบบ prepaid pack ที่ผู้ใช้รู้ยอดจ่ายล่วงหน้า และไม่มีบิลค้างจ่ายเพิ่มตามมา (INFERRED)

### ราคาต่อชิ้นงานของคู่แข่ง
ตัวเลขฝั่งไทยนำมาจากรายงาน 04 และ 01 ส่วน Predis มาจากเว็บรีวิวบุคคลที่สาม ซึ่งให้ตัวเลขไม่ตรงกัน

| ผลิตภัณฑ์ | โมเดล | ราคา | หน่วย | ฿/หน่วย | สถานะ |
|---|---|---|---|---|---|
| GenLabs Startup | รายเดือน | ฿599 / 80 เครดิต | 1 เครดิต = 1 ภาพ | 7.49 | VERIFIED (รายงาน 04) |
| GenLabs Pro | รายเดือน | ฿1,990 / 400 | ภาพ | 4.98 | VERIFIED (04) |
| GenLabs Business | รายเดือน | ฿4,990 / 1,600 | ภาพ | 3.12 | VERIFIED (04) |
| GenLabs เครดิตเติม | one-time | เริ่ม ฿490 | – | – | VERIFIED (04) ไม่หมดอายุ |
| POPCONT | one-time pack | ฿349/10 → ฿12,500/500 | 1 content (caption + ภาพ + ตั้งเวลา) | 34.9 → 25 | VERIFIED (PRD/01) |
| PostPung | รายเดือน | ฿199–899 | โพสต์ (ไม่สร้างภาพ) | – | VERIFIED (04) |
| Prompt D | รายเดือน หรือ lifetime | ฿990/เดือน หรือ ฿1,990 จ่ายครั้งเดียว | – | – | VERIFIED (04) |
| Predis.ai Core | รายเดือน | US$32 / 1,300 credits (~86 ภาพ) | ภาพ | ~฿12 * | SNIPPET (toolchase) |
| PANGLAB (PRD v1) | one-time pack | ฿299/10 → ฿10,900/500 | 1 Quick Post | 29.9 → 21.8 | PRD |

\* คิดที่ ~฿33/US$ (INFERRED ยังไม่ได้ยืนยันอัตราแลกเปลี่ยน)

การเทียบ GenLabs กับ POPCONT/PANGLAB ตรง ๆ ไม่ยุติธรรมนัก เพราะเครดิตของ GenLabs นับเป็น "ภาพ" ส่วนเครดิตของ POPCONT และ PANGLAB นับเป็น "โพสต์" ที่รวม caption, Brand DNA และการตั้งเวลาโพสต์แล้ว ยังไม่ทราบว่าวิดีโอหรือ caption ของ GenLabs ใช้กี่เครดิต (INFERRED ต้องตรวจต่อ) ถึงอย่างนั้น ผู้ซื้อทั่วไปจะเห็นเพียงว่า "฿7.5 กับ ฿29.9" ราคาใน PRD ปัจจุบันจึงเสี่ยงถูกมองว่าแพงกว่า 4 เท่า

### Unit economics
PRD ประเมินต้นทุน AI ต่อ Quick Post ไว้ราว US$0.07 หรือประมาณ ฿2.3 เมื่อรวม infra, regenerate และ caption แล้วน่าจะอยู่ราว ฿3 ต่อเครดิต (INFERRED) ถ้าต้องได้ gross margin ≥ 80% ตาม PRD §5 ราคาต้องไม่ต่ำกว่า **฿15 ต่อเครดิต** แต่ถ้ายอมรับ 75% ในแพ็กใหญ่ได้ ราคาลงไปถึง ~฿12 ได้ breakage (เครดิตที่ซื้อแล้วไม่ได้ใช้) ช่วยดัน margin รวมขึ้น แต่ยังไม่มีข้อมูลอัตรา breakage จริง ราคา ฿7.5 แบบ GenLabs ให้ margin ราว 60% ที่ต้นทุนเท่ากัน PANGLAB จึงไม่ควรลงไปแข่งราคาที่ระดับนั้น ทางที่ดีกว่าคือแข่งด้วย "ราคาต่อโพสต์ที่พร้อมลง" (INFERRED)

## Credit expiry norms

| บริการ | Subscription credits | One-time / top-up credits | Free credits | สถานะ |
|---|---|---|---|---|
| Adobe Firefly | ไม่ rollover รีเซ็ตทุกเดือน | community expert บอกว่าแพ็กเสริมก็ไม่ rollover (ไม่ใช่นโยบายทางการ) | หมดอายุ 1 เดือนหลังได้รับ | VERIFIED (helpx FAQ) |
| Leonardo.Ai | rollover เข้า "Rollover Bank" มีเพดานตามแผน (บุคคลที่สามบอกว่า 3 เท่า) และใช้ bank ก่อน | Top-up "never expire" แต่ใช้ได้เฉพาะตอนยัง subscribe | free 150 tokens/วัน หมดทุก 24 ชม. (บุคคลที่สาม) | VERIFIED (help) / SNIPPET (เพดาน) |
| ElevenLabs | rollover ได้สูงสุด 2 เท่าของโควตารายเดือน เสียสิทธิ์เมื่อ downgrade/cancel | PAYG หมดอายุ 12 เดือนหลังซื้อ | ไม่มี rollover | VERIFIED (docs) |
| POPCONT | – | "เครดิตไม่มีหมดอายุ" แต่ถูกริบเมื่อปิดบัญชีโดยสมัครใจ | 3 เครดิต | VERIFIED (รายงาน 01) |
| GenLabs | ไม่ทราบ | เครดิตเติม "ไม่หมดอายุ" | 10 เครดิต | VERIFIED (04) |

ภาพรวมคือ เครดิตที่มาพร้อม subscription มักหมดหรือ rollover แบบมีเพดาน เครดิตที่จ่ายแยกแบบ one-time มักไม่หมดอายุ หรือมีอายุ 12 เดือน ส่วนเครดิตฟรีหมดอายุเร็ว คู่แข่งไทยทั้งสองรายให้เครดิตที่ซื้อแล้ว "ไม่หมดอายุ" ถ้า BILL-1 กำหนด 12 เดือนจะดูด้อยกว่าคู่แข่ง ซึ่งตรงกับข้อสรุปของรายงาน 01 ในด้านกฎหมาย ยังไม่พบประกาศ สคบ. ที่กำกับวันหมดอายุของเครดิตหรือบัตรเติมเงินโดยตรง (ค้นแล้วไม่พบ ไม่ได้แปลว่าไม่มี) ต้องส่งให้รายงาน 23 ตรวจต่อ

## Behavioral pricing

| หลักการ | หลักฐาน | ใช้กับ PANGLAB อย่างไร | สถานะ |
|---|---|---|---|
| **Pain of paying / prepayment** | Prelec & Loewenstein (1998, *Marketing Science* 17(1):4–28) เสนอโมเดล double-entry mental accounting ซึ่งทำนายว่าคนชอบจ่ายก่อนใช้ และสิ่งที่จ่ายไปแล้ว "รู้สึกเหมือนได้ฟรี" ตอนใช้ | แพ็กแบบ prepaid แยกความเจ็บปวดตอนจ่ายออกจากตอนใช้งาน แต่ถ้า UI แสดงเครดิตลดลงทุกคลิกจะเกิด taxi-meter ขึ้นใหม่ จึงควรแสดง "เหลือ 37 โพสต์" แทน "เครดิต/บาท" ให้ regenerate caption ฟรี และให้ campaign ตัดเครดิตครั้งเดียว | VERIFIED (บทคัดย่อ) |
| **Flat-rate bias / taxi-meter effect** | Lambrecht & Skiera (2006, *JMR*) พบว่าผู้ใช้จำนวนมากเลือก flat rate ทั้งที่ pay-per-use ถูกกว่า และ bias นี้คงอยู่นาน สาเหตุมาจาก insurance, taxi-meter และ overestimation effect | มีลูกค้ากลุ่มหนึ่งที่ยอมจ่ายรายเดือนเพื่อ "ไม่ต้องคิด" ควรมีตัวเลือก auto-refill รายเดือนไว้ให้ | VERIFIED (บทคัดย่อ) |
| **Decoy / asymmetric dominance** | Huber, Payne & Puto (1982, *JCR*) ส่วนตัวอย่าง The Economist ของ Ariely (32% → 84% เมื่อเพิ่มตัวเลือกล่อ) เป็นเรื่องเล่าจากหนังสือ ไม่ใช่งานที่ผ่าน peer review และงาน replication ปี 2014 พบว่า effect หายไปเมื่อใช้ stimuli ที่สมจริง | อย่าพึ่งแพ็กหลอกที่ไม่มีใครควรซื้อ ใช้ badge "ยอดนิยม" + แสดงราคาต่อโพสต์ที่ลดลงชัดเจนเป็นขั้น + วางแพ็ก Agency ไว้เป็น anchor ราคาสูง แล้ววัดผลด้วย A/B test | VERIFIED (Wikipedia สรุปงาน) / SNIPPET (replication) |
| **Anchoring ต่อราคาจ้างคน** | PRD อ้างว่าจ้างฟรีแลนซ์ ฿300–500/โพสต์ แต่ค้นแล้ว**ไม่พบแหล่งยืนยัน** ส่วน PostPung ใช้ ROI calculator ค่าแรง ฿300/วัน (รายงาน 04) | ใช้ anchor แบบ PostPung (ค่าแรงขั้นต่ำ × เวลา) ซึ่งตรวจสอบได้ แทนตัวเลขฟรีแลนซ์ | VERIFIED (ไม่พบ) |

## ผู้บริโภคไทยกับ one-time packs
ยังไม่พบงานวิจัยปี 2024–2025 ที่วัดตรง ๆ ว่าคนไทยชอบ one-time pack มากกว่ารายเดือน หลักฐานที่มีชี้ไปคนละทาง

| สัญญาณ | ทิศทาง | สถานะ |
|---|---|---|
| ตลาดมือถือไทยเป็น prepaid ราว 70% (postpaid ~30% ในปี 2022; ปี 2015 prepaid 82.8%) แต่สัดส่วน prepaid ลดลงต่อเนื่อง | คนไทยคุ้นกับ "เติมเงิน" แต่กำลังย้ายไปรายเดือน | SNIPPET (Twimbit, Bangkok Bank) |
| งานวิจัยข้อมูล NBTC 17 จังหวัด: ผู้ใช้ mobile internet/OTT มีโอกาสเลือก **postpaid (flat rate)** สูงกว่า สะท้อน "bias toward post-paid plans" | สนับสนุนการมีตัวเลือกรายเดือน | VERIFIED (บทคัดย่อบน IDEAS/RePEc) |
| คู่แข่งไทยมีตัวเลือก one-time: POPCONT ขายแพ็กอย่างเดียว, Prompt D ขาย lifetime ฿1,990, GenLabs มีเครดิตเติมไม่หมดอายุ | ผู้ขายไทยเห็นว่ามีความต้องการ one-time | VERIFIED (01, 04) |
| Subscription fatigue ใน SEA: 81% หงุดหงิดกับจำนวน subscription (Bango, 6,000+ คน รวมไทย ไม่แยกประเทศ) | สนับสนุนการขายแบบ "ไม่ผูกมัด" | SNIPPET |
| SME ไทยขายตามฤดูกาลหรือแคมเปญ (11.11, สงกรานต์) ความต้องการคอนเทนต์จึงไม่สม่ำเสมอ | pack เหมาะกว่ารายเดือน | INFERRED (ดูรายงาน 20) |

ข้อสรุป: one-time pack เป็นจุดขาย "ไม่ผูกมัด" ที่ใช้แข่งกับ GenLabs/PostPung ได้ แต่ข้อมูลไทยไม่ได้ยืนยันว่าลูกค้าชอบแบบนี้มากกว่า จึงควรเสนอทั้งสองแบบและวัดผลจริง

## ข้อเสนอกลยุทธ์ราคา PANGLAB
**Pack-first hybrid** ขายแพ็กครั้งเดียวที่ไม่หมดอายุเป็นค่าเริ่มต้น และให้ "เติมอัตโนมัติทุกเดือน" (ตัดบัตร) เป็นตัวเลือกที่ได้เครดิตโบนัส +20% หน้า pricing ทุกหน้าสื่อสารเป็น "ราคาต่อโพสต์ที่พร้อมลง" ไม่ใช่ "ราคาต่อภาพ"

| แพ็ก (ข้อเสนอ, +VAT) | ราคา | เครดิต | ฿/โพสต์ | Margin ที่ต้นทุน ฿3* | Auto-refill (+20%) |
|---|---|---|---|---|---|
| ทดลองฟรี | ฿0 | 5 (หมดอายุ 30 วัน) | – | – | – |
| Starter | ฿199 | 10 | 19.9 | 85% | – |
| Shop | ฿690 | 40 | 17.3 | 83% | 48 เครดิต/เดือน |
| Growth ⭐ | ฿1,690 | 110 | 15.4 | 80% | 132 เครดิต/เดือน |
| Pro | ฿2,990 | 220 | 13.6 | 78% | 264 เครดิต/เดือน |
| Agency | ฿6,990 | 560 | 12.5 | 76% | 672 เครดิต/เดือน |

\* INFERRED จากต้นทุนใน PRD §7.1 ยังไม่รวม payment fee และ breakage

เหตุผลของแต่ละจุด:
- Starter ราคา ฿199 อยู่ใต้เส้น ฿200 และเท่ากับราคาเริ่มต้นของ PostPung ช่วยให้ตัดสินใจซื้อครั้งแรกได้ง่าย
- ราคาต่อโพสต์ ฿12.5–19.9 ถูกกว่า POPCONT ราว 40–50% และอยู่ในช่วงเดียวกับ Predis (~฿12/ภาพ) ถึง GenLabs จะยังถูกกว่าต่อภาพ แต่ PANGLAB ขายเป็นต่อโพสต์ที่รวม caption และการโพสต์แล้ว
- ควรเพิ่ม **"Eco image" 0.5 เครดิต** ที่ใช้โมเดลภาพราคาถูก ไว้ให้คนที่เปรียบเทียบกับ GenLabs (ราคาโมเดลต้องยืนยันจากรายงาน 15)

## ผลต่อ PRD
- **BILL-1** เปลี่ยนเป็น "เครดิตที่ซื้อไม่หมดอายุตราบที่บัญชียัง active, เครดิตฟรีหมดอายุ 30 วัน, เครดิตโบนัส/โปรโมชันหมดอายุ 90 วัน" และกำหนดลำดับการตัด: ตัดเครดิตที่ใกล้หมดอายุก่อน (แนวเดียวกับ Leonardo ที่ใช้ rollover ก่อน) ต้องมีนโยบายบัญชีที่ไม่ใช้งาน (เช่น 24 เดือนและแจ้งล่วงหน้า) ซึ่งต้องให้ Legal (รายงาน 23) ตรวจก่อน
- **BILL-7 (ใหม่, P1)**: Auto-refill รายเดือนผ่านบัตร ได้โบนัส +20% เครดิต rollover ได้ไม่เกิน 2 เท่าของยอดเติมต่อเดือน (ตาม norm ของ ElevenLabs) ยกเลิกได้ทุกเมื่อ และเครดิตที่ซื้อแล้วไม่ถูกริบ ส่วน PromptPay แบบตัดเงินอัตโนมัติต้องรอข้อมูลจากรายงาน 22
- **BILL-8 (ใหม่, P0)**: credit ledger แยกประเภทเครดิต (paid / bonus / free) และวันหมดอายุ ต่อยอดจาก BILL-3 เพื่อรองรับ deferred revenue และการรับรู้รายได้จาก breakage
- **§7.2** แทนตารางแพ็กด้วยข้อเสนอข้างต้น และเลิกตั้งเป้า "ต่ำกว่า POPCONT 10–14%" มาวางตำแหน่งระหว่าง GenLabs กับ POPCONT แทน **§5 metric**: วัด gross margin แบบ blended รวม breakage และตั้งเพดานล่างของแพ็กใหญ่ไว้ที่ ≥ 75%
- **§7.1** เพิ่ม Eco image 0.5 เครดิต ส่วน **Behavioral note** ให้เปลี่ยนจาก decoy มาเป็น "badge ยอดนิยม + ราคาต่อโพสต์ + anchor ค่าแรง" ลบตัวเลขฟรีแลนซ์ ฿300–500 ที่ไม่มีแหล่งอ้างอิง และให้ UI (DESIGN) แสดงยอดคงเหลือเป็น "โพสต์" ไม่ใช่เครดิต (ลด taxi-meter)

## คำถามที่ยังเปิด
1. GenLabs คิดกี่เครดิตต่อวิดีโอ/caption และเครดิตในแผนรายเดือน rollover ได้ไหม ราคาที่แสดงรวม VAT แล้วหรือยัง
2. ราคาบนหน้า pricing ควรแสดงรวม VAT สำหรับลูกค้า B2C/ร้านเล็ก หรือ +VAT แบบ POPCONT (รายงาน 22)
3. อัตรา breakage จริงของแพ็กไม่หมดอายุ (ต้องเก็บข้อมูลช่วง beta)
4. มีประกาศ สคบ./คณะกรรมการว่าด้วยสัญญาที่กำกับวันหมดอายุของเครดิตดิจิทัลหรือไม่ (ค้นแล้วไม่พบ)
5. ตัวเลขฟรีแลนซ์ไทยต่อโพสต์ (fastwork) เพื่อใช้เป็น anchor ยังไม่มีแหล่งอ้างอิง
6. ต้นทุนโมเดล "Eco image" และอัตราแลกเปลี่ยนที่ใช้คำนวณ (สมมติ ~฿33/US$)

## แหล่งอ้างอิง
- https://blog.hubspot.com/website/ai-credits-buyers-guide
- https://www.growthunhinged.com/p/the-state-of-b2b-monetization-in-2026
- https://maxio.com/resources/2025-saas-pricing-trends-report
- https://valueiq.substack.com/p/four-perspectives-on-credit-based
- https://helpx.adobe.com/si/in/firefly/using/generative-credits-faq.html
- https://community.adobe.com/t5/adobe-firefly-discussions/generative-fill-credits/m-p/15521660
- https://intercom.help/leonardo-ai/en/articles/9560707-token-rollover
- https://www.eesel.ai/de/blog/leonardo-ai-pricing
- https://elevenlabs.io/docs/help-center/account/general/how-does-credit-rollover-work
- https://toolchase.com/tool/predis-ai/
- https://admakeai.com/alternatives-to/predis-ai/pricing
- https://pubsonline.informs.org/doi/fpi/10.1287/mksc.17.1.4
- https://www.anderson.ucla.edu/documents/areas/fac/marketing/paying_too_much.pdf
- https://en.wikipedia.org/wiki/Decoy_effect
- https://atticusli.com/replication-crisis/decoy-effect-asymmetric-dominance/
- https://mindhacks.com/2009/01/11/predictably-irrational-and-relative-value/
- https://ideas.repec.org/a/ags/thkase/334407.html
- https://so01.tci-thaijo.org/index.php/AEJ/article/view/227466
- https://cdn.twimbit.com/uploads/2024/02/10092452/Thailand-mobile-market-updates-2024-edition.pdf
- https://www.bangkokbank.com/th-TH/-/media/61C6EAE247C84D3E8778423B9E950197.ashx
- https://www.noypigeeks.com/?p=201300
- https://insight.rakuten.com/wordpress/wp-content/uploads/RI-Snapshot-Subscriptions.pdf
- https://www.kasikornbank.com/th/promotion/Pages/cash-card.aspx
- รายงานภายใน: docs/panglab/research/01-popcont-faq-auth-payment.md, 04-thai-competitors.md, PRD.md §5–§7
