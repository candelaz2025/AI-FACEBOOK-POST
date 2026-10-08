# LINE Platform สำหรับ PANGLAB (Messaging API, LINE Login, OA Pricing ไทย 2026)

## สรุป
ฟีเจอร์ "อนุมัติโพสต์ใน LINE" (CAL-5) ทำได้ด้วย LINE OA ของ PANGLAB เองหนึ่งบัญชี + Messaging API (push Flex Message ที่มีปุ่ม postback อนุมัติ/ขอแก้) และ LINE Login (OIDC) พร้อม `bot_prompt` เพื่อผูก userId และชวนเพิ่มเพื่อนในขั้นตอนเดียว ข้อความ push นับโควตาของแพ็กเกจ OA ไทย (Free 300 / Basic 1,280฿ 15,000 / Pro 1,780฿ 35,000 ข้อความต่อเดือน ไม่รวม VAT) ส่วนการ broadcast แทน OA ของลูกค้า (PUB-9) ทำได้สองแบบ: ลูกค้าสร้าง Messaging API channel เองแล้วมอบ credentials ให้ PANGLAB (ทำได้ทันที) หรือใช้ Module channel ซึ่งต้องสมัครเป็น partner แบบ corporate กับ LINE

หมายเหตุวิธีวิจัย: developers.line.biz, lineforbusiness.com และ relevantaudience.com ถูก egress proxy บล็อก ข้อมูลจึงมาจาก WebSearch summaries ของหน้าทางการ (ระบุ VERIFIED เมื่อ snippet มาจากหน้าทางการโดยตรง) และแหล่ง third-party (INFERRED)

## 1. Messaging API: Flex Message + Postback สำหรับ approve/reject

| รายการ | รายละเอียด | สถานะ |
|---|---|---|
| Postback `data` | string ส่งกลับมาใน webhook `postback.data` สูงสุด 300 ตัวอักษร | INFERRED (classmethod, line-bot-sdk docs; หน้าทางการเข้าไม่ได้) |
| `displayText` | แสดงในแชตเหมือนผู้ใช้พิมพ์เอง สูงสุด 300 ตัวอักษร, ห้ามใช้คู่กับ `text` (deprecated) | INFERRED |
| `label` | สูงสุด 20 ตัวอักษร (template) | INFERRED |
| Flex button | รับ action object ชุดเดียวกัน (postback/uri/message) | VERIFIED (LINE engineering blog + SDK docs) |
| Rich menu behaviour | postback ระบุการเปิด/ปิด rich menu หลังกดได้ (LINE ≥ 12.6.0) | VERIFIED (snippet developers.line.biz/actions) |
| โควตา | reply message ไม่นับโควตา; push / multicast / broadcast / narrowcast นับโควตา | INFERRED (8x8 docs, สอดคล้องกับ Messaging API pricing page) |

Flow ที่แนะนำ: เมื่อโพสต์เข้าสถานะ Pending approval → `POST /v2/bot/message/push` ไปยัง userId ของ Approver พร้อม Flex bubble (รูป preview, caption ย่อ, ปุ่ม "อนุมัติ" / "ขอแก้" / "ดูในเว็บ" แบบ uri) → ผู้ใช้กดปุ่ม → webhook ได้ `postback` event พร้อม `replyToken` → server ตรวจสิทธิ์แล้วตอบยืนยันด้วย reply message (ฟรีโควตา) เนื่องจาก `data` จำกัด 300 ตัวอักษร ควรใส่เพียง `act=approve&pid=<postId>&n=<nonce>` แล้วตรวจสิทธิ์ฝั่ง server จาก userId ที่ webhook ส่งมา (ไม่เชื่อ data อย่างเดียว) การตรวจลายเซ็น `X-Line-Signature` ของ webhook ด้วย channel secret เป็นแนวปฏิบัติมาตรฐาน (INFERRED จากความรู้ทั่วไปของ API ไม่ได้อ่านหน้าทางการรอบนี้)

## 2. LINE Login (OIDC)

