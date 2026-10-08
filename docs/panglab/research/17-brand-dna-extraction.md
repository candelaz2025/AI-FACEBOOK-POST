# 17 — Brand DNA Extraction: เทคนิค/API ดึงตัวตนแบรนด์อัตโนมัติจาก URL หรือเพจโซเชียล

> ค้นคว้าเมื่อ 2026-10-08 · เว็บทางการของ brandfetch.com และ firecrawl.dev ถูก egress proxy บล็อก ส่วน Apify ใช้ไม่ได้เพราะชน concurrent limit ข้อมูลส่วนใหญ่จึงมาจาก search summary ของหน้าทางการ (เช่น `brandfetch.com/developers/brand-api.md` และ `docs.brand.dev/pricing`) กับบทความของบุคคลที่สาม ป้ายกำกับมีสองแบบ: **VERIFIED** คือข้อมูลที่ search summary อ้างจากหน้าทางการหรือแหล่งปฐมภูมิ ส่วน **INFERRED** คือข้อสรุปของผู้เขียนหรือข้อมูลจากบุคคลที่สามที่ยังไม่ได้ยืนยัน

## สรุป
ถ้าแหล่งข้อมูลเป็น **เว็บไซต์** ทำ auto-scan ได้ถูกและเร็ว ตลาดมี API สำเร็จรูปอย่าง Brandfetch, Brand.dev และ Firecrawl `branding` ที่คืน logo, สี และฟอนต์ใน call เดียว หรือจะทำเองด้วย headless browser + Color Thief + Gemini ก็ได้ ต้นทุนต่อการสแกนหนึ่งครั้งต่ำกว่า 0.1 USD ทุกทาง ส่วน **เพจ Facebook/Instagram** ห้าม scrape เพราะ Meta Automated Data Collection Terms ต้องได้ express written permission ก่อน ให้อ่านข้อมูลผ่าน Graph API เฉพาะเพจที่ผู้ใช้เชื่อมต่อเอง (`pages_read_engagement` / `instagram_business_basic`) ข้อมูลน้ำเสียง (voice) สกัดได้ดีที่สุดเมื่อให้ LLM อ่านโพสต์จริงของแบรนด์แล้วคืนค่าเป็น structured output ตามแกน tone ที่วัดได้

## 1. ภาพรวม pipeline ที่แนะนำ

| ชั้น | หน้าที่ | ตัวเลือก | หมายเหตุ |
|---|---|---|---|
| Fetch | ดึง HTML/markdown/screenshot ของเว็บ | Firecrawl (`markdown` + `branding`), Gemini URL context tool, หรือ Playwright ที่ host เอง | ห้ามใช้กับ facebook.com / instagram.com |
| Deterministic extract | logo, สี, ฟอนต์, og:image, favicon | Brandfetch Logo API (ฟรี), Firecrawl `branding`, Color Thief / node-vibrant, CSS `font-family` | ได้ค่าที่ตรวจสอบได้ ไม่หลอน |
| Social (connected) | โพสต์เก่า, รูปโปรไฟล์/ปก, bio | Graph API: `pages_read_engagement`, IG `instagram_business_basic` | ใช้ได้หลังผู้ใช้กด Connect แล้วเท่านั้น |
| LLM synthesis | voice, audience, USP, do/don't words, products | Gemini Flash + `responseSchema` ตาม `BrandDNA` | ทุก field ต้องเก็บ provenance และ confidence |
| Human confirm | "นี่คือแบรนด์คุณใช่ไหม?" | UI ใน S3/S11 | ผู้ใช้แก้ได้ทุก field ก่อนบันทึก |

## 2. Brandfetch API

