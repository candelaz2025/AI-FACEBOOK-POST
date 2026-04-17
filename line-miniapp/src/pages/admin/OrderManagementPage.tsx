import React, { useState, useCallback } from 'react';
import { Order, OrderStatus } from '@/types';
import { orderService } from '@/services/dataService';
import { OrderStatusBadge } from '@/components/shared/Badge';
import { Modal } from '@/components/shared/Modal';
import { useNotify } from '@/contexts/AppContext';

const STATUS_ACTIONS: Record<OrderStatus, { label: string; nextStatus?: OrderStatus; color: string }[]> = {
  pending:   [{ label: 'ยืนยันออเดอร์', nextStatus: 'confirmed', color: 'bg-blue-600' }, { label: 'ยกเลิก', nextStatus: 'cancelled', color: 'bg-red-500' }],
  confirmed: [{ label: 'เริ่มทำ', nextStatus: 'preparing', color: 'bg-orange-500' }, { label: 'ยกเลิก', nextStatus: 'cancelled', color: 'bg-red-500' }],
  preparing: [{ label: 'พร้อมรับ', nextStatus: 'ready', color: 'bg-green-600' }],
  ready:     [{ label: 'รับแล้ว', nextStatus: 'completed', color: 'bg-gray-600' }],
  completed: [],
  cancelled: [],
};

const STATUS_TABS: { key: 'all' | OrderStatus; label: string }[] = [
  { key: 'all',       label: 'ทั้งหมด' },
  { key: 'pending',   label: 'รอยืนยัน' },
  { key: 'confirmed', label: 'ยืนยันแล้ว' },
  { key: 'preparing', label: 'กำลังทำ' },
  { key: 'ready',     label: 'พร้อมรับ' },
  { key: 'completed', label: 'สำเร็จ' },
  { key: 'cancelled', label: 'ยกเลิก' },
];

