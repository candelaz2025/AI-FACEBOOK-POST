# POPCONT: FAQ, Auth, Payment, Legal และ Sitemap

> Research subagent 1/30 · ข้อมูล ณ 2026-10-07 · ดึงผ่าน Apify (`rag-web-browser`, `web-fetch`) เพราะ egress proxy บล็อก popcont.ai · **ไม่ได้ login ไม่ได้สมัคร และไม่ได้ submit ฟอร์มใด ๆ** · ข้อมูลหลัง login มาจาก i18n strings และ client code ใน JS bundle สาธารณะ (`/_next/static/chunks/*`) ไม่ได้เห็นหน้าจอจริง
>
> แท็ก: **VERIFIED** = อ่านจากหน้าเว็บหรือไฟล์ต้นทางโดยตรง · **BUNDLE** = อ่านจาก JS bundle สาธารณะ (เป็นข้อความหรือโค้ดจริง แต่อาจยังไม่เปิดใช้หรือไม่แสดงบนหน้า) · **INFERRED** = อนุมาน

## สรุป

POPCONT ใช้ NextAuth กับ 3 วิธีเข้าระบบ คือ Google, LINE (ปุ่มจะแสดงเมื่อ backend เปิด provider นี้) และ email + password ขั้นต่ำ 12 ตัวอักษร ผู้ใช้ต้องยืนยันอีเมลก่อนจึงใช้เครดิตได้ หน้า checkout รับ 3 ช่องทาง คือ บัตรเครดิต, Thai QR (ยืนยันอัตโนมัติ, QR หมดอายุใน 15 นาที) และโอนเงินแล้วส่งสลิป (ทีมงานเพิ่มเครดิตให้เอง) มีระบบ promo code พร้อมเงื่อนไขครบ เครดิต "ไม่มีหมดอายุ" และไม่คืนเงิน ด้านกฎหมายมีเอกสารครบ 4 ฉบับ (Terms, Privacy, Cookie, AI Policy) และผูกกับ PDPA ส่วน sitemap มีแค่ 5 URL จึงแทบไม่มีเนื้อหาที่ช่วย SEO

## 1. คำตอบ FAQ บนหน้าแรก (ครบทั้ง 6 ข้อ)

คำตอบไม่อยู่ใน HTML ที่ render แล้ว (accordion โหลดฝั่ง client) แต่พบเป็น i18n strings `faq.q1–q6` / `faq.a1–a6` ใน `app/page-89e6bd1aed12fae7.js` — **VERIFIED (BUNDLE)**

| # | คำถาม | คำตอบ (ตามต้นฉบับ) | หมายเหตุ |
|---|---|---|---|
| 1 | ไม่เคยใช้ AI มาก่อนใช้ได้หรือไม่ ? | "ใช้ได้ครับ Popcont ออกแบบมาให้ไม่ต้องเขียน Prompt เอง แค่ใส่ข้อมูลแบรนด์ครั้งเดียว ระบบจะวางแนวทางคอนเทนต์ให้ทั้งหมด" | ขายด้วยจุดเด่น "ไม่ต้อง prompt เอง" |
| 2 | ข้อมูลที่ใส่เข้าไปในระบบปลอดภัยไหม ? | "…ถูกใช้เพื่อสร้างคอนเทนต์ให้แบรนด์คุณเท่านั้น ไม่ถูกนำไปเทรนโมเดลสาธารณะ และไม่แชร์ให้บุคคลที่สาม" | ขัดกับ Privacy Policy เล็กน้อย เพราะในนั้นระบุว่าส่งข้อมูลให้ OpenAI, Meta และ cloud providers ซึ่งเป็นบุคคลที่สาม |
| 3 | อยากลองใช้ทำอย่างไร ? | "สมัครฟรีรับ {n} เครดิตทันที ไม่ต้องผูกบัตรเครดิต…" | หน้าเว็บแสดง n = 3 |
| 4 | ทำคอนเทนต์ platform ไหนได้บ้าง ? | "รองรับ Facebook, Instagram และ LINE OA แบบโพสต์อัตโนมัติ ส่วน TikTok กำลังจะเปิดให้ใช้เร็วๆ นี้ (ระหว่างนี้ดาวน์โหลดไฟล์ไปโพสต์เองได้)" | **ข้อมูลไม่ตรงกัน:** roadmap ใน bundle เดียวกันระบุว่า LINE OA "อยู่ระหว่างออกแบบ" |
| 5 | มีค่าใช้จ่ายอื่น ๆ นอกเหนือจากค่าเครดิตหรือไม่ ? | "ไม่มีครับ จ่ายเฉพาะค่าเครดิตที่ซื้อ ไม่มีค่ารายเดือน และไม่มีค่าแรกเข้า" | – |
| 6 | ทำ 1 คอนเทนต์ใช้เครดิตเท่าไหร่ ? | "1 เครดิต = 1 คอนเทนต์ ได้ครบทั้งภาพและแคปชัน พร้อมตั้งเวลาโพสต์ได้ทันที" | ตัวเลขนี้เป็นการลดรูปให้ง่าย เพราะยังมีตาราง "ค่าใช้งานต่อครั้ง" แยกตาม action (ดูหัวข้อ 3) |

