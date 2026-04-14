import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useApp, useNotify } from '@/contexts/AppContext';
import { orderService } from '@/services/dataService';
import { PaymentMethod } from '@/types';

const paymentOptions: { value: PaymentMethod; label: string; icon: string }[] = [
  { value: 'cash',      label: 'เงินสด',      icon: '💵' },
  { value: 'promptpay', label: 'พร้อมเพย์',   icon: '📱' },
  { value: 'linepay',   label: 'LINE Pay',    icon: '💚' },
  { value: 'creditcard', label: 'บัตรเครดิต', icon: '💳' },
];

export default function CartPage() {
  const navigate = useNavigate();
  const notify = useNotify();
  const { cartItems, cartTotal, removeFromCart, updateCartQty, clearCart } = useCart();
  const { currentMember, refreshMember } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [pointsToUse, setPointsToUse] = useState(0);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const maxPoints = currentMember ? Math.min(currentMember.points, Math.floor(cartTotal * 0.3 / 0.1)) : 0;
  const pointsDiscount = pointsToUse * 0.1;
  const tierDiscountRate = currentMember?.tier === 'platinum' ? 0.10
    : currentMember?.tier === 'gold' ? 0.05
    : currentMember?.tier === 'silver' ? 0.03
    : 0;
  const tierDiscountAmount = cartTotal * tierDiscountRate;
  const total = Math.max(0, cartTotal - tierDiscountAmount - pointsDiscount);

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      notify('warning', 'ตะกร้าว่างเปล่า');
      return;
    }
    if (!currentMember) {
      notify('error', 'กรุณาเข้าสู่ระบบก่อน');
      return;
    }

    setIsSubmitting(true);
    try {
      const order = orderService.create({
        memberId: currentMember.id,
        memberName: currentMember.displayName,
        memberPhone: currentMember.phone,
        items: cartItems,
        pointsUsed: pointsToUse,
        paymentMethod,
        note: note || undefined,
        memberTier: currentMember.tier,
      });
      clearCart();
      refreshMember();
      notify('success', `สั่งซื้อสำเร็จ! หมายเลขคิว ${order.queueNumber}`);
      navigate(`/orders/${order.id}`);
    } catch (err) {
      notify('error', 'เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
        <span className="text-7xl mb-4">🛒</span>
        <h2 className="text-xl font-bold text-gray-700 mb-2">ตะกร้าว่างเปล่า</h2>
        <p className="text-gray-400 mb-6">เลือกเมนูที่คุณชอบได้เลยครับ</p>
        <button
          onClick={() => navigate('/')}
          className="bg-coffee-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-coffee-800 transition"
        >
          ดูเมนู
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Cart items */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-800">รายการสั่ง ({cartItems.length})</h2>
          <button
            onClick={clearCart}
            className="text-red-400 text-xs hover:text-red-600"
          >
            ล้างทั้งหมด
          </button>
        </div>
        {cartItems.map(item => (
          <div key={item.cartItemId} className="px-4 py-3 border-b border-gray-50 last:border-0">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-coffee-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                ☕
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                {item.selectedOptions.length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {item.selectedOptions.map(o => o.choiceLabel).join(', ')}
                  </p>
                )}
                {item.note && (
                  <p className="text-xs text-amber-600 mt-0.5">📝 {item.note}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.quantity <= 1) removeFromCart(item.cartItemId);
                        else updateCartQty(item.cartItemId, item.quantity - 1);
                      }}
                      className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-sm font-bold"
                    >
                      −
                    </button>
                    <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQty(item.cartItemId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-coffee-100 text-coffee-700 flex items-center justify-center text-sm font-bold"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-coffee-700">฿{item.itemTotal.toLocaleString()}</span>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-red-400 text-sm hover:text-red-600"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Payment method */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <h2 className="font-bold text-gray-800 mb-3">วิธีชำระเงิน</h2>
        <div className="grid grid-cols-2 gap-2">
          {paymentOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setPaymentMethod(opt.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                paymentMethod === opt.value
                  ? 'bg-coffee-700 text-white border-coffee-700'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              <span>{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Points redemption */}
      {currentMember && currentMember.points > 0 && (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-gray-800">ใช้แต้ม</h2>
            <span className="text-sm text-amber-600">มี {currentMember.points.toLocaleString()} แต้ม</span>
          </div>
          <input
            type="range"
            min={0}
            max={maxPoints}
            step={10}
            value={pointsToUse}
            onChange={e => setPointsToUse(Number(e.target.value))}
            className="w-full accent-coffee-700"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 แต้ม</span>
            <span className="font-medium text-coffee-700">ใช้ {pointsToUse} แต้ม = ลด ฿{pointsDiscount.toFixed(0)}</span>
            <span>{maxPoints} แต้ม</span>
          </div>
        </section>
      )}

      {/* Note */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <label className="font-bold text-gray-800 text-sm block mb-2">หมายเหตุออเดอร์ (ถ้ามี)</label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="เช่น ต้องการเร็วด่วน, สั่งกลับบ้าน..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
        />
      </section>

      {/* Summary & Order button */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div className="space-y-1.5 mb-4 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>ราคารวม</span>
            <span>฿{cartTotal.toLocaleString()}</span>
          </div>
          {tierDiscountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>ส่วนลดสมาชิก ({(tierDiscountRate * 100).toFixed(0)}%)</span>
              <span>−฿{tierDiscountAmount.toFixed(0)}</span>
            </div>
          )}
          {pointsDiscount > 0 && (
            <div className="flex justify-between text-amber-600">
              <span>แลกแต้ม</span>
              <span>−฿{pointsDiscount.toFixed(0)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg text-gray-900 pt-2 border-t border-gray-100">
            <span>ยอดชำระ</span>
            <span>฿{total.toFixed(0)}</span>
          </div>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          className="w-full bg-coffee-700 hover:bg-coffee-800 text-white py-4 rounded-xl font-bold text-base transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <><span className="animate-spin">⏳</span> กำลังสั่ง...</>
          ) : (
            <>สั่งซื้อเลย ฿{total.toFixed(0)}</>
          )}
        </button>
      </section>
    </div>
  );
}
