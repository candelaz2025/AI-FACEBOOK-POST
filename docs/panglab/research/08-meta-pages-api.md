# Facebook Pages API: Publishing, Tokens, Insights (2026)

> Research subagent 8/30 · 2026-10-08 · ความมั่นใจ: **medium**
> หมายเหตุวิธีวิจัย: `developers.facebook.com` ถูก egress proxy บล็อก (WebFetch) และ Apify ใช้ไม่ได้ (เกิน concurrent limit) ข้อมูลจาก Meta จึงมาจาก search-engine excerpt ของหน้า official (tag **VERIFIED-snippet**) ส่วนข้อมูลจาก vendor/บุคคลที่สามติด tag **3rd-party** และการตีความของผู้วิจัยติด tag **INFERRED**

## สรุป
Graph API ล่าสุดคือ **v26.0 (ออก 2026-07-29)** โดย v25.0 ออก 2026-02-18 และ breaking changes ของ v26 จะบังคับใช้กับทุก version ที่ยังรองรับในวันที่ **2026-10-27** การ publish บน Page (ภาพ, หลายภาพ, วิดีโอ, Reels) ใช้ scope หลักแค่สามตัว คือ `pages_show_list`, `pages_read_engagement` และ `pages_manage_posts` (ต้องได้ Advanced Access ผ่าน App Review) ร่วมกับ Page token ที่ "ไม่มีวันหมดอายุ" แต่ยังถูก invalidate ได้ ส่วน Insights ถูกรื้อหนักใน 2025-2026 เพราะ impressions/reach แบบเดิมถูกถอดและแทนด้วย metric ตระกูล **media_view / total_media_view_unique (Views/Viewers)** ดังนั้น ANA-1 ต้องเปลี่ยนนิยาม "reach" ใหม่

## Graph API version และ deprecation schedule

| Version | วันออก | หมดอายุ | สถานะ / หมายเหตุ | Tag |
|---|---|---|---|---|
| v26.0 | 2026-07-29 | TBD | ล่าสุด ถอด Commerce Order Mgmt 47 endpoints และเปลี่ยน ETag/304 caching (ไม่สนใจ If-None-Match) | VERIFIED-snippet + 3rd-party (ppc.land) |
| v25.0 | 2026-02-18 | TBD | ประกาศ Page "viewers" metric และประกาศถอด reach metrics | VERIFIED-snippet |
| v24.0 | 2025-10-08 | TBD ในหน้า versions แต่ Marketing API changelog ระบุ 2026-10-06 | มีความขัดแย้งระหว่าง Graph กับ Marketing API | VERIFIED-snippet (ขัดแย้ง) |
| v21.0 / v22.0 | — | ~2027-01-21 / ~2027-05-20 | คำนวณตามกฎ "ใช้ได้ 2 ปีหลัง version ถัดไปออก" | 3rd-party / INFERRED |
| v20.0 | — | 2026-09-24 (หมดแล้ว) | | 3rd-party |

**2026-10-27** คือวันที่ breaking changes ของ v26.0 มีผลกับทุก version ที่เหลือ การ pin version เก่าจึงไม่ช่วยหลบ (VERIFIED-snippet จาก v26 changelog) สำหรับ Page Insights metric ที่ถูกถอด Meta ระบุว่าจะ error "ในทุก API version" ทันทีที่ถูก deprecate โดยไม่ขึ้นกับ version ที่ pin ไว้ (VERIFIED-snippet)

ส่วนเรื่องว่าเรียก version ที่หมดอายุแล้วจะเกิดอะไรขึ้น แหล่งข้อมูลยังขัดกันเอง FlareCanary และ CData บอกว่า Meta จะ auto-upgrade ไปใช้ version เก่าสุดที่ยังรองรับ แต่ Ayrshare บอกว่าจะได้ 400 กลับมา (3rd-party ทั้งคู่) จังหวะปกติคือ Meta ออก version ใหม่ราวปีละ 3 ครั้ง (INFERRED จากวันออก v24/v25/v26)

## Permissions ที่ต้องใช้ (App Review)