// ============================================================
// Order Detail Modal
// ============================================================
function OrderDetailModal({
  order,
  onClose,
  onStatusChange,
}: {
  order: Order;
  onClose: () => void;
  onStatusChange: (orderId: string, status: OrderStatus) => void;
}) {
  const actions = STATUS_ACTIONS[order.status];

  return (
    <div className="p-4 pb-6 space-y-4">
      {/* Header info */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-xl text-gray-900">{order.orderNumber}</h3>
          {order.queueNumber && (
            <p className="text-coffee-600 font-bold">คิว #{order.queueNumber}</p>
          )}
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="bg-gray-50 rounded-xl p-3 text-sm space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-500">ลูกค้า</span>
          <span className="font-medium">{order.memberName}</span>
        </div>
        {order.memberPhone && (
          <div className="flex justify-between">
            <span className="text-gray-500">เบอร์โทร</span>
            <a href={`tel:${order.memberPhone}`} className="font-medium text-blue-600">{order.memberPhone}</a>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-gray-500">เวลาสั่ง</span>
          <span className="font-medium">
            {new Date(order.createdAt).toLocaleTimeString('th-TH', { timeStyle: 'short' })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">ชำระด้วย</span>
          <span className="font-medium">
            {order.paymentMethod === 'cash' ? 'เงินสด' : order.paymentMethod === 'promptpay' ? 'พร้อมเพย์' : order.paymentMethod === 'linepay' ? 'LINE Pay' : 'บัตรเครดิต'}
          </span>
        </div>
        {order.note && (
          <div className="flex justify-between">
            <span className="text-gray-500">หมายเหตุ</span>
            <span className="font-medium text-amber-700">{order.note}</span>
          </div>
        )}
      </div>

      {/* Items */}
      <div>
        <h4 className="font-semibold text-gray-700 mb-2">รายการ</h4>
        <div className="space-y-2">
          {order.items.map(item => (
            <div key={item.cartItemId} className="bg-white border border-gray-100 rounded-xl p-3">
              <div className="flex justify-between">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="font-bold text-coffee-700">฿{item.itemTotal}</span>
              </div>
              {item.selectedOptions.length > 0 && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {item.selectedOptions.map(o => `${o.optionName}: ${o.choiceLabel}`).join(' | ')}
                </p>
              )}
              {item.note && (
                <p className="text-xs text-amber-600 mt-0.5">📝 {item.note}</p>
              )}
              <p className="text-xs text-gray-500 mt-0.5">จำนวน: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="border-t border-gray-100 pt-3 space-y-1 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>ราคารวม</span>
          <span>฿{order.subtotal}</span>
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
        <div className="flex justify-between font-bold text-base text-gray-900">
          <span>ยอดรวม</span>
          <span>฿{order.total}</span>
        </div>
      </div>

      {/* Action buttons */}
      {actions.length > 0 && (
        <div className="flex gap-2 pt-2">
          {actions.map(action => (
            <button
              key={action.label}
              onClick={() => {
                if (action.nextStatus) {
                  onStatusChange(order.id, action.nextStatus);
                  onClose();
                }
              }}
              className={`flex-1 py-3 rounded-xl text-white font-bold text-sm ${action.color} transition`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Order Management Page
// ============================================================
export default function OrderManagementPage() {
  const notify = useNotify();
  const [orders, setOrders] = useState<Order[]>(() => orderService.getAll());
  const [activeTab, setActiveTab] = useState<'all' | OrderStatus>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleStatusChange = useCallback((orderId: string, status: OrderStatus) => {
    try {
      orderService.updateStatus(orderId, status);
      setOrders(orderService.getAll());
      notify('success', `อัปเดตสถานะออเดอร์สำเร็จ`);
    } catch {
      notify('error', 'เกิดข้อผิดพลาดในการอัปเดตสถานะ');
    }
  }, [notify]);

  const filteredOrders = orders.filter(o => {
    const matchTab = activeTab === 'all' || o.status === activeTab;
    const matchSearch = !searchQuery || o.orderNumber.includes(searchQuery) || o.memberName.includes(searchQuery);
    return matchTab && matchSearch;
  });

  const tabCounts = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">จัดการออเดอร์</h1>
        <button
          onClick={() => setOrders(orderService.getAll())}
          className="text-coffee-700 text-sm font-medium bg-coffee-50 px-3 py-1.5 rounded-lg hover:bg-coffee-100 transition"
        >
          🔄 รีเฟรช
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="ค้นหาออเดอร์ หรือชื่อลูกค้า..."
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 bg-white"
      />

      {/* Status tabs */}
      <div className="flex overflow-x-auto gap-2 pb-1">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-coffee-700 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-coffee-300'
            }`}
          >
            {tab.label}
            {tab.key !== 'all' && tabCounts[tab.key] > 0 && (
              <span className={`ml-1 ${activeTab === tab.key ? 'text-white/80' : 'text-coffee-600'}`}>
                ({tabCounts[tab.key]})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">📋</span>
          <p>ไม่มีออเดอร์</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">{order.orderNumber}</span>
                    {order.queueNumber && (
                      <span className="text-xs bg-coffee-100 text-coffee-700 px-2 py-0.5 rounded-full font-medium">
                        คิว #{order.queueNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 font-medium">{order.memberName}</p>
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">
                    {order.items.map(i => `${i.name}×${i.quantity}`).join(', ')}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <OrderStatusBadge status={order.status} />
                  <span className="font-bold text-coffee-700">฿{order.total}</span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                <span className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleTimeString('th-TH', { timeStyle: 'short' })}
                </span>
                {/* Quick action buttons */}
                <div className="flex gap-2">
                  {STATUS_ACTIONS[order.status].slice(0, 1).map(action => (
                    <button
                      key={action.label}
                      onClick={e => {
                        e.stopPropagation();
                        if (action.nextStatus) handleStatusChange(order.id, action.nextStatus);
                      }}
                      className={`text-xs px-3 py-1 rounded-lg text-white font-medium ${action.color}`}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order detail modal */}
      <Modal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        title={`รายละเอียดออเดอร์`}
        size="md"
      >
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={(id, status) => {
              handleStatusChange(id, status);
              setSelectedOrder(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
