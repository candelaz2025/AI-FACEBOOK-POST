# Onboarding & Activation Benchmarks สำหรับ AI/PLG SaaS เทียบกับเป้า PRD §5

## สรุป
ตัวเลขอ้างอิงจากตลาดต่ำกว่าเป้าใน PRD §5 อย่างชัดเจน activation rate เฉลี่ยของ SaaS อยู่ราว 30–37% (Lenny, Userpilot) หมวด MarTech เฉลี่ยแค่ 24% ส่วน free-to-paid ระดับ "ดี" อยู่ที่ 3–5% เมื่อวัดภายใน 6 เดือน (Lenny/Kyle Poyar, OpenView) แต่ PRD ตั้งไว้ว่า activation ต้องได้ ≥ 50% และ paid conversion ≥ 8% ภายใน 14 วัน ส่วนแนวทาง onboarding ที่ใส่ URL แล้วได้ Brand Kit (Pomelli, Canva Brand Kit Builder) กลายเป็นมาตรฐานของตลาดไปแล้ว และสนับสนุน BRAND-3 ที่เป็น P0 แต่ Canva เองก็ระบุว่าการดึงข้อมูลล้มเหลวกับเว็บที่ต้องล็อกอินหรือเว็บที่บล็อกบอต ปัญหานี้หนักสำหรับ SME ไทย เพราะหลายรายมีแค่เพจ Facebook หรือร้าน Shopee ไม่มีเว็บไซต์ของตัวเอง

## Benchmarks: Activation, Time-to-Value, Free-to-Paid

### Activation rate
| แหล่ง | กลุ่มตัวอย่าง | ค่าเฉลี่ย | มัธยฐาน | สถานะ |
|---|---|---|---|---|
| Lenny's Newsletter (ทำร่วมกับ Yuriy Timen) | 500+ responses ทุกประเภทผลิตภัณฑ์ | 34% | 25% | VERIFIED (ข้อความในผลค้นหาที่ยกมาจากบทความ ส่วนตัวหน้าบทความถูก proxy บล็อก) |
| Lenny's Newsletter (เฉพาะ SaaS ตัด marketplace/e-com/DTC ออก) | ชุดเดียวกัน | 36% | 30% | VERIFIED (เช่นเดียวกัน) แต่ 365Talents อ้างว่ามัธยฐานเป็น 25% ซึ่งขัดกัน ให้ยึดตัวเลขจากต้นฉบับ |
| Userpilot Benchmark Report 2025 | 62 บริษัท B2B SaaS | 37.5% | 37% | VERIFIED (หน้า userpilot.com) |
| Userpilot หมวด MarTech | ไม่ระบุขนาด | 24% | – | VERIFIED |
| Userpilot หมวด AI & ML | ไม่ระบุขนาด | 54.8% | – | ขัดกัน: อีกหน้าของ Userpilot ระบุว่าตัวเลขนี้เป็นของหมวด HR |
| Growth Unhinged (Kyle Poyar) | PLG survey | ช่วง 30–40% | – | INFERRED (secondary) ผู้เขียนเตือนว่านิยาม activation ของแต่ละบริษัท "ไม่สอดคล้องกันเลย" |

ทุกแหล่งเตือนเหมือนกันว่าตัวเลข activation ขึ้นอยู่กับว่าเลือก milestone ไหน Lenny บอกว่าความผิดพลาดที่เจอบ่อยที่สุดคือเลือก milestone เร็วหรือช้าเกินไป milestone ใน PRD คือ "โพสต์แรกที่ **อนุมัติ** ภายใน 24 ชม." ซึ่งลึกกว่า "สร้าง draft แรก" จึงควรคาดว่าตัวเลขจริงจะออกมาต่ำกว่าค่าเฉลี่ยตลาด ไม่ใช่สูงกว่า

### Time-to-Value (TTV)
| แหล่ง | ตัวเลข | หมายเหตุ |
|---|---|---|
| Userpilot 2025 (62 บริษัทที่วัด TTV) | เฉลี่ย 1 วัน 12 ชม. 23 นาที | หน้า blog ของ Userpilot เรียกตัวเลขเดียวกันว่า median ส่วน Prospeo ระบุ median เป็น 1 วัน 1 ชม. 54 นาที ป้ายกำกับไม่ตรงกัน |
| Userpilot หมวด AI & ML | เฉลี่ย 1 วัน 17 ชม. 19 นาที, มัธยฐาน 16 ชม. 52 นาที | VERIFIED (snippet) |
| Userpilot หมวด MarTech | เฉลี่ย 1 วัน 20 ชม. 47 นาที | VERIFIED (snippet) และพบว่าบริษัท PLG มี TTV ยาวกว่า SLG เล็กน้อย |
| ProductLed (Wes Bush) | ไม่มี benchmark เป็นตัวเลข | มีแต่หลักการ straight-line onboarding: ตัดทุกขั้นตอนที่ไม่จำเป็นออกจากทางไปสู่คุณค่าแรก มีเคสเดียวคือ Snappa ที่เลื่อนการยืนยันอีเมลออกไปทีหลัง แล้ว MRR เพิ่มกว่า 20% และอ้างว่าผู้สมัคร 40–60% ไม่กลับมาใช้อีกหลังสมัคร (anecdotal) |