| Permission | ใช้ทำอะไร | ต้องใช้ใน PANGLAB? | Tag |
|---|---|---|---|
| `pages_show_list` | list Page ที่ user ดูแล (`/me/accounts`) | ใช่ | VERIFIED-snippet |
| `pages_read_engagement` | อ่าน content, metadata และ **Page/Post Insights** (`GET /{page-id}/insights` ใช้ scope นี้ตัวเดียว) | ใช่ | VERIFIED-snippet |
| `pages_manage_posts` | สร้าง/แก้/ลบโพสต์ (`POST /{page-id}/feed`, `/photos`, `/videos`, `/video_reels`) | ใช่ | VERIFIED-snippet |
| `business_management` | จำเป็นเฉพาะเมื่อใช้ **business system user** เรียก API | ขึ้นกับ token strategy | VERIFIED-snippet |
| `read_insights` | permission เก่า (legacy) | น่าจะไม่ต้องใช้สำหรับ Page Insights | INFERRED (ยังไม่ยืนยัน) |
| `pages_manage_engagement` | ตอบ comment | ไม่ใช่ P0 | INFERRED |

การทดสอบกับ Page ของ test user/ทีมเองใช้ Standard Access ได้ แต่ถ้าจะใช้กับ Page ของลูกค้าต้องได้ **Advanced Access** ผ่าน App Review ร่วมกับ Business Verification (3rd-party: bundle.social) แหล่งข้อมูลยังขัดกันว่า `pages_read_engagement` ต้องผ่าน review หรือไม่ แต่สำหรับ SaaS ที่ให้บริการลูกค้าภายนอก **ควรถือว่าทุก scope ต้องได้ Advanced Access** (INFERRED) Reels publishing ต้องใช้ทั้งสาม scope หลัก และ token ต้องมาจาก user ที่ทำ task `CREATE_CONTENT` บน Page ได้ (VERIFIED-snippet, Reels guide)

**Facebook Login for Business** ใช้ `config_id` แทน `scope` (Meta ระบุว่า "should not be used") โดย configuration จะกำหนดชนิด token, business assets และ permissions ไว้ใน App Dashboard (VERIFIED-snippet) และถ้าตั้ง `response_type=code` คู่กับ `override_default_response_type=true` จะได้ system-user access token (VERIFIED-snippet)

## Page token lifecycle

| Token | อายุ | ถูก invalidate เมื่อ | Tag |
|---|---|---|---|
| Short-lived user token | ~1-2 ชม. | — | INFERRED (ความรู้ทั่วไป) |
| Long-lived user token (`grant_type=fb_exchange_token`) | ~60 วัน | หมดอายุแล้วแลกใหม่ไม่ได้ ต้อง login ใหม่ การแลกต้องทำฝั่ง server เพราะต้องใช้ app secret | VERIFIED-snippet |
| Long-lived **Page** token (ดึงจาก long-lived user token ผ่าน `/me/accounts`) | **ไม่มีวันหมดอายุ** (Debugger แสดง "Expires: Never") | user revoke app, เปลี่ยนรหัสผ่าน, ถูกถอด role บน Page, หรือ app ถูกลดสิทธิ์ | VERIFIED-snippet + 3rd-party |
| System user token (Business Manager / FL4B `config_id`) | แบบ non-expiring หรือแบบหมดอายุ 60 วัน (ต้อง refresh ภายใน 60 วัน) | system user กับ app ต้องอยู่ใน Business Manager เดียวกัน | VERIFIED-snippet |

ข้อสรุปเชิงปฏิบัติ: Page token "never expires" **ไม่ได้แปลว่าใช้ได้ตลอดไป** PUB-7 (token health) จึงควรเช็คด้วย `debug_token` หรือ call เบาๆ รายวัน และจับ OAuth error (code 190) แทนการนับวันหมดอายุ (INFERRED)

## Publishing: photo / multi-photo / video / reels / scheduling

