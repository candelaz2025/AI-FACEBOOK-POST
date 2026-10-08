# Payments & Tax สำหรับ Thai SaaS (PANGLAB)

> ค้นคว้า 2026-10-08 (retry run). ป้ายกำกับ: **VERIFIED** = อ่านจากหน้าแหล่งที่มา/สรุปของแหล่งทางการ, **INFERRED** = อนุมานหรือมาจากแหล่งรอง. เว็บทางการหลายแห่ง (stripe.com, docs.stripe.com, omise.co, gbprimepay.com, rd.go.th) ถูก egress proxy บล็อก จึงอาศัยผลสรุปจาก WebSearch ซึ่งอ่านหน้าเหล่านั้นแทน ตัวเลขค่าธรรมเนียมต้องยืนยันซ้ำก่อนใช้ใน pricing จริง

## สรุป
สำหรับ PANGLAB ที่ขาย credit pack เป็นหลัก PromptPay เหมาะกับการซื้อแบบครั้งเดียว (one-time top-up) แต่ **ไม่เหมาะกับการตัดเงินอัตโนมัติรายเดือน** ทั้งบน Stripe และ Opn/Omise ส่วน subscription อัตโนมัติต้องใช้บัตร (card-on-file) ด้าน Stripe TH และ Opn/Omise มีอัตรา PromptPay ราว 1.65% และบัตรในประเทศราว 3.65% ส่วน 2C2P และ GB Prime Pay ไม่ประกาศอัตราสาธารณะ ด้านภาษี เมื่อรายรับเกิน 1.8 ล้านบาทต้องจด VAT ภายใน 30 วัน, ต้องออกใบกำกับภาษีเต็มรูป (ม.86/4) ให้ลูกค้า B2B, และลูกค้านิติบุคคลจะหักภาษี ณ ที่จ่าย 3% (หรือ 1% ผ่าน e-Withholding Tax ซึ่ง ครม. ขยายถึง 31 ธ.ค. 2570) ทำให้ระบบ billing ต้องรองรับการรับเงินสุทธิและ 50 ทวิ

## Payment gateways: ค่าธรรมเนียมและความสามารถ

| Gateway | บัตรในประเทศ | PromptPay | Recurring อัตโนมัติ | หมายเหตุ / สถานะข้อมูล |
|---|---|---|---|---|
| Stripe Thailand | 3.65% + ฿10; บัตรต่างประเทศ 4.75% + ฿10; FX +2% | 1.65% + ฿10 ต่อ refund | บัตร: ได้ (Billing +0.7%) / PromptPay: เฉพาะ Subscriptions/Invoices แบบ `send_invoice` (ลูกค้าต้องสแกนจ่ายเองทุกรอบ), Checkout ไม่รองรับ subscription/setup mode | อัตราอ่านจาก stripe.com/en-th/pricing ในการรันครั้งก่อน (VERIFIED เดิม) แต่รอบนี้เปิดซ้ำไม่ได้ และ DHL ระบุ fixed fee ฿11 → **conflict** ต้องเช็คอีกครั้ง. Dispute ฿500, Invoicing 0.4%. รับเงินได้เฉพาะ THB (VERIFIED support.stripe.com) |
| Opn Payments (Omise) | 3.65% | 1.65% | บัตร: ได้ ผ่าน Schedule API / ตั้ง charge schedule ใน dashboard, ต้อง attach card กับ customer (token ใช้ครั้งเดียว) / PromptPay: เป็น offline flow ต้องสแกน QR ทุกครั้ง → ไม่เหมาะ recurring | ราคาจาก omise.co/pricing/thailand (via search summary) + VAT 7% บนค่าธรรมเนียม (INFERRED จาก search summary). เปิดใช้ PromptPay ต้องอีเมลขอ support@opn.ooo (VERIFIED docs.opn.ooo). ม.ค. 2026 Visa x Omise เปิด Network Token สำหรับ merchant ไทย ช่วยให้ตัดบัตรรายเดือนต่อเนื่องเมื่อบัตรหมดอายุ (VERIFIED visa.co.th) |
| 2C2P | ไม่ประกาศ | รองรับ PromptPay (cross-border กับ MY/SG/KH/VN) | มี recurring/instalment (จากข่าวปี 2021) | ราคาแบบ custom ต้องขอ quote (INFERRED จาก third-party). เหมาะกับ volume สูง/enterprise มากกว่า MVP |
| GB Prime Pay | ไม่พบตัวเลขล่าสุด | รองรับ QR เงินสด / QR เครดิต | ไม่พบข้อมูล | ข่าวปี 2020 ระบุ "อัตราพิเศษ" ต่ำกว่าตลาด (~3%) ฟรีค่าแรกเข้า/รายเดือน แต่ไม่มีตัวเลข (INFERRED, ข้อมูลเก่า) |

