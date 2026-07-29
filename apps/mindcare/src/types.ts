/**
 * สัญญาข้อมูลกลางของระบบ "ผู้ช่วยดูแลใจ"
 *
 * ⚠️ ไฟล์นี้เป็นสัญญาที่ทุกโมดูลใช้ร่วมกัน — ห้ามแก้โดยไม่แจ้งทีม
 * อ้างอิง: docs/depression-support-system-prd.md
 */

// ─────────────────────────────── ความปลอดภัย ───────────────────────────────

/** ระดับความเสี่ยงตาม PRD ข้อ SAFE-01 */
export type RiskLevel = 'green' | 'yellow' | 'orange' | 'red';

/** ลำดับความรุนแรง ใช้เปรียบเทียบเพื่อเลือกระดับที่สูงกว่า (SAFE-02) */
export const RISK_ORDER: Record<RiskLevel, number> = {
  green: 0,
  yellow: 1,
  orange: 2,
  red: 3,
};

export type RiskSource = 'rule' | 'model' | 'assessment' | 'fallback';

export interface RiskAssessment {
  level: RiskLevel;
  /** ชั้นที่ทำให้ได้ระดับสุดท้าย */
  source: RiskSource;
  /** ผลของแต่ละชั้น เก็บไว้เพื่อ audit (NFR-10) */
  ruleLevel: RiskLevel;
  modelLevel?: RiskLevel;
  /** วลีที่ชั้นกฎจับได้ ใช้สำหรับ audit เท่านั้น ห้ามแสดงต่อผู้ใช้ */
  matchedRules: string[];
  /** true เมื่อชั้นโมเดลล้มเหลว/ช้าเกิน แล้วระบบยกระดับตาม SAFE-07 */
  degraded: boolean;
  assessedAt: string;
}

export interface Hotline {
  id: string;
  name: string;
  phone: string;
  /** เช่น 'ฟรี 24 ชั่วโมง' */
  availability: string;
  /** true = ต้องแสดงในหน้าจอวิกฤตเสมอ */
  primary: boolean;
  /** true = ยืนยันกับแหล่งทางการแล้ว (CONT-03) */
  verified: boolean;
  verifiedNote?: string;
}

/** แผนความปลอดภัยตาม Stanley–Brown 6 ส่วน (SAFE-08) */
export interface SafetyPlan {
  warningSigns: string[];
  selfSoothing: string[];
  distractions: string[];
  peopleToAsk: TrustedContact[];
  professionals: Hotline[];
  makeEnvironmentSafe: string[];
  updatedAt: string;
}

export interface TrustedContact {
  name: string;
  phone?: string;
}

/** บันทึกเพื่อ audit ทุกครั้งที่พบระดับ orange/red (SAFE-09) */
export interface CrisisEvent {
  id: string;
  level: RiskLevel;
  triggeredBy: RiskSource;
  hotlineShown: boolean;
  userAcknowledged: boolean;
  /** เวอร์ชันของ prompt/สคริปต์ที่ใช้ตอนนั้น (NFR-11) */
  promptVersion: string;
  createdAt: string;
}

// ─────────────────────────────── การสนทนา ───────────────────────────────

export type ChatMode = 'listen' | 'advice' | 'exercise' | 'crisis';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: ChatMode;
  /** ประเมินเฉพาะข้อความของผู้ใช้ */
  risk?: RiskAssessment;
  /** ผู้ใช้กดรายงานว่าข้อความนี้ทำให้รู้สึกแย่ (LISTEN-10) */
  reported?: boolean;
  promptVersion?: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  messages: Message[];
  mode: ChatMode;
  startedAt: string;
  endedAt?: string;
  /** คะแนน "รู้สึกว่าถูกรับฟัง" 1–5 (G1) */
  feltHeardScore?: number;
}

// ─────────────────────────────── อารมณ์ ───────────────────────────────

export type MoodTag = 'งาน' | 'ครอบครัว' | 'เงิน' | 'สุขภาพ' | 'ความสัมพันธ์' | 'ตัวเอง' | 'อื่น ๆ';

export interface MoodCheckIn {
  id: string;
  score: 1 | 2 | 3 | 4 | 5;
  tags: MoodTag[];
  note?: string;
  createdAt: string;
}

// ─────────────────────────────── คุณค่าในตัวเอง ───────────────────────────────