**Roadmap ที่ซ่อนอยู่ใน bundle** (keys `road.*` ไม่ปรากฏใน markdown ของหน้าที่ render แล้ว จึงน่าจะยังไม่แสดงบนหน้าเว็บ) — **BUNDLE**: Short Video อยู่ในสถานะ "ทดสอบภายในแล้ว", TikTok กำหนด "ไตรมาสถัดไป", LINE OA broadcast "อยู่ระหว่างออกแบบ" และมีพาร์ทเนอร์ "ร่วมกับ BytePlus — ใช้เทคโนโลยีวิดีโอ Seedance จาก BytePlus (ByteDance)"

## 2. Login / Auth

| ด้าน | สิ่งที่พบ | แท็ก |
|---|---|---|
| Framework | NextAuth: cookies `next-auth.session-token` (อายุ session สูงสุด 30 วัน), `next-auth.csrf-token`, `next-auth.callback-url` และโค้ดเรียก `signIn()` / `getProviders()` | VERIFIED (Cookie Policy) + BUNDLE |
| Providers | `google`, `line`, `credentials` (email + password) หน้า `/login` แสดงปุ่ม "ดำเนินการต่อด้วย Google", "ดำเนินการต่อด้วย LINE", "หรือใช้อีเมล" และ "ลืมรหัสผ่าน?" | VERIFIED (หน้า /login ที่ render แล้ว) |
| ปุ่ม LINE เป็นแบบมีเงื่อนไข | ปุ่มจะแสดงเมื่อ `getProviders()` คืน `line` มา จึงเป็น feature flag ฝั่ง server | BUNDLE |
| Password policy | ขั้นต่ำ 12 ตัวอักษร ต้องกรอกยืนยันซ้ำ ลิงก์ reset ใช้ได้ครั้งเดียวและหมดอายุใน 1 ชม. และ endpoint forgot มี rate limit (คืน 429) | BUNDLE |
| Email verification | "ยืนยันอีเมลก่อนเริ่มสร้างคอนเทนต์" (`auth.unverified_spend`) แปลว่าต้องยืนยันก่อนจึงใช้เครดิตได้ ซึ่งช่วยกันคนสมัครหลายบัญชีเพื่อเอาเครดิตฟรี | BUNDLE |
| สถานะบัญชี | `account_closed` และ `account_suspended` แต่ละสถานะมีข้อความแจ้งของตัวเอง | BUNDLE |
| Backend | API แยกที่ `https://api.popcont.ai/api/v1/...` ส่ง `Authorization: Bearer <session.apiToken>` เมื่อได้ 401 จะ redirect ไป `/login?callbackUrl=…&expired=1` | BUNDLE |
| Referral ตอนสมัคร | ช่อง "มีโค้ดแนะนำ?" (ยาวไม่เกิน 16 ตัว) ส่วน `?ref=` จะเก็บใน localStorage `popcont_ref` ได้ 30 วัน แล้ว claim ผ่าน `/api/v1/affiliate/claim` หลัง login | BUNDLE |
| Route ที่ต้อง login | `/how-to` redirect ไป `/login?callbackUrl=%2Fhow-to` แปลว่าคู่มือใช้งานไม่เปิดให้คนทั่วไปอ่าน ส่วน `/subscribe` และ `/checkout` ได้ HTML shell ขนาด 19,087 bytes เท่ากับหน้า login | VERIFIED |
| ช่องโหว่ด้านการเปิดเผยข้อมูล | Privacy Policy พูดถึงแค่ "Google OAuth" และไม่พูดถึง LINE Login เลย | VERIFIED (privacy) |

