# กฎหมายไทยสำหรับ PANGLAB: PDPA, อย., สคบ., ลิขสิทธิ์ภาพ AI, ร่างกฎหมาย AI

> ค้นคว้าเมื่อ 2026-10-08 (retry run) เว็บทางการหลายแห่ง (ocpb.go.th, tilleke.com, mondaq.com, hfocus.org, matichon.co.th) ถูก egress proxy บล็อก ข้อมูลส่วนนั้นจึงมาจากผลสรุปของ WebSearch ที่ชี้ไปยังหน้าเหล่านั้น แท็กที่ใช้: **VERIFIED** = เห็นในหน้าต้นทางหรือในผลสรุปที่อ้างหน้าต้นทางโดยตรง, **INFERRED** = การตีความของผู้เขียน, **UNVERIFIED** = มาจาก draft ก่อนหน้าที่ไม่มี URL เอกสารนี้ไม่ใช่คำปรึกษาทางกฎหมาย ต้องให้ทนายไทยตรวจก่อนเปิดตัว

## สรุป
PANGLAB เป็น **Processor** ของข้อมูลส่วนบุคคลที่ร้านค้าอัปโหลดหรือให้ระบบประมวลผล และเป็น **Controller** ของข้อมูลบัญชี billing และ analytics ของตัวเอง การส่งข้อมูลไป Gemini หรือ cloud ต่างประเทศต้องทำตามประกาศ PDPC ตามมาตรา 28/29 (มีผล 24 มี.ค. 2567) และ PDPC เริ่มปรับ processor โดยตรงแล้ว (สูงสุดที่พบ 3 ล้านบาท เมื่อ ส.ค. 2568) ความเสี่ยงด้านเนื้อหาที่ใหญ่ที่สุดมี 2 เรื่อง เรื่องแรกคือ caption อาหารหรืออาหารเสริมที่อ้างสรรพคุณโดยไม่มีใบอนุญาตโฆษณาจาก อย. (หลักเกณฑ์การโฆษณาอาหาร พ.ศ. 2569 มีผล 28 ก.ค. 2569) เรื่องที่สองคือประกาศ สคบ. (มี.ค. 2569) ที่บังคับให้ระบุว่าภาพโฆษณาสร้างหรือแก้ไขด้วย AI PANGLAB จึงต้องทำ label และ claim-guardrail เป็นฟีเจอร์หลักของผลิตภัณฑ์

## 1. PDPA: บทบาท Controller vs Processor ของ SaaS

| ประเภทข้อมูลใน PANGLAB | บทบาท PANGLAB | ภาระหลัก |
|---|---|---|
| บัญชีผู้ใช้ อีเมล เบอร์ การชำระเงิน log การใช้งาน และ marketing ของ PANGLAB เอง | Controller | lawful basis, privacy notice, สิทธิเจ้าของข้อมูล, แจ้ง breach ต่อ PDPC ภายใน 72 ชม., DPO ถ้าเข้าเกณฑ์, ROPA |
| ข้อมูลที่ร้านใส่เข้าระบบ เช่น รูปลูกค้า รีวิว ชื่อในโพสต์ รายชื่อลูกค้า และคอมเมนต์หรือ DM ที่ดึงจาก FB/IG | Processor | ประมวลผลตามคำสั่ง controller เท่านั้น, security measures, ROPA ฝั่ง processor, แจ้ง controller เมื่อเกิด breach, ควบคุม sub-processor (Google/Gemini, cloud) |
| ใช้ข้อมูลลูกค้าของร้านไปเทรนหรือปรับโมเดล หรือทำ benchmark ของ PANGLAB เอง | กลายเป็น Controller (INFERRED) | ต้องมี lawful basis ของตัวเอง ควรเลี่ยง หรือทำเป็น opt-in |