Brandfetch แยกผลิตภัณฑ์เป็นสองกลุ่ม กลุ่มแรกคือ **Logo API / Brand Search API** ใช้ฟรีได้ถึง 500,000 requests/เดือนโดยไม่ต้องใส่ attribution เมื่อเกินจะเป็น soft cap ที่ส่งแค่การแจ้งเตือน (VERIFIED จาก search summary ของหน้าทางการ) กลุ่มที่สองคือ **Brand API** ซึ่งคืนข้อมูลครบใน response เดียว ได้แก่ logo ทุกแบบ (light/dark/icon/symbol), brand colors, fonts, company description, industry, location และ social profiles แผนฟรีมี 100 requests และแผนเสียเงินคือ **$129/เดือน ได้ 2,500 fetches** ใช้ร่วมกับ Brand Context โดย overage คิด **$0.10/fetch** และโควตาไม่ทบไปเดือนถัดไป (VERIFIED จาก `brandfetch.com/developers/brand-api.md` แม้รีวิวบุคคลที่สามจะบอกว่า $99 และ Geekflare บอกว่าแผนฟรีได้ 500 requests ซึ่งขัดกัน ผู้เขียนเลือกเชื่อตัวเลขของ vendor)

ข้อจำกัดเชิงสัญญาที่กระทบ PANGLAB โดยตรง: ตาม pricing FAQ ใช้ข้อมูลในเชิงพาณิชย์แบบ internal ได้ เช่น แสดงโลโก้ในแอป แต่ถ้าจะ **sublicense ให้ลูกค้าหรือใส่ไว้ใน API response ของเราเอง ต้องทำ agreement แยก** (VERIFIED จาก search summary) ข้อนี้ไม่ใช่ปัญหาตราบที่ข้อมูลอยู่ใน Brand DNA ของ tenant แต่ถ้า PANGLAB เปิด public API ในอนาคตจะติดเงื่อนไขนี้ อีกเรื่องคือ Brandfetch ทำงานจาก **domain** แบรนด์ไทยขนาดเล็กที่มีแค่เพจ FB ไม่มีเว็บจึงอาจไม่มีข้อมูลเลย และยังไม่มีตัวเลข coverage ของแบรนด์ไทย (INFERRED)

## 3. Firecrawl `branding` format

เรียกโดยใส่ `formats=["branding"]` ใน scrape ได้ logo, favicon, share image, colors (primary/secondary), font families, spacing scale และ UI component styles ใช้กับ batch scrape และ crawl ได้ด้วย และ branding format v2 อ้างว่าจับ logo ของเว็บที่สร้างด้วย Wix/Framer ได้ถูกต้องแล้ว (VERIFIED จาก search summary ของเอกสาร/บล็อก Firecrawl) ข้อดีที่สำคัญคือ scrape เดียวกันขอ `markdown` มาพร้อมกันได้ จึงได้ข้อความไปให้ LLM วิเคราะห์ voice ในรอบเดียว ส่วนข้อจำกัดตามที่หน้าเปรียบเทียบของ Brandfetch (คู่แข่ง) ระบุคือ Firecrawl ไม่มี brand dataset ผลจึงขึ้นกับ HTML ณ เวลาที่ scrape และ cache ค่าเริ่มต้นนานสูงสุด 2 วัน (INFERRED เพราะมาจากคู่แข่ง)

ราคา (มาจากบุคคลที่สาม และยังเปิดหน้าทางการไม่ได้): Free 500–1,000 credits (แต่ละแหล่งขัดกัน), Hobby $16 (3,000–5,000 credits ขัดกัน), **Standard $83/เดือน = 100,000 credits**, Growth $333 = 500k และ Scale $599 = 1M ราคาทั้งหมดเป็นแบบจ่ายรายปี scrape ปกติใช้ 1 credit/page ถ้าเปิด JSON extraction บวกอีก +4 credits/page และ credit ของแผนรายเดือนไม่ทบ (INFERRED) **ไม่พบ** ข้อมูลว่า `branding` คิด credit เพิ่มหรือไม่ ต้องทดสอบเอง

## 4. ทางเลือกอื่น: Brand.dev และ Gemini URL context

| บริการ | ได้อะไร | ราคา | สถานะข้อมูล |
|---|---|---|---|
| Brandfetch Brand API | logo, colors, fonts, description, socials | ฟรี 100 req · $129/2,500 fetches · overage $0.10 | VERIFIED (vendor) / มีตัวเลขขัดกัน |
| Brandfetch Logo API | logo อย่างเดียว | ฟรีถึง 500k req/เดือน | VERIFIED |
| Firecrawl `branding` | logo, colors, fonts, spacing, components + markdown | ~1 credit/page · Standard $83/100k credits | INFERRED (บุคคลที่สาม) |
| Brand.dev Brand API | logos, colors, fonts, backdrops | 10 credits/call · web scrape 1 credit · overage $6/10k credits | VERIFIED (snippet หน้า pricing) ส่วนราคาแผนขัดกัน ($29–$949) |
| Brand.dev Styleguide API | typography, spacing, shadows, components | ไม่พบราคา | VERIFIED เฉพาะว่ามี endpoint นี้ |
| Gemini URL context tool | ให้ Gemini อ่าน URL เองแล้ววิเคราะห์ | คิดเป็น input token ตามราคาโมเดล · สูงสุด 20 URLs/request, 34 MB/URL | VERIFIED จาก Google blog/Vertex docs |