| ประเภท | Endpoint / flow | ข้อจำกัดสำคัญ | Tag |
|---|---|---|---|
| ข้อความ / ลิงก์ | `POST /{page-id}/feed` (`message`, `link`) | — | VERIFIED-snippet |
| ภาพเดี่ยว | `POST /{page-id}/photos` (`url` หรือ multipart `source`, `message`) | — | VERIFIED-snippet |
| หลายภาพ | (1) อัปโหลดแต่ละภาพไปที่ `/photos` ด้วย `published=false` แล้วได้ photo id → (2) `POST /{page-id}/feed` พร้อม `attached_media[n]={"media_fbid":"<id>"}` | ภาพ unpublished จะถูกลบภายใน ~24 ชม. ถ้าไม่ได้ใช้ ภาพที่ใช้ใน scheduled post ต้องตั้ง `temporary=true` มีแหล่งหนึ่งอ้างว่า "สูงสุด 4 ภาพ" แต่ยังไม่ยืนยัน | VERIFIED-snippet + 3rd-party |
| วิดีโอ (feed) | `POST /{page-id}/videos` ที่ `graph-video.facebook.com` ส่งได้ทั้ง `file_url` และ resumable (`upload_phase` start/transfer/finish) | non-resumable/URL รับได้ ≤1 GB และ ≤20 นาที, resumable รับได้ ≤1.75 GB และ ≤45 นาที (เอกสารเก่า ควร re-verify) | VERIFIED-snippet (stale) |
| Reels | (1) `POST /{page-id}/video_reels upload_phase=start` ได้ `video_id` และ upload URL → (2) อัปโหลดไฟล์ไปที่ `rupload.facebook.com` (เป็น local binary หรือ `file_url` ก็ได้, resume ได้) → (3) `upload_phase=finish` พร้อม `video_state=PUBLISHED/DRAFT/SCHEDULED` → poll `/{video-id}?fields=status` | 9:16, แนะนำ 1080×1920 (ขั้นต่ำ 540×960), 24-60 fps, .mp4, **3-90 วินาที**, ถ้าเป็น Page story ไม่เกิน 60 วินาที, **30 Reels ต่อ Page ใน rolling 24 ชม.**, ไม่รับ URL จาก fbcdn | VERIFIED-snippet |
| Native scheduling | `published=false` + `scheduled_publish_time` (unix) + `unpublished_content_type=SCHEDULED` | ถ้าไม่ได้ตั้ง `published=false` โพสต์จะออกทันที แหล่งข้อมูลขัดกันเรื่องกรอบเวลา (10 นาที-30 วัน หรือ 6 เดือน) และควรเช็ค `is_published` | 3rd-party + VERIFIED-snippet |

PRD PUB-4 ใช้ scheduler ของเราเอง ซึ่งช่วยหลบปัญหาเรื่องกรอบเวลา native scheduling และภาพ temporary หมดอายุ 24 ชม. ได้ทั้งหมด จึงควรคงไว้ (INFERRED) และเมื่อ Graph API ส่ง `fbcdn` URL กลับมา ห้ามนำไปใช้เป็น source ของ Reel (VERIFIED-snippet)

## Page Insights metrics ที่ยังใช้ได้ในปี 2026

**รอบที่ 1 (2025-11-15):** Meta ถอด `page_impressions`, `page_impressions_paid`, `page_impressions_viral`, `page_impressions_nonviral`, `post_impressions` และตระกูล `page_fans*` ออกจาก**ทุก version** การเรียก metric เหล่านี้จะได้ error "invalid metric" (VERIFIED-snippet, Meta deprecated-metrics page ปรับปรุง 2026-03-02) ก่อนหน้านั้น `page_impressions_unique` ถูกประกาศถอดในรอบ 2025-06-15 ไปแล้ว (VERIFIED-snippet) และนับจากรอบนี้ "Views" นับเฉพาะเมื่อ content ถูกแสดงหรือเล่นจริง ตัวเลขจึงต่ำกว่า impressions เดิม (3rd-party: Yext)

**รอบที่ 2 (มิ.ย.-ก.ค. 2026):** v25 changelog ประกาศถอด page reach, page post reach, video impressions และ story impressions เมื่อ v26 ออก ส่วน Page Insights reference ระบุว่า "by June 15, 2026" (VERIFIED-snippet) ขณะที่ Supermetrics รายงานว่าเลื่อนเข้ามาจาก 30 มิ.ย. เป็น 15 มิ.ย. นอกจากนี้ Agorapulse รายงานว่า Meta หยุดให้ **demographic metrics** ใน Page Insights API ตั้งแต่ 2026-03-12 (3rd-party, ยังไม่ยืนยันจาก Meta)

