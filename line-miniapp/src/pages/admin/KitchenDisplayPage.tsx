import React, { useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/dataService';
import { useNotify } from '@/contexts/AppContext';

type KitchenStatus = 'confirmed' | 'preparing' | 'ready';

const STATUS_COLOR: Record<KitchenStatus, { card: string; badge: string; button: string; nextLabel: string; nextStatus: OrderStatus | null }> = {
  confirmed: {
    card:      'bg-blue-50 border-blue-200',
    badge:     'bg-blue-100 text-blue-700',
    button:    'bg-orange-500 hover:bg-orange-600',
    nextLabel: 'เริ่มทำ',
    nextStatus: 'preparing',
  },
  preparing: {
    card:      'bg-orange-50 border-orange-200',
    badge:     'bg-orange-100 text-orange-700 animate-pulse',
    button:    'bg-green-600 hover:bg-green-700',
    nextLabel: 'พร้อมเสิร์ฟ',
    nextStatus: 'ready',
  },
  ready: {
    card:      'bg-green-50 border-green-200',
    badge:     'bg-green-100 text-green-700 animate-pulse',
    button:    'bg-gray-600 hover:bg-gray-700',
    nextLabel: 'รับแล้ว',
    nextStatus: 'completed',
  },
};

const COLUMN_LABELS: Record<KitchenStatus, string> = {
  confirmed: '📋 รอทำ',
  preparing: '🔥 กำลังทำ',
  ready:     '✅ พร้อมรับ',
};

// ============================================================
// Order Card
// ============================================================
function KitchenOrderCard({
  order,
  onAdvance,
}: {
  order: Order;
  onAdvance: (id: string, next: OrderStatus) => void;
}) {
  const cfg = STATUS_COLOR[order.status as KitchenStatus];
  const elapsed = Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000);

  return (
    <div className={`rounded-2xl border-2 p-4 shadow-sm ${cfg.card}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-black text-2xl text-gray-900">คิว #{order.queueNumber}</p>
          <p className="text-sm font-semibold text-gray-700">{order.orderNumber}</p>
        </div>
        <div className="text-right">
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${cfg.badge}`}>
            {order.status === 'confirmed' ? 'รอทำ' : order.status === 'preparing' ? 'กำลังทำ' : 'พร้อมรับ'}
          </span>
          <p className={`text-xs mt-1 font-medium ${elapsed > 10 ? 'text-red-500' : 'text-gray-400'}`}>
            {elapsed} นาทีที่แล้ว
          </p>
        </div>
      </div>

      {/* Customer */}
      <p className="text-sm text-gray-600 mb-3 font-medium">👤 {order.memberName}</p>

      {/* Items */}
      <div className="space-y-2 mb-4">
        {order.items.map(item => (
          <div key={item.cartItemId} className="bg-white rounded-xl px-3 py-2 border border-white/80">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="font-bold text-gray-900 text-sm">
                  <span className="text-coffee-600 mr-1">×{item.quantity}</span>
                  {item.name}
                </p>
                {item.selectedOptions.length > 0 && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {item.selectedOptions.map(o => `${o.optionName}: ${o.choiceLabel}`).join(' · ')}
                  </p>
                )}
                {item.note && (
                  <p className="text-xs text-amber-600 font-medium mt-0.5">📝 {item.note}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Note */}
      {order.note && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-3">
          <p className="text-xs text-amber-700 font-medium">📝 {order.note}</p>
        </div>
      )}

      {/* Action */}
      {cfg.nextStatus && (
        <button
          onClick={() => cfg.nextStatus && onAdvance(order.id, cfg.nextStatus)}
          className={`w-full py-3 rounded-xl text-white font-bold text-sm transition ${cfg.button}`}
        >
          {cfg.nextLabel} →
        </button>
      )}
    </div>
  );
}

// ============================================================
// Kitchen Display Page
// ============================================================
export default function KitchenDisplayPage() {
  const notify = useNotify();
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const refresh = useCallback(() => {
    setOrders(orderService.getActive().filter(o => o.status !== 'pending'));
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(refresh, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, refresh]);

  const handleAdvance = useCallback((orderId: string, nextStatus: OrderStatus) => {
    orderService.updateStatus(orderId, nextStatus);
    refresh();
    const labels: Record<string, string> = {
      preparing: 'เริ่มทำแล้ว',
      ready:     'พร้อมเสิร์ฟ! แจ้งลูกค้าแล้ว',
      completed: 'รับเครื่องดื่มแล้ว',
    };
    notify(nextStatus === 'ready' ? 'success' : 'info', labels[nextStatus] || 'อัปเดตสำเร็จ');
  }, [refresh, notify]);

  const columns: KitchenStatus[] = ['confirmed', 'preparing', 'ready'];

  const getColumnOrders = (status: KitchenStatus) =>
    orders
      .filter(o => o.status === status)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  const pendingCount = orderService.getAll().filter(o => o.status === 'pending').length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Kitchen Display</h1>
          <p className="text-gray-500 text-sm">
            อัปเดตล่าสุด {lastUpdated.toLocaleTimeString('th-TH', { timeStyle: 'short' })}
            {' '}· ทั้งหมด {orders.length} ออเดอร์
          </p>
        </div>
        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <div className="bg-yellow-100 border border-yellow-300 text-yellow-800 px-3 py-2 rounded-xl text-sm font-semibold animate-pulse">
              ⏳ รอยืนยัน {pendingCount} ออเดอร์
            </div>
          )}
          <button
            onClick={() => setAutoRefresh(p => !p)}
            className={`px-3 py-2 rounded-xl text-sm font-medium border transition ${
              autoRefresh ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}
          >
            {autoRefresh ? '🟢 Auto' : '⏸ Manual'}
          </button>
          <button
            onClick={refresh}
            className="px-3 py-2 rounded-xl bg-coffee-700 text-white text-sm font-medium hover:bg-coffee-800 transition"
          >
            🔄 รีเฟรช
          </button>
        </div>
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map(status => {
          const colOrders = getColumnOrders(status);
          const cfg = STATUS_COLOR[status];
          return (
            <div key={status} className="flex flex-col gap-3">
              {/* Column header */}
              <div className={`px-4 py-2.5 rounded-xl border-2 flex items-center justify-between ${cfg.card}`}>
                <span className="font-bold text-gray-800">{COLUMN_LABELS[status]}</span>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cfg.badge}`}>
                  {colOrders.length}
                </span>
              </div>

              {/* Cards */}
              {colOrders.length === 0 ? (
                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center text-gray-400 text-sm">
                  ไม่มีออเดอร์
                </div>
              ) : (
                colOrders.map(order => (
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    onAdvance={handleAdvance}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {orders.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <span className="text-7xl block mb-4">🎉</span>
          <p className="text-xl font-bold text-gray-600">ไม่มีออเดอร์ที่ต้องทำ</p>
          <p className="text-sm mt-1">ออเดอร์ใหม่จะปรากฏที่นี่อัตโนมัติ</p>
        </div>
      )}
    </div>
  );
}
