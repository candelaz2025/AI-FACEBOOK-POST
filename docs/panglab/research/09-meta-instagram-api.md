# Instagram Platform API (2026) — Login, Publishing, Limits, Insights

## สรุป
Instagram Platform มี 2 แบบ: **Instagram API with Instagram Login** (host `graph.instagram.com`, ไม่ต้องมี Facebook Page) และ **Instagram API with Facebook Login** (ต้องผูก Page, ได้ฟีเจอร์ครบกว่า เช่น hashtag search, resumable upload, `total_*` metrics) — ทั้งสองแบบ publish ภาพ JPEG, carousel ≤10, Reels, Stories ได้ผ่าน flow container → poll status → `media_publish` และรองรับ `is_ai_generated` (เพิ่ม 22 มิ.ย. 2026) สำหรับติดป้าย "AI info". ไม่มี native scheduling, container หมดอายุใน 24 ชม., และเอกสาร Meta ขัดกันเองเรื่อง publishing limit (100 vs 50 ต่อ 24 ชม.) — endpoint `content_publishing_limit` ระบุ `quota_total` = 50 จึงต้องอ่านค่าจริงตอน runtime.

## Instagram Login vs Facebook Login

| ประเด็น | Instagram API with Instagram Login | Instagram API with Facebook Login (for Business) |
|---|---|---|
| Token | Instagram User token (Business Login for Instagram) | Facebook User / Page token |
| ต้องมี Facebook Page | ไม่ต้อง (VERIFIED) | ต้อง (VERIFIED) |
| Host | `graph.instagram.com` (VERIFIED) | `graph.facebook.com` |
| Account | Professional (Business + Creator) (VERIFIED) | Professional ที่ผูก Page |
| Scopes publish | `instagram_business_basic` + `instagram_business_content_publish` (ชื่อใหม่แทน `instagram_business_content_publishing`) (VERIFIED) | `instagram_basic`, `instagram_content_publish`, `pages_show_list` ฯลฯ (INFERRED จาก ARCHITECTURE.md + เอกสาร Meta เดิม) |
| Hashtag search / ads / tagging | ไม่รองรับ (VERIFIED) | รองรับ |
| Resumable upload (rupload.facebook.com) | ไม่รองรับ — เอกสารระบุเฉพาะ Facebook Login for Business (VERIFIED) | รองรับ |
| `total_likes/total_comments/total_views`, `reposts_count/saved_count/shares_count` บน IG Media | ไม่มี (VERIFIED) | มี (Jun 2026) |
| `is_ai_generated` | รองรับ | รองรับ (VERIFIED) |

ข้อสังเกต: Meta อธิบายว่าแต่ละฟีเจอร์ของ Instagram Login ใช้แค่ 2 permission (basic + ฟีเจอร์นั้น) ทำให้ onboarding ง่ายกว่า — เหมาะกับ SME ไทยที่มี IG แต่ไม่มี/ไม่ได้ผูก Page. แต่ PANGLAB โพสต์ FB Page ด้วยอยู่แล้ว การใช้ Facebook Login ทางเดียวจะได้ทั้ง Page token + IG id ในรอบเดียว.

## Content Publishing (image, carousel, reels, stories)
VERIFIED จาก Content Publishing guide (Updated Jun 30, 2026; อ่านได้ใน attempt แรก) และ IG User Media reference ผ่าน search summary:

| ประเภท | วิธี | ข้อจำกัดสำคัญ |
|---|---|---|
| Single image | `POST /{ig_id}/media` `image_url=` → `POST /{ig_id}/media_publish creation_id=` | **JPEG เท่านั้น**; Meta ดึงไฟล์จาก URL ณ เวลาเรียก — URL ต้องเป็น public และยังไม่หมดอายุ (signed URL TTL สั้นจะ fail แบบ fetch error ทั่วไป — INFERRED จาก bundle.social) |
| Carousel | สร้าง child containers (`is_carousel_item=true`) → parent `media_type=CAROUSEL` `children=` → publish | ≤10 items; นับเป็น 1 post ใน quota; `is_ai_generated` ใส่ที่ parent เท่านั้น |
| Reels | `media_type=REELS` `video_url=` (หรือ resumable upload) | 3 วิ–15 นาที, ≤300 MB, MOV/MP4, H.264/HEVC, AAC, 23–60 fps, กว้าง ≤1920, ≤25 Mbps, แนะนำ 9:16 (VERIFIED – IG User Media ref). `VIDEO` สำหรับ feed เลิกใช้ตั้งแต่ 9 พ.ย. 2023 → ใช้ `REELS` |
| Stories | `media_type=STORIES` (ภาพหรือวิดีโอ) | spec เฉพาะ Story ไม่พบในเอกสาร Meta ที่เข้าถึงได้ (OPEN); metrics ของ Story อยู่ได้ 24 ชม. |
| Trial Reels | `trial_params` (graduation strategy `MANUAL` / `SS_PERFORMANCE`) | ร่างแรกบันทึกว่าเห็นใน Content Publishing guide; รอบนี้ยืนยันได้จาก Ayrshare เท่านั้น — การ graduate ทำผ่าน API ไม่ได้ ต้องทำในแอป IG (INFERRED) |

**`is_ai_generated`** (VERIFIED – Instagram Platform Changelog, 22 Jun 2026): ส่ง `true` ตอนสร้าง container เพื่อติด label "AI info"; ใช้ได้ทั้งสองแบบ login; อ่านกลับได้ `GET /{ig_media_id}?fields=is_ai_generated`. INFERRED (inro.social): ตั้งได้ตอนสร้างเท่านั้น แก้หลัง publish ไม่ได้ (update รับแค่ `comment_enabled`).

## Container status และ Rate limit
Container `status_code`: `IN_PROGRESS`, `FINISHED`, `PUBLISHED`, `ERROR`, `EXPIRED` (VERIFIED). Meta แนะนำ poll ไม่เกินวิละครั้ง → ประมาณ 1 ครั้ง/นาที ไม่เกิน 5 นาที (VERIFIED ร่างแรก). `EXPIRED` = container ที่ไม่ได้ publish ภายใน **24 ชม.** (VERIFIED – IG Container reference ผ่าน search).

**ความขัดแย้งเรื่อง publishing limit** (VERIFIED ทุกแหล่งด้านล่าง):

| แหล่ง | ค่าที่ระบุ |
|---|---|
| Content Publishing guide — หัวข้อ Rate Limit | 100 API-published posts / 24h moving period |
| Content Publishing guide — หัวข้อ Carousel (หน้าเดียวกัน) | 50 posts / 24h |
| Instagram Graph API content-publishing guide (เดิม) และ Instagram Login content-publishing guide | 50 / 24h |
| `GET /{ig-user-id}/content_publishing_limit` reference | `config.quota_total` "currently 50", `quota_duration` 86400 |
| Third party | Ayrshare 50, PostProxy 100, บางแหล่ง 25 (ล้าสมัย) |

Endpoint `content_publishing_limit`: คืน `quota_usage` เป็นค่า default; `fields=config,quota_usage`; `since` = Unix timestamp ย้อนได้ไม่เกิน 24 ชม. Limit บังคับที่ `media_publish` (ไม่ใช่ตอนสร้าง container); carousel = 1. Meta ระบุชัดว่า app ควร enforce limit เองโดยเฉพาะเมื่อมีการตั้งเวลาโพสต์.

## Native scheduling
**ไม่มี** — Instagram Content Publishing API ไม่มี `scheduled_publish_time` แบบ Facebook Pages (INFERRED: หลายแหล่ง third-party ยืนยันตรงกัน และ Meta เองพูดถึง "apps that allow app users to schedule posts" ให้ enforce quota เอง ซึ่งสื่อว่าการตั้งเวลาเป็นหน้าที่ของ app). เนื่องจาก container หมดอายุ 24 ชม. design ที่ถูกคือเก็บ "โพสต์ + URL ต้นฉบับ" ใน DB แล้วสร้าง container ไม่กี่นาทีก่อนเวลาโพสต์ → poll → publish, บันทึก container/media id เพื่อ retry แบบ idempotent.