**PromptPay one-time vs recurring:** ทุกแหล่งชี้ทางเดียวกันว่า PromptPay เป็น push payment ที่ลูกค้าต้องสแกน QR ยืนยันเองทุกครั้ง Stripe รองรับใน Subscriptions ได้เฉพาะโหมดส่ง invoice ให้ลูกค้าจ่ายเอง (VERIFIED จาก product-support table ใน docs.stripe.com/payments/promptpay ผ่าน search summary) ส่วน Opn ระบุว่าเป็น offline flow (VERIFIED) และ MemberPress/Worldline ระบุว่า PromptPay ไม่รองรับ recurring (INFERRED, แหล่งอื่น) **Refund** บน Stripe ทำได้ แต่ Stripe จะอีเมลขอเลขบัญชีจากลูกค้า ถ้าลูกค้าไม่ให้ refund อาจล้มเหลว (VERIFIED via search summary of Stripe docs)

**ข้อสรุปเชิงต้นทุน (INFERRED, คำนวณเอง):** แพ็ก ฿299 จ่ายด้วย PromptPay ≈ 1.65% = ฿4.93 (+VAT ค่าธรรมเนียมถ้ามี) เทียบบัตรในประเทศ Stripe ≈ 3.65% + ฿10 = ฿20.91 ดังนั้นสำหรับแพ็กราคาต่ำ PromptPay ถูกกว่าราว 4 เท่า และ fixed fee ฿10 ของ Stripe ทำให้แพ็กราคาต่ำกว่า ~฿200 ไม่คุ้มบนบัตร

## VAT registration
ผู้ประกอบการที่มีรายรับจากการขายสินค้า/บริการ (ก่อนหักค่าใช้จ่าย) **เกิน 1.8 ล้านบาทต่อปี** ต้องยื่น ภ.พ.01 ภายใน 30 วันนับจากวันที่รายรับเกิน (INFERRED จาก FlowAccount; มีความเห็นต่างว่านับ "ต่อปี" หรือ "สะสม") หลังจดแล้วต้องยื่น ภ.พ.30 ภายในวันที่ 15 ของเดือนถัดไป (ยื่นออนไลน์ได้ถึงวันที่ 23) และเมื่อจ่ายค่าบริการให้ผู้ให้บริการต่างประเทศ เช่น Google (Gemini/Imagen/Veo API, Workspace), Meta Ads ต้องยื่น **ภ.พ.36** นำส่ง VAT 7% แทน (reverse charge) แล้วนำไปเครดิตเป็นภาษีซื้อได้ (INFERRED จาก FlowAccount) ข้อนี้กระทบ PANGLAB โดยตรงเพราะต้นทุนหลักคือ Google AI API ซึ่งเรียกเก็บจากต่างประเทศ

การจด VAT ตั้งแต่ต้นมีข้อดีสำหรับ B2B (ลูกค้านิติบุคคลเคลม VAT ได้) แต่ทำให้ราคา B2C แพงขึ้น 7% ถ้าไม่ดูดซับไว้ ราคาที่แสดงต่อผู้บริโภคควรเป็นราคารวม VAT

## e-Tax Invoice & e-Receipt (กรมสรรพากร)