| หัวข้อ | รายละเอียด | สถานะ |
|---|---|---|
| Version / มาตรฐาน | LINE Login v2.1 รองรับ OpenID Connect; discovery doc `https://access.line.me/.well-known/openid-configuration` | VERIFIED (snippet developers.line.biz verify-id-token) |
| Scopes | `openid`, `profile`, `email` (คั่นด้วย space); ได้ `id_token` เฉพาะเมื่อขอ `openid` | `openid profile` VERIFIED; `email` อยู่ในรายการ INFERRED |
| Email permission | ต้องยื่นขอใน Console (Basic settings → OpenID Connect → Apply) โดยยอมรับเงื่อนไขและอัปโหลด screenshot ที่แสดงการแจ้งเก็บอีเมล | VERIFIED (integrate-line-login guide) |
| Verify ID token | `POST https://api.line.me/oauth2/v2.1/verify` ส่ง `id_token` + `client_id` ได้ claims `iss, sub, aud, exp, iat, nonce, amr, name, picture, email` | VERIFIED |
| Local verify | HS256 (web login) ใช้ channel secret; ES256 (SDK/LIFF) ใช้ JWK ตาม `kid` | VERIFIED |
| ข้อควรระวัง | scope ใน access-token verify ไม่แสดง `email` แม้ได้สิทธิ์ ให้ดู claim ใน ID token; ห้ามเชื่อ userId ที่ client ส่งมา ให้ส่ง raw ID token มาตรวจที่ server | VERIFIED |
| Add friend option | `bot_prompt=normal` (checkbox ในหน้า consent) / `aggressive` (หน้าชวนเพิ่มเพื่อนแยกหลัง consent); ต้องผูก OA กับ Login channel ใน Console; callback ได้ `friendship_status_changed`; ตรวจทีหลังด้วย friendship status API (`friendFlag`) | VERIFIED (link-a-bot docs) |

ประเด็นสำคัญต่อ CAL-5: userId ที่ได้จาก LINE Login จะใช้ push ผ่าน Messaging API ได้ก็ต่อเมื่อ Login channel และ Messaging API channel อยู่ใต้ provider เดียวกัน (userId เป็น per-provider — INFERRED จากความรู้ทั่วไปของแพลตฟอร์ม) และผู้ใช้ต้องเป็นเพื่อนกับ OA ของ PANGLAB จึงต้องใช้ `bot_prompt=aggressive` ตอนสมัครด้วย LINE (AUTH-1)

## 3. LINE OA pricing ประเทศไทย 2026

| แพ็กเกจ | ราคา/เดือน (ไม่รวม VAT 7%) | รวม VAT (คำนวณ) | ข้อความฟรี/เดือน | ส่งเกินโควตา |
|---|---|---|---|---|
| Free (Communication) | 0฿ | 0฿ | 300 | ไม่ได้ |
| Basic | 1,280฿ | ~1,370฿ | 15,000 | ไม่ยืนยัน (ดูด้านล่าง) |
| Pro | 1,780฿ | ~1,905฿ | 35,000 (+ MyCustomer CRM) | ไม่ยืนยัน |

สถานะ: ตัวเลขราคา/โควตา INFERRED ระดับดี — หลายแหล่ง (yespress.io, relevantaudience.com ระบุว่าตรวจกับหน้าราคาไทยเมื่อ 9 ก.ย. 2026) ตรงกัน แต่เปิดหน้าทางการ lineforbusiness.com ไม่ได้ ราคาข้อความส่วนเกิน **ขัดแย้ง**: แหล่งหนึ่ง (เอกสารสอน) ระบุ Basic 0.10฿ / Pro 0.06฿ ต่อข้อความ, help center ไทยระบุ 4 สตางค์ (~400฿/10,000 ข้อความ), ตัวเลขปี 2019 คือ 0.08/0.04฿ (ล้าสมัย) การปรับราคาข้อความเพิ่ม 1 ต.ค. 2026 ที่พบใน search เป็นของญี่ปุ่น ไม่ใช่ไทย การนับโควตานับต่อผู้รับ (broadcast ถึงเพื่อน 10,000 คน = 10,000 ข้อความ) และนับเฉพาะเพื่อนที่ไม่ block (INFERRED)

## 4. Broadcast / Multicast / Narrowcast API

| Endpoint | ใช้ทำอะไร | ข้อจำกัด/หมายเหตุ | สถานะ |
|---|---|---|---|
| Push `POST /v2/bot/message/push` | ส่งถึง user/group เดียว | นับโควตา; รองรับ `X-Line-Retry-Key` | VERIFIED (retry docs) |
| Multicast | ส่งถึงรายชื่อ userId | เพดาน 500 userId/request ยังไม่ยืนยันรอบนี้ | INFERRED |
| Broadcast | ส่งถึงเพื่อนทุกคนของ OA | มี rate limit ต่อ endpoint (ตารางทางการมีค่า "60 requests/hour" แต่ยืนยันไม่ได้ว่าเป็นแถวไหน) | บางส่วน VERIFIED |
| Narrowcast | ส่งตาม audience/demographic | `limit.upToRemainingQuota=true` เพื่อไม่เกินโควตา | VERIFIED |
| Quota | `GET /v2/bot/message/quota`, `/quota/consumption` | ใช้แสดงโควตาคงเหลือใน UI | VERIFIED (ชื่อ endpoint) |