Gemini URL context ตรงกับ stack ของ PANGLAB ที่ใช้ Gemini อยู่แล้ว และไม่ต้องสมัคร vendor เพิ่ม แต่มีความเสี่ยงด้านต้นทุน เพราะ tool นี้ดึงทั้งหน้าเข้าเป็น input token และไม่บอกขนาดล่วงหน้า มีนักพัฒนารายหนึ่งรายงานว่าโดนบิลราว $2,000 ภายใน 4 วัน (dejan.ai) ถ้าจะใช้ต้องตั้ง `maxOutputTokens` ปิด thinking ระดับสูง และนับ usage metadata ทุก call อีกข้อคือ tool นี้ไม่คืนค่าสีหรือฟอนต์แบบ deterministic จึงควรใช้เฉพาะการวิเคราะห์ข้อความ (INFERRED)

## 5. Color palette extraction

ถ้าทำเอง แนะนำ **Color Thief v3 (`colorthief`)** ซึ่งรันได้ทั้ง browser และ Node ด้วย API เดียวกัน ไม่มี runtime dependency รองรับ quantization ใน **OKLCH** (`colorSpace: 'oklch'`) มี `getSwatches` ที่คืน swatch แบบ Vibrant/Muted และมี option `region` สำหรับตัดพื้นหลังโลโก้ออก (VERIFIED จากเอกสาร repo) อีกตัวคือ **node-vibrant** ซึ่งเป็น port ของ Android Palette ที่คืน swatch ตามบทบาท (Vibrant, DarkMuted ฯลฯ) ตอนนี้อยู่ที่ 4.x alpha (VERIFIED)

แหล่งสีควรเรียงตามความน่าเชื่อถือดังนี้: (1) CSS variables / `theme-color` meta / สีปุ่ม CTA จาก Firecrawl `branding` หรือ DOM, (2) โลโก้ (SVG อ่านค่า fill ได้ตรง ส่วน PNG ให้ quantize 5–6 สีแล้วกรองขาว/ดำ/สีขอบ anti-alias), (3) รูปโปรไฟล์และปกเพจที่ได้จาก Graph API, (4) รูปโพสต์ล่าสุด ซึ่งมี noise สูงสุดเพราะเป็นสีของสินค้าและฉาก ไม่ใช่สีแบรนด์ (INFERRED) ผลลัพธ์ควร cluster ใน OKLCH แล้วเสนอไม่เกิน 5 สีตาม BRAND-2 พร้อมติดป้ายว่าแต่ละสีมาจากแหล่งไหน

## 6. Font detection

ฟอนต์ของเว็บดึงได้จาก CSS `font-family` หรือจาก Firecrawl `branding` แต่ `getComputedStyle().fontFamily` คืน **รายการที่ประกาศไว้** ไม่ใช่ฟอนต์ที่ render จริง ถ้าต้องการรู้ฟอนต์จริงต้องดู `document.fonts` หรือ network request ของไฟล์ฟอนต์ (INFERRED จากความรู้ทั่วไป ยังไม่ได้ตรวจกับ MDN) การระบุฟอนต์จาก **ภาพ** ด้วย WhatTheFont, Fontspring Matcherator, Aspose.OCR Cloud font identification API หรือ WhatFontIs API ยังไม่แม่น ในการทดสอบของรีวิวหนึ่งไม่มีเครื่องมือไหนระบุ Helvetica ถูกตรงตัว WhatTheFont ยังเอนไปทางฟอนต์ที่ขายบน MyFonts และไม่มีหลักฐานว่ารองรับอักษรไทยได้ดี (VERIFIED ในส่วนของรีวิว ส่วนเรื่องอักษรไทยเป็น INFERRED)