| ระบบ | ใครใช้ได้ | รูปแบบ | หมายเหตุ |
|---|---|---|---|
| e-Tax Invoice & e-Receipt (เต็มระบบ) | นิติบุคคล ไม่จำกัดรายได้ | XML ลงลายมือชื่อดิจิทัล (ต้องมีใบรับรอง CA) ส่งข้อมูลให้กรมฯ | ใช้ผ่าน Service Provider ที่ได้รับอนุมัติ หรือเชื่อมตรง (INFERRED จากรายงาน Easy E-Receipt 2.0) |
| e-Tax Invoice by Time Stamp (by Email) | เดิม: รายได้ไม่เกิน 30 ล้านบาท/ปี | PDF/A-3 ส่ง cc อีเมลกลางของกรมฯ เพื่อประทับ Time Stamp ฟรี | เอกสารสัมมนากรมฯ และ KTC ยังระบุเพดาน 30 ล้าน แต่ PEAK FAQ ระบุว่าตั้งแต่ 2567 รายได้เกิน 30 ล้านยื่น ก.อ.01 ขอใช้ได้ผ่านสรรพากรภาค → **conflict**. FlowAccount ระบุว่ารองรับเฉพาะอีเมล Gmail/Google Workspace ที่ลงทะเบียนไว้ (INFERRED) |

สำหรับ MVP แนวทางที่ปฏิบัติได้คือออกใบกำกับภาษีผ่าน accounting SaaS (FlowAccount/PEAK) ที่รองรับ e-Tax by Time Stamp หรือ Service Provider แทนการสร้างเอง (INFERRED)

## ใบกำกับภาษีเต็มรูป (มาตรา 86/4)
รายการขั้นต่ำ (INFERRED จาก OFM + ข้อหารือกรมสรรพากรที่ปรากฏในผลค้นหา ยังไม่ได้อ่านตัวบทโดยตรง): (1) คำว่า "ใบกำกับภาษี" ในที่เห็นเด่นชัด (2) ชื่อ ที่อยู่ เลขประจำตัวผู้เสียภาษีของผู้ขาย (3) ชื่อ ที่อยู่ของผู้ซื้อ (ในทางปฏิบัติลูกค้านิติบุคคลต้องการเลขผู้เสียภาษี 13 หลักและสาขาด้วย) (4) เลขที่ใบกำกับ และเลขที่เล่ม (ถ้ามี) (5) ชื่อ ชนิด ประเภท ปริมาณ และมูลค่าของสินค้า/บริการ (6) จำนวน VAT แยกจากมูลค่าชัดเจน (7) วันที่ออก ข้อหารือกรมฯ ระบุว่าใบกำกับที่ไม่ครบตาม 86/4 ใช้เคลมภาษีซื้อไม่ได้ และผู้ขายที่ออกใบกำกับอย่างย่อ (ม.86/6) แล้วสามารถยกเลิกและออกแบบเต็มรูปแทนได้ ชื่อผู้ซื้อเป็นภาษาอังกฤษได้ แต่ชื่อผู้ขายในใบรับต้องเป็นภาษาไทย (ม.105 ทวิ)

## Withholding tax สำหรับลูกค้า B2B
เมื่อลูกค้าที่เป็นนิติบุคคลจ่ายค่าบริการให้บริษัทผู้ให้บริการ ปกติจะหักภาษี ณ ที่จ่าย **3%** ของค่าบริการก่อน VAT (INFERRED: อัตรา 3% เป็นความรู้ทั่วไปจาก FlowAccount/ธนาคาร ยังไม่ได้อ่านประกาศ ท.ป.4/2528 โดยตรง) เกณฑ์ปฏิบัติทั่วไปคือหักเมื่อจ่ายครั้งละ ≥ ฿1,000 (INFERRED, ไม่ได้ยืนยันในรอบนี้) ผู้จ่ายต้องออกหนังสือรับรอง **50 ทวิ** ให้ผู้รับเงิน เว้นแต่จ่ายผ่าน **e-Withholding Tax** ของธนาคารที่ร่วมโครงการ ซึ่งข้อมูลจะถูกส่งเข้ากรมฯ และไม่ต้องออก/เก็บ 50 ทวิ (VERIFIED จากหน้า Bangkok Bank/ข่าว)

