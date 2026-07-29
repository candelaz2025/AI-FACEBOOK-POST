/**
 * ที่เก็บข้อมูลฝั่ง client
 *
 * ⚠️ ชั่วคราวสำหรับ Phase 1 เท่านั้น — v1.0 ต้องย้ายไป backend ที่เข้ารหัส (NFR-05, D4)
 * ห้ามเก็บ API key ใด ๆ ที่นี่
 */

const PREFIX = 'mindcare_';

export const StorageKeys = {
  profile: `${PREFIX}profile`,
  conversations: `${PREFIX}conversations`,
  moodCheckIns: `${PREFIX}mood`,
  worthEntries: `${PREFIX}worth`,
  thoughtRecords: `${PREFIX}thoughts`,
  programProgress: `${PREFIX}program`,
  assessments: `${PREFIX}assessments`,
  safetyPlan: `${PREFIX}safetyPlan`,
  crisisEvents: `${PREFIX}crisisEvents`,
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys];

/** อ่านค่าแบบไม่ throw — ข้อมูลเสียหายต้องไม่ทำให้แอปพัง */
export function read<T>(key: StorageKey, fallback: T): T {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function write<T>(key: StorageKey, value: T): void {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(value));
  } catch {
    /* โควตาเต็มหรือโหมดส่วนตัว — ไม่ให้แอปพัง */
  }
}

export function append<T>(key: StorageKey, item: T): T[] {
  const list = read<T[]>(key, []);
  const next = [...list, item];
  write(key, next);
  return next;
}

/** ลบข้อมูลผู้ใช้ทั้งหมด (ACCT-06) */
export function clearAll(): void {
  try {
    for (const key of Object.values(StorageKeys)) {
      globalThis.localStorage?.removeItem(key);
    }
  } catch {
    /* ไม่ทำอะไร */
  }
}

/** ส่งออกข้อมูลทั้งหมดของผู้ใช้ (ACCT-07) */
export function exportAll(): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [name, key] of Object.entries(StorageKeys)) {
    out[name] = read<unknown>(key as StorageKey, null);
  }
  return out;
}

export function newId(): string {
  return globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function now(): string {
  return new Date().toISOString();
}