ตามคู่มือ Baker McKenzie Cloud Compliance Center (VERIFIED) cloud provider ถือเป็น data processor เมื่อประมวลผลหรือโฮสต์ข้อมูลตามคำสั่งของ controller และไม่มีอำนาจตัดสินใจเองเรื่องการเก็บ ใช้ หรือเปิดเผย ตาม DFDL และผลสรุปอื่น (VERIFIED) processor มีหน้าที่ตาม ม.40 ได้แก่ จัด security ที่เหมาะสม (ม.37(1) และ ม.40(2)) และจัดทำบันทึกรายการประมวลผล (ROPA) ตามประกาศ PDPC (ม.40(3)) ส่วน controller ต้องทำข้อตกลง (DPA) กับ processor เลขวรรคของ ม.40 ในแต่ละแหล่งไม่ตรงกัน ควรตรวจกับตัวบท DataGuidance สรุปร่างประกาศรองไว้ว่า processor ต้องทำตามคำสั่งที่เป็นลายลักษณ์อักษร ขออนุญาตก่อนใช้ sub-processor ช่วย controller เรื่อง breach และสิทธิเจ้าของข้อมูล และแจ้งเมื่อคำสั่งผิดกฎหมาย ยังไม่ยืนยันว่าประกาศออกจริงในรูปนี้ แต่ควรใส่ทุกข้อใน DPA อยู่ดี (INFERRED)

**การบังคับใช้ (VERIFIED จาก Tilleke, Gala Law, Hogan Lovells):** วันที่ 1 ส.ค. 2568 PDPC ประกาศค่าปรับทางปกครอง 8 รายการใน 5 คดี
- คดีหนึ่ง **data processor ถูกปรับ 3,000,000 บาท**
- อีกคดีหนึ่ง หน่วยงานรัฐและ **software developer (processor)** ถูกปรับรายละกว่า 150,000 บาท หลังถูกโจมตีจนข้อมูลราว 200,000 คนรั่ว ผลสอบพบว่า security อ่อน จัดการรหัสผ่านไม่ดี ไม่ทำ risk assessment และ **ไม่มี DPA ที่เหมาะสม**
- ความผิดที่พบซ้ำ ได้แก่ security ไม่เพียงพอ ไม่แจ้ง breach และไม่แต่งตั้ง DPO

ยอดค่าปรับต่างกันตามแหล่ง (ราว 14.5 ล้านบาทในรอบนี้ และเกิน 21 ล้านบาทเมื่อนับสะสม) เพดานโทษปรับทางปกครองคือ 5 ล้านบาท (จาก consentstack ซึ่งเป็นแหล่งรอง) ยังไม่พบข้อมูลค่าปรับปี 2569

## 2. การโอนข้อมูลข้ามพรมแดน (มาตรา 28-29)

| กลไก | ใช้กับ PANGLAB อย่างไร | สถานะ |
|---|---|---|
| Adequacy (ม.28) คือ PDPC ประกาศว่าประเทศปลายทางมีมาตรฐานเพียงพอ | ยังไม่พบรายชื่อประเทศที่ PDPC ประกาศ จึงไม่ควรพึ่งกลไกนี้ | VERIFIED ว่า PDPC ใช้ดุลพินิจรายกรณีหรือทำรายชื่อประเทศได้ |
| ข้อยกเว้นตาม ม.28 ได้แก่ ปฏิบัติตามสัญญากับเจ้าของข้อมูล ปฏิบัติตามกฎหมาย vital interest และประโยชน์สาธารณะ | ในบทบาท Controller การส่ง prompt หรือข้อมูลบัญชีไปผู้ให้บริการต่างประเทศเพื่อให้บริการตามสัญญา อาจอ้าง "contract necessity" ได้ (INFERRED) | VERIFIED (Tilleke/Conventus) |
| Consent | ใช้ได้เฉพาะเมื่อแจ้งก่อนว่าปลายทางมีมาตรฐานไม่เพียงพอ เหมาะกับการโอนเป็นครั้งคราว ไม่เหมาะกับ flow ประจำ | VERIFIED |
| BCR (ม.29) | ใช้ในเครือบริษัทและต้องยื่นให้ PDPC อนุมัติ ไม่เกี่ยวกับ startup | VERIFIED |
| SCC (ม.29) มี 2 แบบ คือ Thai Model และ Overseas Model (เช่น ASEAN MCC, EU SCC) | ใส่ไว้ใน DPA กับ sub-processor (Google Cloud/Gemini, hosting อื่น) และเสนอให้ร้านค้าที่เป็น controller ใช้ | VERIFIED: ประกาศ 25 ธ.ค. 2566 มีผล 24 มี.ค. 2567 ต้องรับประกันสิทธิเจ้าของข้อมูลและช่องทางเยียวยา ผลสรุปหนึ่งระบุว่าต้อง "ยื่น" SCC ต่อ PDPC ด้วย ซึ่งขัดกับความเข้าใจทั่วไป ต้องตรวจตัวบท |