อัตราลดเหลือ **1%** เมื่อหักผ่าน e-WHT: มาตรการเดิมสิ้นสุด 31 ธ.ค. 2568 และ ครม. (มิ.ย. 2569) เห็นชอบขยายถึง **31 ธ.ค. 2570** ครอบคลุมค่าบริการ ค่าจ้างทำของ ค่าเช่า ค่านายหน้า ฯลฯ (VERIFIED จากข่าว The Standard/PPTV/InfoQuest; แต่ยังไม่พบกฎกระทรวงฉบับสุดท้ายในราชกิจจานุเบกษา) ผลต่อ PANGLAB: ลูกค้า B2B ที่ซื้อแพ็ก ฿10,000 (ก่อน VAT) จะโอนมา ฿10,700 − ฿300 = ฿10,400 (หรือ ฿10,600 ถ้าผ่าน e-WHT 1%) ระบบต้องบันทึกยอดสุทธิ, ออกใบเสร็จเต็มจำนวน และเก็บ 50 ทวิ ไว้เครดิตภาษีปลายปี **ข้อจำกัดสำคัญ:** การตัดบัตร/PromptPay ผ่าน gateway หักภาษี ณ ที่จ่ายไม่ได้ ลูกค้า B2B ที่ต้องหัก WHT จึงต้องจ่ายผ่าน invoice + โอนธนาคาร หรือ PANGLAB ต้องยอมรับยอดเต็ม (INFERRED)

## ผลต่อ PRD
| ID | การเปลี่ยนแปลงที่แนะนำ |
|---|---|
| PAY-01 | Gateway หลักสำหรับ MVP: เลือก **Opn/Omise หรือ Stripe TH** (ทั้งคู่ PromptPay ~1.65%, บัตร ~3.65%); ใช้ PromptPay เป็นวิธีจ่ายเริ่มต้นสำหรับ credit pack แบบครั้งเดียว และบัตรสำหรับ subscription. ซ่อน abstraction `PaymentProvider` ใน architecture เพื่อสลับได้ |
| PAY-02 | Subscription รายเดือน: auto-renew เฉพาะบัตร (card-on-file/Schedule API หรือ Stripe Billing). ผู้ใช้ PromptPay ได้ "แจ้งเตือนต่ออายุ + QR ใหม่" ทาง LINE/อีเมลแทนตัดอัตโนมัติ; UX ต้องแสดง QR timeout และสถานะรอชำระผ่าน webhook |
| PAY-03 | ตั้งราคาแพ็กขั้นต่ำ ≥ ฿199 และคำนวณ margin หลังค่าธรรมเนียม (fixed fee ฿10 ทำให้แพ็กเล็กบนบัตรไม่คุ้ม); credit ต้อง grant ตอน webhook `succeeded` เท่านั้น (idempotent) |
| PAY-04 | Refund policy: credit ที่ซื้อแล้วไม่คืนเงินเป็นหลัก; ถ้าคืนผ่าน PromptPay ต้องมี flow ขอเลขบัญชีลูกค้า |
| TAX-01 | Billing profile ต่อ workspace: ชื่อนิติบุคคล/บุคคล, เลขผู้เสียภาษี 13 หลัก, สาขา (สำนักงานใหญ่/เลขสาขา), ที่อยู่ — บังคับเมื่อขอใบกำกับเต็มรูป |
| TAX-02 | ออกใบกำกับภาษี/ใบเสร็จอัตโนมัติผ่าน e-Tax provider (FlowAccount/PEAK API หรือ Service Provider) ไม่สร้างเองใน MVP; รองรับ PDF/A-3 + เลขเอกสารต่อเนื่อง; แสดงราคารวม VAT 7% ในหน้า pricing |
| TAX-03 | B2B invoice flow: ปุ่ม "ชำระแบบใบแจ้งหนี้ (โอนธนาคาร)" สำหรับแพ็ก Business/Agency ≥ ฿1,000 ที่รองรับการหัก WHT 3%/1%, อัปโหลด 50 ทวิ, และ admin ยืนยันยอดสุทธิก่อนเติม credit |
| TAX-04 | Finance ops: จด VAT เมื่อใกล้ 1.8 ล้าน (หรือจดตั้งแต่ต้นถ้าเน้น B2B), ยื่น ภ.พ.36 ทุกเดือนสำหรับค่า Google AI/Meta/Cloud ต่างประเทศ, ภ.พ.30 รายเดือน — เพิ่มใน launch checklist |

