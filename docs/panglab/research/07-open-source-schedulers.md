# Open-source Social Schedulers: Postiz, Mixpost และอื่นๆ

## สรุป
Postiz (AGPL-3.0, NextJS + NestJS + Prisma/Postgres + Temporal) เป็นโปรเจกต์ open-source ที่ active และครบที่สุด โค้ด provider ของ Facebook/Instagram ใช้เป็นแหล่งเรียนรู้ได้ดี แต่**ไม่ควร copy โค้ดเข้า PANGLAB** เพราะ PANGLAB เป็น SaaS ปิด ส่วน Mixpost Lite เป็น MIT (Laravel package) นำโค้ดมาใช้ได้ แต่ Lite รองรับแค่ Facebook Pages, X, Mastodon และไม่ตรงกับ stack TypeScript ของเรา ข้อสรุปคือ PANGLAB ควรเขียน `packages/meta` เอง โดยยืม "pattern" (error taxonomy, container status polling, per-platform queue, insights ที่ Meta เลิกใช้แล้ว) จาก Postiz ในระดับความรู้ ไม่ใช่ระดับโค้ด

## ภาพรวมโปรเจกต์

| โปรเจกต์ | License | Stack | FB/IG | สถานะ | ความเหมาะกับ PANGLAB |
|---|---|---|---|---|---|
| **Postiz** (gitroomhq/postiz-app) | AGPL-3.0 (VERIFIED, README) | pnpm monorepo, NextJS (React) + NestJS, Prisma (ค่าเริ่มต้น PostgreSQL), Temporal, Redis, Resend (VERIFIED, README) | FB Page, IG (ผ่าน Facebook Login), Threads และอีก 10+ แพลตฟอร์ม (VERIFIED) | active มาก ประมาณ 26.8k stars, v2.18.0 ก.พ. 2026 (INFERRED, ข้อมูลจากผลค้นหาบุคคลที่สาม) | ใช้เรียนรู้ pattern ได้ ห้าม copy โค้ด |
| **Mixpost Lite** (inovector/mixpost) | MIT (VERIFIED, README + composer.json) | Laravel package: PHP ^8.2, illuminate 10–12, Inertia, Horizon, php-ffmpeg, intervention/image (VERIFIED, composer.json) | Lite มี provider แค่ `Meta`, `Twitter`, `Mastodon` (VERIFIED, โฟลเดอร์ src/SocialProviders) ซึ่งตรงกับข้อมูลว่า Lite = Facebook Pages, X, Mastodon และ IG อยู่ใน Pro เท่านั้น (INFERRED, จากหน้าเปรียบเทียบของคู่แข่ง) | ประมาณ 3.3k stars, v2.4.0 พ.ย. 2025 (INFERRED) | ใช้โค้ดได้ตาม MIT แต่ภาษาและ framework ไม่ตรง (PHP กับ TS) |
| **Mixpost Pro / Enterprise** | Commercial (VERIFIED: README ระบุว่า "commercial product") | เหมือน Lite | ครบทุกแพลตฟอร์ม | Pro $299 / Enterprise $1,199 แบบจ่ายครั้งเดียว, ได้อัปเดต 1 ปี (INFERRED, แหล่งรอง) | Enterprise มีระบบ subscription/billing สำหรับทำ SaaS แต่ Pro ไม่อนุญาตให้ทำ SaaS (INFERRED, แหล่งรอง ต้องอ่าน license จริง) |
| **Socioboard 5.0** | AGPL-3.0 หรือ GPL-3.0 (แหล่งข้อมูลขัดกัน), open-core | Node.js (INFERRED) | มี | ล่าสุด v5.0 ปี 2019 น่าจะหยุดพัฒนาแล้ว (INFERRED) | ไม่แนะนำ |

หมายเหตุ: เว็บ mixpost.app, docs.postiz.com, postiz.com, blotato.com และ selfhostedworld.com ถูก egress proxy บล็อก ข้อมูลส่วนนั้นจึงมาจาก summary ของผลค้นหาและไฟล์ใน GitHub

## สถาปัตยกรรมและ Stack (Postiz)

ตามสรุปของเอกสาร self-host อย่างเป็นทางการ (VERIFIED ผ่านผลค้นหาของ docs.postiz.com ซึ่งเปิดตรงไม่ได้) Postiz มี 3 service หลัก ได้แก่ frontend, backend และ **orchestrator** โดยปกติรันใน container เดียวกันและคุยกันผ่าน HTTP ส่วน Postgres, Redis, Temporal และ storage แยกเป็น container ต่างหาก ตั้งแต่ v2.12.0 ต้องใช้ Temporal (VERIFIED, หน้า system requirements) ซึ่งมาแทน cron และ worker แบบเดิม หน้าที่ของ orchestrator ได้แก่ publish โพสต์ที่ตั้งเวลาไว้, refresh token, ส่งอีเมล digest/notification, **จับโพสต์ที่พลาดเวลา (missed posts)** และนับ posting streak ทุกแพลตฟอร์มมี **task queue ของตัวเอง** เพื่อคุม concurrency แยกกัน