| ความต้องการ (ANA-1) | Metric เดิม (ถอดแล้ว) | Metric ที่ใช้แทนในปี 2026 | Tag |
|---|---|---|---|
| Page reach | `page_impressions_unique` | `page_total_media_view_unique` (Viewers) | VERIFIED-snippet |
| Post reach | `post_impressions_unique` | `post_total_media_view_unique` | VERIFIED-snippet |
| Page impressions | `page_impressions` | `page_media_view` (Views) | VERIFIED-snippet |
| Paid vs organic | `page_impressions_paid` | `page_media_view` breakdown `is_from_ads` | VERIFIED-snippet |
| Post impressions | `post_impressions` | `post_media_view` | VERIFIED-snippet |
| Followers | `page_fans`, `page_fan_adds` | `page_follows`, `page_daily_follows_unique` | VERIFIED-snippet / 3rd-party |
| Engagement | — | `page_post_engagements` (อยู่ใน v25 reference และไม่อยู่ในรายการถอด) | VERIFIED-snippet |
| Viral / non-viral, organic-unique, unique video views | หลายตัว | **ไม่มีตัวแทน** | 3rd-party (Statusbrew, Windsor) |
| Page views | `page_views_total` | ไม่อยู่ในรายการถอด | 3rd-party (Yext) |
| Reactions per post | `post_reactions_by_type_total` | ยังไม่ยืนยันสถานะ | ไม่ยืนยัน |
| Clicks per post | `post_clicks` ฯลฯ | **ยังไม่ยืนยันสถานะ** | ไม่ยืนยัน |

ตัวแทนใหม่ไม่ได้เทียบกัน 1:1 กับตัวเดิม เพราะ methodology ต่างกัน กราฟ trend จึงจะ "หัก" ที่จุดเปลี่ยน แหล่งข้อมูลยังขัดกันด้วยว่า historical data ของ metric ที่ถูกถอดยังดึงย้อนหลังได้หรือไม่ (Improvado บอกได้, Coupler บอกไม่ได้) และ "viewers" ถูกออกแบบให้เป็นตัวนับ cross-platform ระหว่าง FB กับ IG (VERIFIED-snippet, v25 blog)

## ผลต่อ PRD

| ID | การเปลี่ยนแปลงที่แนะนำ |
|---|---|
| ANA-1 | เปลี่ยนจาก "reach, engagement, clicks" เป็น **Views (`post_media_view`), Viewers (`post_total_media_view_unique`), engagement (reactions + comments + shares จาก post fields), follows** ส่วน clicks ให้เป็น "ถ้ามี" จนกว่าจะยืนยัน metric ได้ และให้ UI ภาษาไทยใช้คำว่า "การดู" และ "ผู้ชม" แทน "การเข้าถึง" เพื่อให้ตรงกับ Meta Business Suite |
| ANA-2/3 | เก็บชื่อ metric ไว้ใน config/registry (ไม่ hard-code) และบันทึก `metric_version`/วันเปลี่ยน methodology เพื่อแสดงหมายเหตุ "ตัวเลขเปลี่ยนวิธีนับ" บนกราฟ ไม่ทำ paid/organic, viral หรือ demographic breakdown ใน P0 |
| PUB-1 / ARCH §Meta | ใช้ Facebook Login for Business ด้วย **`config_id`** (ห้ามใช้ `scope`) ตัด `read_insights` ออกจากรายการ scope ใน ARCHITECTURE.md เพราะใช้ `pages_read_engagement` แทน และประเมินว่าจะใช้ business system-user token (`business_management`) หรือ Page token ของ user แล้วเลือกทางเดียว |
| PUB-7 | Token health ไม่ควรนับวันหมดอายุของ Page token ("Never") แต่ควรเรียก `debug_token` รายวันและจับ error 190/permission-revoked แล้วแจ้งเตือนเป็นภาษาไทยให้ reconnect ถ้าเลือกใช้ system-user token แบบ 60 วัน ต้องมี job refresh |
| PUB-2 | multi-photo ใช้ flow `published=false` แล้วตามด้วย `attached_media` โดยอัปโหลดภาพตอนถึงเวลาโพสต์จริง (ไม่ pre-upload) เพราะภาพ temporary หมดอายุใน 24 ชม. |
| PUB-8 | FB Reels: ตรวจ spec ก่อนส่ง (9:16, 3-90 วินาที, 24-60 fps, mp4) และเพิ่ม **quota 30 Reels / Page / 24 ชม.** ไว้ใน scheduler แบบเดียวกับ PUB-5 (IG 100) ส่วน Veo output ต้องตัดหรือแปลงให้ตรง spec และ host บน storage ของเราเอง (ไม่ใช้ fbcdn) |
| NFR ใหม่ | **Graph API version policy**: pin version ไว้ที่ `packages/meta` จุดเดียว, ทบทวนทุกครั้งที่ Meta ออก version ใหม่ (~ทุก 4-5 เดือน), ทำ smoke test publish/insights บน staging ก่อนวัน enforcement (เช่น 2026-10-27) และ subscribe Meta changelog |