## 3. Payment และเครดิต

| ด้าน | สิ่งที่พบ | แท็ก |
|---|---|---|
| ช่องทางชำระ | 💳 บัตรเครดิต (ชื่อบนบัตร / เลขบัตร / วันหมดอายุ / CVV) · 📱 QR Code ("ชำระด้วย Thai QR", ยืนยันอัตโนมัติ, "QR หมดอายุใน 15 นาที") · 🏦 โอนเงิน ("โอนภายใน 24 ชั่วโมงและส่งสลิปให้ทีมงาน เครดิตจะเพิ่มด้วยตนเอง") | BUNDLE (`checkout.*`, `subscribe.*`) |
| Payment gateway | Terms §9 ระบุ Stripe ในรายชื่อผู้ให้บริการภายนอก ส่วน Privacy ระบุว่า "ข้อมูลการชำระเงินจัดการโดยพันธมิตรเกตเวย์… เราจัดเก็บเฉพาะบันทึกใบแจ้งหนี้" ใน bundle ไม่พบชื่อ Stripe, Omise, 2C2P หรือ gateway อื่น | VERIFIED (terms/privacy) · ว่า gateway จริงคือ Stripe = INFERRED |
| Promo code | ช่อง "โค้ดส่วนลด" มี error 8 แบบ: ไม่พบโค้ด / ถูกปิด / ยังไม่เริ่ม / หมดอายุ / ใช้กับแพ็กนี้ไม่ได้ / ยอดไม่ถึงขั้นต่ำ / ใช้ครบจำนวนแล้ว / คุณใช้ไปแล้ว และมีแบนเนอร์ "ตอนนี้มีโปรโมชันอยู่" | BUNDLE |
| อายุเครดิต | "เครดิตไม่มีหมดอายุ" (`subscribe.feat.no_expiry`) แต่ Terms ระบุว่าเครดิตคงเหลือ "จะถูกริบเมื่อมีการปิดบัญชีโดยสมัครใจ" | BUNDLE + VERIFIED |
| คืนเงิน | "ไม่สามารถขอคืนเงินได้" (checkout) ส่วน Terms §4 เขียนว่า "ถือเป็นที่สิ้นสุด… เว้นแต่ที่กฎหมายคุ้มครองผู้บริโภคของไทยกำหนด" | VERIFIED |
| VAT / ใบกำกับภาษี | ราคาแสดงเป็น "+VAT 7%" ใบเสร็จพิมพ์หรือบันทึก PDF ได้ แต่ถ้าต้องการ**ใบกำกับภาษีต้องส่งอีเมล**แจ้งชื่อบริษัท ที่อยู่ และเลขผู้เสียภาษีเอง ระบบไม่มีให้ทำเอง | BUNDLE |
| ค่าใช้งานต่อ action | มีตาราง "ค่าใช้งานต่อครั้ง" แยกเป็น แผนแคมเปญ AI, Brand DNA, แคปชั่นอย่างเดียว, แคปชั่น + รูปภาพ, สร้างแคปชั่นใหม่, สร้างรูปใหม่, AI แต่งรูป, แก้ไขด้วย Mask พร้อมข้อความ "ราคาถูกตั้งโดยแอดมิน และมีผลทันที" (**ไม่ตรงกับ Terms** ที่สัญญาว่าจะแจ้งล่วงหน้าอย่างน้อย 7 วัน) ไม่พบตัวเลขเครดิตต่อ action | BUNDLE + VERIFIED |
| ของแถมในแพ็ก | "แก้ไขคอนเทนต์ได้ ฟรี! 1 ครั้ง (เฉพาะรูปภาพ)" และ "ไม่จำกัดจำนวนแบรนด์" | BUNDLE |
| Analytics events | GA4 มี `begin_checkout` (พร้อม `coupon`) และ `purchase` (พร้อม `discount`, `credits_added`) ส่วน Meta Pixel มี `InitiateCheckout`, `Purchase` และ `CompleteRegistration` (แนบ provider) | BUNDLE |
| Affiliate | 2 ระดับ: สมาชิกได้เครดิตเมื่อคนที่แนะนำ "ซื้อครั้งแรก" (สมัครอย่างเดียวไม่ได้อะไร) ส่วน Partner (ต้องสมัครและรออนุมัติ) ได้ % ของยอดสั่งซื้อ "จ่ายเงินแบบ manual… ยังไม่มีปุ่มถอน" | BUNDLE |
| ราคาใน metadata ไม่ตรงกับหน้า | JSON-LD และ meta description ยังเขียน "เริ่มต้น ฿990" กับ "8 THB per AI content pack" ขณะที่หน้า pricing ปัจจุบันแสดง ฿349/10 เครดิต และ "คอนเทนต์ละ 30 บาท" | VERIFIED |