| ประเด็น | Postiz | PANGLAB (ARCHITECTURE.md ปัจจุบัน) | บทเรียน |
|---|---|---|---|
| Durable jobs | Temporal (self-host, ต้องมี Postgres + Elasticsearch เพิ่ม ตาม template ของ Railway) | Inngest (managed) | Inngest เหมาะกับทีมเล็กกว่า เพราะไม่ต้องดูแล Temporal cluster เองตามแนวคิดเดียวกัน ให้คง Inngest ไว้ |
| Concurrency ต่อแพลตฟอร์ม | queue แยกต่อ platform, `maxConcurrentJob` FB=500, IG=400 (VERIFIED, โค้ด provider) | cron ทุก 1 นาที | ใช้ Inngest `concurrency` key ต่อ `platform` + ต่อ `social_account_id` |
| Missed posts | มี workflow catch-up | ยังไม่ระบุ | เพิ่ม sweep หาโพสต์ `scheduled` ที่เลยเวลาไป |
| Public API/MCP | Public API, webhooks, MCP, CLI, NodeJS SDK, n8n node, Make app (VERIFIED, README) | ไม่มี | พิจารณาเป็น P2 สำหรับเอเจนซี่ |
| AI | Cloud: AI Copilot, รูปภาพ, วิดีโอ แบบมีโควตา; self-host ใช้ key ของผู้ใช้เอง (BYOK) (VERIFIED) | ขายเป็นเครดิต | โมเดลราคาของ Postiz Cloud เป็นแบบโควตารายเดือน ส่วน PANGLAB ขายเครดิตแบบ pack ซึ่งต่างกัน |

## แนวทางเชื่อมต่อ Meta (Facebook/Instagram) ใน Postiz

ข้อมูลทั้งหมดในส่วนนี้ VERIFIED จากการอ่าน `facebook.provider.ts` และ `instagram.provider.ts` บน branch main

| ประเด็น | Facebook Page | Instagram |
|---|---|---|
| Graph version | `v25.0` (`META_GRAPH_API_VERSION`) | ใช้ค่าเดียวกัน host `graph.facebook.com` |
| Login | Facebook Login → แลก code → `fb_exchange_token` เพื่อได้ long-lived user token | Facebook Login ผ่าน Page (ยังไม่ได้ทำ Instagram Login บน `graph.instagram.com`) |
| Scopes | `pages_show_list, business_management, pages_manage_posts, pages_manage_engagement, pages_read_engagement, read_insights` | `instagram_basic, pages_show_list, pages_read_engagement, business_management, instagram_content_publish, instagram_manage_comments, instagram_manage_insights` |
| หา Page | `/me/accounts` และ `/me/businesses` → `owned_pages` / `client_pages` (รองรับ Page ที่อยู่ใต้ Business Manager) | วิธีเดียวกัน แล้วเก็บ token รูปแบบ `pageToken___userToken` |
| Token expiry | hardcode 59 วัน, `refreshToken()` เป็น stub ที่ไม่ทำอะไร และหลังตรวจ `/me/permissions` จะเรียก `checkScopes` | เหมือนกัน |
| Publish | ข้อความ `/{id}/feed`; หลายภาพ: `/{id}/photos` (`published:false`) แบบขนาน → `/feed` + `attached_media`; วิดีโอ `/{id}/videos` ด้วย `file_url`; Stories ผ่าน `photo_stories` / `video_stories` (3 เฟส) | สร้าง container ด้วย `/{id}/media` (`image_url`, `REELS`, `STORIES`, `VIDEO`+`is_carousel_item`) → container `CAROUSEL` → poll `status_code` (`IN_PROGRESS`/`ERROR`/`EXPIRED`/`PUBLISHED`) → `media_publish` |
| Validation | text preset ใช้เฉพาะโพสต์ข้อความสั้น ถ้าถูกปฏิเสธจะ retry อีกครั้งโดยไม่ใส่ preset | carousel ≤10, caption ≤2200, Trial Reels รับวิดีโอได้ 1 ตัว |
| Error taxonomy | `handleErrors` คืนค่า `refresh-token` / `bad-body` / `retry` (เช่น subcode 1390008 "posting too fast") | เพิ่มประเภท `disconnect`; รหัส 2207xxx, 36001/36003 (aspect ratio/resolution) map เป็นข้อความที่ผู้ใช้อ่านเข้าใจ |
| Rate limit | ไม่มี backoff ที่ชัดเจน | ไม่มี throttle มีเพียงการ map ข้อความ "Page request limit reached" |
| Insights | `page_media_view`, `page_total_media_view_unique` ฯลฯ ใน comment ระบุว่า metric เดิมถูก Meta deprecate เมื่อ 2026-06-15 | `views, reach, saved, likes, comments, shares` |
| Idempotency | Stories ใช้ขั้นตอน "arm → confirm → publish" เพื่อกันโพสต์ซ้ำ; IG ใช้สถานะ `PUBLISHED` ในการกู้คืนหลัง crash และถ้าดึง permalink ไม่ได้จะไม่ retry ซ้ำ | — |

