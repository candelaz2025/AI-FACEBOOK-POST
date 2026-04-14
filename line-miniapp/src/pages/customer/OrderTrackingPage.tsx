import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/dataService';
import { useApp } from '@/contexts/AppContext';
import { OrderStatusBadge } from '@/components/shared/Badge';

const statusSteps: { status: OrderStatus; label: string; icon: string }[] = [
  { status: 'pending',   label: 'รอยืนยัน',   icon: '📝' },
  { status: 'confirmed', label: 'ยืนยันแล้ว',  icon: '✅' },
  { status: 'preparing', label: 'กำลังทำ',     icon: '👨‍🍳' },
  { status: 'ready',     label: 'พร้อมรับ',    icon: '🔔' },
  { status: 'completed', label: 'รับแล้ว',     icon: '🎉' },
];

const statusOrder: Record<OrderStatus, number> = {
  pending: 0, confirmed: 1, preparing: 2, ready: 3, completed: 4, cancelled: -1,
};

// ============================================================
// Single Order Tracking
// ============================================================
function OrderTracking({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(() => orderService.getById(orderId) ?? null);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = orderService.getById(orderId);
      if (updated) setOrder(updated);
    }, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  if (!order) {
    return (
      <div className="text-center py-16 text-gray-400">
        <span className="text-5xl block mb-3">❌</span>
        <p>ไม่พบออเดอร์</p>
      </div>
    );
  }

  const currentStep = order.status === 'cancelled' ? -1 : statusOrder[order.status];

  return (
    <div className="p-4 flex flex-col gap-4">
      {/* Order header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-bold text-xl text-gray-900">{order.orderNumber}</h2>
          <OrderStatusBadge status={order.status} />
        </div>
        {order.queueNumber && order.status !== 'completed' && order.status !== 'cancelled' && (
          <div className="bg-coffee-50 rounded-xl p-3 text-center">
            <p className="text-xs text-coffee-600 font-medium">หมายเลขคิว</p>
            <p className="text-4xl font-black text-coffee-800">{order.queueNumber}</p>
            {order.estimatedMinutes && (
              <p className="text-xs text-coffee-500 mt-1">
                ประมาณ {order.estimatedMinutes} นาที
              </p>
            )}
          </div>
        )}
      </div>

      {/* Status stepper */}
      {order.status !== 'cancelled' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <h3 className="font-semibold text-gray-700 mb-4">สถานะออเดอร์</h3>
          <div className="relative">
            {/* Progress line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-gray-200" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-coffee-500 transition-all"
              style={{ height: `${(currentStep / (statusSteps.length - 1)) * 100}%` }}
            />
            <div className="space-y-6 relative">
              {statusSteps.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 z-10 transition-all ${
                        done
                          ? 'bg-coffee-600 shadow-md'
                          : 'bg-gray-100'
                      } ${active ? 'ring-4 ring-coffee-200' : ''}`}
                    >
                      {step.icon}
                    </div>
                    <div>
                      <p className={`font-semibold text-sm ${done ? 'text-gray-900' : 'text-gray-400'}`}>
                        {step.label}
                      </p>
                      {active && (
                        <p className="text-xs text-coffee-600 animate-pulse">กำลังดำเนินการ...</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {order.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
          <span className="text-4xl block mb-2">❌</span>
          <p className="font-bold text-red-700">ออเดอร์ถูกยกเลิก</p>
        </div>
      )}

      {order.status === 'ready' && (
        <div className="bg-green-50 border border-green-300 rounded-2xl p-4 text-center animate-pulse-slow">
          <span className="text-4xl block mb-2">🔔</span>
          <p className="font-bold text-green-700 text-lg">เครื่องดื่มพร้อมแล้ว!</p>
          <p className="text-green-600 text-sm">กรุณามารับที่เคาน์เตอร์</p>
        </div>
      )}

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-semibold text-gray-700 mb-3">รายการ</h3>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.cartItemId} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} × {item.quantity}
                {item.selectedOptions.length > 0 && (
                  <span className="text-gray-400 text-xs ml-1">
                    ({item.selectedOptions.map(o => o.choiceLabel).join(', ')})
                  </span>
                )}
              </span>
              <span className="font-medium">฿{item.itemTotal.toLocaleString()}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-3 pt-3 space-y-1 text-sm">
          <div className="flex justify-between text-gray-500">
            <span>ราคารวม</span>
            <span>฿{order.subtotal.toLocaleString()}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{order.discountNote || 'ส่วนลด'}</span>
              <span>−฿{order.discountAmount.toFixed(0)}</span>
            </div>
          )}
          {order.pointsDiscount > 0 && (
            <div className="flex justify-between text-amber-600">
              <span>แลกแต้ม</span>
              <span>−฿{order.pointsDiscount.toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-gray-900 text-base">
            <span>ยอดรวม</span>
            <span>฿{order.total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-gray-500">
            <span>ชำระด้วย</span>
            <span>{order.paymentMethod === 'cash' ? 'เงินสด' : order.paymentMethod === 'promptpay' ? 'พร้อมเพย์' : order.paymentMethod === 'linepay' ? 'LINE Pay' : 'บัตรเครดิต'}</span>
          </div>
          {order.pointsEarned > 0 && (
            <div className="flex justify-between text-amber-600 font-medium">
              <span>แต้มที่ได้รับ</span>
              <span>+{order.pointsEarned} แต้ม</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Order History List
// ============================================================
function OrderHistoryList({ memberId }: { memberId: string }) {
  const [orders] = useState<Order[]>(() => orderService.getByMember(memberId));
  const navigate = useNavigate();

  if (orders.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <span className="text-5xl block mb-3">📋</span>
        <p>ยังไม่มีประวัติการสั่ง</p>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      {orders.map(order => (
        <button
          key={order.id}
          onClick={() => navigate(`/orders/${order.id}`)}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 text-left hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-gray-900">{order.orderNumber}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-xs text-gray-400 mb-2">
            {new Date(order.createdAt).toLocaleDateString('th-TH', { dateStyle: 'medium' })}
            {' '}
            {new Date(order.createdAt).toLocaleTimeString('th-TH', { timeStyle: 'short' })}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 line-clamp-1">
              {order.items.map(i => `${i.name}×${i.quantity}`).join(', ')}
            </p>
            <p className="font-bold text-coffee-700 text-sm ml-2">฿{order.total.toLocaleString()}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

// ============================================================
// Page
// ============================================================
export default function OrderTrackingPage() {
  const { orderId } = useParams<{ orderId?: string }>();
  const { currentMember } = useApp();
  const [tab, setTab] = useState<'active' | 'history'>(orderId ? 'active' : 'active');
  const activeOrders = orderService.getAll().filter(
    o => currentMember && o.memberId === currentMember.id &&
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
  );

  if (orderId) {
    return (
      <div>
        <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-3">
          <Link to="/orders" className="text-coffee-700 text-sm font-medium">← กลับ</Link>
          <h2 className="font-bold text-gray-800">ติดตามออเดอร์</h2>
        </div>
        <OrderTracking orderId={orderId} />
      </div>
    );
  }

  return (
    <div>
      <div className="px-4 py-3 bg-white border-b border-gray-100">
        <h2 className="font-bold text-gray-800 mb-3">ออเดอร์ของฉัน</h2>
        <div className="flex gap-2">
          {[{ key: 'active', label: `กำลังดำเนินการ (${activeOrders.length})` }, { key: 'history', label: 'ประวัติ' }].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as 'active' | 'history')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                tab === t.key ? 'bg-coffee-700 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {tab === 'active' && (
        activeOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl block mb-3">✅</span>
            <p>ไม่มีออเดอร์ที่กำลังดำเนินการ</p>
          </div>
        ) : (
          <div className="p-4 flex flex-col gap-3">
            {activeOrders.map(o => (
              <Link
                key={o.id}
                to={`/orders/${o.id}`}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 block"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">{o.orderNumber}</span>
                  <OrderStatusBadge status={o.status} />
                </div>
                {o.queueNumber && (
                  <p className="text-coffee-700 font-bold text-lg mt-1">คิว #{o.queueNumber}</p>
                )}
              </Link>
            ))}
          </div>
        )
      )}

      {tab === 'history' && currentMember && (
        <OrderHistoryList memberId={currentMember.id} />
      )}
    </div>
  );
}