## Insights metrics 2026

| สถานะ | Metrics | หมายเหตุ |
|---|---|---|
| ถูกถอดแล้ว (2025) | `impressions`, `plays`, `clips_replays_count`, `ig_reels_aggregated_all_plays_count`, `video_views` | ถอดทุกเวอร์ชันตั้งแต่ 21 Apr 2025 (v22.0 เริ่มก่อน) — VERIFIED ผ่าน search ของ Meta ref |
| ตัวหลักปัจจุบัน | `views` (FEED/STORY/REELS; account-level มี breakdown `follower_type`, `media_product_type`), `reach`, `total_interactions`, `likes`, `comments`, `shares`, `saved` | `views` แทน impressions/plays (VERIFIED) |
| ใหม่ Dec 2025 | `reels_skip_rate` (media), `reposts` (media + user) | นิยาม skip rate "ข้ามใน 3 วิแรก" มาจาก socialsamosa (INFERRED) |
| Cross-post FB | `crossposted_views`, `facebook_views` (ขยายครอบ Feed/Reels/Stories) | error ถ้าไม่ได้แชร์ไป FB |
| ใหม่ Apr–Jun 2026 | IG Media fields `reposts_count`, `saved_count`, `shares_count`; `total_likes`, `total_comments`, `total_views` (รวม boosted + crosspost) | **เฉพาะ Facebook Login** (VERIFIED – changelog / Meta dev blog 22 Apr 2026) |

ข้อจำกัดทั่วไป (VERIFIED): ข้อมูลล่าช้าได้ถึง 48 ชม.; ไม่มีข้อมูลคืน empty set แทน 0; เก็บย้อนหลัง 2 ปี; Story insights อยู่ 24 ชม.; metrics organic-only ไม่นับ ads (ยกเว้น `total_*`).

## ผลต่อ PRD
1. **PUB-5 (ตรวจ IG publishing limit)**: ห้าม hardcode 50/100 — worker เรียก `GET /{ig}/content_publishing_limit?fields=config,quota_usage` ก่อน publish และ enforce `quota_total` ในฝั่งเรา (default safe = 50); แสดงโควตาคงเหลือใน UI ภาษาไทย.
2. **PUB-4 (Scheduler ของเราเอง)**: ยืนยันแนวทางเดิม — เก็บโพสต์ ไม่เก็บ container; สร้าง container T-5 นาที, poll `status_code` ทุก ~60 วิ ไม่เกิน 5 นาที, publish, บันทึก `container_id`/`media_id` เพื่อ idempotent retry; จัดการ `EXPIRED`/`ERROR` ด้วยการสร้างใหม่.
3. **PUB-3 + ARCHITECTURE §IG publish**: signed URL จาก Supabase Storage ต้องมี TTL ≥ ระยะ poll (แนะนำ ≥ 1 ชม.) เพราะ Meta fetch ตอนเรียก; คงการแปลงเป็น JPEG ด้วย `sharp`.
4. **เพิ่ม requirement ใหม่ (เช่น PUB-9 / AI-LABEL)**: ส่ง `is_ai_generated=true` เป็น default สำหรับภาพ/วิดีโอที่ Imagen/Veo สร้าง (ใส่ที่ parent ของ carousel) — ตั้งได้ตอนสร้างเท่านั้น จึงต้องตัดสินใจก่อน publish; เชื่อมกับรายงาน 11 (AI content policy).
5. **ARCHITECTURE §Login/Scopes**: ใช้ Facebook Login for Business เป็นหลัก (ได้ Page + IG ในครั้งเดียว, resumable upload, `total_*` metrics); พิจารณาเพิ่ม Instagram Login เป็นทางเลือก P1 สำหรับลูกค้าที่มี IG แต่ไม่มี Page — scopes `instagram_business_basic`, `instagram_business_content_publish`, `instagram_business_manage_insights` (ตรวจชื่อสุดท้ายตอน App Review).
6. **PUB-8 (Reels/Stories, P1)**: validate วิดีโอ Veo ก่อนส่ง (MP4 H.264, AAC, 9:16, ≤300 MB, 3 วิ–15 นาที); Trial Reels เป็นตัวเลือก P2 ที่น่าสนใจสำหรับ A/B แต่ graduate ผ่าน API ไม่ได้.
7. **Analytics module**: ใช้ `views`, `reach`, `total_interactions`, `saved`, `shares`, `reposts`, `reels_skip_rate`; ห้ามใช้ `impressions`/`plays`; UI ต้องแจ้งว่าข้อมูลล่าช้าได้ 48 ชม.