ข้อสังเกต: โค้ด Postiz map รหัส 2207042 เป็นข้อความว่า "25 posts/day" ซึ่งขัดกับ PRD PUB-5 ที่ใช้ 100 โพสต์ต่อ 24 ชม. (INFERRED: Postiz น่าจะใช้ข้อความเก่า ให้ยึดค่าจากเอกสาร Meta ในรายงาน 09) จุดอ่อนของ Postiz ที่ PANGLAB ไม่ควรทำตาม ได้แก่ การ hardcode อายุ token 59 วันแทนที่จะอ่าน `expires_in`/`data_access_expires_at` จริง, การ match substring `'490'` แบบกว้างเกินไป และการไม่มี backoff เมื่อชน rate limit

## License และผลกระทบ AGPL ต่อ SaaS แบบปิด

| สถานการณ์ | AGPL (Postiz) | MIT (Mixpost Lite) |
|---|---|---|
| อ่านโค้ดเพื่อเรียนรู้ pattern แล้วเขียนใหม่เอง (clean-room) | ทำได้ ความรู้เรื่อง endpoint/scope ไม่ใช่สิ่งที่มีลิขสิทธิ์ | ทำได้ |
| Copy ไฟล์/ฟังก์ชันมาใส่ใน PANGLAB | ทำให้ส่วนที่เกี่ยวข้องเป็น "work based on the Program" และเมื่อให้บริการผ่านเครือข่าย Section 13 บังคับให้เปิด Corresponding Source ให้ผู้ใช้ **ไม่ควรทำ** | ทำได้ ขอแค่เก็บ copyright notice ไว้ |
| รัน Postiz ที่ไม่ได้แก้ไขเป็น service แยก แล้ว PANGLAB เรียกผ่าน Public API | หน้าที่ตาม Section 13 เกิดขึ้นเมื่อ "แก้ไข" เท่านั้น ผู้เรียกผ่าน API มักถือเป็นโปรแกรมแยกต่างหาก แต่ยังไม่มีคำพิพากษาของศาล จึงเป็น grey area (VERIFIED: สรุปจาก FAQ ของ CiviCRM, OSI license-discuss) | — |
| Fork Postiz แล้วแก้ไขเป็น backend ของ PANGLAB | ต้องเปิดซอร์สส่วนที่แก้ไขให้ผู้ใช้ทุกคนที่ใช้งานผ่านเครือข่าย จึงขัดกับโมเดล SaaS ปิด | — |

Postiz ระบุว่า "We do not gate features or limit the license" และไม่พบ commercial/dual license ใน README (VERIFIED) ส่วนการทำ SaaS บน Mixpost ต้องใช้ Enterprise ซึ่งมีเงื่อนไข license เฉพาะ (INFERRED) คำแนะนำ: ห้าม copy โค้ด Postiz เข้า repo PANGLAB, เขียน `packages/meta` เองจากเอกสาร Meta, และถ้าจะใช้ Postiz เป็นเครื่องมือภายใน (เช่น ทดสอบ) ให้รันแบบไม่แก้ไขในเครือข่ายแยก ทั้งหมดนี้ไม่ใช่คำแนะนำทางกฎหมาย ควรให้ทนายตรวจก่อนเปิดตัว

## ผลต่อ PRD