export type WorthEntryType =
  | 'achievement'        // สิ่งที่ทำได้วันนี้
  | 'contribution'       // สิ่งที่คนอื่นได้ประโยชน์จากเรา
  | 'strength'           // จุดแข็ง
  | 'thought-challenge'  // ผลการท้าความคิด
  | 'compassion-letter'  // จดหมายถึงตัวเอง
  | 'value';             // คุณค่าที่ยึดถือ

export interface WorthEntry {
  id: string;
  type: WorthEntryType;
  /** ⚠️ ต้องเป็นคำที่ผู้ใช้เขียนเองเท่านั้น ห้าม AI แต่งเพิ่ม (WORTH-07) */
  content: string;
  createdAt: string;
}

/** flow ท้าความคิด CBT 5 ขั้น (WORTH-03) */
export interface ThoughtRecord {
  id: string;
  thought: string;
  emotion: string;
  emotionIntensity: number; // 0–100
  evidenceFor: string[];
  evidenceAgainst: string[];
  balancedThought: string;
  emotionIntensityAfter?: number;
  createdAt: string;
}

/** การ์ดคุณค่าของฉัน — ทุกข้อความต้อง trace กลับไปหา WorthEntry (WORTH-07) */
export interface WorthCard {
  strengths: WorthCardItem[];
  evidence: WorthCardItem[];
  kindWords: WorthCardItem[];
  values: WorthCardItem[];
  generatedAt: string;
}

export interface WorthCardItem {
  /** อ้างอิงกลับไปยัง WorthEntry.id — บังคับ เพื่อพิสูจน์ว่าไม่ได้แต่งขึ้น */
  sourceEntryId: string;
  text: string;
}

export interface ProgramProgress {
  /** สัปดาห์ 1–4 */
  week: 1 | 2 | 3 | 4;
  /** จำนวนวันที่ทำจริง ไม่ใช่วันตามปฏิทิน (WORTH-08) */
  daysCompleted: number;
  startedAt: string;
  completedAt?: string;
}

// ─────────────────────────────── แบบคัดกรอง ───────────────────────────────

export type AssessmentTool = '2Q' | '9Q' | '8Q';

export interface AssessmentQuestion {
  id: string;
  text: string;
  /** ตัวเลือกคำตอบ พร้อมคะแนน */
  options: { label: string; value: number }[];
}

export interface AssessmentResult {
  id: string;
  tool: AssessmentTool;
  answers: number[];
  score: number;
  /** ⚠️ ข้อความกลาง ๆ ห้ามใช้คำวินิจฉัย (ASSESS-04) */
  interpretation: string;
  /** ระดับความเสี่ยงที่ได้จากผลการประเมิน ใช้ป้อนเข้า Safety Layer */
  riskLevel: RiskLevel;
  /** เครื่องมือถัดไปที่ควรทำ ถ้ามี */
  nextTool?: AssessmentTool;
  createdAt: string;
}

// ─────────────────────────────── ผู้ใช้ ───────────────────────────────

export type AgeBand = '20-29' | '30-45' | '46-60';
export type UiScale = 'normal' | 'large';

export interface UserProfile {
  id: string;
  ageBand: AgeBand;
  displayName?: string;
  uiScale: UiScale;
  trustedContact?: TrustedContact;
  consent: {
    terms: boolean;
    /** ความยินยอมประมวลผลข้อมูลอ่อนไหว แยกจากข้อตกลงทั่วไป (ACCT-02) */
    sensitiveData: boolean;
    at: string;
  };
  createdAt: string;
}

// ─────────────────────────────── AI transport ───────────────────────────────

export interface ChatRequest {
  messages: Pick<Message, 'role' | 'content'>[];
  mode: ChatMode;
  ageBand: AgeBand;
}

export interface ChatResponse {
  content: string;
  promptVersion: string;
}

export interface ClassifyRequest {
  text: string;
}

export interface ClassifyResponse {
  level: RiskLevel;
}

/**
 * ทุกการเรียก AI ต้องผ่าน transport นี้ — ฝั่ง client ห้ามถือ API key (NFR-05)
 */
export interface AiTransport {
  chat(req: ChatRequest, signal?: AbortSignal): Promise<ChatResponse>;
  classify(req: ClassifyRequest, signal?: AbortSignal): Promise<ClassifyResponse>;
}
