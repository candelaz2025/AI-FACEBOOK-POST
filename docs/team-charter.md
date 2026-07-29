# Team Charter · ทีมพัฒนา "ผู้ช่วยดูแลใจ"

ทีม agent 10 ตัว (Dev 5 · QA 5) ที่ทำงานขนานกันบน `apps/mindcare/`
นิยาม agent อยู่ใน `.claude/agents/` · เอกสารอ้างอิง: [PRD](./depression-support-system-prd.md) · [แผน](./depression-support-system-plan.md)

---

## 1. กฎที่ทุก agent ต้องทำตาม

1. **ความปลอดภัยมาก่อนฟีเจอร์เสมอ** ถ้าต้องเลือกระหว่างประสบการณ์ใช้งานที่ลื่นกับความปลอดภัยของผู้ใช้ ให้เลือกความปลอดภัย
2. **เขียนเฉพาะไฟล์ที่ตัวเองเป็นเจ้าของ** (ตารางข้อ 3) ห้ามแก้ไฟล์ของ agent อื่นเด็ดขาด ถ้าต้องการให้เขาแก้ ให้รายงานกลับ ไม่ใช่แก้เอง
3. **`src/types.ts` เป็นสัญญากลาง** ห้ามแก้ ถ้าต้องเพิ่ม type ให้รายงานกลับมาที่หัวหน้าทีม
4. **ห้ามรัน git** ไม่ commit ไม่ push ไม่สร้าง branch — หัวหน้าทีมจัดการเอง
5. **ข้อความที่ผู้ใช้เห็นต้องเป็นภาษาไทยทั้งหมด** รวมข้อความ error ห้ามมีศัพท์อังกฤษใน UI
6. **ห้ามใส่ API key ใด ๆ ในฝั่ง client** ทุกการเรียก AI ต้องผ่าน `services/aiClient.ts`
7. **สคริปต์ในภาวะวิกฤตและแบบฝึกหัดต้องเป็นข้อความตายตัว** ห้ามให้ LLM แต่งสด
8. ทุกไฟล์ที่มีข้อความบำบัด ให้ใส่คอมเมนต์กำกับว่า **"รอการรีวิวจากนักจิตวิทยาคลินิก"** — เนื้อหาที่ทีมเขียนถือเป็นฉบับร่างเสมอ

---

## 2. หลักการเขียนโค้ด

- TypeScript strict · ห้ามใช้ `any` · React 19 function components + hooks
- ไม่มี state management library — ใช้ `useState`/`useReducer` และ `services/storage.ts`
- CSS ธรรมดาโดยใช้ token จาก `src/styles/tokens.css` — ไม่มี Tailwind ในแอปนี้ (ต้องทำงาน offline ได้)
- ทุกปุ่มต้องมีเป้าแตะ ≥ 44px และ `aria-label` เมื่อข้อความไม่ชัดเจนพอ
- ฟีเจอร์ในกลุ่ม SAFE ต้องทำงานได้โดยไม่ต้องมี network

---

## 3. ตารางความเป็นเจ้าของไฟล์ (ห้ามข้ามเขต)

| Agent | ไฟล์ที่เป็นเจ้าของ |
|---|---|
| `dev-safety-engineer` | `src/features/safety/**` · `src/prompts/crisisScripts.ts` · `src/content/hotlines.ts` |
| `dev-listening-engineer` | `src/features/listening/**` · `src/prompts/systemPrompts.ts` |
| `dev-selfworth-engineer` | `src/features/selfworth/**` · `src/content/worthContent.ts` |
| `dev-assessment-engineer` | `src/features/assessment/**` · `src/features/mood/**` |
| `dev-platform-engineer` | `src/features/onboarding/**` · `src/components/**` · `src/hooks/**` |
| `qa-crisis-eval` | `tests/evals/crisis/**` |
| `qa-listening-eval` | `tests/evals/listening/**` |
| `qa-unit-tester` | `tests/unit/**` |
| `qa-accessibility` | `tests/a11y/**` |
| `qa-privacy-compliance` | `tests/privacy/**` |
| หัวหน้าทีม (session หลัก) | `src/types.ts` · `src/App.tsx` · `src/main.tsx` · `src/services/**` · `src/styles/**` · config ทั้งหมด |

