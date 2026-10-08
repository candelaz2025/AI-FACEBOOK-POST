# TikTok Content Posting API และ TikTok Business API สำหรับ PANGLAB

## สรุป
TikTok มีทางโพสต์อัตโนมัติ 2 ทาง: **Content Posting API** (developers.tiktok.com, OAuth แบบ Login Kit, มีโหมด Direct Post และ Upload-to-inbox, รองรับทั้งวิดีโอและ photo post สูงสุด 35 รูป) และ **TikTok API for Business – Accounts API** (business-api.tiktok.com, endpoint `/business/video/publish/` สำหรับ Business Account) ทั้งสองทางมีเพดาน ~15 โพสต์/วัน/บัญชี และ 6 req/นาที. App ที่ยังไม่ผ่าน audit โพสต์ได้เพียงแบบ private เท่านั้น และการผ่าน audit ต้องทำ UX ตาม Content Sharing Guidelines อย่างเคร่งครัด จึงควรวาง TikTok เป็นงาน Phase 3 ที่ต้องเริ่มยื่น audit ล่วงหน้า. ยังไม่พบเอกสารทางการที่ยืนยันว่า Accounts API เปิดให้ธุรกิจไทยใช้ได้หรือไม่ (มีเพียงหลักฐานว่าไทยอยู่ในรายชื่อ self-serve ของ Business Center)

> หมายเหตุวิธีวิจัย: developers.tiktok.com, business-api.tiktok.com และ ads.tiktok.com ถูก egress proxy บล็อก ข้อมูลที่ติด VERIFIED มาจาก search summary ที่อ้างหน้าเอกสารทางการของ TikTok โดยตรง (ไม่ได้เปิดหน้าเอง) ส่วน INFERRED/3rd-party ระบุไว้ชัด

## Content Posting API: Direct Post vs Upload

| หัวข้อ | Direct Post | Upload (inbox / draft) |
|---|---|---|
| Scope | `video.publish` | `video.upload` |
| Endpoint วิดีโอ | `POST /v2/post/publish/video/init/` (open.tiktokapis.com) | `POST /v2/post/publish/inbox/video/init/` |
| Endpoint รูปภาพ | `POST /v2/post/publish/content/init/` + `post_mode: DIRECT_POST`, `media_type: PHOTO` | endpoint เดียวกัน + `post_mode: MEDIA_UPLOAD` |
| ผลลัพธ์ | โพสต์ขึ้นบัญชีทันที (ถ้าผ่าน audit) | ส่ง notification เข้า inbox ของ creator ให้กดเข้า TikTok editor แล้วโพสต์เอง; status `SEND_TO_USER_INBOX` → `PUBLISH_COMPLETE` เมื่อ user โพสต์ |
| Webhook | post.publish.* | `post.publish.inbox_delivered`, `publish_type` = `INBOX_SHARE` |
| ข้อกำหนดพิเศษ | ต้องดึง `creator_info` ทุกครั้งที่แสดงหน้าโพสต์ และทำ UX ครบตาม guideline | Photo MEDIA_UPLOAD ต้องใช้ TikTok app ≥ 31.8 |
| สถานะ | VERIFIED | VERIFIED |

วิดีโอส่งได้ 2 แบบ: `FILE_UPLOAD` (PUT เป็น chunk ไปยัง `upload_url`) หรือ `PULL_FROM_URL` ซึ่ง URL ต้องอยู่บน domain ที่ verify ไว้ใน Developer Portal (meta tag/DNS) — ข้อหลังมาจากแหล่ง 3rd-party (INFERRED แต่สอดคล้องกับหลายแหล่ง). รูปภาพรองรับ **PULL_FROM_URL เท่านั้น** (VERIFIED) จึงต้องมี public media URL บน domain ของเรา. API **ไม่มี native scheduling** (3rd-party, zernio.com) ต้องใช้ scheduler ของเราเอง ซึ่งตรงกับ PUB-4 อยู่แล้ว

## App audit และข้อจำกัดของ app ที่ยังไม่ผ่าน audit

| ประเด็น | รายละเอียด | สถานะ |
|---|---|---|
| Visibility ก่อน audit | content ทั้งหมดถูกจำกัดเป็น private viewing (SELF_ONLY) ไม่ว่าจะส่ง `privacy_level` อะไร | VERIFIED |
| บัญชีปลายทาง | ถ้าบัญชี creator ไม่ได้ตั้งเป็น private จะได้ error `unaudited_client_can_only_post_to_private_accounts` | VERIFIED |
| จำนวนผู้ใช้ | มี daily cap ของ active publishing users (`reached_active_user_cap`); ตัวเลข "5 users / 24 ชม." พบเฉพาะในแหล่ง 3rd-party | ตัวเลข INFERRED |
| Upload (inbox) ก่อน audit | เอกสารระบุข้อจำกัด private สำหรับ Direct Post; ไม่พบข้อความยืนยันว่า Upload ได้รับยกเว้น | ไม่ชัด — ต้องทดสอบ |
| ระยะเวลา audit | 3rd-party ประเมิน 2–6 สัปดาห์; ต้องส่ง demo video ครบ flow (login → consent → composer จาก creator_info → โพสต์ขึ้นจริง) | INFERRED |
| การเปลี่ยนแปลงหลังอนุมัติ | ต้องยื่น re-review | INFERRED (3rd-party) |