## คำถามที่ยังเปิด
1. `post_clicks` / `post_clicks_by_type` และ `post_reactions_by_type_total` ยังใช้ได้หลัง v26 หรือไม่ ต้องทดสอบจริงด้วย Page ทดสอบ
2. รายการ metric ที่ถูกถอดใน v26.0 changelog ส่วน Insights ฉบับเต็ม (ยังอ่านหน้า official ไม่ได้เพราะถูกบล็อก)
3. กรอบเวลา native scheduling (30 วันหรือ 6 เดือน) และจำนวนภาพสูงสุดของ multi-photo feed post
4. สำหรับ SaaS หลายลูกค้า ควรใช้ user-derived Page token หรือ FL4B system-user token ดีกว่ากัน (มีผลต่อ App Review และการ revoke)
5. Video size limit ปี 2026 ของ `/videos` (เอกสารที่พบเก่า) และ resumable upload ผ่าน `rupload` ใช้กับ feed video ได้ด้วยหรือไม่
6. Historical data ของ metric ที่ถูกถอดยังดึงย้อนหลังได้หรือไม่

## แหล่งอ้างอิง
- https://developers.facebook.com/docs/graph-api/changelog/versions
- https://developers.facebook.com/docs/graph-api/changelog/version25.0
- https://developers.facebook.com/docs/graph-api/changelog/version26.0
- https://developers.facebook.com/blog/post/2026/02/18/introducing-graph-api-v25-and-marketing-api-v25
- https://developers.facebook.com/blog/post/2026/07/29/introducing-graph-api-v26-and-marketing-api-v26/
- https://developers.facebook.com/documentation/ads-commerce/marketing-api/marketing-api-changelog.md
- https://developers.facebook.com/documentation/pages-api/platforminsights/page/deprecated-metrics
- https://developers.facebook.com/docs/graph-api/reference/page/insights/
- https://developers.facebook.com/docs/pages-api/manage-pages
- https://developers.facebook.com/documentation/pages-api
- https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived
- https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens
- https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/
- https://developers.facebook.com/docs/graph-api/reference/page/photos
- https://developers.facebook.com/docs/video-api/guides/reels-publishing
- https://developers.facebook.com/docs/video-api/guides/publishing
- https://developers.secure.facebook.com/docs/graph-api/video-uploads/
- https://ppc.land/meta-blocks-47-commerce-endpoints-as-graph-api-v26-0-lands-today/
- https://dev.to/flarecanary/metas-graph-api-v20-expires-september-24-your-calls-wont-fail-theyll-quietly-start-running-v21-2m2a
- https://www.ayrshare.com/solutions/meta-graph-api-versioning-survival-kit-staying-ahead-of-v21-v22-and-beyond/
- https://docs.ninjacat.io/docs/2025
- https://docs.supermetrics.com/docs/facebook-insights-field-changes-november-13-2025
- https://docs.supermetrics.com/docs/facebook-insights-field-changes-june-30-2026
- https://statusbrew.com/help/articles/facebook-metric-deprecation-november-2025
- https://support.sproutsocial.com/hc/en-us/articles/39899335524493-Facebook-Metric-Deprecation-November-2025
- https://support.sproutsocial.com/hc/en-us/articles/45863997056397-Facebook-Metric-Deprecations-June-2026
- https://www.yext.com/blog/facebook-is-deprecating-metrics-what-to-know
- https://docs.coupler.io/sources/category/social-media/facebook-page-insights/data-overview/meta-facebook-insights-deprecated-metrics-june-2026
- https://improvado.io/product-updates/connectors/facebook-pages-metrics-deprecation
- https://windsor.ai/documentation/guide-for-deprecating-metrics-for-facebook-organic-connector-june-15-2026/
- https://support.agorapulse.com/en/articles/14184641-facebook-metric-deprecation-march-2026
- https://bundle.social/blog/facebook-api-permissions
- https://bundle.social/blog/facebook-page-access-token
- https://bundle.social/blog/facebook-posting-api
- https://www.ayrshare.com/blog/facebook-reels-api-how-to-post-fb-reels-using-a-social-media-api/
- https://communityforums.atmeta.com/discussions/Questions_Discussions/pages-read-engagement-permission-present-in-token-scopes-but-api-returns-error/1365694