Rate limit คิดต่อ endpoint ต่อ channel แบบ token bucket (ไม่ได้รีเซ็ตต้นชั่วโมง) เกินแล้วได้ HTTP 429 ซึ่งอาจเกิดจากโควตารายเดือนหมดด้วย (VERIFIED, LINE Developers tips 2026-09-10 + reference) `X-Line-Retry-Key` (UUID ที่สร้างเอง) ใช้ได้กับ push/multicast/narrowcast/broadcast ต้องใส่ตั้งแต่ครั้งแรก ส่งซ้ำหลังสำเร็จจะได้ 409 พร้อม `X-Line-Accepted-Request-Id` (บางครั้ง) (VERIFIED) LINE Notify ปิดบริการแล้วตั้งแต่ 31 มี.ค. 2025 ทางเลือกเดียวคือ Messaging API (VERIFIED, LINE news end-of-life + หลายแหล่ง)

## 5. SaaS broadcast แทน OA ของลูกค้าได้หรือไม่

| ทางเลือก | วิธีทำ | ข้อดี | ข้อเสีย |
|---|---|---|---|
| A. ลูกค้าเปิด Messaging API channel เอง | ลูกค้าเปิดใช้ Messaging API ใน OA Manager (สร้าง provider ของตัวเอง) แล้วกรอก Channel ID/secret หรือ token ใน PANGLAB | ทำได้ทันที ไม่ต้องขออนุมัติจาก LINE; โควตาเป็นของ OA ลูกค้า | onboarding ยุ่ง (SME ไทยต้องเข้า Developers Console); ต้องเก็บ secret อย่างปลอดภัย; 1 OA มี Messaging API channel ได้ 1 ตัว อาจชนกับ chatbot เดิมของลูกค้า (webhook URL เดียว) |
| B. Module channel (partner) | PANGLAB สร้าง module channel แล้วให้ admin ของ OA ลูกค้า attach ผ่าน OAuth 2.0 | หนึ่ง module ผูกได้หลาย OA; มี chat control (acquire/release initiative); มี detach/list API; webhook ยังมาถึงแม้ลูกค้าปิด webhook | เปิดเฉพาะ "corporate customers who have made the prescribed applications"; ไม่มี long-lived token (ใช้ short-lived); userId ต่างกันในแต่ละ OA; บน LINE Marketplace ผูกได้ 1 module ต่อ OA |
| C. PANGLAB สร้าง channel ใต้ provider ตัวเองให้ลูกค้า | — | — | ไม่แนะนำ: เอกสารเตือนไม่ให้รวม channel ของบริษัทที่ไม่เกี่ยวข้องไว้ใน provider เดียว และย้าย channel ข้าม provider ไม่ได้ |

สถานะ: รายละเอียด module channel VERIFIED จาก snippet developers.line.biz/partner-docs ส่วนเงื่อนไขการสมัคร partner ในไทย (ค่าใช้จ่าย, คุณสมบัติ) ยังไม่ทราบ

