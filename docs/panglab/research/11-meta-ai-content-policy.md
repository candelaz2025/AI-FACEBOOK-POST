# 11 — นโยบาย Meta ต่อ AI-generated content, Community Standards, Branded Content, Platform Terms และข้อจำกัดในไทย

## สรุป
(กำลังค้นคว้า — draft)

## 1. AI info labels (Facebook / Instagram)
Draft notes:
- ก.พ. 2024 Meta ประกาศ label ภาพ AI ข้ามแพลตฟอร์ม โดยอ่าน C2PA + IPTC (DigitalSourceType = trainedAlgorithmicMedia); บังคับ self-disclose สำหรับ organic photorealistic video / realistic audio; ไม่ทำอาจถูก penalty (press coverage)
- ก.ค. 2024 เปลี่ยน "Made with AI" → "AI info"
- ก.ย. 2024 content ที่ "แก้ไขด้วย AI" ย้าย label ไปไว้ใน menu; content ที่ "สร้างทั้งหมดด้วย AI" ยังแสดง label ใต้ชื่อ (TechCrunch 2024-09-12)
- 22 มิ.ย. 2026: IG Content Publishing API รองรับ `is_ai_generated=true` บน media container (carousel: ตั้งที่ container หลักเท่านั้น), อ่านกลับด้วย `GET /{ig_media_id}?fields=is_ai_generated` (IG changelog, จาก search snippet)
- FB Page video stories มี `is_ai_generated` (optional, default false); FB Page photo/feed ยังไม่ยืนยัน

## 2. C2PA / IPTC metadata และ SynthID
กำลังค้นคว้า

## 3. Community Standards ที่เกี่ยวข้อง
กำลังค้นคว้า

## 4. Branded Content policy
กำลังค้นคว้า

## 5. Platform Terms / Developer Policies — ข้อจำกัด automated posting
Draft: IG content_publishing_limit — เอกสาร Meta ขัดกันเอง 100 vs 50 posts / 24h rolling; carousel นับ 1; ควรอ่าน `config.quota_total` จาก endpoint

## 6. ข้อจำกัดเฉพาะประเทศไทย (organic posts)
กำลังค้นคว้า

## ผลต่อ PRD
กำลังค้นคว้า

## คำถามที่ยังเปิด
กำลังค้นคว้า

## แหล่งอ้างอิง
กำลังค้นคว้า