---

## 4. สัญญาระหว่างโมดูล (Public API)

ทุก feature ต้องมี `index.ts` ที่ export ตามนี้เป๊ะ ๆ — ทีม QA เขียนเทสตามสัญญานี้ ถ้าเปลี่ยนชื่อ เทสของคนอื่นจะพัง

### `features/safety/index.ts`
```ts
export const CRISIS_SCRIPT_VERSION: string;
export const HOTLINES: Hotline[];
export function classifyByRules(text: string): { level: RiskLevel; matched: string[] };
export function assessRisk(text: string, transport?: AiTransport): Promise<RiskAssessment>;
export function recordCrisisEvent(e: Omit<CrisisEvent, 'id' | 'createdAt'>): CrisisEvent;
export function CrisisScreen(props: { onClose: () => void }): JSX.Element;
export function SafetyPlanScreen(props: { onBack: () => void }): JSX.Element;
export function HelpButton(props: { onOpen: () => void }): JSX.Element;
```

### `features/listening/index.ts`
```ts
export const LISTEN_PROMPT_VERSION: string;
export const BANNED_PHRASES: string[];
export function buildSystemPrompt(mode: ChatMode, ageBand: AgeBand): string;
export function violatesBannedPhrases(text: string): string[];
export function ChatScreen(props: { onCrisis: () => void }): JSX.Element;
```

### `features/selfworth/index.ts`
```ts
export function buildWorthCard(entries: WorthEntry[]): WorthCard;
export function WorthHome(props: { onBack: () => void }): JSX.Element;
export function EvidenceLogScreen(props: { onBack: () => void }): JSX.Element;
export function ThoughtChallengeScreen(props: { onBack: () => void }): JSX.Element;
export function CompassionLetterScreen(props: { onBack: () => void }): JSX.Element;
export function ValuesSortScreen(props: { onBack: () => void }): JSX.Element;
export function StrengthsFinderScreen(props: { onBack: () => void }): JSX.Element;
```

### `features/assessment/index.ts`
```ts
export const TWO_Q: AssessmentQuestion[];
export const NINE_Q: AssessmentQuestion[];
export const EIGHT_Q: AssessmentQuestion[];
export function scoreAssessment(tool: AssessmentTool, answers: number[]): AssessmentResult;
export function AssessmentScreen(props: { onBack: () => void }): JSX.Element;
```

### `features/mood/index.ts`
```ts
export function MoodCheckInCard(): JSX.Element;
export function MoodTrend(props: { days: number }): JSX.Element;
```

---

## 5. Definition of Done ของแต่ละงาน

- [ ] `npm run typecheck` ผ่าน (ไม่มี error ในไฟล์ที่ตัวเองเป็นเจ้าของ)
- [ ] export ครบตามสัญญาข้อ 4
- [ ] ข้อความที่ผู้ใช้เห็นเป็นภาษาไทยทั้งหมด
- [ ] ไม่มี `any` · ไม่มี `console.log` ค้าง
- [ ] ฟีเจอร์ SAFE ทำงานได้แม้ไม่มี network
- [ ] มีคอมเมนต์อ้างอิงรหัสความต้องการจาก PRD (เช่น `// SAFE-04`)

---

## 6. เส้นทางส่งงาน

agent เขียนไฟล์ → หัวหน้าทีมรัน typecheck + test ทั้งชุด → แก้จุดที่ชนกัน → commit + push → อัปเดต PR
agent **ไม่** commit เอง และ **ไม่** คุยกับ GitHub โดยตรง