**UX ที่ต้องมีเพื่อผ่าน audit (Content Sharing Guidelines, VERIFIED):** แสดง nickname ของบัญชีปลายทาง; dropdown privacy ที่ **ไม่มีค่า default** และตัวเลือกต้องมาจาก `privacy_level_options` ของ creator_info; checkbox Allow Comment/Duet/Stitch ไม่ติ๊กไว้ล่วงหน้า และต้อง grey out ถ้า creator ปิดไว้ (photo post มีแค่ Comment); toggle **Commercial content disclosure** (ปิดเป็น default) แยก "Your brand" (→ label "Promotional content") กับ "Branded content" (→ "Paid partnership") ถ้าเปิด toggle แต่ไม่เลือกอะไร ปุ่ม publish ต้อง disabled และ Branded content ห้ามคู่กับ "Only me"; ข้อความ consent (Music Usage Confirmation / Branded Content Policy) ก่อนปุ่ม publish; preview content; ห้ามใส่ watermark/โลโก้โปรโมตของเรา; user ต้องแก้ title/hashtag ที่ AI เติมไว้ได้; ห้ามส่ง media ก่อน user ยินยอม; แจ้งว่าการประมวลผลอาจใช้เวลาหลายนาทีและ poll status/webhook. สาเหตุถูก reject ที่รายงานโดยนักพัฒนา (3rd-party) คือ UX ไม่ครบตามนี้, ขอ scope ผิดช่องทาง, domain ไม่ verify, demo video ไม่ครบ, และ "one-click publish" ไม่มีหน้าตรวจทาน — **ข้อสุดท้ายขัดกับแนวคิด auto-post เต็มรูปแบบโดยตรง**

## Rate limits และ quota

| Limit | ค่า | สถานะ |
|---|---|---|
| Init Direct Post / Upload / Photo | 6 requests/นาที/access token | VERIFIED |
| Get Post Status (`/v2/post/publish/status/fetch/`) | 30 requests/นาที/access token | VERIFIED |
| Query Creator Info | 20 requests/นาที/access token (มีหน้าเอกสารบางเวอร์ชันไม่ระบุ — ขัดกัน) | VERIFIED + conflict |
| โพสต์ต่อบัญชี | ~15 โพสต์/วัน/creator account, แชร์ร่วมกับทุก client ที่ใช้ Direct Post (ค่า "อาจเปลี่ยน") | VERIFIED |
| Business API `/business/video/publish/` | 6 โพสต์/นาที/บัญชี, สูงสุด 15/วัน | VERIFIED (snippet) |
| Error | 429 `rate_limit_exceeded` (sliding window 1 นาที), 403 `spam_risk_too_many_posts` | VERIFIED |

ข้อสำคัญ: quota 15/วันใช้ร่วมกับเครื่องมืออื่นที่ลูกค้าใช้อยู่ (เช่น scheduler ตัวอื่น) ดังนั้น PANGLAB ไม่สามารถรับประกัน slot ได้ 100%

## รูปแบบสื่อที่รองรับ (วิดีโอ + Photo post)

| | วิดีโอ (Content Posting API) | Photo post |
|---|---|---|
| Format | MP4 (แนะนำ), WebM, MOV; codec H.264 (แนะนำ), H.265, VP8, VP9 | JPEG, WebP (ไม่รองรับ PNG ตามเอกสาร) |
| ขนาด | ≤ 4GB; ด้านละ 360–4096 px; 23–60 FPS | ≤ 20MB/รูป, ความละเอียดสูงสุด 1080p |
| ความยาว/จำนวน | ≤ 10 นาทีผ่าน API (บัญชีส่วนใหญ่โพสต์ได้ 3 นาที, บางบัญชี 5/10) | 1–35 รูป/โพสต์, เลือกปกด้วย `photo_cover_index` (เริ่มที่ 0) |
| Text | caption (title) | title ≤ 90 UTF-16 runes, description ≤ 4000 |
| Transfer | chunk 5–64MB (chunk สุดท้าย ≤128MB), 1–1000 chunks, ส่งตามลำดับ; < 5MB ส่งก้อนเดียว | PULL_FROM_URL เท่านั้น |
| สถานะ | VERIFIED | VERIFIED (photo เปิดตัว 3 พ.ย. 2023 ตาม changelog) |

