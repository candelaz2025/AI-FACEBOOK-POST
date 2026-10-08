# 17 — Brand DNA Extraction: เทคนิค/API ดึงตัวตนแบรนด์อัตโนมัติจาก URL หรือเพจโซเชียล

## สรุป
(ร่าง) Brandfetch / Brand.dev / Firecrawl `branding` ให้ logo+colors+fonts จาก domain ได้ใน 1 call; ฝั่งโซเชียลควรใช้ Graph API บนเพจที่ผู้ใช้เชื่อมต่อ ไม่ scrape เพจ FB/IG (ขัด Meta Automated Data Collection Terms)

## Brandfetch API
- Brand API: free 100 requests (VERIFIED จาก search summary ของ brandfetch.com/developers), $129/เดือน = 2,500 fetches, overage $0.10/fetch (official brand-api.md; third-party บอก $99 → conflict)
- Logo API / Brand Search API: ฟรีถึง 500,000 req/เดือน
- Commercial: ใช้ภายในแอปได้; sublicensing ให้ลูกค้า/ใส่ใน API response ต้องมี agreement

## Firecrawl branding extraction
- `formats=["branding"]` → logo, favicon, colors, fonts, spacing, UI component styles (branding format v2)
- Pricing (third-party): Free 500–1,000 credits, Hobby $16, Standard $83/100k credits, scrape 1 credit/page; JSON +4

## Brand.dev
- Brand API 10 credits/call, web scrape 1 credit; Styleguide API แยก; plan prices conflict

## กฎหมาย/ToS
- Meta v. Bright Data (N.D. Cal., 23 ม.ค. 2024): logged-out scraping ของ public data ไม่ breach terms; Meta ไม่ appeal (ก.พ. 2024) — district court ไม่ใช่ precedent ผูกพัน
- Meta Automated Data Collection Terms (eff. 7 ต.ค. 2024): ต้องมี express written permission

กำลังค้นคว้า: Graph API permissions, color/font libraries, LLM voice, PDPA