ข้อเสนอ: ไม่ต้อง "ตรวจจับ" ฟอนต์ให้ตรงตัว ให้ **map ไปยังบุคลิก** แทน คืออ่าน `font-family` แล้ว classify เป็นกลุ่ม หนักแน่น / เป็นมิตร / ทางการ / สนุก / เทค จากนั้นเลือกฟอนต์ OFL จาก whitelist ในรายงาน 18 (Kanit, Prompt, Sarabun, Mali, Chakra Petch ฯลฯ) ถ้าเว็บใช้ฟอนต์ Google Fonts ที่อยู่ใน whitelist อยู่แล้วก็ใช้ตรงตัวได้เลย

## 7. LLM voice analysis

input ที่ดีที่สุดคือโพสต์จริง 20 โพสต์ล่าสุดของเพจ (BRAND-6) รองลงมาคือข้อความ hero/about บนเว็บ โครง output ควรมีสองส่วน ส่วนแรกเป็นแกน tone ที่วัดได้ตาม **NN/g 4 dimensions** ได้แก่ funny↔serious, formal↔casual, respectful↔irreverent และ enthusiastic↔matter-of-fact ซึ่งงานวิจัยของ NN/g ในปี 2016 พบว่า tone มีผลอย่างมีนัยสำคัญต่อความรู้สึกว่าแบรนด์เป็นมิตร น่าเชื่อถือ และน่าแนะนำต่อ (VERIFIED ผ่านแหล่งทุติยภูมิ เพราะเปิดบทความต้นฉบับไม่ได้) ส่วนที่สองเป็นมิติเฉพาะภาษาไทย (INFERRED) ได้แก่ สรรพนามแทนตัว (เรา/แอดมิน/พี่), คำลงท้าย (ครับ/ค่ะ/นะคะ/จ้า), ความหนาแน่นของ emoji และ hashtag, ความยาวเฉลี่ย, รูปแบบ hook, CTA ที่ใช้บ่อย และคำที่ใช้ซ้ำ (เตรียมไว้เป็น do-words)

ด้านเทคนิคควรใช้ Gemini Flash + `responseSchema` ให้ทุก field มี `evidence[]` อ้างถึงโพสต์ต้นทาง และมี `confidence` ค่าที่เป็นนับเชิงสถิติ เช่น จำนวน emoji ความยาว และคำลงท้าย ให้คำนวณด้วยโค้ดก่อนแล้วส่งให้ LLM เป็น context ห้ามให้ LLM นับเอง แกน tone ทั้ง 4 ควร map กับ slider ใน BRAND-1 ที่มีอยู่ (ทางการ↔เป็นกันเอง, ขายตรง↔เล่าเรื่อง) และเพิ่มแกนที่ขาด (INFERRED)

## 8. กฎหมาย/ToS: Scraping FB/IG vs Graph API

