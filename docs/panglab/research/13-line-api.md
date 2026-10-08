# LINE Platform สำหรับ PANGLAB (Messaging API, LINE Login, OA Pricing ไทย 2026)

## สรุป
กำลังค้นคว้า (draft รอบ retry: pricing + module channel ยืนยันจาก search แล้ว, กำลังเติม LINE Login / broadcast)

## 1. Messaging API: Flex Message + Postback (approve/reject)
postback `data` ≤300 ตัวอักษร, `displayText` ≤300, `label` ≤20 (INFERRED: classmethod + line-bot-sdk docs; developers.line.biz ถูก proxy บล็อก). Flex button รับ action object เดียวกัน. Reply ไม่นับโควตา; push/multicast/broadcast/narrowcast นับโควตา (8x8 docs).

## 3. LINE OA pricing ไทย 2026
Free 0฿/300, Basic 1,280฿/15,000, Pro 1,780฿/35,000 (ไม่รวม VAT 7%) — search summary อ้าง relevantaudience (ตรวจ 9 ก.ย. 2026). Overage ขัดแย้ง: 0.10/0.06฿ vs 4 สตางค์.

## 5. SaaS broadcast แทน OA ลูกค้า
Module channel: attach กับหลาย OA ผ่าน OAuth, ต้องเป็น corporate partner ที่ยื่นขอ, ไม่มี long-lived token, userId ต่าง OA ต่างกัน.

## ผลต่อ PRD
กำลังค้นคว้า

## คำถามที่ยังเปิด
กำลังค้นคว้า

## แหล่งอ้างอิง
กำลังค้นคว้า
