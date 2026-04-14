import React, { useState, useMemo, useCallback } from 'react';
import { MenuItem, MenuCategory, CartItemOption } from '@/types';
import { menuService, categoryService } from '@/services/dataService';
import { useCart, useApp, useNotify } from '@/contexts/AppContext';
import { Modal } from '@/components/shared/Modal';
import { TagBadge } from '@/components/shared/Badge';
import { TierBadge } from '@/components/shared/Badge';

// ============================================================
// Item Detail / Add to Cart Modal
// ============================================================
function MenuItemModal({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const { addToCart } = useCart();
  const notify = useNotify();
  const [qty, setQty] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, CartItemOption>>({});
  const [note, setNote] = useState('');

  const handleOptionChange = (optionId: string, optionName: string, choice: { label: string; priceDiff: number }) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: { optionId, optionName, choiceLabel: choice.label, priceDiff: choice.priceDiff },
    }));
  };

  const optionTotal = Object.values(selectedOptions).reduce((s, o) => s + o.priceDiff, 0);
  const lineTotal = (item.price + optionTotal) * qty;

  const allRequiredSelected = item.options
    .filter(o => o.required)
    .every(o => selectedOptions[o.id]);

  const handleAdd = () => {
    if (!allRequiredSelected) {
      notify('warning', 'กรุณาเลือกตัวเลือกที่จำเป็นให้ครบ');
      return;
    }
    addToCart(item, Object.values(selectedOptions), qty, note || undefined);
    notify('success', `เพิ่ม ${item.name} ลงตะกร้าแล้ว`);
    onClose();
  };

  return (
    <div className="p-4 pb-6">
      {/* Item image placeholder */}
      <div className="w-full h-48 bg-gradient-to-br from-coffee-100 to-coffee-200 rounded-xl flex items-center justify-center mb-4">
        <span className="text-7xl">☕</span>
      </div>

      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
        <div className="flex gap-1 flex-wrap justify-end">
          {item.tags.map(t => <TagBadge key={t} tag={t} />)}
        </div>
      </div>

      {item.description && (
        <p className="text-sm text-gray-500 mb-3">{item.description}</p>
      )}

      <p className="text-2xl font-bold text-coffee-700 mb-4">
        ฿{item.price.toLocaleString()}
        {optionTotal !== 0 && (
          <span className="text-base font-normal text-gray-400 ml-1">
            {optionTotal > 0 ? `+${optionTotal}` : optionTotal}
          </span>
        )}
      </p>

      {/* Options */}
      {item.options.map(opt => (
        <div key={opt.id} className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            {opt.name}
            {opt.required && <span className="text-red-500 ml-1">*</span>}
          </p>
          <div className="flex flex-wrap gap-2">
            {opt.choices.map(choice => {
              const isSelected = selectedOptions[opt.id]?.choiceLabel === choice.label;
              return (
                <button
                  key={choice.label}
                  onClick={() => handleOptionChange(opt.id, opt.name, choice)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    isSelected
                      ? 'bg-coffee-700 text-white border-coffee-700'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-coffee-400'
                  }`}
                >
                  {choice.label}
                  {choice.priceDiff !== 0 && (
                    <span className="ml-1 text-xs opacity-70">
                      {choice.priceDiff > 0 ? `+${choice.priceDiff}` : choice.priceDiff}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* Note */}
      <div className="mb-4">
        <label className="text-sm font-semibold text-gray-700 block mb-1">หมายเหตุ (ถ้ามี)</label>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="เช่น ไม่ใส่น้ำแข็ง, หวานน้อยมาก..."
          className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
        />
      </div>

      {/* Qty & Add button */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setQty(q => Math.max(1, q - 1))}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow text-lg font-bold"
          >
            −
          </button>
          <span className="text-lg font-bold w-6 text-center">{qty}</span>
          <button
            onClick={() => setQty(q => q + 1)}
            className="w-9 h-9 flex items-center justify-center bg-white rounded-lg shadow text-lg font-bold"
          >
            +
          </button>
        </div>
        <button
          onClick={handleAdd}
          className="flex-1 bg-coffee-700 hover:bg-coffee-800 text-white py-3 px-4 rounded-xl font-bold text-sm transition-colors flex items-center justify-between"
        >
          <span>เพิ่มลงตะกร้า</span>
          <span>฿{lineTotal.toLocaleString()}</span>
        </button>
      </div>
    </div>
  );
}

// ============================================================
// Menu Card
// ============================================================
function MenuCard({ item, onSelect }: { item: MenuItem; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      disabled={!item.isAvailable}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-left transition-all hover:shadow-md active:scale-98 ${
        !item.isAvailable ? 'opacity-50' : ''
      }`}
    >
      {/* Image */}
      <div className="h-32 bg-gradient-to-br from-coffee-100 to-cream-200 flex items-center justify-center relative">
        <span className="text-5xl">☕</span>
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-gray-500/40 flex items-center justify-center">
            <span className="text-white text-xs font-bold bg-gray-700 px-2 py-1 rounded">หมด</span>
          </div>
        )}
        {item.tags.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {item.tags.map(t => <TagBadge key={t} tag={t} />)}
          </div>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{item.name}</p>
        {item.description && (
          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{item.description}</p>
        )}
        <p className="text-coffee-700 font-bold mt-2">฿{item.price}</p>
      </div>
    </button>
  );
}

// ============================================================
// Home Page
// ============================================================
export default function HomePage() {
  const { currentMember } = useApp();
  const [categories] = useState<MenuCategory[]>(() => categoryService.getAll().filter(c => c.isActive));
  const [allItems] = useState<MenuItem[]>(() => menuService.getAll());
  const [activeCatId, setActiveCatId] = useState<string>(categories[0]?.id ?? '');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const displayedItems = useMemo(() => {
    const base = searchQuery
      ? allItems.filter(i =>
          i.name.includes(searchQuery) ||
          (i.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      : allItems.filter(i => i.categoryId === activeCatId);
    return base;
  }, [allItems, activeCatId, searchQuery]);

  return (
    <div className="flex flex-col">
      {/* Member greeting */}
      {currentMember && (
        <div className="bg-coffee-800 text-white px-4 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-coffee-600 flex items-center justify-center text-xl">
              {currentMember.pictureUrl ? (
                <img src={currentMember.pictureUrl} alt="" className="w-full h-full rounded-full object-cover" />
              ) : '👤'}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">สวัสดี, {currentMember.displayName}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <TierBadge tier={currentMember.tier} size="xs" />
                <span className="text-xs text-coffee-200">⭐ {currentMember.points.toLocaleString()} แต้ม</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-4 py-3 bg-coffee-800 pb-5">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="ค้นหาเมนู..."
            className="w-full bg-white/20 backdrop-blur text-white placeholder-white/60 rounded-xl px-4 py-2.5 pr-10 text-sm focus:outline-none focus:bg-white/30 transition"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60">🔍</span>
        </div>
      </div>

      {/* Category tabs */}
      {!searchQuery && (
        <div className="sticky top-[60px] bg-white z-10 border-b border-gray-100 shadow-sm">
          <div className="flex overflow-x-auto scrollbar-hide px-2 py-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  activeCatId === cat.id
                    ? 'bg-coffee-700 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu grid */}
      <div className="p-4">
        {searchQuery && (
          <p className="text-sm text-gray-500 mb-3">
            ผลลัพธ์สำหรับ "{searchQuery}" ({displayedItems.length} รายการ)
          </p>
        )}

        {displayedItems.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <span className="text-5xl block mb-3">🔍</span>
            <p>ไม่พบเมนูที่ค้นหา</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {displayedItems.map(item => (
              <MenuCard
                key={item.id}
                item={item}
                onSelect={() => setSelectedItem(item)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Item modal */}
      <Modal
        isOpen={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        title={selectedItem?.name}
        size="md"
      >
        {selectedItem && (
          <MenuItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        )}
      </Modal>
    </div>
  );
}