| ประเด็น | ข้อเท็จจริง | สถานะ |
|---|---|---|
| Meta Automated Data Collection Terms (มีผล 7 ต.ค. 2024) | "You will not engage in Automated Data Collection without first obtaining Meta's express written permission…" การกดยอมรับ terms ไม่นับเป็น permission และการที่ข้อมูลเห็นได้แบบ public ก็ไม่ได้แปลว่าอนุญาต | VERIFIED (ข้อความอ้างผ่านแหล่งทุติยภูมิ) |
| robots.txt ของ Facebook | ระบุว่าห้ามเก็บข้อมูลอัตโนมัติถ้าไม่มี express written permission | VERIFIED (แหล่งทุติยภูมิ) |
| Meta v. Bright Data (N.D. Cal.) | 23 ม.ค. 2024 ศาลตัดสินว่าการ scrape public data แบบ **logged-out** ไม่ breach terms เพราะ terms ผูกเฉพาะ "การใช้" ของผู้มีบัญชี ต่อมา 23 ก.พ. 2024 Meta ถอนข้อหาที่เหลือและสละสิทธิ์อุทธรณ์ | VERIFIED (fbm.com, TechCrunch) |
| ขอบเขตของคำตัดสิน | เป็นคำตัดสินของ district court ไม่ผูกพันศาลอื่น และ Meta แก้ terms เพื่อห้ามได้ การ scrape แบบ **logged-in** หรือการทะลุ login wall ยังเสี่ยงสูง Meta เคยฟ้อง OneAudience และ BrandTotal มาแล้ว | VERIFIED |
| Graph API (เพจของผู้ใช้เอง) | `pages_read_engagement` อ่านโพสต์/รูป/วิดีโอของเพจ, `pages_read_user_content` อ่าน UGC บนเพจ, ทั้งสองต้องมี `pages_show_list` | VERIFIED (สิทธิ์) / INFERRED (บล็อก vendor อ้างว่าไม่ต้องผ่าน App Review) |
| Instagram API with Instagram Login | scope ใหม่คือ `instagram_business_basic` ไม่ต้องผูก FB Page แต่แอปหนึ่งใช้ได้ **ทาง Facebook Login หรือ Instagram Login อย่างใดอย่างหนึ่งเท่านั้น** | VERIFIED (developers.facebook.com) · ยังไม่ยืนยันว่าอ่าน caption ได้ |
| Page Public Content Access | ใช้อ่าน public data ของเพจที่ **ไม่ได้** เป็นแอดมิน ต้องผ่าน App Review | VERIFIED |
| PDPA ไทย | นิยาม personal data กว้าง ผู้ scrape ถือเป็น controller ต้องมี lawful basis และต้องแจ้ง data subject ไม่พบหลักว่า "ข้อมูล public" เป็น lawful basis ในตัวเอง ร่างแก้ไข PDPA ซึ่งปิดรับฟังความเห็นเมื่อ 15 ส.ค. 2026 จะปรับโครง lawful basis ใหม่ | VERIFIED (Tilleke & Gibbins) / INFERRED ส่วนที่ใช้กับ scraping |

ข้อสรุป (INFERRED ไม่ใช่คำแนะนำทางกฎหมาย): PANGLAB เป็น SaaS ที่ต้องผ่าน Meta App Review เพื่อโพสต์ FB/IG และ business model ทั้งหมดผูกอยู่กับ Meta Platform Terms ถ้าถูก Meta มองว่า scrape จะเสี่ยงถึงขั้นโดนแบน app ซึ่งเป็นความเสี่ยงระดับทั้งบริษัท แม้คำตัดสิน Bright Data จะเป็นคุณกับผู้ scrape แบบ logged-out ก็ตาม เพราะฉะนั้นการสแกนเพจ FB/IG ให้ทำผ่าน Graph API กับเพจที่ผู้ใช้เป็นแอดมินเท่านั้น ส่วนเพจคู่แข่งหรือเพจที่ยังไม่ได้เชื่อมต่อ ให้ผู้ใช้วางข้อความหรืออัปโหลด screenshot เอง (user-provided content) แทน

## 9. ต้นทุนต่อการสแกน 1 แบรนด์ (ประมาณการ, INFERRED)

| ทางเลือก | สมมติฐาน | ต้นทุนโดยประมาณ |
|---|---|---|
| Firecrawl Standard + Gemini Flash | 3–5 หน้า × ~1 credit ($0.00083) + LLM ~30k input tokens | < $0.02 |
| Brandfetch Brand API + Firecrawl markdown + Gemini | 1 fetch ($129/2,500 ≈ $0.052) + ข้างบน | ≈ $0.06–0.07 |
| Self-host Playwright + Color Thief + Gemini | ค่า compute + LLM | < $0.01 แต่ต้นทุนทีมดูแลระบบสูงกว่า |
| Graph API (เพจที่เชื่อมต่อ) | ฟรี เสียเฉพาะ LLM สำหรับ 20 โพสต์ | < $0.01 |

## ผลต่อ PRD