## 4. Terms / Privacy / Cookie / AI Policy (ประเด็นที่มีผลต่อการออกแบบ)

| เอกสาร (อัปเดตล่าสุด) | ประเด็นสำคัญ |
|---|---|
| Terms (17 ส.ค. 2026) | คู่สัญญาคือ บริษัท ซิกซ์ชีต เทค จำกัด · ผู้ใช้ต้องอายุ 18+ · บริษัทอาจขอยืนยันตัวตนหรือสถานะธุรกิจและระงับบัญชีระหว่างรอได้ · เครดิตไม่ใช่ e-money, โอนไม่ได้, ไม่มีมูลค่าเงินสด · ระบุชื่อ OpenAI, Anthropic, Google, Meta, AWS, Cloudflare, Stripe เป็นผู้ให้บริการภายนอก · §10 เขียนชัดว่า auto-publish อาจ "โพสต์ซ้ำ / โพสต์ผิดบัญชี / ไม่เผยแพร่" และผู้ใช้ต้องตรวจสอบเอง · เพดานความรับผิด = ยอดที่จ่ายใน 3 เดือนก่อนเหตุ · ใช้ศาลกรุงเทพฯ · ถ้าสองภาษาขัดกันให้ยึดฉบับภาษาอังกฤษ |
| Privacy (3 ส.ค. 2026) | เขียนตาม PDPA · เก็บ FB Page ID, IG Business ID, page token และ refresh token · AI หลักคือ OpenAI (USA) · ไม่ใช้ข้อมูลผู้ใช้เทรนโมเดลถ้าไม่ได้รับความยินยอม · ระยะเก็บข้อมูล: บัญชีและเนื้อหาลบภายใน 30 วันหลังปิดบัญชี, ใบแจ้งหนี้เก็บ 7 ปี (ประมวลรัษฎากร), log เก็บ 90 วัน, การติดต่อ support เก็บ 2 ปี · กด Disconnect ที่ `/social` แล้วลบ token ทันที · **ลบบัญชีต้องส่งอีเมล** หัวข้อ "Account Deletion Request" และใช้เวลาไม่เกิน 30 วัน |
| Cookie (3 ส.ค. 2026) | GA4 (`G-04PSRCTHRY`) และ Meta Pixel จะโหลดเฉพาะหลังผู้ใช้กดยอมรับในแบนเนอร์ · เก็บการตั้งค่าความยินยอมใน localStorage `popcont_analytics_consent` · มี cookie `marko-theme` (INFERRED: "marko" น่าจะเป็นชื่อโค้ดภายในของ codebase) |
| AI Policy (3 ส.ค. 2026) | ใช้ OpenAI "และผู้ให้บริการ AI รายอื่นเป็นครั้งคราว" · **POPCONT ไม่ติดป้าย AI-disclosure ให้โพสต์** ผู้ใช้ต้องรับผิดชอบเอง · ยืนยันหลัก human-in-the-loop ว่า "ไม่เผยแพร่… โดยปราศจากการกระทำที่ชัดแจ้งของท่าน (เผยแพร่เอง หรือตามกำหนดเวลาที่ท่านอนุมัติ)" · คนอื่นอาจได้ผลลัพธ์คล้ายกัน ไม่การันตีความเป็นเอกลักษณ์ |