TTV ใน benchmark วัดเป็น "วัน" เพราะเป็น B2B SaaS ทั่วไปที่ต้องตั้งค่าเยอะ ส่วนเครื่องมือสร้างคอนเทนต์ด้วย AI โฆษณากันว่าได้ผลลัพธ์แรก "ในไม่กี่นาที" เป้า P50 ≤ 3 นาทีของ PRD สำหรับ "draft แรก" จึงสมเหตุสมผลในเชิงผลิตภัณฑ์ แต่เทียบตรงกับ benchmark ไม่ได้ (INFERRED)

### Free-to-paid conversion
| แหล่ง | Freemium | Free trial | นิยาม/ช่วงเวลา | สถานะ |
|---|---|---|---|---|
| Lenny + Kyle Poyar (ส.ค. 2023, 1,000+ products, ร่วมกับ Pendo) | 3–5% = "ดี" | – | % บัญชีใหม่ที่จ่ายเงินภายใน **6 เดือน** | VERIFIED (snippet) ตัวเลขระดับ "great" อยู่หลัง paywall |
| OpenView Product Benchmarks 2022 | มัธยฐาน 5% | มัธยฐาน 17% | – | INFERRED (สรุปจาก malpaniventures ซึ่งเป็น secondary) ส่วน calculator ของ OpenView ระบุ signup→paid 4% |
| ChartMogul (อ้างผ่าน Userpilot) | 3–5% ดี / 8–12% ยอดเยี่ยม | ไม่ใส่บัตร 4–6% / 10–15%, ใส่บัตร 25–35% / 50–60% | – | INFERRED (secondary) และ ChartMogul ระบุมัธยฐานรวมทุกโมเดลเป็น 8% |

PANGLAB ให้เครดิตฟรีโดยไม่ต้องใส่บัตร จึงเทียบได้ใกล้ที่สุดกับ freemium หรือ trial แบบไม่ใส่บัตร ตามตัวเลขนี้ 8% ภายใน **14 วัน** อยู่ในระดับ "ยอดเยี่ยม" ทั้งที่ benchmark ใช้กรอบเวลา 6 เดือน เป้านี้จึงทะเยอทะยานมาก

## ตัวอย่าง URL-to-Brand-Kit Onboarding

| ผลิตภัณฑ์ | Input | สิ่งที่ดึงได้ | เวลา/ข้อจำกัด | สถานะ |
|---|---|---|---|---|
| **Pomelli** (Google Labs + DeepMind) | URL เว็บไซต์ | "Business DNA": โลโก้ สี ฟอนต์ tone of voice ภาพ tagline และค่านิยมแบรนด์ จากนั้นเสนอแคมเปญแล้วสร้าง asset | อ้างว่าใช้ "ไม่ถึงหนึ่งนาที" เปิด public beta ต.ค. 2025 ที่ US/CA/AU/NZ ภาษาอังกฤษเท่านั้น ฟรีในช่วงทดลอง ปี 2026 เพิ่ม Pomelli Agent, Brand Book และแชร์ไป Google Ads/Instagram | INFERRED (หลายแหล่ง secondary โพสต์ทางการที่ blog.google/technology/google-labs/pomelli/ ถูก proxy บล็อก) รีวิวภาษาสเปนบอกว่า tone ที่ดึงได้มักต้องแก้เอง |
| **Canva Brand Kit Builder** | URL เว็บไซต์ (แท็บ Brand) | โลโก้ สี ฟอนต์สาธารณะ กราฟิก ภาพถ่าย brand voice และ guidelines | ใช้ได้เฉพาะ Pro/Teams/Enterprise/Edu/Nonprofit Canva แนะนำให้ "review เสมอ" และระบุว่าจะล้มเหลวถ้าเว็บต้องล็อกอิน บล็อกการเข้าถึงอัตโนมัติ ไม่เป็นสาธารณะ หรือใช้รูปแบบหน้าที่ยังไม่รองรับ Canva AI ยังใช้ URL เพื่อดึง brand context ได้โดยไม่ต้องสร้าง kit | VERIFIED (help page ของ canva.com จากผลค้นหา) |
| **Predis.ai** | อัปโหลดเอง | Brand Kit (สี ฟอนต์ โลโก้) ตั้งค่าด้วยมือ ส่วน URL ใช้ import รายการสินค้าจาก Shopify/Woo/Etsy/Wix | มี guided tutorial | INFERRED (รีวิวและ directory) ไม่พบหลักฐานว่าดึงแบรนด์จาก URL |