| Req ID | การเปลี่ยนแปลงที่แนะนำ |
|---|---|
| **BRAND-3** (แก้) | แยกเป็น **BRAND-3a Website scan** (P0) ใช้ Firecrawl `markdown`+`branding` เป็นหลัก และ Brandfetch Logo API (ฟรี) เป็น fallback ของโลโก้ ส่วน **BRAND-3b Social scan** (P0 แต่ต้องรอ SOC/Connect ก่อน) อ่านเพจที่ผู้ใช้เชื่อมต่อผ่าน Graph API เท่านั้น ให้ตัดคำว่า "URL เพจ" ออกจาก input ของ auto-scan ที่ไม่ได้เชื่อมต่อ และเพิ่ม fallback "วางข้อความ/อัปโหลดภาพหน้าจอเพจ" |
| **Non-goal ใหม่** | "ไม่ scrape facebook.com / instagram.com ทุกกรณี รวมถึงเพจคู่แข่ง" เขียนไว้ใน PRD §Non-goals และใน DPA/Privacy Policy |
| **BRAND-6** | ผูกกับ scope `pages_read_engagement` (FB) และ `instagram_business_basic` (IG) ใส่ไว้ใน App Review submission ตั้งแต่ MVP แล้วเลือกให้ชัดว่าใช้ Facebook Login หรือ Instagram Login เพราะใช้ทั้งสองในแอปเดียวไม่ได้ |
| **BRAND-1** | ปรับ voice slider ให้ครบ 4 แกนของ NN/g และเพิ่มมิติไทย (สรรพนาม, คำลงท้าย, emoji density) ค่าทั้งหมดต้อง pre-fill มาจาก scan |
| **BRAND-2** | สีที่เสนอได้มาจาก OKLCH clustering (Color Thief v3) โดยเรียงลำดับแหล่งเป็น CSS > logo > avatar/cover > posts ส่วนฟอนต์ให้ map เป็นบุคลิกแล้วเลือกจาก whitelist OFL (รายงาน 18) ไม่ต้อง detect ฟอนต์จากภาพ |
| **ARCHITECTURE: Brand DNA Analyst** | เพิ่ม `BrandDNA.provenance{field → source_url/post_id, method: css|logo|llm, confidence}` เพิ่มชั้น deterministic extractor ก่อนเรียก LLM, cache ผล scan ต่อ domain 30 วัน และตั้ง token cap/usage logging ถ้าใช้ Gemini URL context |
| **Billing** | คิด Brand DNA scan เป็น action ที่ใช้เครดิต (POPCONT ก็คิด action "Brand DNA" แยก ดูรายงาน 01) ต้นทุนจริงต่ำกว่า $0.07 ต่อครั้ง จึงให้ scan ครั้งแรกฟรีได้เพื่อช่วย activation |
| **Compliance** | ไม่เก็บคอมเมนต์หรือชื่อลูกค้าจากโพสต์ที่สแกน (PDPA data minimisation) ใช้แค่ข้อความที่เพจโพสต์เอง ถ้าในอนาคตเปิด public API ต้องตรวจเงื่อนไข sublicensing ของ Brandfetch ก่อน |
| **Open question #5 ใน PRD** | คำตอบเบื้องต้นคือ ก่อนผ่าน App Review ให้ทำ BRAND-3a (เว็บ) และ fallback แบบวางข้อความ ส่วน BRAND-3b ทดสอบได้กับ user ที่มี role ใน app (INFERRED จากหลัก development mode ของ Meta) |

## คำถามที่ยังเปิด

1. Firecrawl `branding` คิด credit เพิ่มจาก scrape ปกติหรือไม่ และให้ผลกับเว็บไทยที่สร้างด้วย Wix/Shopify/LINE MyShop ดีแค่ไหน (ต้องทดสอบกับเว็บ SME ไทยราว 20 เว็บ)
2. Brandfetch มีข้อมูลแบรนด์ SME ไทยครอบคลุมแค่ไหน เพราะแบรนด์ไทยจำนวนมากไม่มี domain ของตัวเอง
3. `pages_read_engagement` ต้องผ่าน App Review สำหรับผู้ใช้ทั่วไปหรือไม่ (บล็อก vendor บอกว่าไม่ต้อง ซึ่งขัดกับประสบการณ์ทั่วไป) และ `instagram_business_basic` อ่าน caption ย้อนหลังได้จริงหรือไม่
4. หลังร่างแก้ไข PDPA ประกาศใช้ ข้อความโพสต์ที่เพจเผยแพร่เองถือเป็น personal data ของแอดมินหรือไม่ และ lawful basis ที่เหมาะสมคืออะไร (ควรถามที่ปรึกษากฎหมายไทย)
5. ราคาจริงของ Brand.dev และ Firecrawl ณ ต.ค. 2026 (แต่ละแหล่งให้ตัวเลขขัดกัน และหน้าทางการถูก proxy บล็อก)