## คำถามที่ยังเปิด
1. อัตรา Stripe TH ปัจจุบัน: fixed fee ฿10 หรือ ฿11 (conflict กับ DHL) และค่าธรรมเนียมรวม VAT หรือไม่ — ต้องเปิด stripe.com/th/pricing ด้วยเบราว์เซอร์จริง
2. อัตรา Omise ปัจจุบันยังเป็น 3.65%/1.65% หรือไม่ และมี payout fee เท่าไร (omise.co ถูกบล็อกในรอบนี้)
3. GB Prime Pay และ 2C2P อัตราจริง — ต้องขอ quote
4. e-Tax by Time Stamp ยังจำกัดรายได้ 30 ล้านหรือไม่ (PEAK vs เอกสารกรมฯ) — ตรวจ rd.go.th/27659.html
5. กฎกระทรวงขยาย e-WHT 1% ถึง 2570 ประกาศในราชกิจจานุเบกษาแล้วหรือยัง
6. Stripe PromptPay ใน Subscriptions แบบ `send_invoice` ใช้งานจริงกับ THB ได้ราบรื่นแค่ไหน (ยังไม่มีหลักฐานจากผู้ใช้จริง)
7. ต้องหัก ภ.ง.ด.54 สำหรับค่าบริการ Google AI API ที่จ่ายต่างประเทศหรือไม่ — ปรึกษาผู้สอบบัญชี

## แหล่งอ้างอิง
- https://stripe.com/en-th/pricing (อ่านในการรันครั้งก่อน; ถูกบล็อกในรอบนี้)
- https://docs.stripe.com/payments/promptpay
- https://stripe.com/payment-method/promptpay
- https://support.stripe.com/questions/supported-payment-methods-currencies-and-businesses-for-stripe-accounts-in-thailand
- https://support.stripe.com/questions/thailand-faq
- https://www.dhl.com/discover/en-th/e-commerce-advice/e-commerce-best-practice/payment-gateways-for-e-commerce
- https://memberpress.com/?p=63101
- https://docs.connect.worldline-solutions.com/payment-product/promptpay/faqs
- https://www.omise.co/pricing/thailand
- https://docs.opn.ooo/how-to-do-recurring-payments
- https://opn.ooo/jp-en/faq/payments/how-to-do-recurring-payments
- https://docs.opn.ooo/promptpay
- https://assets.omise.co/charging-cards
- https://www.visa.co.th/en_TH/about-visa/newsroom/press-releases/visa-and-omise-partner-to-advance-payment-security-with-network-token-solution-for-thai-merchants.html
- https://2c2p.com/countries/thailand/
- https://www.theasianbanker.com/press-releases/deutsche-bank-partners-2c2p-to-launch-payments-platform-in-thailand
- https://dodopayments.com/payments-in/thailand
- https://www.mitihoon.com/2020/09/11/197171/
- https://flowaccount.com/blog/vat-basic-knowledge/
- https://flowaccount.com/blog/revenue-over-1-8-million-not-vat-registered/
- https://flowaccount.com/blog/pp36/
- https://flowaccount.com/blog/advertising-expense-submit-vat-pp36/
- https://flowaccount.com/blog/google-workspace-tax-pnd54-pp36/
- https://flowaccount.com/blog/what-is-an-e-tax-invoice-by-timestamp/
- https://flowaccount.com/our-integrations/etax-by-email
- https://intercom.help/peak/en/articles/8764369-คำถามที-พบบ-อยเกี-ยวกับ-e-tax-invoice-faq012
- https://www.rd.go.th/publish/seminar/Seminar_190819.pdf
- https://www.rd.go.th/27659.html
- https://www.ktc.co.th/article/knowledge/what-is-etax-invoice
- https://www.infoquest.co.th/?p=462192
- https://www.ofm.co.th/blog/what-is-tax-invoice/
- https://www.bangkokbiznews.com/business/983215
- https://rd.go.th/3568.html
- https://flowaccount.com/blog/wht-basic-knowledge/
- https://flowaccount.com/blog/?p=27451
- https://www.bangkokbank.com/th-TH/Business-Banking/Manage-My-Business/Payments/eWithholding-Tax
- https://thestandard.co/cabinet-extend-tax-measures-e-withholding/
- https://www.pptvhd36.com/wealth/economic/277689
- https://www.infoquest.co.th/2026/601636
- https://www.bangkokbiznews.com/finance/investment/1059807
- https://www.forvismazars.com/th/en/insights/doing-business-in-thailand/tax/extension-withholding-tax-reduction