Business API ระบุ .mp4/.mov/.webm และ "ห้ามใช้ video URL ที่ไม่ verify" (VERIFIED snippet). ไม่พบความยาวขั้นต่ำของวิดีโอใน Content Posting API (Share Video API รุ่นเก่ากำหนด 3–60 วินาที แต่เป็นคนละระบบ) — วิดีโอ 5–8 วินาทีของ GEN-8 น่าจะผ่าน แต่ยังเป็น INFERRED

## TikTok Business API / Marketing API ในประเทศไทย

| หัวข้อ | รายละเอียด | สถานะ |
|---|---|---|
| โครงสร้าง | TikTok API for Business = Marketing API (ads) + Organic API (Accounts, Mentions, TikTok One, Discovery, Spark Ads Recommendation) ใช้งานด้าน content publishing, community interaction, account insights | VERIFIED (snippet ads.tiktok.com help) |
| Endpoint โพสต์ | `POST /open_api/v1.3/business/video/publish/` โพสต์วิดีโอ public ไปยัง owned TikTok (Business) account; v1.3 เพิ่ม AI-generated flag, branded content, upload-to-draft, custom thumbnail, music, location | VERIFIED (snippet) |
| การขอสิทธิ์ | ต้องอนุมัติ developer profile ก่อน แล้วยื่น app (รีวิว 2–3 วันทำการ, สูงสุด 5 apps/developer); ตั้งแต่ **20 มี.ค. 2026** ต้องกรอก **Accounts API Access Application Form** ก่อนขอ scope "TikTok Accounts" | VERIFIED (snippet business-api.tiktok.com) |
| ประเทศไทย | ไทยอยู่ในรายชื่อประเทศที่สร้าง ad account ใน Business Center แบบ self-serve ได้ และหน้า portal API for Business มีไทยในรายชื่อประเทศ แต่ไม่พบเอกสารที่ระบุชัดว่า Organic/Accounts API เปิดสำหรับธุรกิจไทย | ไทย-self-serve VERIFIED; สิทธิ์ Accounts API = ไม่ทราบ |
| Photo ผ่าน Business API | ไม่พบใน snippet (มี open-source PR อ้างว่าโพสต์ photo ของ Business account ได้) | INFERRED |

ข้อสรุปเชิงกลยุทธ์ (INFERRED): Content Posting API ใช้ได้กับทั้งบัญชี personal และ business ทั่วโลก จึงเป็นทางหลักที่เสี่ยงน้อยกว่า; Accounts API เหมาะเป็นทางเลือกเสริมเมื่อได้รับอนุมัติ เพราะรองรับ AI-generated flag และ branded content ใน API โดยตรง

## ผลต่อ PRD

| # | ข้อเสนอ | Requirement |
|---|---|---|
| 1 | แตก **PUB-9** เป็น PUB-9a (TikTok) และ PUB-9b (LINE OA). PUB-9a ใช้ Content Posting API: เริ่มด้วยโหมด **Upload-to-inbox (`video.upload`)** เป็น MVP ของ TikTok เพราะ user จบโพสต์ใน TikTok เอง (ลดความเสี่ยง audit/visibility) แล้วค่อยเปิด **Direct Post** หลังผ่าน audit | PUB-9 |
| 2 | เริ่มยื่น TikTok developer app + audit ตั้งแต่ Phase 2 (ล่วงหน้า 6–8 สัปดาห์ก่อน Phase 3) พร้อม verify domain ของ media CDN และอัด demo video ครบ flow; ทำ Accounts API Access Application Form คู่ขนาน | Roadmap Phase 3, ARCHITECTURE |
| 3 | สร้าง component **TikTokComposer** แยกจาก FB/IG: ดึง `creator_info` ทุกครั้ง, nickname, privacy dropdown ไม่มี default, toggle Comment/Duet/Stitch, Commercial content disclosure, consent text, preview, แก้ caption/hashtag ได้ — หมายความว่า **TikTok ต้องมีขั้น "อนุมัติโพสต์" ต่อโพสต์** ไม่ใช่ auto-post ล้วน (แม้ตั้งเวลาได้ ค่า privacy/disclosure ต้องถูกเลือกโดย user ตอนอนุมัติ) | UX approval (DESIGN), ใหม่: PUB-10 |
| 4 | Scheduler (PUB-4) ต้องรู้ quota TikTok: ≤15 โพสต์/วัน/บัญชี และ 6 init/นาที; จัดการ 403 `spam_risk_too_many_posts`, 429, `reached_active_user_cap` พร้อมข้อความภาษาไทย (ขยาย PUB-5/PUB-6) | PUB-4, PUB-5, PUB-6 |
| 5 | Media pipeline: แปลงรูปเป็น **JPEG/WebP ≤1080p ≤20MB** และวิดีโอเป็น **MP4 H.264**; host บน domain ที่ verify กับ TikTok; รองรับ carousel TikTok สูงสุด 35 รูป (GEN-4 ทำได้ ≤10 อยู่แล้ว); รองรับ 9:16 สำหรับ GEN-8 | GEN-4, GEN-8, PUB-3 |
| 6 | ใส่ data model `PlatformAccount.provider = 'tiktok'` เก็บ open_id, access/refresh token, scopes, `audit_status` ของ client และ flag private-only เพื่อ UI เตือนว่า "ระหว่างรอ TikTok อนุมัติ โพสต์จะเห็นได้เฉพาะคุณ" | ARCHITECTURE |
| 7 | AI content: เพิ่มช่อง AI-generated content label สำหรับ TikTok (Business API v1.3 มี flag; TikTok มีนโยบายติด label AIGC) — เชื่อมกับรายงาน 11 | GEN-*, compliance |