## แหล่งอ้างอิง

- https://brandfetch.com/developers/brand-api.md
- https://brandfetch.com/developers/pricing.md
- https://brandfetch.io/developers/pricing
- https://brandfetch.com/developers.md
- https://docs.brandfetch.com/brand-search-api/overview
- https://docs.brandfetch.com/comparisons/firecrawl
- https://geekflare.com/guides/best-brand-apis-for-businesses/
- https://www.stork.ai/en/brandfetch-mcp
- https://firecrawl.dev/blog/branding-format-v2
- https://www.firecrawl.dev/glossary/web-extraction-apis/extract-website-branding
- https://www.firecrawl.dev/tools/website-logo-extractor
- https://docs.firecrawl.dev/developer-guides/cookbooks/brand-style-guide-generator-cookbook
- https://www.eesel.ai/blog/firecrawl-pricing
- https://www.tinyfish.ai/blog/firecrawl-pricing
- https://use-apify.com/blog/firecrawl-pricing-2026
- https://costbench.com/software/web-scraping/firecrawl/free-plan/
- https://toolradar.com/tools/firecrawl/pricing
- https://brand.dev/pricing
- https://docs.brand.dev/pricing
- https://docs.brand.dev/guides/use-cases/automating-brand-kits
- https://www.everydev.ai/tools/brand-dev
- https://www.brand.dev/alternatives/firecrawl
- https://developers.googleblog.com/en/url-context-tool-for-gemini-api-now-generally-available/
- https://cloud.google.com/vertex-ai/generative-ai/docs/url-context?hl=en
- https://discuss.ai.google.dev/t/inconsistent-behavior-with-url-context-limits/106543
- https://dejan.ai/blog/sorry-google-i-was-wrong/
- https://bestofjs.org/projects/node-vibrant
- https://docsearch.algolia.com/mcp/docs/repo/lokesh/color-thief
- https://docsearch.algolia.com/mcp/docs/repo/vibrant-colors/node-vibrant
- https://elegantthemes.com/blog/design/find-font-from-image
- https://fontspring.com/matcher
- https://docs.aspose.cloud/ocr/identify-fonts/
- https://www.videosdk.live/ai-apps/whatfontis
- https://www.beta.knowledgeowl.com/blog/posts/four-dimensions-of-tone-of-voice/
- https://beta.theglobeandmail.com/report-on-business/careers/management/the-four-dimensions-of-a-websites-tone/article31147068/
- https://www.fbm.com/post/102kqw7/
- https://techcrunch.com/2024/01/24/court-rules-in-favor-of-a-web-scraper-bright-data-which-meta-had-used-and-then-sued
- https://techcrunch.com/2024/02/26/meta-drops-lawsuit-against-web-scraping-firm-bright-data-that-sold-millions-of-instagram-records
- https://www.quinnemanuel.com/the-firm/news-events/client-alert-what-does-the-meta-v-bright-data-summary-judgment-ruling-mean-for-web-scraping/
- https://www.zyte.com/blog/california-court-meta-ruling
- https://about.fb.com/news/2021/04/how-we-combat-scraping/
- https://www.govinfo.gov/content/pkg/USCOURTS-cand-3_20-cv-07182/pdf/USCOURTS-cand-3_20-cv-07182-1.pdf
- https://newmedialaw.proskauer.com/tag/platform-terms-and-conditions/
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
- https://developers.facebook.com/documentation/instagram-platform/app-review
- https://developers.facebook.com/documentation/pages-api
- https://developers.facebook.com/docs/features-reference/page-public-content-access
- https://developers.facebook.com/docs/features-reference/page-public-metadata-access
- https://bundle.social/blog/facebook-api-permissions
- https://communityforums.atmeta.com/discussions/Questions_Discussions/pages-read-engagement-permission-present-in-token-scopes-but-api-returns-error/1365694
- https://www.tilleke.com/insights/thailand-operationalising-pdpa-lawful-basis-sensitive-personal-data-and-data-processing-safeguards/
- https://www.tilleke.com/insights/thailand-proposes-significant-amendments-to-the-personal-data-protection-act/25/
- https://law.ungovr.org/ai/th