ทางที่เสี่ยงน้อยที่สุด (INFERRED) มีดังนี้
- เก็บข้อมูลหลักไว้ใน region สิงคโปร์หรือไทย
- ใช้ Gemini API แบบที่ Google ไม่นำข้อมูลไปเทรน (paid tier)
- ทำรายชื่อ sub-processor แบบสาธารณะ
- ผูก SCC (Overseas Model ใน Cloud Data Processing Addendum ของ Google) เข้ากับ DPA ของ PANGLAB

draft ก่อนหน้าระบุว่า "การเก็บข้อมูลบน cloud ต่างประเทศโดยไม่มีบุคคลที่สามเข้าถึงไม่ถือเป็นการโอน" ข้อนี้ยัง UNVERIFIED ในรอบนี้ อย่าใช้เป็นฐานตัดสินใจ

## 3. อย. กับการโฆษณาอาหาร/อาหารเสริม/เครื่องสำอาง

| หมวด | ต้องขออนุญาตโฆษณาก่อนหรือไม่ | กฎหลัก | สถานะ |
|---|---|---|---|
| อาหารและผลิตภัณฑ์เสริมอาหาร | **ต้องขอ** เมื่อโฆษณาคุณประโยชน์ คุณภาพ หรือสรรพคุณ ต้องส่งเสียง ภาพ และข้อความให้ อย. พิจารณาก่อน และสรรพคุณต้องตรงกับที่ได้รับอนุญาต โพสต์และคลิปออนไลน์เข้านิยาม "การโฆษณา" | พ.ร.บ.อาหาร 2522 และ **ประกาศ อย. หลักเกณฑ์การโฆษณาอาหาร พ.ศ. 2569** (ราชกิจจาฯ 27 ก.ค. 2569 มีผล 28 ก.ค. 2569 ยกเลิกฉบับ 2564) ฉบับใหม่มีรายการคำต้องห้ามละเอียดขึ้น เพิ่มเกณฑ์ claim ด้านสิ่งแวดล้อมและ BCG มีเกณฑ์เฉพาะกระท่อม กัญชา กัญชง (ห้ามสื่อถึงเด็ก) และห้ามใช้ชื่อ ภาพ หรือความน่าเชื่อถือของแพทย์รับรองสินค้า | VERIFIED (Thansettakij, Bangkok Biznews, HFocus ผ่าน search) ส่วนเงื่อนไข "เมื่ออ้างสรรพคุณ" เป็น INFERRED จากหลักเดิม |
| เครื่องสำอาง | โดยหลัก **ไม่มี** ระบบขออนุญาตโฆษณาล่วงหน้า เพราะใช้ระบบจดแจ้งผลิตภัณฑ์ แต่สินค้าต้องจดแจ้งแล้ว | พ.ร.บ.เครื่องสำอาง 2558 ม.41 ห้ามข้อความไม่เป็นธรรมและห้ามอ้างว่ารักษาโรค ข้อความเท็จหรือเกินจริงมีโทษจำคุกไม่เกิน 1 ปี ปรับไม่เกิน 100,000 บาท กฎกระทรวงที่มีผล 22 พ.ย. 2567 ขยายรายการข้อความต้องห้าม อย. เตือนไม่ให้ใช้บุคลากรการแพทย์ในโฆษณา และในราว 6 ปีมีดาราและอินฟลูเอนเซอร์ถูกดำเนินคดีกว่า 230 คน | VERIFIED (legardy, Bangkok Insight, InfoQuest, Prachachat ผ่าน search) ส่วน "ไม่ต้องขออนุญาต" เป็น INFERRED |
| ยาและเครื่องมือแพทย์ | ต้องขอ และต้องแสดงเลขอนุญาตในสื่อ | อยู่นอกขอบเขต MVP ควรบล็อกหมวดนี้ | INFERRED |

