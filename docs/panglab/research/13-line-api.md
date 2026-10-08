# LINE Platform สำหรับ PANGLAB (Messaging API, LINE Login, OA Pricing ไทย 2026)

## สรุป
กำลังค้นคว้า (draft ระหว่างทาง)

## 1. Messaging API: Flex Message + Postback (approve/reject)
Draft: postback action `data` สูงสุด 300 ตัวอักษร (classmethod, INFERRED-จาก third-party), `displayText` 300 grapheme; webhook ได้ `postback.data`. Reply ไม่นับโควตา; push/multicast/broadcast/narrowcast นับโควตา.

## 2. LINE Login (OIDC)
Draft: v2.1 รองรับ OIDC, scope openid/profile/email (email ต้องยื่นขอ), verify endpoint POST https://api.line.me/oauth2/v2.1/verify, HS256 (web) / ES256 (LIFF/SDK).

## 3. LINE OA pricing ประเทศไทย 2026
Draft: Free 300 / Basic 1,280 (15,000) / Pro 1,780 (35,000) — ยังไม่ยืนยันจากหน้า official.

## 4. Broadcast / Multicast / Narrowcast API
Draft: multicast ≤500 user IDs, ≤5 message objects; quota endpoints.

## 5. SaaS broadcast แทน OA ของลูกค้าได้หรือไม่
Draft: Module channel (partner, ต้องสมัคร) vs ลูกค้าสร้าง Messaging API channel เองแล้วให้ token.

## ผลต่อ PRD
กำลังค้นคว้า

## คำถามที่ยังเปิด
กำลังค้นคว้า

## แหล่งอ้างอิง
กำลังค้นคว้า
