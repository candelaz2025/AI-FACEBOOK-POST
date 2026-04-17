import React, { useState, useCallback } from 'react';
import { Promotion, DiscountType, MemberTier } from '@/types';
import { promotionService } from '@/services/dataService';
import { Modal } from '@/components/shared/Modal';
import { TierBadge } from '@/components/shared/Badge';
import { useNotify } from '@/contexts/AppContext';

// ============================================================
// Promotion Form
// ============================================================
function PromotionForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Promotion;
  onSave: (data: Omit<Promotion, 'id' | 'usageCount'>) => void;
  onCancel: () => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState(initial?.name ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [discountType, setDiscountType] = useState<DiscountType>(initial?.discountType ?? 'baht');
  const [discountValue, setDiscountValue] = useState<number>(initial?.discountValue ?? 0);
  const [minOrder, setMinOrder] = useState<number>(initial?.minOrderAmount ?? 0);
  const [maxDiscount, setMaxDiscount] = useState<number>(initial?.maxDiscount ?? 0);
  const [maxUsage, setMaxUsage] = useState<number>(initial?.maxUsage ?? 0);
  const [startDate, setStartDate] = useState(initial?.startDate ?? today);
  const [endDate, setEndDate] = useState(initial?.endDate ?? '');
  const [requiredTier, setRequiredTier] = useState<MemberTier | ''>(initial?.requiredTier ?? '');
  const [isActive, setIsActive] = useState(initial?.isActive ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !discountValue || !endDate) return;
    onSave({
      name: name.trim(),
      description: description.trim() || undefined,
      discountType,
      discountValue,
      minOrderAmount: minOrder || undefined,
      maxDiscount: discountType === 'percent' && maxDiscount ? maxDiscount : undefined,
      maxUsage: maxUsage || undefined,
      startDate,
      endDate,
      requiredTier: requiredTier || undefined,
      isActive,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 pb-8 space-y-4">
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">ชื่อโปรโมชั่น *</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          placeholder="เช่น Happy Hour ลด 20 บาท"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">คำอธิบาย</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 resize-none"
          placeholder="รายละเอียดเพิ่มเติม"
        />
      </div>

      {/* Discount type & value */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ประเภทส่วนลด *</label>
          <select
            value={discountType}
            onChange={e => setDiscountType(e.target.value as DiscountType)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 bg-white"
          >
            <option value="baht">ลดเป็นบาท (฿)</option>
            <option value="percent">ลดเป็นเปอร์เซ็นต์ (%)</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">
            ส่วนลด ({discountType === 'baht' ? '฿' : '%'}) *
          </label>
          <input
            required
            type="number"
            min={1}
            max={discountType === 'percent' ? 100 : undefined}
            value={discountValue || ''}
            onChange={e => setDiscountValue(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
            placeholder={discountType === 'baht' ? '20' : '15'}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ยอดขั้นต่ำ (฿)</label>
          <input
            type="number"
            min={0}
            value={minOrder || ''}
            onChange={e => setMinOrder(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
            placeholder="0 = ไม่จำกัด"
          />
        </div>
        {discountType === 'percent' && (
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">ส่วนลดสูงสุด (฿)</label>
            <input
              type="number"
              min={0}
              value={maxDiscount || ''}
              onChange={e => setMaxDiscount(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
              placeholder="0 = ไม่จำกัด"
            />
          </div>
        )}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">จำกัดการใช้ (ครั้ง)</label>
          <input
            type="number"
            min={0}
            value={maxUsage || ''}
            onChange={e => setMaxUsage(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
            placeholder="0 = ไม่จำกัด"
          />
        </div>
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">วันเริ่ม *</label>
          <input
            required
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">วันสิ้นสุด *</label>
          <input
            required
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            min={startDate}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          />
        </div>
      </div>

      {/* Required tier */}
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">เฉพาะระดับสมาชิก</label>
        <div className="flex gap-2 flex-wrap">
          {(['', 'bronze', 'silver', 'gold', 'platinum'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setRequiredTier(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                requiredTier === t
                  ? 'bg-coffee-700 text-white border-coffee-700'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {t === '' ? 'ทุกระดับ' : t === 'bronze' ? '🥉 Bronze' : t === 'silver' ? '🥈 Silver' : t === 'gold' ? '🥇 Gold' : '💎 Platinum'}
            </button>
          ))}
        </div>
      </div>

      {/* Active toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsActive(p => !p)}
          className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isActive ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-gray-700">{isActive ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}</span>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          className="flex-1 py-3 rounded-xl bg-coffee-700 text-white font-semibold text-sm hover:bg-coffee-800 transition"
        >
          {initial ? 'บันทึก' : 'สร้างโปรโมชั่น'}
        </button>
      </div>
    </form>
  );
}

// ============================================================
// Promotions Page
// ============================================================
export default function PromotionsPage() {
  const notify = useNotify();
  const [promotions, setPromotions] = useState<Promotion[]>(() => promotionService.getAll());
  const [showForm, setShowForm] = useState(false);
  const [editPromo, setEditPromo] = useState<Promotion | undefined>(undefined);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  const today = new Date().toISOString().slice(0, 10);

  const isExpired = (p: Promotion) => p.endDate < today;
  const isRunning = (p: Promotion) => p.isActive && p.startDate <= today && p.endDate >= today;
  const isFull = (p: Promotion) => !!(p.maxUsage && p.usageCount >= p.maxUsage);

  const filtered = promotions.filter(p => {
    if (filterActive === 'active') return isRunning(p) && !isFull(p);
    if (filterActive === 'inactive') return !isRunning(p) || isFull(p);
    return true;
  });

  const handleSave = useCallback((data: Omit<Promotion, 'id' | 'usageCount'>) => {
    if (editPromo) {
      promotionService.update(editPromo.id, data);
      notify('success', 'แก้ไขโปรโมชั่นสำเร็จ');
    } else {
      promotionService.create(data);
      notify('success', 'สร้างโปรโมชั่นใหม่สำเร็จ');
    }
    setPromotions(promotionService.getAll());
    setShowForm(false);
    setEditPromo(undefined);
  }, [editPromo, notify]);

  const handleToggle = useCallback((id: string) => {
    promotionService.toggleActive(id);
    setPromotions(promotionService.getAll());
  }, []);

  const handleDelete = useCallback((p: Promotion) => {
    if (!confirm(`ลบโปรโมชั่น "${p.name}"?`)) return;
    promotionService.delete(p.id);
    setPromotions(promotionService.getAll());
    notify('success', `ลบ ${p.name} แล้ว`);
  }, [notify]);

  const activeCount = promotions.filter(p => isRunning(p) && !isFull(p)).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">โปรโมชั่น</h1>
          <p className="text-gray-500 text-sm mt-1">กำลังใช้งาน {activeCount} รายการ</p>
        </div>
        <button
          onClick={() => { setEditPromo(undefined); setShowForm(true); }}
          className="bg-coffee-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-coffee-800 transition"
        >
          + สร้างโปรโมชั่น
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[
          { key: 'all',      label: `ทั้งหมด (${promotions.length})` },
          { key: 'active',   label: `ใช้งานอยู่ (${activeCount})` },
          { key: 'inactive', label: 'ไม่ใช้งาน' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilterActive(tab.key as typeof filterActive)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              filterActive === tab.key ? 'bg-coffee-700 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Promotions list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">🎁</span>
          <p>ไม่มีโปรโมชั่น</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(promo => {
            const running = isRunning(promo);
            const expired = isExpired(promo);
            const full = isFull(promo);

            return (
              <div
                key={promo.id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                  running && !full ? 'border-green-200' : 'border-gray-100 opacity-70'
                }`}
              >
                {/* Color band */}
                <div className={`h-2 ${running && !full ? 'bg-green-400' : expired ? 'bg-gray-300' : full ? 'bg-red-300' : 'bg-yellow-300'}`} />

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{promo.name}</h3>
                      {promo.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{promo.description}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <div className="text-2xl font-black text-coffee-700">
                        {promo.discountType === 'baht' ? `฿${promo.discountValue}` : `${promo.discountValue}%`}
                      </div>
                      <p className="text-xs text-gray-400">ส่วนลด</p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {running && !full && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">🟢 ใช้งานอยู่</span>
                    )}
                    {expired && (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">⏰ หมดอายุ</span>
                    )}
                    {full && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">🔴 ใช้ครบแล้ว</span>
                    )}
                    {!promo.isActive && !expired && !full && (
                      <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">⏸ ปิดใช้งาน</span>
                    )}
                    {promo.requiredTier && (
                      <TierBadge tier={promo.requiredTier} size="xs" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 mb-3">
                    {promo.minOrderAmount && (
                      <span>ขั้นต่ำ ฿{promo.minOrderAmount}</span>
                    )}
                    {promo.maxDiscount && (
                      <span>สูงสุด ฿{promo.maxDiscount}</span>
                    )}
                    <span>เริ่ม {new Date(promo.startDate).toLocaleDateString('th-TH', { dateStyle: 'short' })}</span>
                    <span>ถึง {new Date(promo.endDate).toLocaleDateString('th-TH', { dateStyle: 'short' })}</span>
                    <span>ใช้ไปแล้ว {promo.usageCount} ครั้ง</span>
                    {promo.maxUsage && (
                      <span>จำกัด {promo.maxUsage} ครั้ง</span>
                    )}
                  </div>

                  {/* Usage progress */}
                  {promo.maxUsage && (
                    <div className="mb-3">
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${full ? 'bg-red-400' : 'bg-green-400'}`}
                          style={{ width: `${Math.min(100, (promo.usageCount / promo.maxUsage) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggle(promo.id)}
                      className={`flex-1 py-2 text-xs rounded-xl font-medium border transition ${
                        promo.isActive
                          ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200'
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'
                      }`}
                    >
                      {promo.isActive ? 'ปิดใช้' : 'เปิดใช้'}
                    </button>
                    <button
                      onClick={() => { setEditPromo(promo); setShowForm(true); }}
                      className="flex-1 py-2 text-xs rounded-xl font-medium bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(promo)}
                      className="flex-1 py-2 text-xs rounded-xl font-medium bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 transition"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditPromo(undefined); }}
        title={editPromo ? 'แก้ไขโปรโมชั่น' : 'สร้างโปรโมชั่นใหม่'}
        size="md"
      >
        <PromotionForm
          initial={editPromo}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditPromo(undefined); }}
        />
      </Modal>
    </div>
  );
}