## 5. sitemap.xml

`https://popcont.ai/sitemap.xml` มี 5 URL และทุกอันมี `lastmod` เป็น `2026-10-06T16:57:01.219Z` เท่ากัน จึงน่าจะสร้างใหม่ทุกครั้งที่ build (INFERRED) — **VERIFIED**

| URL | changefreq | priority |
|---|---|---|
| https://popcont.ai | weekly | 1 |
| /terms · /privacy · /cookies · /ai-policy | yearly | 0.3 |

ใน sitemap ไม่มี blog, help center, template gallery หรือหน้าแยกตามอุตสาหกรรมเลย แม้หน้าแรกจะโชว์ตัวอย่างถึง 17 อุตสาหกรรม ส่วน `/how-to` ก็ต้อง login ก่อน ทำให้ POPCONT แทบไม่มีพื้นที่ SEO แบบ long-tail (INFERRED)

## ผลต่อ PRD

| PRD / Doc | สถานะเดิม | ข้อเสนอ |
|---|---|---|
| AUTH-1 (PRD §6.1) | Google + LINE Login + Email OTP | **คงไว้** และให้ LINE เป็นปุ่มหลักตั้งแต่วันแรก (POPCONT ยังซ่อน LINE ไว้หลัง flag) ใช้ Email OTP/magic link แทนรหัสผ่าน 12 ตัวเพื่อลดขั้นตอน เพิ่ม **AUTH-1b (P0): ต้องยืนยันอีเมล/เบอร์ก่อนใช้เครดิตฟรี** และเก็บสถานะ `suspended/closed` ไว้ใน `workspaces` |
| BILL-1 | "ไม่หมดอายุภายใน 12 เดือน" | คู่แข่งให้ **ไม่หมดอายุเลย** ถ้าเราตั้ง 12 เดือนจะดูแย่กว่า จึงแนะนำ "ไม่หมดอายุตราบที่บัญชียัง active" เพื่อปิด open question #2 ใน PRD §10 |
| BILL-2 | PromptPay QR + บัตร | คงไว้ ตั้ง QR timeout ไว้ประมาณ 15 นาทีเท่าคู่แข่ง **ไม่ทำการโอนเงินแล้วส่งสลิปใน MVP** เพราะต้องมีคนเติมเครดิตเอง (ภาระ ops) ถ้าจำเป็นให้เปิดเฉพาะ Enterprise/B2B |
| BILL-5 | ใบกำกับภาษีเต็มรูป | ทำให้ **self-serve ใน checkout** (กรอกเลขผู้เสียภาษีและที่อยู่ แล้วได้ PDF ทันที) เป็นจุดต่างชัดเจน เพราะ POPCONT ยังต้องส่งอีเมลขอ |
| BILL ใหม่: Promo (P1) | ไม่มี | เพิ่ม promo engine ที่มีเงื่อนไข: ช่วงวันที่, ใช้ได้เฉพาะแพ็ก, ยอดขั้นต่ำ, จำกัดจำนวนรวม, จำกัดต่อคน · ใน Architecture ให้เพิ่มตาราง `promo_codes` และ `promo_redemptions` |
| BILL ใหม่: Price transparency (P1) | §7.1 มีตารางต้นทุน | **เปิดตารางเครดิตต่อ action ให้ดูได้โดยไม่ต้อง login** และสัญญาว่าจะแจ้งล่วงหน้าก่อนเปลี่ยนราคา (POPCONT เขียนว่า "แอดมินตั้ง มีผลทันที" ซึ่งขัดกับ Terms ของตัวเอง) และคืนเครดิตอัตโนมัติเมื่อ generate หรือ publish ล้มเหลวจากฝั่งระบบ (ARCHITECTURE §3.1 ข้อ 8 รองรับแล้ว) |
| BILL-6 Affiliate | P2 | ใช้โครง 2 ระดับแบบคู่แข่ง (เครดิตสำหรับสมาชิก, revenue share สำหรับ partner) และนับเฉพาะ**การซื้อครั้งแรก**เพื่อกันการโกง ส่วน payout ควรมีขั้นตอนชัดเจนกว่า "manual" |
| Legal / PDPA (PRD §8) | มีบรรทัดเดียว | ต้องมีเอกสาร **4 ฉบับ** ก่อน beta: Terms, Privacy, Cookie, AI Policy · ระบุ LINE Login ใน Privacy ให้ครบ (คู่แข่งตกหล่นเรื่องนี้) · โหลด GA/Pixel หลังผู้ใช้ยินยอมเท่านั้น · ทำ **ปุ่มลบบัญชีให้ผู้ใช้กดเอง** พร้อม Data Deletion Callback สำหรับ Meta App Review |
| AI disclosure (ใหม่, P2) | ไม่มี | ใส่ toggle "ติดป้าย AI-generated" ให้เลือกเปิดได้ และเตือนตามกฎของแต่ละแพลตฟอร์ม (POPCONT ผลักความรับผิดชอบนี้ให้ผู้ใช้ทั้งหมด) |
| SEO / Growth (ใหม่) | ไม่มี | เปิด help center และ template/industry pages ให้อ่านได้โดยไม่ต้อง login แล้วใส่ใน sitemap ตั้งแต่ launch (POPCONT มี 5 URL และ how-to อยู่หลัง login) และตรวจให้ JSON-LD ตรงกับราคาจริงด้วย test |
| ARCHITECTURE §1 | Supabase Auth + Stripe | ยังใช้ได้: Supabase รองรับ Google และต่อ LINE ผ่าน custom OIDC ได้ ส่วน Stripe TH รองรับ PromptPay กับบัตร (จะโอนเงินแบบ manual ไม่ได้ ซึ่งไม่กระทบเพราะเราตัดออกแล้ว) และควรเก็บ `provider` ของการสมัครไว้วัด funnel ตาม channel เหมือนที่คู่แข่งทำ |

