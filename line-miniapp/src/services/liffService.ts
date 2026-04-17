import { LiffProfile } from '@/types';

// Augment window type for LIFF SDK
declare global {
  interface Window {
    liff: {
      init: (config: { liffId: string }) => Promise<void>;
      isLoggedIn: () => boolean;
      login: (config?: { redirectUri?: string }) => void;
      logout: () => void;
      getProfile: () => Promise<LiffProfile>;
      getIDToken: () => string | null;
      getAccessToken: () => string | null;
      isInClient: () => boolean;
      sendMessages: (messages: object[]) => Promise<void>;
      closeWindow: () => void;
      ready: Promise<void>;
    };
  }
}

const LIFF_ID = import.meta.env.VITE_LIFF_ID || 'YOUR_LIFF_ID';
const MOCK_MODE = import.meta.env.VITE_MOCK_LIFF === 'true' || !window.liff || LIFF_ID === 'YOUR_LIFF_ID';

// Mock profile used in development / when not running inside LINE
const MOCK_PROFILE: LiffProfile = {
  userId: 'Udev0000000000000000000000000000000',
  displayName: 'ผู้ใช้ทดสอบ',
  pictureUrl: 'https://profile.line-scdn.net/0h00000000',
  statusMessage: 'กาแฟสักแก้ว ชีวิตดีขึ้น ☕',
};

let _initialized = false;
let _mockLoggedIn = true; // auto-login in mock mode

export const liffService = {
  async init(): Promise<void> {
    if (_initialized) return;

    if (MOCK_MODE) {
      console.info('[LIFF] Running in mock mode');
      _initialized = true;
      return;
    }

    try {
      await window.liff.init({ liffId: LIFF_ID });
      _initialized = true;
    } catch (err) {
      console.error('[LIFF] init failed:', err);
      throw err;
    }
  },

  isLoggedIn(): boolean {
    if (MOCK_MODE) return _mockLoggedIn;
    return window.liff?.isLoggedIn() ?? false;
  },

  login(): void {
    if (MOCK_MODE) {
      _mockLoggedIn = true;
      return;
    }
    window.liff.login();
  },

  logout(): void {
    if (MOCK_MODE) {
      _mockLoggedIn = false;
      return;
    }
    window.liff.logout();
  },

  async getProfile(): Promise<LiffProfile> {
    if (MOCK_MODE) {
      return MOCK_PROFILE;
    }
    if (!this.isLoggedIn()) throw new Error('ยังไม่ได้เข้าสู่ระบบ');
    return window.liff.getProfile();
  },

  isInClient(): boolean {
    if (MOCK_MODE) return false;
    return window.liff?.isInClient() ?? false;
  },

  async sendMessage(text: string): Promise<void> {
    if (MOCK_MODE) {
      console.info('[LIFF] sendMessage (mock):', text);
      return;
    }
    if (!this.isInClient()) return;
    await window.liff.sendMessages([{ type: 'text', text }]);
  },

  closeWindow(): void {
    if (MOCK_MODE) {
      console.info('[LIFF] closeWindow (mock)');
      return;
    }
    window.liff.closeWindow();
  },
};
