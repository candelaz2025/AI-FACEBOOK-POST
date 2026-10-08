# Meta App Review + Business Verification สำหรับ PANGLAB

> สถานะ: เสร็จ (รอบ retry, 2026-10-08) · ความมั่นใจโดยรวม: medium
> หมายเหตุวิธีการ: developers.facebook.com, developers.secure.facebook.com, bundle.social, ppc.land และ woopsocial.com ถูก egress proxy บล็อก จึงอ่านหน้าเต็มไม่ได้ ข้อมูลทั้งหมดมาจาก snippet/summary ของ WebSearch
> แท็ก: **VERIFIED-snippet** = ข้อความจากเอกสารทางการของ Meta ที่เห็นใน search snippet · **REPORTED** = จาก vendor/ชุมชนนักพัฒนา (ไม่ใช่ Meta, บางเจ้าขายบริการ "รับประกันผ่าน" จึงอาจเกินจริง) · **INFERRED** = ข้อสรุปของผู้วิจัย

## สรุป
PANGLAB ต้องผ่านสี่ด่านก่อนจะ auto-post ให้ Page/IG ของลูกค้าที่ไม่มี role ในแอปได้: (1) Business Verification ของ Business Portfolio, (2) Tech Provider Access Verification เพราะแอปเข้าถึงข้อมูลที่ธุรกิจอื่นเป็นเจ้าของ (`business_management`, `instagram_basic` อยู่ในรายการ trigger), (3) App Review เพื่อขอ Advanced Access ทีละ permission พร้อม screencast และ (4) Data Use Checkup ก่อนสลับเป็น Live mode และทุกปีหลังจากนั้น (กำลังถูกรวมเป็น "Data Access Renewal") ในปี 2026 คิว App Review ช้าลงมาก (รายงานว่าราว 20 วันต่อรอบ และส่วนใหญ่โดน reject อย่างน้อยหนึ่งครั้ง) จึงควรวางแผน critical path ราว 6-10 สัปดาห์ (INFERRED) และต้องมี UI ภาษาอังกฤษสำหรับ screencast เพราะ PANGLAB เป็น Thai-first

## 1. Permissions ที่ต้องขอ (Advanced Access)
Standard Access ใช้ได้เฉพาะผู้ใช้ที่มี role บนแอป (admin/developer/tester) ส่วนการใช้กับ Page ของลูกค้าภายนอกต้องได้ Advanced Access ซึ่ง "must complete Meta App Review" (VERIFIED-snippet, Instagram App Review doc) ข้อมูลนี้สอดคล้องกับ 08-meta-pages-api.md

| Permission | ใช้ทำอะไรใน PANGLAB | ต้อง App Review | Trigger Tech Provider AV? | หมายเหตุ |
|---|---|---|---|---|
| `pages_show_list` | แสดงรายชื่อ Page ให้เลือกเชื่อม | ใช่ (Advanced) | ไม่อยู่ในรายการ 2022 | |
| `pages_read_engagement` | อ่านโพสต์/ข้อมูล Page (Brand DNA, ตรวจผล) | ใช่ (INFERRED, แหล่งขัดกัน) | ไม่อยู่ในรายการ 2022 | ดู 08 |
| `pages_manage_posts` | สร้าง/แก้/ลบโพสต์บน Page | ใช่ | ไม่อยู่ในรายการ 2022 | reviewer ต้องเห็นโพสต์จริงบน Page ทดสอบ (REPORTED, bundle.social) |
| `instagram_basic` (FB Login path) | อ่าน IG Business account ที่ผูกกับ Page | ใช่ | **ใช่** | |
| `instagram_content_publish` (FB Login path) | โพสต์ IG | ใช่ | ไม่ระบุ | publish ใช้ไม่ได้ถ้าไม่มี base permission คู่กัน (REPORTED) |
| `instagram_business_basic` / `instagram_business_content_publish` (Instagram Login path) | ทางเลือกถ้าใช้ Instagram Login | ใช่ | ไม่ชัด | ชื่อ scope ในเอกสาร Meta สะกดไม่ตรงกันระหว่างหน้า (`..._publishing`) ต้องเช็กใน Dashboard (VERIFIED-snippet) |
| `business_management` | จัดการ asset ผ่าน Business Portfolio | ใช่ | **ใช่** | ขอเฉพาะเมื่อจำเป็นจริง (INFERRED) |
| `read_insights` / `instagram_manage_insights` | Analytics (ANA-1) | ใช่ | ไม่อยู่ในรายการ 2022 | แนะนำแยกยื่นรอบสอง |