## คำถามที่ยังเปิด
1. ตัวเลขจริงของ active-user cap สำหรับ unaudited client (3rd-party ว่า 5 users/24 ชม.) — ต้องดูในหน้า developer portal ของ app เรา
2. โหมด Upload (inbox) ของ unaudited client ถูกจำกัด private ด้วยหรือไม่ — ต้องทดสอบด้วยบัญชีจริง
3. Accounts API (`/business/video/publish/`) เปิดให้ developer/Business Account ในไทยหรือไม่ และรองรับ photo post หรือไม่ — ต้องถาม TikTok for Business Thailand
4. TikTok จะอนุมัติ audit ให้ SaaS ที่ AI สร้างเนื้อหาและตั้งเวลาโพสต์ล่วงหน้าหรือไม่ (guideline ต้องการ user ยืนยันต่อโพสต์ — scheduled post ที่อนุมัติไว้ก่อนถือว่าผ่านไหม)
5. ความยาววิดีโอขั้นต่ำของ Content Posting API (สำหรับคลิป 5–8 วินาที) และการรองรับ PNG (ปัจจุบันเอกสารระบุ JPEG/WebP)
6. ระยะเวลา audit จริงในปี 2026 (3rd-party ประเมิน 2–6 สัปดาห์)

## แหล่งอ้างอิง
- https://developers.tiktok.com/docs/en/content-posting-api-get-started
- https://developers.tiktok.com/doc/content-posting-api-reference-direct-post
- https://developers.tiktok.com/docs/en/content-posting-api-get-started-upload-content
- https://developers.tiktok.com/docs/en/content-posting-api-reference-upload-video
- https://developers.tiktok.com/docs/en/content-posting-api-reference-photo-post
- https://developers.tiktok.com/docs/en/content-posting-api-media-transfer-guide
- https://developers.tiktok.com/docs/en/content-posting-api-reference-query-creator-info
- https://developers.tiktok.com/docs/en/content-posting-api-reference-get-video-status
- https://developers.tiktok.com/doc/tiktok-api-v2-rate-limit
- https://developers.tiktok.com/docs/en/content-sharing-guidelines
- https://developers.tiktok.com/doc/changelog
- https://developers.tiktok.com/docs/en/tiktok-api-scopes
- https://developers.tiktok.com/bulletin/migration-notice-share-video-api/
- https://business-api.tiktok.com/portal/docs/publish-a-public-video-post-to-an-owned-account/v1.3
- https://business-api.tiktok.com/portal/docs/create-a-developer-app/v1.3
- https://business-api.tiktok.com/portal/docs/permission-scope/v1.3
- https://business-api.tiktok.com/portal
- https://ads.tiktok.com/help/article/marketing-api
- https://ads.tiktok.com/help/article/available-countries-and-regions-for-ad-account-creation-in-bc
- https://github.com/gitroomhq/postiz-app/issues/1362 (3rd-party: เหตุผลถูก reject)
- https://singhamandeep.com/?p=1660 (3rd-party case study)
- https://bundle.social/blog/tiktok-api-approval (3rd-party)
- https://www.postpeer.dev/blog/tiktok-direct-posting-api-tutorial (3rd-party)
- https://postproxy.dev/blog/how-to-post-to-tiktok-via-api/ (3rd-party)
- https://zernio.com/blog/tik-tok-upload-api-for-business (3rd-party)
- https://github.com/sixb-ai/sixb/pull/640 (3rd-party)
