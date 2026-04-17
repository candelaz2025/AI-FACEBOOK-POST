import React from 'react';
import { MemberTier } from '@/types';

// ============================================================
// Tier Badge
// ============================================================
const tierConfig: Record<MemberTier, { label: string; color: string; icon: string }> = {
  bronze:   { label: 'บรอนซ์',   color: 'bg-amber-100 text-amber-700 border-amber-300',    icon: '🥉' },
  silver:   { label: 'ซิลเวอร์', color: 'bg-gray-100 text-gray-600 border-gray-300',       icon: '🥈' },
  gold:     { label: 'โกลด์',    color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: '🥇' },
  platinum: { label: 'แพลทินัม', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: '💎' },
};

export function TierBadge({ tier, size = 'sm' }: { tier: MemberTier; size?: 'xs' | 'sm' | 'md' }) {
  const cfg = tierConfig[tier];
  const sizeClass = size === 'xs' ? 'text-xs px-1.5 py-0.5' : size === 'md' ? 'text-sm px-3 py-1' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center gap-1 font-medium rounded-full border ${cfg.color} ${sizeClass}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

// ============================================================
// Status Badge (Order)
// ============================================================
type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';

const statusConfig: Record<OrderStatus, { label: string; color: string; dot: string }> = {
  pending:   { label: 'รอยืนยัน',    color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-400' },
  confirmed: { label: 'ยืนยันแล้ว',  color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-400' },
  preparing: { label: 'กำลังทำ',     color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400 animate-pulse' },
  ready:     { label: 'พร้อมรับ',    color: 'bg-green-100 text-green-700',  dot: 'bg-green-400 animate-pulse' },
  completed: { label: 'สำเร็จ',      color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400' },
  cancelled: { label: 'ยกเลิก',      color: 'bg-red-100 text-red-700',      dot: 'bg-red-400' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const cfg = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

// ============================================================
// Tag Badge
// ============================================================
const tagColors: Record<string, string> = {
  ขายดี:   'bg-red-100 text-red-600',
  ใหม่:    'bg-green-100 text-green-600',
  แนะนำ:  'bg-blue-100 text-blue-600',
};

export function TagBadge({ tag }: { tag: string }) {
  const color = tagColors[tag] || 'bg-gray-100 text-gray-600';
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${color}`}>{tag}</span>
  );
}