เอกสาร Instagram App Review ระบุว่าแอปที่ไม่มี interface ให้ทดสอบหรือยังไม่ได้ implement **Facebook Login for Business** ขอได้เพียงชุด permission แคบ ๆ (เช่น `instagram_basic`, `instagram_manage_comments`) ดังนั้นการขอ scope publish ต้องมี flow Facebook Login for Business ที่ reviewer ทดสอบได้จริง (VERIFIED-snippet) และแอปที่ย้ายจาก Facebook Login ไป Instagram Login อาจได้ Advanced Access ของ permission ที่สอดคล้องกันโดยอัตโนมัติ (VERIFIED-snippet)

## 2. Business Verification และ Access Verification (Tech Provider)
**Business Verification (BV)** เป็นเงื่อนไขก่อน Advanced Access: หลายแหล่งรายงานว่าคำขอ Advanced Access จะถูก reject อัตโนมัติถ้า BV ของ Business Portfolio ยัง pending (REPORTED, singhamandeep.com/woopsocial.com) เอกสารที่ Meta รับต้องแสดงชื่อนิติบุคคลตามกฎหมาย และที่อยู่/เบอร์โทรถ้าธุรกิจยังไม่อยู่ในฐานข้อมูล Meta ประเภทที่รับได้แก่หนังสือรับรองการจดทะเบียน, ใบอนุญาตประกอบธุรกิจ, statement บัญชีธนาคารธุรกิจ ส่วน invoice/PO/เอกสารที่ยื่นเองไม่มีตราประทับไม่รับ ขอ verify ได้สูงสุด 3 ครั้ง (REPORTED, Klaviyo help center; WATI) ชื่อและที่อยู่ต้องตรงกับเอกสารทุกตัวอักษร (REPORTED, MyOperator)

| แหล่ง | ระยะเวลา BV |
|---|---|
| Klaviyo help | สูงสุด 30 วัน |
| WATI | 10 นาที ถึง 14 วันทำการ |
| Aurorainbox (2026-05) | 1-5 วันทำการถ้าเอกสารครบ |
| singhamandeep (ผู้ขายบริการ) | ราว 7-15 วัน |

**Tech Provider Access Verification (AV)** ประกาศโดย Meta 2022-06-02: เป็นกระบวนการที่ "Tech Providers are required to share details about their business and how their app is used by other businesses" ใช้กับแอปที่เข้าถึงข้อมูลที่ธุรกิจอื่นเป็นเจ้าของ และ "independent of App Review" กล่าวคือ permission ยังต้องได้ Advanced Access แยกต่างหาก แอปที่ business claim แล้วจะ "cannot be used by other businesses until the business has been verified as a Tech Provider" ยกเว้นผู้ใช้มี role บนแอป Meta คาดว่าใช้ "typically ... five business days" และสถานะแสดงใน Basic Settings (VERIFIED-snippet, Meta blog 2022 ผ่าน Zeta Global/PYMNTS) รายการ permission ที่ trigger ในปี 2022: `ads_management`, `ads_read`, `business_management`, `catalog_management`, `instagram_basic`, `leads_retrieval`, `pages_manage_ads` และต้องผ่าน BV ก่อนจึงเริ่ม AV ได้ (REPORTED, singhamandeep) รายการนี้อาจเปลี่ยนแล้ว ต้องตรวจใน Dashboard

