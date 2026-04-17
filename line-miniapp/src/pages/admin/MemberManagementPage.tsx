import React, { useState, useCallback } from 'react';
import { Member } from '@/types';
import { memberService } from '@/services/dataService';
import { TierBadge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { useNotify } from '@/contexts/AppContext';

// ============================================================
// Member Detail
// ============================================================
function MemberDetail({ member, onClose }: { member: Member; onClose: () => void }) {
  const notify = useNotify();
  const [adjustPoints, setAdjustPoints] = useState(0);
  const [adjustNote, setAdjustNote] = useState('');
  const [localMember, setLocalMember] = useState(member);
  const [isEditing, setIsEditing] = useState(false);
  const [phone, setPhone] = useState(member.phone ?? '');
  const [notes, setNotes] = useState(member.notes ?? '');

  const handleAdjust = () => {
    if (!adjustPoints) { notify('warning', 'กรุณาใส่จำนวนแต้ม'); return; }
    try {
      const updated = memberService.addPoints(localMember.id, adjustPoints);
      setLocalMember(updated);
      notify('success', `ปรับแต้ม ${adjustPoints > 0 ? '+' : ''}${adjustPoints} สำเร็จ`);
      setAdjustPoints(0);
      setAdjustNote('');
    } catch (err: any) {
      notify('error', err.message);
    }
  };

  const handleSaveInfo = () => {
    const updated = memberService.update(localMember.id, { phone, notes });
    setLocalMember(updated);
    notify('success', 'บันทึกข้อมูลสำเร็จ');
    setIsEditing(false);
  };

  const tierConfig = {
    bronze:   { label: 'บรอนซ์',   min: 0,     next: 5000  },
    silver:   { label: 'ซิลเวอร์', min: 5000,  next: 20000 },
    gold:     { label: 'โกลด์',    min: 20000, next: 50000 },
    platinum: { label: 'แพลทินัม', min: 50000, next: undefined },
  };
  const tc = tierConfig[localMember.tier];
  const progressPct = tc.next
    ? Math.min(100, ((localMember.totalSpent - tc.min) / (tc.next - tc.min)) * 100)
    : 100;

  return (
    <div className="p-4 pb-8 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-coffee-200 flex items-center justify-center text-3xl border-2 border-coffee-300">
          {localMember.pictureUrl ? (
            <img src={localMember.pictureUrl} alt="" className="w-full h-full rounded-full object-cover" />
          ) : '👤'}
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-900">{localMember.displayName}</h3>
          <TierBadge tier={localMember.tier} size="sm" />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="bg-coffee-50 rounded-xl p-3">
          <p className="text-xl font-black text-coffee-800">{localMember.points.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-0.5">แต้ม</p>
        </div>
        <div className="bg-coffee-50 rounded-xl p-3">
          <p className="text-xl font-black text-coffee-800">{localMember.orderCount}</p>
          <p className="text-xs text-gray-500 mt-0.5">ออเดอร์</p>
        </div>
        <div className="bg-coffee-50 rounded-xl p-3">
          <p className="text-lg font-black text-coffee-800">฿{(localMember.totalSpent / 1000).toFixed(1)}K</p>
          <p className="text-xs text-gray-500 mt-0.5">ยอดรวม</p>
        </div>
      </div>

      {/* Tier progress */}
      {tc.next && (
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>ความคืบหน้าระดับ</span>
            <span>฿{localMember.totalSpent.toLocaleString()} / ฿{tc.next.toLocaleString()}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="h-2 rounded-full bg-coffee-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      )}

      {/* Info */}
      <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">LINE User ID</span>
          <span className="font-mono text-xs text-gray-700 truncate max-w-[180px]">{localMember.lineUserId}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">เบอร์โทร</span>
          {isEditing ? (
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-coffee-400 w-36"
            />
          ) : (
            <span className="font-medium">{localMember.phone || '—'}</span>
          )}
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">สมาชิกตั้งแต่</span>
          <span className="font-medium">{new Date(localMember.joinDate).toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">เข้าใช้ล่าสุด</span>
          <span className="font-medium">{new Date(localMember.lastVisit).toLocaleDateString('th-TH', { dateStyle: 'medium' })}</span>
        </div>
        {isEditing && (
          <div>
            <label className="text-gray-500 block mb-1">หมายเหตุ</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              className="w-full text-sm border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-coffee-400 resize-none"
            />
          </div>
        )}
      </div>

      {/* Edit controls */}
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(p => !p)}
          className="flex-1 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
        >
          {isEditing ? 'ยกเลิก' : '✏️ แก้ไขข้อมูล'}
        </button>
        {isEditing && (
          <button
            onClick={handleSaveInfo}
            className="flex-1 py-2 rounded-xl bg-coffee-700 text-white text-sm font-medium hover:bg-coffee-800 transition"
          >
            บันทึก
          </button>
        )}
      </div>

      {/* Points adjustment */}
      <div className="border-t border-gray-100 pt-4">
        <h4 className="font-semibold text-gray-800 mb-3">ปรับแต้ม</h4>
        <div className="flex gap-2 mb-3">
          {[-100, -50, +50, +100, +200].map(v => (
            <button
              key={v}
              onClick={() => setAdjustPoints(v)}
              className={`flex-1 py-2 text-xs rounded-lg font-medium border transition ${
                adjustPoints === v
                  ? v > 0 ? 'bg-green-500 text-white border-green-500' : 'bg-red-500 text-white border-red-500'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-coffee-300'
              }`}
            >
              {v > 0 ? `+${v}` : v}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            value={adjustPoints || ''}
            onChange={e => setAdjustPoints(Number(e.target.value))}
            placeholder="จำนวนแต้ม (+ หรือ -)"
            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          />
          <button
            onClick={handleAdjust}
            className="px-4 py-2 rounded-xl bg-coffee-700 text-white text-sm font-medium hover:bg-coffee-800 transition"
          >
            ปรับ
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Member Management Page
// ============================================================
export default function MemberManagementPage() {
  const [members, setMembers] = useState<Member[]>(() => memberService.getAll());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTier, setFilterTier] = useState<string>('all');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [sortBy, setSortBy] = useState<'joinDate' | 'points' | 'totalSpent' | 'orderCount'>('joinDate');

  const stats = memberService.getStats();

  const filteredMembers = members
    .filter(m => {
      const matchTier = filterTier === 'all' || m.tier === filterTier;
      const matchSearch = !searchQuery ||
        m.displayName.includes(searchQuery) ||
        (m.phone && m.phone.includes(searchQuery));
      return matchTier && matchSearch && m.isActive;
    })
    .sort((a, b) => {
      if (sortBy === 'joinDate') return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime();
      if (sortBy === 'points') return b.points - a.points;
      if (sortBy === 'totalSpent') return b.totalSpent - a.totalSpent;
      return b.orderCount - a.orderCount;
    });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">จัดการสมาชิก</h1>
        <p className="text-gray-500 text-sm mt-1">สมาชิกทั้งหมด {stats.total} คน</p>
      </div>

      {/* Tier summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { tier: 'bronze',   label: 'บรอนซ์',   count: stats.tiers.bronze,   color: 'bg-amber-50 border-amber-200' },
          { tier: 'silver',   label: 'ซิลเวอร์', count: stats.tiers.silver,   color: 'bg-gray-50 border-gray-200' },
          { tier: 'gold',     label: 'โกลด์',    count: stats.tiers.gold,     color: 'bg-yellow-50 border-yellow-200' },
          { tier: 'platinum', label: 'แพลทินัม', count: stats.tiers.platinum, color: 'bg-purple-50 border-purple-200' },
        ].map(item => (
          <button
            key={item.tier}
            onClick={() => setFilterTier(filterTier === item.tier ? 'all' : item.tier)}
            className={`rounded-xl border p-3 text-center transition ${item.color} ${
              filterTier === item.tier ? 'ring-2 ring-coffee-400' : ''
            }`}
          >
            <p className="text-xl font-black text-gray-900">{item.count}</p>
            <p className="text-xs text-gray-500 mt-0.5">{item.label}</p>
          </button>
        ))}
      </div>

      {/* Filter row */}
      <div className="flex gap-2 flex-wrap">
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="ค้นหาชื่อ หรือเบอร์โทร..."
          className="flex-1 min-w-48 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 bg-white"
        />
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as typeof sortBy)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none bg-white"
        >
          <option value="joinDate">เรียงตาม: วันที่สมัคร</option>
          <option value="points">เรียงตาม: แต้ม</option>
          <option value="totalSpent">เรียงตาม: ยอดรวม</option>
          <option value="orderCount">เรียงตาม: จำนวนออเดอร์</option>
        </select>
      </div>

      <p className="text-sm text-gray-500">แสดง {filteredMembers.length} คน</p>

      {/* Members list */}
      <div className="space-y-3">
        {filteredMembers.map(member => (
          <div
            key={member.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedMember(member)}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-coffee-100 flex items-center justify-center text-2xl flex-shrink-0">
                {member.pictureUrl ? (
                  <img src={member.pictureUrl} alt="" className="w-full h-full rounded-full object-cover" />
                ) : '👤'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="font-bold text-gray-900 truncate">{member.displayName}</p>
                  <TierBadge tier={member.tier} size="xs" />
                </div>
                <p className="text-xs text-gray-500">{member.phone || '—'}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-coffee-700 text-sm">⭐ {member.points.toLocaleString()}</p>
                <p className="text-xs text-gray-400">{member.orderCount} ออเดอร์</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50 text-xs text-gray-400">
              <span>สมัคร: {new Date(member.joinDate).toLocaleDateString('th-TH', { dateStyle: 'short' })}</span>
              <span>ยอดรวม: ฿{member.totalSpent.toLocaleString()}</span>
              <span>ล่าสุด: {new Date(member.lastVisit).toLocaleDateString('th-TH', { dateStyle: 'short' })}</span>
            </div>
          </div>
        ))}

        {filteredMembers.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl block mb-3">👥</span>
            <p>ไม่พบสมาชิก</p>
          </div>
        )}
      </div>

      {/* Member detail modal */}
      <Modal
        isOpen={!!selectedMember}
        onClose={() => { setSelectedMember(null); setMembers(memberService.getAll()); }}
        title="ข้อมูลสมาชิก"
        size="md"
      >
        {selectedMember && (
          <MemberDetail
            member={selectedMember}
            onClose={() => { setSelectedMember(null); setMembers(memberService.getAll()); }}
          />
        )}
      </Modal>
    </div>
  );
}