ผลต่อผลิตภัณฑ์: ผู้ใช้หลักของ PANGLAB คือร้านอาหาร คาเฟ่ และแบรนด์ skincare หรืออาหารเสริมบน FB/IG ซึ่งเป็นกลุ่มที่เสี่ยงสูงที่สุด caption ชวนเชื่อแบบ "ผิวขาวใน 7 วัน" "ลดน้ำหนัก" "รักษา" หรือ "เห็นผล 100%" ที่ AI อาจเขียนออกมา คือข้อความที่ อย. ดำเนินคดีบ่อยที่สุด และผู้รีวิวหรือผู้โพสต์ก็ต้องรับผิดด้วย รายละเอียดจาก draft ก่อนหน้า (e-Submission ไม่เกิน 8 วันทำการ และคู่มือโฆษณาเครื่องสำอาง 2567) ยัง UNVERIFIED

## 4. สคบ. และประกาศเรื่องภาพ AI ในโฆษณา
แหล่งที่มา (VERIFIED) คือบทความ Tilleke & Gibbins วันที่ 12 มี.ค. 2569 (ผ่าน Mondaq และผลสรุป) และบทความ Tilleke เรื่องร่าง AI Act ที่ยืนยันว่าประกาศนี้ "ออกเมื่อ มี.ค. 2569 และมีผลแล้ว" สคบ. ออกประกาศภายใต้ พ.ร.บ.คุ้มครองผู้บริโภค 2522 ครอบคลุมภาพที่ตกแต่งด้วยซอฟต์แวร์หรือ AI เพื่อดึงดูดหรือสร้างความน่าเชื่อถือ โดยมีข้อกำหนดดังนี้

| ข้อกำหนด | รายละเอียด |
|---|---|
| ต้องมีข้อความกำกับ | เช่น "ภาพจริงที่ผ่านการแก้ไขด้วย AI" "ภาพจำลองที่แก้ไขด้วย AI" "ภาพที่สร้างโดย AI" รวมถึงวิดีโอที่สร้างโดย AI |
| ความชัดเจน | ข้อความต้องมองเห็น ได้ยิน หรืออ่านได้ชัดตามประเภทสื่อ |
| ความถูกต้องของสินค้า | ขนาด ปริมาณ และส่วนประกอบของสินค้าในภาพหรือวิดีโอต้องตรงกับที่ขายจริง |
| ฐานความผิด | โฆษณาไม่เป็นธรรม หรือข้อความที่ทำให้เข้าใจผิดในสาระสำคัญ (ม.22 พ.ร.บ.คุ้มครองผู้บริโภค) |

สิ่งที่ยังไม่ยืนยัน ได้แก่ ชื่อประกาศและเลขราชกิจจาฯ อย่างเป็นทางการ และบทลงโทษเฉพาะ เพราะหน้า ocpb.go.th ถูกบล็อก มีเอกสาร ocpb.go.th/images/article/article_20260511152227.pdf ที่เกี่ยวกับแนวปฏิบัติ AI ปี 2569 แต่อ่านไม่ได้ MOU อินฟลูเอนเซอร์ 10 ก.ย. 2569 จาก draft ก่อนยัง UNVERIFIED ส่วน Meta บังคับ disclosure เฉพาะโฆษณาการเมือง (InfoQuest) ซึ่งไม่พอสำหรับข้อกำหนดของ สคบ.

