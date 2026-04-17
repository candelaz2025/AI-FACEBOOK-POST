import React, { useState } from 'react';
import { useApp, useNotify } from '@/contexts/AppContext';
import { memberService } from '@/services/dataService';
import { TierBadge } from '@/components/shared/Badge';
import { MemberTier } from '@/types';

const tierConfig: Record<MemberTier, { min: number; next?: number; nextTier?: string; color: string; bg: string }> = {
  bronze:   { min: 0,     next: 5000,  nextTier: 'ซิลเวอร์', color: 'text-amber-700',  bg: 'bg-amber-500' },
  silver:   { min: 5000,  next: 20000, nextTier: 'โกลด์',    color: 'text-gray-600',   bg: 'bg-gray-400' },
  gold:     { min: 20000, next: 50000, nextTier: 'แพลทินัม', color: 'text-yellow-700', bg: 'bg-yellow-400' },
  platinum: { min: 50000, color: 'text-purple-700', bg: 'bg-purple-500' },
};

export default function ProfilePage() {
  const { currentMember, refreshMember, setAppView } = useApp();
  const notify = useNotify();
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(currentMember?.phone ?? '');
  const [email, setEmail] = useState(currentMember?.email ?? '');
  const [birthday, setBirthday] = useState(currentMember?.birthday ?? '');

  if (!currentMember) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <span className="text-7xl mb-4">🔒</span>
        <h2 className="text-xl font-bold text-gray-700 mb-2">กรุณาเข้าสู่ระบบ</h2>
        <p className="text-gray-400">เข้าสู่ระบบด้วย LINE เพื่อดูโปรไฟล์</p>
      </div>
    );
  }

  const cfg = tierConfig[currentMember.tier];
  const progressPercent = cfg.next
    ? Math.min(100, ((currentMember.totalSpent - cfg.min) / (cfg.next - cfg.min)) * 100)
    : 100;
  const remaining = cfg.next ? cfg.next - currentMember.totalSpent : 0;

  const handleSave = () => {
    memberService.update(currentMember.id, { phone, email, birthday });
    refreshMember();
    notify('success', 'บันทึกข้อมูลสำเร็จ');
    setIsEditing(false);
  };

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Profile card */}
      <div className="bg-gradient-to-br from-coffee-800 to-coffee-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-coffee-400 flex items-center justify-center text-3xl border-2 border-white/50">
            {currentMember.pictureUrl ? (
              <img src={currentMember.pictureUrl} alt="" className="w-full h-full rounded-full object-cover" />
            ) : '👤'}
          </div>
          <div>
            <h2 className="font-bold text-xl">{currentMember.displayName}</h2>
            <TierBadge tier={currentMember.tier} size="sm" />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-black">{currentMember.points.toLocaleString()}</p>
            <p className="text-xs text-white/70 mt-0.5">แต้มสะสม</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-2xl font-black">{currentMember.orderCount}</p>
            <p className="text-xs text-white/70 mt-0.5">ออเดอร์</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-xl font-black">฿{(currentMember.totalSpent / 1000).toFixed(1)}K</p>
            <p className="text-xs text-white/70 mt-0.5">ยอดรวม</p>
          </div>
        </div>
      </div>

      {/* Tier progress */}
      {cfg.next && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-gray-800">ความคืบหน้าระดับ</h3>
            <TierBadge tier={currentMember.tier} />
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
            <div
              className={`h-3 rounded-full ${cfg.bg} transition-all`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-500">
            อีก ฿{remaining.toLocaleString()} เพื่อเลื่อนขึ้น <span className="font-medium text-coffee-700">{cfg.nextTier}</span>
          </p>
        </div>
      )}

      {/* Member info */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800">ข้อมูลส่วนตัว</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="text-coffee-700 text-sm font-medium"
          >
            {isEditing ? 'ยกเลิก' : 'แก้ไข'}
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">เบอร์โทรศัพท์</label>
            {isEditing ? (
              <input
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="0xx-xxx-xxxx"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
              />
            ) : (
              <p className="text-sm text-gray-800">{currentMember.phone || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">อีเมล</label>
            {isEditing ? (
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
              />
            ) : (
              <p className="text-sm text-gray-800">{currentMember.email || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">วันเกิด</label>
            {isEditing ? (
              <input
                type="text"
                value={birthday}
                onChange={e => setBirthday(e.target.value)}
                placeholder="MM-DD (เช่น 06-15)"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
              />
            ) : (
              <p className="text-sm text-gray-800">{currentMember.birthday || '—'}</p>
            )}
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">สมาชิกตั้งแต่</label>
            <p className="text-sm text-gray-800">
              {new Date(currentMember.joinDate).toLocaleDateString('th-TH', { dateStyle: 'long' })}
            </p>
          </div>
        </div>

        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full mt-4 bg-coffee-700 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-coffee-800 transition"
          >
            บันทึกข้อมูล
          </button>
        )}
      </div>

      {/* Points guide */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <h3 className="font-semibold text-amber-800 mb-2">💡 วิธีสะสมแต้ม</h3>
        <ul className="text-sm text-amber-700 space-y-1">
          <li>• ใช้จ่าย ฿10 = 1 แต้ม</li>
          <li>• 1 แต้ม = ส่วนลด ฿0.10</li>
          <li>• สมาชิก Silver: ลดเพิ่ม 3%</li>
          <li>• สมาชิก Gold: ลดเพิ่ม 5%</li>
          <li>• สมาชิก Platinum: ลดเพิ่ม 10%</li>
        </ul>
      </div>

      {/* Admin switch */}
      <button
        onClick={() => setAppView('admin')}
        className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium text-sm hover:bg-gray-200 transition"
      >
        🔧 เข้าระบบหลังบ้าน (สำหรับเจ้าของร้าน)
      </button>
    </div>
  );
}