## คำถามที่ยังเปิด

1. POPCONT ใช้ gateway อะไรจริง (Stripe ตามรายชื่อใน Terms หรือ gateway ไทย) และ Thai QR ของเขาคือ PromptPay ผ่าน gateway ตัวนั้นหรือไม่ ต้องดูหน้า checkout จริงหลัง login
2. แต่ละ action (Brand DNA, Campaign Plan, AI แต่งรูป, Mask edit, regenerate) ใช้กี่เครดิต ไม่พบตัวเลขใน bundle
3. LINE OA auto-post ใช้งานได้แล้วหรือยัง เพราะ FAQ บอกว่ารองรับ แต่ roadmap บอกว่า "อยู่ระหว่างออกแบบ"
4. คนที่สมัครผ่าน Google/LINE ต้องยืนยันอีเมลซ้ำหรือไม่ และเครดิตฟรี 3 เครดิตต่อบัญชีมีระบบกันสมัครซ้ำอื่นนอกจากการยืนยันอีเมลหรือเปล่า

## แหล่งอ้างอิง

- https://popcont.ai/ (หน้าแรกที่ render แล้ว + raw HTML + JSON-LD)
- https://popcont.ai/sitemap.xml
- https://popcont.ai/login (render ผ่าน apify/web-fetch wait 8s)
- https://popcont.ai/how-to (redirect → /login?callbackUrl=%2Fhow-to)
- https://popcont.ai/subscribe?plan=starter และ https://popcont.ai/checkout (ได้ login shell)
- https://popcont.ai/terms
- https://popcont.ai/privacy
- https://popcont.ai/cookies
- https://popcont.ai/ai-policy
- https://popcont.ai/_next/static/chunks/app/page-89e6bd1aed12fae7.js (FAQ answers, roadmap, nav strings)
- https://popcont.ai/_next/static/chunks/app/login/page-40dc9b70e17167ba.js (login page, analytics events)
- https://popcont.ai/_next/static/chunks/1779-83243523d9c156e6.js (auth form: providers, password, referral)
- https://popcont.ai/_next/static/chunks/7150-bdca48b0fd58e79b.js (i18n: checkout, subscribe, billing, credits, affiliate, auth)
- https://popcont.ai/_next/static/chunks/webpack-ab80b07001ada9d2.js (webpack runtime; ไม่มี route map)
- อ้างอิงภายใน: /home/user/AI-FACEBOOK-POST/docs/panglab/RESEARCH.md, PRD.md, ARCHITECTURE.md