จากตารางนี้ การใส่ URL แล้วได้ Brand DNA ร่างภายใน ≤ 1 นาที กลายเป็นความคาดหวังพื้นฐานของผู้ใช้ไปแล้ว ไม่ใช่จุดขายพิเศษ ข้อได้เปรียบที่ PANGLAB ทำได้คือรองรับแหล่งข้อมูลที่ SME ไทยใช้จริง เช่น เพจ Facebook, IG, LINE OA และร้าน Shopee/Lazada ซึ่ง scraper ทั่วไปเข้าไม่ถึงเพราะต้องล็อกอินหรือมีระบบกันบอต (INFERRED)

## เทียบกับเป้าหมายใน PRD §5

| Metric ใน PRD | เป้า PRD | Benchmark ที่ใกล้ที่สุด | ประเมิน |
|---|---|---|---|
| Activation (โพสต์แรกที่อนุมัติภายใน 24 ชม.) | ≥ 50% | SaaS เฉลี่ย 34–37.5%, มัธยฐาน 25–37%, MarTech 24% | **สูงเกินจริง** โดยเฉพาะเมื่อ milestone ลึกถึงขั้น "อนุมัติ" |
| Time-to-first-post (draft แรก, P50) | ≤ 3 นาที | TTV ของ B2B SaaS ~1.5 วัน (เทียบตรงไม่ได้), Pomelli สร้าง DNA ใน < 1 นาที | **ทำได้** ถ้า auto-scan ทำงานแบบ async และเริ่มสร้าง draft ไปพร้อมกัน |
| Connect rate (เชื่อม Meta) | ≥ 40% | ไม่พบ benchmark | ยังไม่มีข้อมูลยืนยัน |
| Paid conversion (ซื้อแพ็กแรกภายใน 14 วัน) | ≥ 8% | Freemium ดี 3–5% (ภายใน 6 เดือน), ยอดเยี่ยม 8–12%, trial ไม่ใส่บัตร 4–6% | **สูงเกินจริง** สำหรับกรอบ 14 วัน |
| Approval rate, Publish success, Margin | 60% / 99% / 80% | อยู่นอกขอบเขตรายงานนี้ | – |

## ผลต่อ PRD

1. **แยก activation ใน §5 ออกเป็น 3 ขั้น** ได้แก่ *Setup* (ยืนยัน Brand DNA แล้ว), *Aha* (สร้าง draft แรกที่มีภาพ+caption แล้ว) และ *Habit* (อนุมัติหรือตั้งเวลาโพสต์ ≥ 3 ชิ้นภายใน 7 วัน) ให้ "Activation" หลักเป็นขั้น Aha หรือขั้นอนุมัติโพสต์แรก โดยตั้งเป้าเริ่มต้นที่ **35–40%** และเป้า stretch ที่ 50% แล้วค่อยทบทวนหลังได้ข้อมูล beta
2. **ปรับ Paid conversion** เป็น 2 ตัว คือ ≥ 3–4% ภายใน 14 วัน และ ≥ 6–8% ภายใน 90 วัน วัดเป็น cohort ตามสัปดาห์ที่สมัคร พร้อมระบุชัดว่าโมเดลคือ free credits ไม่ใส่บัตร เพื่อให้เทียบกับ benchmark freemium หรือ trial แบบไม่ใส่บัตรได้ตรง
3. **Time-to-first-post** คงเป้า P50 ≤ 3 นาทีไว้ แต่เพิ่ม P90 ≤ 10 นาที และ instrument event `signup → brand_scan_done → first_draft_ready` เพื่อวัดค่าจริง
4. **ขยาย BRAND-3** โดยตั้ง SLA ให้สแกนได้ผลใน ≤ 60 วินาที (ระดับเดียวกับ Pomelli) ให้รองรับแหล่ง input นอกจากเว็บไซต์ ได้แก่ เพจ FB/IG ผ่าน Graph API หลังเชื่อม Meta, ลิงก์ร้าน Shopee/Lazada และ LINE OA และเมื่อสแกนล้มเหลวให้ fallback ไปที่ "อัปโหลดโลโก้+รูปสินค้า 3 รูป + ตอบคำถาม 3 ข้อ" ทุกช่องที่ดึงได้ต้องแก้ไขได้ (เหมือนที่ Canva ให้ review) ส่วน ARCHITECTURE ต้องทำ scan เป็น background job ที่ timeout เร็ว
5. **เพิ่ม requirement ONB ใหม่ใน §6.1** ได้แก่ ONB-1 (P0) straight-line onboarding โดยเลื่อนการยืนยันอีเมล/OTP และการเชื่อม Meta ไปหลังจากได้ draft แรก ตามบทเรียนจาก Snappa และ ONB-2 (P0) checklist "3 ขั้นสู่โพสต์แรก" พร้อม empty state ที่มีตัวอย่างคอนเทนต์ ใน DESIGN ให้ใช้ AI กรอกให้ล่วงหน้า (prefill) แทนฟอร์มยาวใน BRAND-1
6. ลบหรือแก้หมายเหตุใต้ตาราง §5 ให้อ้างอิงรายงานนี้ และบันทึกว่าเป้า activation และ paid conversion เดิมสูงกว่า benchmark