ผลต่อ PANGLAB: ทันทีที่ขอ `instagram_basic` หรือ `business_management` PANGLAB จะถูกนับเป็น Tech Provider (INFERRED) ลำดับที่ถูกต้องจึงเป็น BV → AV → App Review (ทำ AV คู่ขนานกับการเตรียม App Review ได้)

## 3. Screencast requirements
Meta กำหนดให้มี screen recording ครอบคลุม **ทุก** permission/feature ที่ยื่น reviewer ใช้วิดีโอเหมือน test script ถ้าดูแล้วยืนยันไม่ได้ว่าแอปต้องใช้ permission นั้นก็จะไม่อนุมัติ และแนะนำให้ตั้ง UI เป็นภาษาอังกฤษก่อนอัด (VERIFIED-snippet, developers.facebook.com/docs/app-review/submission-guide/screen-recordings)

| สิ่งที่ต้องเห็นในวิดีโอ | แหล่ง |
|---|---|
| Login ด้วย Facebook Login for Business → หน้า consent ที่แสดง permission นั้น → เลือก Page | REPORTED (หลายแหล่ง) |
| การใช้ permission จริงที่เกิดจาก action ของผู้ใช้ (กดโพสต์/ตั้งเวลา) | REPORTED, bundle.social |
| ปิดท้ายด้วยโพสต์ที่ขึ้นจริงบน **test Business Page** ไม่ใช่โปรไฟล์ส่วนตัว | REPORTED, bundle.social / singhamandeep |
| UI ภาษาอังกฤษ หรือมี English overlay/caption (มีเคส 3 permissions ถูก reject เพราะ screencast ภาษาสเปน) | VERIFIED-snippet (คำแนะนำ) + REPORTED (เคส) |
| แยกคลิปหรือแยกช่วงต่อ permission, คำอธิบาย use case เฉพาะต่อ permission ไม่ copy ซ้ำ | REPORTED |
| ให้ test credentials ที่ reviewer login เองได้ (บัญชีที่มี Page Admin role, ไม่หมดอายุ, ไม่ติด OTP) | REPORTED |

Meta มีวิดีโอทางการ "Creating screencasts for Meta App Review" (2024) และ "creating screencasts for ongoing checks" ซึ่งบ่งว่า screencast ต้องใช้ซ้ำใน ongoing review ด้วย (INFERRED จากชื่อวิดีโอ)

## 4. Timeline และสาเหตุที่ถูก reject บ่อย
| ขั้น | ระยะเวลาที่รายงาน | ประเภท |
|---|---|---|
| Business Verification | 1 วัน ถึง 30 วัน | REPORTED |
| Tech Provider AV | ~5 business days (ปี 2022) | VERIFIED-snippet (ข้อมูลเก่า) |
| App Review ต่อรอบ | 3-7 business days (แนวทางเดิม); ช่วงก่อน 2025 ราว 1-3 วัน; พ.ค. 2026 ราว 17-19 วัน; Meta "explicitly telling developers to expect a 20-day wait" | REPORTED (bundle.social 2026-07, ยืนยันกับหน้า Meta ไม่ได้) |
| Pages permissions ทั้งกระบวนการ | 1-3 สัปดาห์ + reject อย่างน้อยหนึ่งครั้ง; กรณีแย่สุดของ bundle.social 43 submissions ใน ~8 สัปดาห์ | REPORTED |
| เคส Instagram ยืดเยื้อ | ~3 เดือน, 15+ submissions | REPORTED (Blind) |
| Data Use Checkup / Data Access Renewal | 10-15 business days กว่าจะได้ผล | VERIFIED-snippet (FAQ) |

**สาเหตุ reject ที่พบบ่อย** (REPORTED เว้นแต่ระบุ)

