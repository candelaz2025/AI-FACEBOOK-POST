# Open-source Social Schedulers: Postiz, Mixpost และอื่นๆ

## สรุป
กำลังค้นคว้า (ร่างบางส่วน)

## ภาพรวมโปรเจกต์
กำลังค้นคว้า

- Postiz: AGPL-3.0 (VERIFIED README), NextJS + NestJS + Prisma/Postgres + Temporal, Redis required for self-host. Cloud = AI Copilot/images/videos. Public API, webhooks, MCP, CLI, n8n node, Make app. "We do not gate features".
- Postiz FB provider: Graph v25.0, scopes pages_show_list,business_management,pages_manage_posts,pages_manage_engagement,pages_read_engagement,read_insights. Long-lived token 59d hardcoded, refreshToken stub. /me/accounts + /me/businesses owned_pages/client_pages. Multi-photo via /photos published=false -> /feed attached_media. Video /videos file_url. Stories photo_stories, video_stories 3-phase. handleErrors -> refresh-token/bad-body/retry. maxConcurrentJob 500. Insights page_media_view etc; comments note metrics deprecated 2026-06-15.
- Postiz IG provider: Facebook Login via Page (graph.facebook.com), scopes instagram_basic,pages_show_list,pages_read_engagement,business_management,instagram_content_publish,instagram_manage_comments,instagram_manage_insights. Container /media -> status_code polling -> media_publish. Carousel max 10, maxLength 2200, error 2207042 = 25 posts/day(?) per Postiz message. Trial reels. maxConcurrentJob 400.
- Mixpost Lite: MIT (VERIFIED README), Composer package. Lite = FB Pages, X, Mastodon only (INFERRED from postiz.com/blotato comparisons). Pro $299 one-time, Enterprise $1,199 one-time; Enterprise adds SaaS billing (secondary sources). mixpost.app blocked.

## ผลต่อ PRD
กำลังค้นคว้า

## คำถามที่ยังเปิด
กำลังค้นคว้า

## แหล่งอ้างอิง
- https://raw.githubusercontent.com/gitroomhq/postiz-app/main/README.md
- https://raw.githubusercontent.com/gitroomhq/postiz-app/main/libraries/nestjs-libraries/src/integrations/social/facebook.provider.ts
- https://raw.githubusercontent.com/gitroomhq/postiz-app/main/libraries/nestjs-libraries/src/integrations/social/instagram.provider.ts
- https://raw.githubusercontent.com/inovector/mixpost/main/README.md
- https://www.blotato.com/blog/mixpost-vs-postiz
