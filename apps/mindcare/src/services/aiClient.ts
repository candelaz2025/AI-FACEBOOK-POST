/**
 * ทางเข้าเดียวสำหรับการเรียก AI
 *
 * ⚠️ ฝั่ง client ห้ามถือ API key เด็ดขาด (NFR-05) — ทุกอย่างวิ่งผ่าน backend
 * Phase 1 ยังไม่มี backend จึงใช้ mock transport ที่ทำงาน offline ได้เต็มรูปแบบ
 * ทำให้ทดสอบ Safety Layer ได้โดยไม่ต้องพึ่ง network (SAFE-03, NFR-02)
 */

import type {
  AiTransport,
  ChatRequest,
  ChatResponse,
  ClassifyRequest,
  ClassifyResponse,
} from '@/types';

export const PROMPT_VERSION = 'listen-v0.1.0';

/** timeout ของชั้นโมเดลตาม SAFE-07 */
export const CLASSIFY_TIMEOUT_MS = 3000;

/**
 * transport จริงสำหรับ v1.0 — ชี้ไปที่ backend ของเราเอง ไม่ใช่ผู้ให้บริการ LLM โดยตรง
 */
export function createRemoteTransport(baseUrl = '/api'): AiTransport {
  async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    });
    if (!res.ok) throw new Error(`ai_transport_failed_${res.status}`);
    return (await res.json()) as T;
  }

  return {
    chat: (req, signal) => post<ChatResponse>('/chat', req, signal),
    classify: (req, signal) => post<ClassifyResponse>('/risk-classify', req, signal),
  };
}

/**
 * transport จำลองสำหรับ Phase 1 และการทดสอบ
 * ตอบตามโปรโตคอลการรับฟัง 5 ขั้น โดยไม่ให้คำแนะนำในโหมด listen
 */
export function createMockTransport(overrides: Partial<AiTransport> = {}): AiTransport {
  const base: AiTransport = {
    async chat(req: ChatRequest): Promise<ChatResponse> {
      const last = req.messages[req.messages.length - 1]?.content ?? '';
      const excerpt = last.length > 40 ? `${last.slice(0, 40)}…` : last;
      const content =
        req.mode === 'advice'
          ? `ฟังแล้วนะ เรื่อง "${excerpt}" ฟังดูหนักอยู่เหมือนกัน\nถ้าจะลองดู มีสองทางที่พอเป็นไปได้ คือคุยกับคนที่ไว้ใจสักคน หรือแบ่งเรื่องนี้เป็นส่วนเล็ก ๆ ก่อน\nอันไหนพอเป็นไปได้บ้าง`
          : `ฟังแล้วนะ ที่เล่ามาคือเรื่อง "${excerpt}" ใช่ไหม\nฟังดูเหมือนตอนนี้เหนื่อยอยู่พอสมควร\nตอนนั้นในใจคิดอะไรอยู่`;
      return { content, promptVersion: PROMPT_VERSION };
    },
    async classify(_req: ClassifyRequest): Promise<ClassifyResponse> {
      // mock ไม่ตัดสินความเสี่ยงเอง — ให้ชั้นกฎเป็นคนตัดสิน
      return { level: 'green' };
    },
  };
  return { ...base, ...overrides };
}

let transport: AiTransport = createMockTransport();

export function setTransport(next: AiTransport): void {
  transport = next;
}

export function getTransport(): AiTransport {
  return transport;
}