| สาเหตุ | วิธีกัน |
|---|---|
| ขอ permission ที่ยังไม่ได้ใช้/ยังไม่โชว์ใน screencast ("just in case") ซึ่งเป็นสาเหตุอันดับหนึ่งของ `pages_manage_posts` | ยื่นเฉพาะ scope ที่ feature เสร็จแล้ว |
| Screencast ข้าม login/consent หรือไม่เห็น permission ทำงานจริง | อัดตั้งแต่ login จนโพสต์ขึ้น |
| ใช้ personal profile แทน test Business Page | เตรียม Page + IG Business ทดสอบ |
| Test credentials ใช้ไม่ได้ (หมดอายุ, ไม่มี Page, ติด verify) | บัญชี reviewer ถาวร + reviewer instructions |
| UI ไม่ใช่ภาษาอังกฤษ | EN locale หรือ overlay |
| คำอธิบาย use case กว้าง/ซ้ำกัน ("to improve user experience") | เขียนแยกต่อ permission |
| Privacy policy ไม่กล่าวถึง Meta API/ข้อมูลที่เก็บ หรือไม่มีขั้นตอนขอลบข้อมูล | Meta FAQ: แค่บอกว่าขอลบได้ "is not sufficient" ต้องมีวิธียื่นคำขอ (VERIFIED-snippet) |
| คำอธิบายกับ screencast ไม่ตรงกัน (อ้าง Developer Policy 1.6 ในประกาศ reject ที่มีคนโพสต์) | ใช้ script เดียวกันทั้งสองส่วน |
| BV ยัง pending | ทำ BV ให้เสร็จก่อนยื่น |
| ไม่มี API call ล่าสุดภายใน 30 วันก่อนยื่น | ยังยืนยันไม่ได้ (REPORTED, singhamandeep) |

## 5. Data Use Checkup และภาระหลังอนุมัติ
Data Use Checkup (DUC) คือ "annual assessment" ว่าการใช้ข้อมูลผ่าน Meta API ยังสอดคล้องกับ Platform Terms/Developer Policies ใช้กับแอปที่ Live พร้อม use case หรือมี Advanced Access ส่วนแอป Standard Access ได้รับยกเว้น ระหว่าง Development mode ไม่ต้องทำ แต่ "will need to complete DUC before the app can be switched to Live mode" ตั้งแต่ ม.ค. 2024 มี data handling questions รวมอยู่ใน DUC ด้วย (VERIFIED-snippet, Meta DUC doc)

Meta ประกาศ **Data Access Renewal** (blog 2024-08-22) ที่รวม data handling questions, DUC และ Data Protection Assessment ให้เป็นการประเมินรายปีครั้งเดียว ส่วนประกอบได้แก่ ยืนยัน business connection ผ่าน Meta Business Suite, ยืนยัน allowed usage ต่อ permission, data handling questions, data protection questions (สำหรับบางแอป แบ่งเป็น app purpose / data sharing / data deletion / data security) และ reviewer instructions (VERIFIED-snippet + REPORTED ppc.land) FAQ ระบุว่าต้อง certify ทุก permission ที่เคยได้ ควรลบ permission ที่ไม่ใช้ออกจาก Dashboard ก่อน และอาจต้องทำบ่อยขึ้นเมื่อขอ permission ใหม่ผ่าน App Review (VERIFIED-snippet) วันที่บังคับใช้ Data Access Renewal จริงยังยืนยันไม่ได้

ภาระอื่น: Data Deletion Request Callback เป็น optional แต่ถ้ามีต้องเป็น HTTPS, ใส่ใน Settings ของ App Dashboard และตอบกลับด้วย URL สถานะ + confirmation code ที่คนอ่านเข้าใจได้ (VERIFIED-snippet) vendor บางรายอ้างว่าต้องมี callback หรือ instructions URL อย่างใดอย่างหนึ่งจึงผ่าน review ได้ ซึ่งขัดกับคำว่า optional ของ Meta (REPORTED, ขัดกัน) นอกจากนี้ Meta อาจสั่ง App Review ซ้ำได้ตามดุลยพินิจ (conductatlas สรุป Platform Policy)