## คำถามที่ยังเปิด
- ค่าจริงของ `quota_total` สำหรับบัญชีที่ใช้งานจริงในปี 2026 เป็น 50 หรือ 100 (ต้องทดสอบด้วย token จริง).
- Spec ภาพ/วิดีโอเฉพาะ Stories (ขนาด, ความยาว) ผ่าน API และ aspect ratio ภาพ feed ที่รับ (เดิม 4:5–1.91:1) — ยังไม่ได้ยืนยันจากเอกสาร Meta รอบนี้.
- `trial_params` มีในเอกสารทางการทั้งสองแบบ login หรือไม่ และใช้กับ Instagram Login ได้หรือเปล่า.
- `is_ai_generated` แก้ไขหลัง publish ได้หรือไม่ (ยืนยันเฉพาะจาก third party ว่าไม่ได้).
- Container หมดอายุ 24 ชม. นับจากเวลาสร้างหรือเวลา FINISHED.
- ชื่อ insights scope ล่าสุดสำหรับ Instagram Login (`instagram_business_manage_insights`) — ยังไม่ VERIFIED รอบนี้.

## แหล่งอ้างอิง
- https://developers.facebook.com/docs/instagram-platform/content-publishing
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/content-publishing (เดิม developers.secure.facebook.com)
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/content-publishing
- https://developers.facebook.com/documentation/instagram-platform/changelog
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
- https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container
- https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/media
- https://developers.facebook.com/documentation/instagram-platform/content-publishing/resumable-uploads
- https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights/
- https://developers.facebook.com/docs/instagram-platform/api-reference/instagram-user/insights
- https://developers.facebook.com/blog/post/2026/04/22/instagram-api-updates-for-partnerships-metrics-collaboration-and-engagement/
- https://www.inro.social/glossary/ai-content-disclosure
- https://adaptlypost.com/blog/content-publishing-limit-instagram-api
- https://www.ayrshare.com/apis/post/social-networks/instagram
- https://postproxy.dev/blog/post-to-instagram-via-api/
- https://bundle.social/blog/instagram-graph-api
- https://www.socialsamosa.com/news-2/instagram-new-metrics-tools-marketing-api-10883266
- https://social-media-management-help.brandwatch.com/en/articles/15695131-cross-posted-facebook-data-in-instagram-total-views-reactions-and-comments-june-2026
- https://help.swydo.com/en/articles/10365140-instagram-insights-metrics-deprecation-what-you-need-to-know

หมายเหตุวิธีวิจัย: developers.facebook.com, developers.secure.facebook.com และ docs.supermetrics.com ถูก egress proxy บล็อกในรอบนี้ ข้อมูล "VERIFIED" รอบนี้มาจาก search-engine summary ที่อ้างข้อความหน้าเอกสาร Meta โดยตรง (ไม่ได้เปิดอ่านหน้าเต็ม) ยกเว้น Content Publishing guide ที่อ่านได้ใน attempt แรก.