| ID | การเปลี่ยนแปลงที่แนะนำ |
|---|---|
| PUB-1 | ดึง Page จาก `/me/accounts` **และ** `/me/businesses` → `owned_pages`/`client_pages` (กรณีเอเจนซี่และ Page ที่อยู่ใน Business Manager) ส่วน Page ที่ไม่มี `access_token` ให้แสดงข้อความภาษาไทยว่า "ต้องมีสิทธิ์จัดการเนื้อหาเต็ม" ตรวจ `/me/permissions` ทันทีหลัง OAuth และแจ้ง scope ที่ขาด |
| PUB-6 | ใช้ error taxonomy 4 ประเภท `retry` / `refresh-token` / `disconnect` / `bad-body` (`bad-body` ห้าม retry และคืนเครดิตตาม BILL-4 เฉพาะความผิดพลาดฝั่งระบบ) โดยเพิ่ม exponential backoff ที่ Postiz ไม่มี และ map รหัส 2207xxx, 36001/36003, 1390008 เป็นภาษาไทย |
| PUB-7 | เก็บ `token_expires_at` จากค่าจริง (`debug_token` → `expires_at`/`data_access_expires_at`) แทนการ hardcode 59 วันแบบ Postiz |
| PUB-3 / PUB-8 | IG worker: สร้าง container → poll `status_code` (`IN_PROGRESS`/`ERROR`/`EXPIRED`) ด้วย Inngest `step.sleep` → `media_publish` และใช้สถานะ `PUBLISHED` ตอนกู้คืนหลัง crash เพื่อกันโพสต์ซ้ำ |
| PUB-4 (ARCHITECTURE) | เพิ่ม Inngest `concurrency` ต่อ `platform` + `social_account_id`, เพิ่ม job "missed-post sweep" และใช้ idempotency แบบ arm → confirm → publish คง Inngest ไว้แทน Temporal |
| PUB-5 | ยืนยันเพดานโควตา IG จากเอกสาร Meta (100 ต่อ 24 ชม.) ในรายงาน 09 เพราะโค้ด Postiz ยังใช้ "25/day" |
| ANA-1 | ใช้ metric ชุดใหม่ (`page_media_view`, `post_total_media_view_unique`, `views`) เพราะ metric impressions เดิมถูก deprecate (ตาม comment ในโค้ด Postiz อ้างวันที่ 2026-06-15 ต้องยืนยันกับ changelog ของ Meta) |
| ใหม่ (NFR / Legal) | NFR-LIC-1: ห้ามนำโค้ด AGPL/GPL เข้า repo และเพิ่ม license check (`license-checker` ใน CI) |
| ใหม่ P2 | INT-1: Public API + MCP สำหรับเอเจนซี่ (Postiz มีครบแล้ว และน่าจะกลายเป็นมาตรฐานที่ลูกค้าคาดหวัง) |

## คำถามที่ยังเปิด
1. เงื่อนไข license ของ Mixpost Enterprise สำหรับการทำ SaaS (หน้า mixpost.app ถูกบล็อก ยังไม่ได้อ่านต้นฉบับ)
2. Postiz Cloud มีราคาเท่าไร และมีข้อเสนอ commercial license หรือ OEM หรือไม่ (postiz.com ถูกบล็อก)
3. วันที่ Meta deprecate metric (2026-06-15) และ Graph `v25.0` ต้องยืนยันกับ changelog ของ Meta (รายงาน 08/09)
4. ควรรองรับ Instagram Login (`graph.instagram.com`) สำหรับ IG ที่ไม่ได้ผูกกับ Page ตั้งแต่ MVP หรือไม่ (Postiz เองยังไม่ได้ทำใน provider นี้)
5. Socioboard ใช้ license อะไรกันแน่ (AGPL หรือ GPL) ไม่สำคัญเพราะเลิกพัฒนาแล้ว

## แหล่งอ้างอิง
- https://raw.githubusercontent.com/gitroomhq/postiz-app/main/README.md
- https://raw.githubusercontent.com/gitroomhq/postiz-app/main/libraries/nestjs-libraries/src/integrations/social/facebook.provider.ts
- https://raw.githubusercontent.com/gitroomhq/postiz-app/main/libraries/nestjs-libraries/src/integrations/social/instagram.provider.ts
- https://docs.postiz.com/self-host/architecture.md (ผ่านผลค้นหา, เปิดตรงไม่ได้)
- https://docs.postiz.com/installation/system-requirements (ผ่านผลค้นหา)
- https://railway.com/deploy/postiz-with-temporal (ผ่านผลค้นหา)
- https://raw.githubusercontent.com/inovector/mixpost/main/README.md
- https://raw.githubusercontent.com/inovector/mixpost/main/composer.json
- https://github.com/inovector/mixpost/tree/main/src/SocialProviders
- https://www.blotato.com/blog/mixpost-vs-postiz (ผ่านผลค้นหา)
- https://postiz.com/compare/mixpost/upload-post (ผ่านผลค้นหา)
- https://openalternative.co/compare/mixpost/vs/postiz (ผ่านผลค้นหา)
- https://postiz.com/blog/open-source-social-media-scheduler (ผ่านผลค้นหา)
- https://civicrm.org/about/license/faqs
- https://lists.opensource.org/pipermail/license-discuss_lists.opensource.org/2011-December/017502.html
- https://runxiyu.org/blog/agpl
