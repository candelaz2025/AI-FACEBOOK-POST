# TikTok Content Posting API และ TikTok Business API สำหรับ PANGLAB

## สรุป
(ร่าง) Content Posting API มี 2 โหมด: Direct Post (`video.publish`) และ Upload/inbox draft (`video.upload`); app ที่ยังไม่ผ่าน audit โพสต์ได้แค่ private (SELF_ONLY) — กำลังค้นคว้าส่วน Business API ไทย

## Content Posting API: Direct Post vs Upload
VERIFIED (developers.tiktok.com ผ่าน search snippet): Direct Post = `/v2/post/publish/video/init/` scope `video.publish`; Upload = `/v2/post/publish/inbox/video/init/` scope `video.upload` → ส่ง notification เข้า inbox ให้ creator กดเข้าไปแก้และโพสต์เองใน TikTok editor. Photo ใช้ `/v2/post/publish/content/init/` ด้วย `post_mode` DIRECT_POST หรือ MEDIA_UPLOAD.

## App audit และข้อจำกัดของ app ที่ยังไม่ผ่าน audit
VERIFIED: unaudited → content ทั้งหมด private viewing; error `unaudited_client_can_only_post_to_private_accounts`; มี active creator cap ต่อ 24 ชม. (`reached_active_user_cap`) — ตัวเลขยังไม่ยืนยัน. UX requirement ตาม Content Sharing Guidelines (nickname, privacy dropdown no default, interaction toggles, commercial content disclosure, consent declaration, preview, no watermark).

## Rate limits และ quota
VERIFIED: init endpoints 6 req/min/access token; status fetch 30/min; creator_info 20/min; ~15 posts/วัน/creator (shared across Direct Post clients); 429 `rate_limit_exceeded`, 403 `spam_risk_too_many_posts`.

## รูปแบบสื่อที่รองรับ (วิดีโอ + Photo post)
VERIFIED: video MP4 (แนะนำ)/WebM/MOV, H.264/H.265/VP8/VP9, 23-60 FPS, 360-4096 px, ≤4GB, ≤10 นาที; chunk 5-64MB (สุดท้าย ≤128MB), 1-1000 chunks. Photo: JPEG/WebP, ≤1080p, ≤20MB/รูป, ≤35 รูป, PULL_FROM_URL เท่านั้น, title ≤90, description ≤4000.

## TikTok Business API / Marketing API ในประเทศไทย
กำลังค้นคว้า

## ผลต่อ PRD
กำลังค้นคว้า

## คำถามที่ยังเปิด
กำลังค้นคว้า

## แหล่งอ้างอิง
กำลังค้นคว้า