## 5. ลิขสิทธิ์ภาพที่สร้างด้วย AI ในไทย
ข้อมูลส่วนนี้ VERIFIED จากแนวทาง Generative AI ของ ETDA และงานวิจัยใน TCI
- พ.ร.บ.ลิขสิทธิ์ 2537 ม.4 นิยาม "ผู้สร้างสรรค์" ว่าเป็นผู้ทำงาน และ ม.8 ให้ผู้สร้างสรรค์เป็นเจ้าของ นักวิชาการตีความว่าผู้สร้างสรรค์ต้องเป็นมนุษย์
- ศาลฎีกากำหนดว่างานต้องมีความวิริยะและความสร้างสรรค์ในระดับหนึ่ง
- ETDA ระบุว่างานที่ AI สร้างล้วน ๆ **ไม่ได้รับความคุ้มครอง แม้มนุษย์จะเป็นคนเขียน prompt** แต่ถ้ามนุษย์ใส่ creative input เพิ่ม ส่วนนั้นอาจได้รับความคุ้มครอง
- กรมทรัพย์สินทางปัญญายังไม่มี position paper ที่ผูกพัน เมื่อ ก.ย. 2569 มีเพียงการหารือกับเกาหลีเรื่อง AI กับลิขสิทธิ์ (Thailand Business News)

ผลเชิงธุรกิจ (INFERRED): PANGLAB โอนลิขสิทธิ์ภาพที่ AI สร้างล้วนให้ลูกค้าไม่ได้จริง ทำได้เพียงโอนสิทธิเท่าที่มีและให้ license ใช้งาน คู่แข่งอาจก๊อปภาพ AI ล้วนได้โดยไม่ผิดลิขสิทธิ์ ส่วนภาพที่ผสมรูปสินค้าจริงหรือโลโก้ของร้าน ยังได้รับความคุ้มครองในส่วนที่มนุษย์สร้าง

## 6. ร่างกฎหมาย AI ของไทย
ข้อมูลส่วนนี้ VERIFIED จากบทความ Tilleke "Thailand Releases New Draft Artificial Intelligence Act" (ผ่านผลสรุป)
- ETDA เผยแพร่ร่าง พ.ร.บ. AI ฉบับปรับปรุงเมื่อ 2 ก.ค. 2569 รับฟังความเห็นราว 30 วัน (ปิดราวต้น ส.ค. 2569) โดยส่งความเห็นถึงกระทรวง DE
- ใช้โครงสร้าง **risk-based** ที่ได้แรงบันดาลใจจาก EU AI Act
- มีผลนอกอาณาเขตกับกิจกรรม AI ที่กระทบคนในไทย
- กำหนด **strict liability** สำหรับความเสียหายจาก AI และ **กฎความโปร่งใสสำหรับเนื้อหาที่ AI สร้าง**
- มาตรการเกี่ยวกับการออกผลิตภัณฑ์ AI มีผลทันทีเมื่อกฎหมายประกาศใช้
- วันเดียวกัน กสทช. ออกแนวทาง AI แบบไม่ผูกพันสำหรับผู้รับใบอนุญาตโทรคมนาคม

ไม่พบสถานะหลังช่วงรับฟังความเห็น เท่าที่พบ ณ 8 ต.ค. 2569 ร่างยังไม่ผ่านเป็นกฎหมาย ข้อกำหนด "ผู้แทนในประเทศ" สำหรับผู้ให้บริการต่างประเทศยัง UNVERIFIED (INFERRED) PANGLAB เป็นเครื่องมือสร้าง marketing content จึงน่าจะไม่อยู่ใน high-risk tier แต่จะต้องทำหน้าที่ transparency และ labeling ของ generative content ซึ่งสอดคล้องกับประกาศ สคบ. อยู่แล้ว

## ผลต่อ PRD
เสนอเพิ่มกลุ่ม requirement ใหม่ `LEGAL-*` ใน PRD.md (ID ใหม่ รอบนี้ไม่ได้เปิด PRD จึงต้องเช็กว่าไม่ซ้ำกับ ID เดิม)