## คำถามที่ยังเปิด
- ยังไม่มี benchmark activation/TTV ของเครื่องมือ AI content แบบ self-serve โดยตรง (Jasper, Predis, Ocoya ไม่เปิดเผยตัวเลข) และไม่มีข้อมูลของตลาดไทยหรือ SEA เลย
- ตัวเลขระดับ "great" ใน Lenny/Poyar อยู่หลัง paywall และตัวเลข ChartMogul ได้มาจาก secondary ควรไปอ่านต้นฉบับก่อนใช้ในเอกสารนักลงทุน
- Userpilot ระบุค่า 54.8% ขัดกันเองว่าเป็นของหมวด AI & ML หรือ HR และระบุ TTV ขัดกันว่าเป็น average หรือ median
- รายละเอียด Pomelli จากแหล่งทางการ (blog.google) ยังเปิดอ่านไม่ได้เพราะ proxy บล็อก ทั้งความแม่นยำ ประเทศที่ให้บริการตอนนี้ และว่ารองรับภาษาไทยหรือยัง
- ยังไม่รู้ว่าผู้ใช้เป้าหมายกี่ % มีเว็บไซต์ของตัวเอง ข้อนี้กำหนดว่า BRAND-3 แบบใช้ URL จะครอบคลุมผู้ใช้ได้แค่ไหน ควรถามในการสัมภาษณ์ beta
- ยังไม่มี benchmark ของ Connect rate (การเชื่อม Meta) สำหรับใช้ตั้งเป้า 40%

## แหล่งอ้างอิง
- https://www.lennysnewsletter.com/p/what-is-a-good-activation-rate
- https://lennysnewsletter.com/p/what-is-a-good-free-to-paid-conversion
- https://365talents.com/?p=4791
- https://userpilot.com/blog/activation-rate/
- https://userpilot.com/saas-product-metrics/
- https://userpilot.com/blog/?p=196703
- https://userpilot.com/blog/free-trial-conversion-rate/
- https://userpilot.com/blog/saas-average-conversion-rate
- https://prospeo.io/s/time-to-value-ttv
- https://chartmogul.com/reports/saas-conversion-report/
- https://openviewpartners.com/blog/product-benchmarks-2022/
- https://openviewpartners.com/2022-product-benchmarks-calculator
- https://www.malpaniventures.com/blog/learnings-from-open-view-s-product-benchmarks-report-2022
- https://www.growthunhinged.com/p/your-guide-to-saas-product-metrics
- https://productled.com/?p=13068
- https://www.productboard.com/blog/a-battle-tested-product-onboarding-framework-from-wes-bush/
- https://blog.google/technology/google-labs/pomelli/ (ถูก proxy บล็อก ไม่ได้อ่านโดยตรง)
- https://siecledigital.fr/2025/11/03/pomelli-le-nouveau-pari-de-google-pour-rendre-la-creation-de-contenus-accessible-a-toutes-les-pme/
- https://www.cyberclick.es/numerical-blog/pomelli-que-es-y-como-funciona-la-nueva-ia-de-google-para-marketing
- https://ice-ice-bear.github.io/ko/posts/2026-03-16-google-pomelli/
- https://www.buildfastwithai.com/blogs/what-is-pomelli-google-ai-marketing-tool
- https://www.canva.com/help/brand-kit-builder/
- https://www.canva.com/help/create-on-brand-designs/
- https://aiindigo.com/tutorials/getting-started-with-predis-ai-automate-high-converting-social-content-workflows
- https://www.getapp.com.au/software/2048720/predisai