## ผลต่อ PRD
1. **เลื่อน Business Verification ขึ้นเป็นสัปดาห์ที่ 0-1 (แก้ PRD ตาราง milestone บรรทัด "Meta App Review" และ ARCHITECTURE workstream C)** ต้องจดทะเบียนนิติบุคคลไทยและเตรียมหนังสือรับรอง + เอกสารที่อยู่ที่ชื่อตรงกันทุกตัวอักษรก่อนเริ่ม dev จากนั้นทำ Tech Provider AV ทันทีที่ BV ผ่าน แล้วยื่น App Review เมื่อ flow publish เสร็จจริงเท่านั้น (ไม่ใช่ "สัปดาห์ที่ 3" แบบตายตัว) งบเวลา 6-10 สัปดาห์ และเผื่อ reject 1-2 รอบ
2. **เพิ่ม requirement ใหม่ CMP-1 "Review mode ภาษาอังกฤษ"**: i18n EN locale อย่างน้อยสำหรับหน้า Connect Page/IG, composer, scheduler, ประวัติโพสต์ (ขัดกับหลัก Thai-only ใน CLAUDE.md จึงต้องเป็น toggle ที่ซ่อนไว้ ไม่ใช่เปลี่ยนภาษาหลัก)
3. **CMP-2 Legal pages**: privacy policy สาธารณะ (HTTPS, ไม่ต้อง login) ที่ระบุ Meta API, ข้อมูลที่เก็บต่อ permission, ระยะเก็บ และขั้นตอนขอลบข้อมูลแบบทำตามได้ พร้อม Data Deletion Callback endpoint ที่คืน status URL + confirmation code (เชื่อมกับ 23-legal-pdpa)
4. **CMP-3 Scope minimization แบบยื่นเป็นรอบ**: รอบแรก `pages_show_list`, `pages_read_engagement`, `pages_manage_posts`, `instagram_basic`, `instagram_content_publish` ส่วน `business_management` ขอเฉพาะถ้าสถาปัตยกรรม token ต้องใช้จริง และ `read_insights`/`instagram_manage_insights` (ANA-1) ยื่นรอบสองหลังฟีเจอร์ analytics เสร็จ แก้ ARCHITECTURE บรรทัด Scopes ให้สะท้อนการแบ่งรอบ
5. **CMP-4 Reviewer kit**: Business Page + IG Business account ทดสอบถาวร, บัญชี reviewer ที่ไม่มี OTP/ไม่หมดอายุ/มีเครดิตพอ, reviewer instructions, screencast script ต่อ permission ที่ตรงกับข้อความ use case และ cron ที่เรียก API เป็นระยะให้มี activity ล่าสุด
6. **CMP-5 Compliance calendar**: เจ้าของงาน + reminder สำหรับ Data Use Checkup/Data Access Renewal รายปี (ต้องทำก่อนสลับ Live ครั้งแรกด้วย) และ log ว่า permission ใดใช้ที่ไหนเพื่อให้ certify ได้เร็ว
7. **คง fallback ใน PRD (โหมด "ดาวน์โหลด + คัดลอก caption" และ beta tester เป็น app tester)** ระหว่างรอ แต่ระบุใน onboarding ว่าช่วง beta ต้องเพิ่มผู้ใช้เป็น tester ของแอปก่อนจึงเชื่อม Page ได้ (Standard Access)

