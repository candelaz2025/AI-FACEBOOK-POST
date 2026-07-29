import { useEffect, useState } from 'react';
import { HelpButton, CrisisScreen, SafetyPlanScreen } from '@/features/safety';
import { ChatScreen } from '@/features/listening';
import { WorthHome } from '@/features/selfworth';
import { AssessmentScreen } from '@/features/assessment';
import { MoodCheckInCard, MoodTrend } from '@/features/mood';
import { read, write, StorageKeys } from '@/services/storage';
import type { UserProfile } from '@/types';

export type Screen = 'home' | 'chat' | 'worth' | 'assess' | 'safetyPlan' | 'crisis';

export function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const profile = read<UserProfile | null>(StorageKeys.profile, null);

  useEffect(() => {
    document.documentElement.dataset.scale = profile?.uiScale ?? 'normal';
  }, [profile?.uiScale]);

  return (
    <div className="mc-page mc-stack">
      {screen === 'home' && <Home onNavigate={setScreen} />}
      {screen === 'chat' && <ChatScreen onCrisis={() => setScreen('crisis')} />}
      {screen === 'worth' && <WorthHome onBack={() => setScreen('home')} />}
      {screen === 'assess' && <AssessmentScreen onBack={() => setScreen('home')} />}
      {screen === 'safetyPlan' && <SafetyPlanScreen onBack={() => setScreen('home')} />}
      {screen === 'crisis' && <CrisisScreen onClose={() => setScreen('home')} />}

      {/* SAFE-06: ต้องเข้าถึงได้ทุกหน้าจอ ภายใน 1 การแตะ */}
      <HelpButton onOpen={() => setScreen('crisis')} />
    </div>
  );
}

function Home({ onNavigate }: { onNavigate: (s: Screen) => void }) {
  return (
    <main className="mc-stack">
      <header>
        <h1>ผู้ช่วยดูแลใจ</h1>
        <p className="mc-muted">เพื่อนที่รับฟัง สำหรับวันที่ใจไม่ไหว</p>
      </header>

      <button className="mc-primary" onClick={() => onNavigate('chat')}>
        อยากเล่าอะไรสักอย่าง
      </button>

      <MoodCheckInCard />
      <MoodTrend days={7} />

      <div className="mc-stack">
        <button onClick={() => onNavigate('worth')}>การ์ดคุณค่าของฉัน</button>
        <button onClick={() => onNavigate('assess')}>ประเมินความรู้สึกตัวเอง</button>
        <button onClick={() => onNavigate('safetyPlan')}>แผนความปลอดภัยของฉัน</button>
      </div>

      <p className="mc-muted" style={{ fontSize: '0.875em' }}>
        ระบบนี้เป็นเพื่อนคุย ไม่ใช่การรักษา และไม่ใช่บริการฉุกเฉิน
        ถ้าต้องการความช่วยเหลือด่วน โทร 1323 ได้ตลอด 24 ชั่วโมง
      </p>
    </main>
  );
}

export function resetUiScale(scale: UserProfile['uiScale']) {
  const p = read<UserProfile | null>(StorageKeys.profile, null);
  if (p) write(StorageKeys.profile, { ...p, uiScale: scale });
  document.documentElement.dataset.scale = scale;
}