| ID | ข้อเสนอ | ที่มา |
|---|---|---|
| LEGAL-01 AI disclosure label | ทุกภาพและวิดีโอที่ PANGLAB สร้างหรือแก้ ต้องมี metadata `aiOrigin: generated / edited / none` และใส่ข้อความ "ภาพที่สร้างโดย AI" หรือ "ภาพจริงที่ผ่านการแก้ไขด้วย AI" ให้อัตโนมัติ ทั้งในภาพ (overlay มุมภาพ เลือกตำแหน่งได้ แต่ปิดไม่ได้เมื่อโพสต์ถูกติดแท็กเป็นโฆษณาหรือขายของ) และท้าย caption | สคบ. มี.ค. 2569, ร่าง AI Act |
| LEGAL-02 Product-accuracy check | เมื่อภาพมีสินค้าของร้าน ให้แสดงคำเตือนก่อนโพสต์ว่า "ขนาด/ปริมาณ/ส่วนประกอบในภาพต้องตรงกับสินค้าจริง" และให้ผู้ใช้กดยืนยัน | สคบ. |
| LEGAL-03 Regulated-category guardrail | ให้เลือกหมวดใน Brand DNA (อาหาร, อาหารเสริม, เครื่องสำอาง, ยา/เครื่องมือแพทย์, อื่น ๆ) สำหรับหมวดอาหารและอาหารเสริม: system prompt ห้ามอ้างสรรพคุณ การรักษา หรือการลดน้ำหนัก, lint หลัง generate ด้วยรายการคำต้องห้ามของ อย. (อัปเดตตามประกาศ 2569), มีช่องใส่เลขใบอนุญาตโฆษณาหรือเลข อย. และเตือนว่าโพสต์ที่อ้างคุณประโยชน์ต้องขออนุญาตก่อน สำหรับหมวดยาและเครื่องมือแพทย์: บล็อกใน MVP | พ.ร.บ.อาหาร, ประกาศ อย. 2569, พ.ร.บ.เครื่องสำอาง ม.41 |
| LEGAL-04 No doctor/medical endorsement | ห้าม generate ภาพหรือข้อความที่ใช้แพทย์ เภสัชกร ชุดกาวน์ หรือคำว่า "แพทย์แนะนำ" กับอาหารและเครื่องสำอาง | ประกาศ อย. 2569, คำเตือน อย. |
| LEGAL-05 DPA + sub-processor list | เผยแพร่ DPA ภาษาไทยที่ครอบคลุม ม.40 พร้อม SCC (Overseas Model) และหน้ารายชื่อ sub-processor (Google Gemini/Imagen/Veo, hosting, payment, Meta API) ตั้งแต่ช่วง beta | PDPA ม.28-29 และ ม.40, คดีปรับ processor ปี 2568 |
| LEGAL-06 Data use policy | ไม่นำ content หรือข้อมูลลูกค้าของร้านไปเทรนโมเดลโดย default, ใช้เฉพาะ Gemini paid tier ที่ไม่นำข้อมูลไปเทรน และกำหนด data residency ใกล้ไทย (asia-southeast1) ใน ARCHITECTURE.md | PDPA (เลี่ยงการกลายเป็น controller) |
| LEGAL-07 Security & breach runbook | ทำ ROPA ทั้งฝั่ง controller และ processor, ทำ breach runbook ที่แจ้งร้านค้าทันทีและแจ้ง PDPC ภายใน 72 ชม. (กรณีข้อมูลของ PANGLAB เอง), พิจารณาแต่งตั้ง DPO และเก็บ Meta page token แบบเข้ารหัส | ม.37 และ ม.40, รูปแบบความผิดที่ PDPC ปรับ |
| LEGAL-08 ToS เรื่องลิขสิทธิ์ | ToS ระบุว่าลูกค้าได้สิทธิใช้ผลงานเชิงพาณิชย์เต็มที่ แต่ PANGLAB ไม่รับประกันว่าภาพที่ AI สร้างล้วนมีลิขสิทธิ์ และลูกค้ารับผิดชอบความถูกต้องของ claim และการขออนุญาตโฆษณาเอง | พ.ร.บ.ลิขสิทธิ์, ETDA |