## คำถามที่ยังเปิด
1. รายการ permission ที่ trigger Tech Provider AV ในปี 2026 ยังเป็นชุดเดียวกับปี 2022 หรือไม่ และ Instagram Login path (`instagram_business_*`) trigger AV หรือไม่ (ถ้าไม่ อาจลดด่านได้)
2. ตัวเลข "20 วัน" มาจากประกาศของ Meta จริงหรือเป็นการตีความของ bundle.social (ต้องอ่าน App Dashboard ตอนยื่นจริง)
3. Meta รับเอกสารไทยประเภทใดสำหรับ BV (หนังสือรับรองบริษัทจาก DBD, ภ.พ.20) และต้องแปลอังกฤษหรือไม่ (INFERRED ว่าหนังสือรับรองใช้ได้ ยังไม่ยืนยัน)
4. Data Access Renewal บังคับใช้แทน DUC เต็มรูปแบบแล้วหรือยัง และรอบแรกของ PANGLAB จะตรงกับช่วงใด
5. จำนวน tester สูงสุดที่เพิ่มได้ใน Standard Access เพียงพอสำหรับ beta หรือไม่
6. ข้อกำหนด "API call ภายใน 30 วันก่อนยื่น" มีจริงหรือไม่

## แหล่งอ้างอิง
- https://developers.facebook.com/docs/app-review/submission-guide/screen-recordings (snippet; หน้าเต็มถูกบล็อก)
- https://developers.secure.facebook.com/docs/app-review/submission-guide/screen-recordings/ (ถูกบล็อก)
- https://developers.facebook.com/videos/2024/creating-screencasts-for-meta-app-review/
- https://developers.secure.facebook.com/videos/2024/creating-screencasts-for-ongoing-checks
- https://developers.facebook.com/docs/instagram-platform/app-review
- https://developers.facebook.com/docs/instagram-platform/overview
- https://developers.facebook.com/blog/post/2022/06/02/access-verification-process-for-tech-provider-apps/
- https://products.zetaglobal.com/selligent/EN/Content/Engage/Admin Configuration/Details/MetaTechProviderAccessVerificationProcess.htm
- https://www.pymnts.com/meta/2022/meta-debuts-tech-provider-verification/
- https://docs.360dialog.com/partner/get-started/tech-providers/becoming-a-meta-tech-provider-a-step-by-step-guide
- https://singhamandeep.com/?p=1392 (Tech Provider & Access Verification, ผู้ขายบริการ)
- https://singhamandeep.com/what-is-meta-advanced-access/
- https://singhamandeep.com/rejected-facebook-app-review-fix/
- https://developers.secure.facebook.com/docs/resp-plat-initiatives/data-use-checkup
- https://developers.facebook.com/docs/resp-plat-initiatives/data-access-renewal/
- https://developers.facebook.com/documentation/resp-plat-initiatives/data-access-renewal/faqs
- https://developers.facebook.com/documentation/resp-plat-initiatives/data-access-renewal/tutorial
- https://developers.secure.facebook.com/blog/post/2024/08/22/meta-data-access-renewal
- https://ppc.land/meta-unveils-consolidated-data-access-renewal-process-for-developers/ (ถูกบล็อก, ใช้ snippet)
- https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback
- https://developers.facebook.com/documentation/development/terms-and-policies/faqs
- https://bundle.social/blog/meta-app-review-20-days (ถูกบล็อก, ใช้ snippet)
- https://bundle.social/blog/facebook-api-permissions
- https://woopsocial.com/blog/meta-app-review-rejected-2026-fix-guide (ถูกบล็อก, ใช้ snippet)
- https://www.teamblind.com/post/helpadvice-with-facebook-app-review-for-advanced-access-gs1pboj2
- https://help.klaviyo.com/hc/en-us/articles/40116148219163
- https://support.wati.io/en/articles/11463209-why-can-t-my-business-be-verified-by-meta
- https://support.myoperator.com/portal/en/kb/articles/what-documents-are-required-for-facebook-business-verification-20-9-2025
- https://www.aurorainbox.com/en/2026/05/14/what-is-meta-business-verification/
- https://conductatlas.com/platform/meta/meta-platform-policy/meta-may-require-app-review-at-its-discretion/