## ผลต่อ PRD
| ID | ข้อเสนอ |
|---|---|
| AUTH-1 | LINE Login ใช้ OIDC (`openid profile`, ยื่นขอ `email` ล่วงหน้าเพราะต้องมี screenshot แจ้งการเก็บอีเมล), ตรวจ ID token ฝั่ง server เท่านั้น, ตั้ง `bot_prompt=aggressive` เพื่อให้ผู้ใช้เป็นเพื่อน PANGLAB OA ตั้งแต่สมัคร; วาง Login channel + Messaging API channel ไว้ใต้ provider เดียวกัน |
| CAL-5 | ระบุสเปก: push Flex bubble ต่อโพสต์ (หรือ carousel รวมรายวันเพื่อลดโควตา), postback `data` ≤ 300 ตัวอักษร (`act`,`pid`,`nonce`), ตรวจ `X-Line-Signature` + สิทธิ์ Approver จาก `source.userId`, ตอบยืนยันด้วย reply (ไม่เสียโควตา), idempotent ต่อ postId; ปุ่ม "ขอแก้" เปิด LIFF/เว็บแทนการพิมพ์ในแชต |
| CAL-5 (ต้นทุน) | ตั้งงบ PANGLAB OA เป็น Pro (1,780฿+VAT, 35,000 push) ตั้งแต่ V1; เพิ่ม setting "สรุปรออนุมัติวันละครั้ง" และ fallback เป็น email/web push เมื่อใกล้โควตา (ตรวจด้วย `/quota/consumption`) |
| PUB-9 | Phase 3 เริ่มด้วยทางเลือก A (ลูกค้าเชื่อม Messaging API channel ของตัวเอง, โควตาเป็นของลูกค้า, แสดงโควตาคงเหลือใน UI) แล้วค่อยยื่นเป็น Module channel partner เมื่อมีลูกค้า OA มากพอ; ใช้ narrowcast `upToRemainingQuota=true` และ `X-Line-Retry-Key` ทุกการส่ง |
| ARCHITECTURE | เพิ่ม `line-webhook` endpoint, ตาราง `line_identities(user_id, provider_user_id, friend_flag)`, เก็บ channel secret ลูกค้าแบบเข้ารหัส (AES-256 ตามที่มีใน PRD), queue ที่จัดการ 429 แบบ backoff ไม่ใช่รอต้นชั่วโมง |
| เอกสาร/การตลาด | ห้ามสัญญา "LINE Notify" (ปิดแล้ว 2025) ใช้คำว่า "แจ้งเตือนผ่าน LINE OA ของ PANGLAB" |

## คำถามที่ยังเปิด
1. ราคาข้อความส่วนเกินของ Basic/Pro ไทยปี 2026 ที่แท้จริง (0.10/0.06฿ หรือ 4 สตางค์) — ต้องเปิดดูใน LINE OA Manager
2. เพดาน multicast (500 userId?) และ rate limit ของ broadcast/narrowcast ที่ถูกต้องจากตารางทางการ
3. LINE Thailand เปิดรับ Module channel partner จาก startup ไทยหรือไม่ เงื่อนไข/ค่าธรรมเนียมเท่าไร
4. ใช้ LIFF แทนเว็บสำหรับ "ขอแก้/ดู preview เต็ม" คุ้มกว่าหรือไม่ (ไม่ได้ค้นรอบนี้)
5. Certified provider (ทำให้ checkbox add friend ติ๊กไว้ก่อน) ขอได้อย่างไรในไทย

## แหล่งอ้างอิง
- https://developers.line.biz/en/docs/messaging-api/pricing/ (blocked; อ้างผ่าน search snippet)
- https://developers.line.biz/en/reference/messaging-api/ (blocked; snippet)
- https://developers.line.biz/en/docs/messaging-api/actions/ (snippet)
- https://developers.line.biz/en/docs/messaging-api/retrying-api-request/
- https://developers.line.biz/en/tips/2026/09/10/messaging-api-rate-limits/
- https://developers.line.biz/en/docs/messaging-api/development-guidelines/
- https://developers.line.biz/en/docs/partner-docs/module/
- https://developers.line.biz/en/docs/partner-docs/module-technical-attach-channel/
- https://developers.line.biz/en/docs/partner-docs/module-technical-using-messaging-api/
- https://developers.line.biz/en/docs/line-login/verify-id-token
- https://developers.line.biz/en/reference/line-login/
- https://developers.line.biz/en/docs/line-login/integrate-line-login/
- https://developers.line.biz/en/docs/line-login/link-a-bot/
- https://developers.line.biz/en/news/tags/end-of-life
- https://engineering.linecorp.com/en/blog/introducing-flex-message-a-new-message-type-for-line-messaging-api/
- https://dev.classmethod.jp/articles/line-messaging-api-action-object/
- https://line-bot-sdk-python.readthedocs.io/en/stable/linebot.models.html
- https://developer.8x8.com/connect/docs/line/loa-messaging
- https://yespress.io/line-company-thailand
- https://www.relevantaudience.com/digital-marketing-en/line-thailand-business-solutions-2026/ (blocked; snippet)
- https://than-is-on.duckdns.org/LINE_OA_DEV/module-01-intro.html (third-party, overage 0.10/0.06฿)
- https://www.marketingoops.com/news/line-official-account-new-price
- https://www.bangkokpost.com/business/1724687/line-draws-flak-over-changes (ราคา 2019, ล้าสมัย)
- https://roboin.io/article/2024/10/07/line-terminates-line-notify-service
- https://help.shopline.com/hc/en-001/articles/900004854846
