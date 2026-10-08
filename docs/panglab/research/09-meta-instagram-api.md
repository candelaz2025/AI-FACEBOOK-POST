# Instagram Platform API (2026) — Login, Publishing, Limits, Insights

## สรุป
กำลังค้นคว้า

## Instagram Login vs Facebook Login
กำลังค้นคว้า

## Content Publishing (image, carousel, reels, stories)
(ร่าง) VERIFIED จาก developers.facebook.com/docs/instagram-platform/content-publishing (Updated Jun 30, 2026; อ่านใน attempt ก่อน): JPEG only; carousel ≤10; media_type VIDEO/REELS/STORIES; is_ai_generated; trial_params; status_code EXPIRED/ERROR/FINISHED/IN_PROGRESS/PUBLISHED, poll 1/min ≤5 min; 100 posts/24h (แต่ส่วน carousel เขียน 50 — ขัดแย้ง).

is_ai_generated: VERIFIED (search summary ของ Changelog Instagram Platform) เพิ่มเมื่อ 22 Jun 2026; ตั้ง true ตอนสร้าง container → ใส่ label "AI info"; carousel ใส่ที่ parent container เท่านั้น; ใช้ได้ทั้ง IG Login และ FB Login; อ่านค่ากลับได้ด้วย GET /{ig_media_id}?fields=is_ai_generated. INFERRED (inro.social): ตั้งได้ตอนสร้างเท่านั้น แก้หลัง publish ไม่ได้.

## Container status และ Rate limit
กำลังค้นคว้า

## Native scheduling
กำลังค้นคว้า

## Insights metrics 2026
กำลังค้นคว้า

## ผลต่อ PRD
กำลังค้นคว้า

## คำถามที่ยังเปิด
กำลังค้นคว้า

## แหล่งอ้างอิง
- https://developers.facebook.com/docs/instagram-platform/content-publishing
- https://developers.facebook.com/documentation/instagram-platform/changelog
- https://www.inro.social/glossary/ai-content-disclosure