## คำถามที่ยังเปิด
1. ชื่อทางการ เลขราชกิจจาฯ และบทลงโทษของประกาศ สคบ. เรื่องภาพ AI ยังไม่ทราบ ต้องตรวจว่าใช้กับโพสต์ organic ของร้าน (ไม่ใช่ paid ad) ด้วยหรือไม่ และผู้ให้บริการเครื่องมืออย่าง PANGLAB ต้องรับผิดร่วมหรือไม่
2. ประกาศ อย. 2569 ยังต้องหารายการคำต้องห้ามฉบับเต็ม ขั้นตอนและระยะเวลา e-Submission สำหรับขออนุญาตโฆษณาอาหาร และข้อยกเว้นสำหรับโพสต์ที่ไม่อ้างสรรพคุณ (เช่น โพสต์เมนูร้านอาหารทั่วไป) ต้องอ่าน ratchakitcha.soc.go.th/documents/123102.pdf
3. ต้องยื่น SCC ต่อ PDPC จริงหรือไม่ และ Google Cloud DPA ปัจจุบันรองรับ SCC แบบ Thai Model หรือ Overseas Model หรือไม่
4. ร่าง พ.ร.บ. AI ยังต้องติดตามสถานะหลังรับฟังความเห็น นิยาม high-risk ข้อกำหนด local representative และรูปแบบ label ที่บังคับ
5. PANGLAB ต้องแต่งตั้ง DPO หรือไม่ ขึ้นกับเกณฑ์ "large scale" ในประกาศ PDPC

## แหล่งอ้างอิง
- https://www.tilleke.com/insights/thailand-unveils-regulations-for-cross-border-personal-data-transfer
- https://conventuslaw.com/featured-content/thailand-unveils-regulations-for-cross-border-personal-data-transfer/
- https://www.legal500.com/developments/?p=41122
- https://www.austchamthailand.com/resources/news/forslaw-cross-border-customer-data-under-thailands-pdpa
- https://resourcehub.bakermckenzie.com/bg-bg/resources/cloud-compliance-center/apac/thailand/topics/data-privacy-and-security
- https://www.dfdl.com/insights/legal-and-tax-updates/thailands-personal-data-protection-act-pdpa-subordinate-laws
- https://www.dataguidance.com/opinion/thailand-operationalising-pdpa-vendor-management
- https://services.google.com/fh/files/misc/googlecloud_thailand_personal_data_protection_act_whitepaper.pdf
- https://www.tilleke.com/insights/more-than-a-warning-eight-serious-fines-imposed-in-thai-data-protection-cases
- https://blog.galalaw.com/post/102lr0u/thailands-pdpc-signals-tougher-enforcement-with-multi-million-baht-fines
- https://publicationportalpreviewstg.hoganlovells.com/en/publications/thailand-ramps-up-data-protection-enforcement
- https://www.consentstack.io/regulations/th-pdpa
- https://www.tilleke.com/insights/thailand-releases-new-draft-artificial-intelligence-act/
- https://www.mondaq.com/it-and-internet/1811290/thailand-releases-new-draft-artificial-intelligence-act
- https://www.mondaq.com/new-technology/1759528/thailands-advertising-guidelines-targeting-ai-generated-content
- https://www.tilleke.com/insights/thailands-advertising-guidelines-targeting-ai-generated-content/
- https://www.ocpb.go.th/images/article/article_20260511152227.pdf (ถูกบล็อก อ่านไม่ได้)
- https://www.infoquest.co.th/?p=355390
- https://www.thansettakij.com/health-wellness/665840
- https://www.thansettakij.com/health-wellness/health/665172
- https://www.hfocus.org/content/2026/07/38913
- https://www.bangkokbiznews.com/health/public-health/1245189
- https://he02.tci-thaijo.org/index.php/JOHCP/article/view/279197
- https://legardy.com/blogs/cosmetic-law-thailand-allergy-claims-seller-duties
- https://www.thebangkokinsight.com/160237/
- https://www.infoquest.co.th/?p=447090
- https://www.prachachat.net/?p=1672151
- https://www.matichon.co.th/publicize/news_5836019 (ถูกบล็อก อ่านไม่ได้)
- https://www.etda.or.th/getattachment/Our-Service/AIGC/Research-and-Recommendation/Generative-AI.pdf.aspx?lang=th-TH
- https://so06.tci-thaijo.org/index.php/lawcrru/article/view/243655
- https://journals.mfu.ac.th/mfuraphi/article/download/286/138/2536
- https://www.thailand-business-news.com/?p=327881
- https://rajahtannasia.com/wp-content/uploads/2024/03/2024-02_Navigating-the-Intersection-of-AI-and-Art.pdf
