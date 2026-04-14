import React, { useState, useCallback } from 'react';
import { MenuItem, MenuCategory } from '@/types';
import { menuService, categoryService } from '@/services/dataService';
import { Modal } from '@/components/shared/Modal';
import { TagBadge } from '@/components/shared/Badge';
import { useNotify } from '@/contexts/AppContext';

// ============================================================
// Menu Item Form
// ============================================================
function MenuItemForm({
  initial,
  categories,
  onSave,
  onCancel,
}: {
  initial?: MenuItem;
  categories: MenuCategory[];
  onSave: (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? '');
  const [nameEn, setNameEn] = useState(initial?.nameEn ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [price, setPrice] = useState<number>(initial?.price ?? 0);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? '');
  const [isAvailable, setIsAvailable] = useState(initial?.isAvailable ?? true);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);

  const PRESET_TAGS = ['ขายดี', 'ใหม่', 'แนะนำ'];

  const addTag = (t: string) => {
    if (t && !tags.includes(t)) setTags(prev => [...prev, t]);
    setTagInput('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price) return;
    onSave({
      name: name.trim(),
      nameEn: nameEn.trim() || undefined,
      description: description.trim() || undefined,
      price,
      categoryId,
      isAvailable,
      options: initial?.options ?? [],
      tags,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-8">
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">ชื่อเมนู *</label>
        <input
          required
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          placeholder="เช่น ลาเต้ร้อน"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">ชื่อภาษาอังกฤษ</label>
        <input
          value={nameEn}
          onChange={e => setNameEn(e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
          placeholder="e.g. Hot Latte"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">คำอธิบาย</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 resize-none"
          placeholder="อธิบายเมนูสั้นๆ"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ราคา (บาท) *</label>
          <input
            required
            type="number"
            min={1}
            value={price || ''}
            onChange={e => setPrice(Number(e.target.value))}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400"
            placeholder="0"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">หมวดหมู่ *</label>
          <select
            value={categoryId}
            onChange={e => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 bg-white"
          >
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="text-xs font-semibold text-gray-600 block mb-1">แท็ก</label>
        <div className="flex gap-2 mb-2 flex-wrap">
          {PRESET_TAGS.map(t => (
            <button
              key={t}
              type="button"
              onClick={() => addTag(t)}
              disabled={tags.includes(t)}
              className={`text-xs px-3 py-1 rounded-full border transition ${
                tags.includes(t)
                  ? 'bg-coffee-100 text-coffee-700 border-coffee-300'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-coffee-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        {tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-2">
            {tags.map(t => (
              <span key={t} className="inline-flex items-center gap-1 text-xs bg-coffee-100 text-coffee-700 px-2 py-0.5 rounded-full">
                {t}
                <button type="button" onClick={() => setTags(prev => prev.filter(x => x !== t))} className="hover:text-red-500">×</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Availability toggle */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsAvailable(p => !p)}
          className={`relative w-11 h-6 rounded-full transition-colors ${isAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
        >
          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${isAvailable ? 'left-5' : 'left-0.5'}`} />
        </button>
        <span className="text-sm text-gray-700">{isAvailable ? 'มีจำหน่าย' : 'หมด / ปิดชั่วคราว'}</span>
      </div>

      {/* Actions */}
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
          {initial ? 'บันทึก' : 'เพิ่มเมนู'}
        </button>
      </div>
    </form>
  );
}

// ============================================================
// Menu Management Page
// ============================================================
export default function MenuManagementPage() {
  const notify = useNotify();
  const [categories] = useState<MenuCategory[]>(() => categoryService.getAll());
  const [items, setItems] = useState<MenuItem[]>(() => menuService.getAll());
  const [activeCatId, setActiveCatId] = useState<string>(categories[0]?.id ?? '');
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshItems = () => setItems(menuService.getAll());

  const filteredItems = items.filter(i => {
    const matchCat = i.categoryId === activeCatId;
    const matchSearch = !searchQuery || i.name.includes(searchQuery);
    return searchQuery ? matchSearch : matchCat;
  });

  const handleSave = useCallback((data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editItem) {
      menuService.update(editItem.id, data);
      notify('success', 'แก้ไขเมนูสำเร็จ');
    } else {
      menuService.create(data);
      notify('success', 'เพิ่มเมนูใหม่สำเร็จ');
    }
    refreshItems();
    setShowForm(false);
    setEditItem(undefined);
  }, [editItem, notify]);

  const handleDelete = useCallback((item: MenuItem) => {
    if (!confirm(`ลบ "${item.name}" ออกจากเมนู?`)) return;
    menuService.delete(item.id);
    refreshItems();
    notify('success', `ลบ ${item.name} แล้ว`);
  }, [notify]);

  const handleToggle = useCallback((item: MenuItem) => {
    menuService.toggleAvailability(item.id);
    refreshItems();
    notify('info', `${item.name}: ${item.isAvailable ? 'ปิด' : 'เปิด'}จำหน่ายแล้ว`);
  }, [notify]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">จัดการเมนู</h1>
        <button
          onClick={() => { setEditItem(undefined); setShowForm(true); }}
          className="bg-coffee-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-coffee-800 transition"
        >
          + เพิ่มเมนู
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="ค้นหาเมนู..."
        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-coffee-400 bg-white"
      />

      {/* Category tabs */}
      {!searchQuery && (
        <div className="flex overflow-x-auto gap-2 pb-1">
          {categories.map(cat => {
            const count = items.filter(i => i.categoryId === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCatId(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition whitespace-nowrap ${
                  activeCatId === cat.id
                    ? 'bg-coffee-700 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-coffee-300'
                }`}
              >
                {cat.emoji} {cat.name}
                <span className={`text-xs ${activeCatId === cat.id ? 'text-white/70' : 'text-gray-400'}`}>({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Summary */}
      <p className="text-sm text-gray-500">
        {searchQuery ? `ค้นหา "${searchQuery}": ` : ''}
        {filteredItems.length} รายการ
        {' '}({filteredItems.filter(i => !i.isAvailable).length} หมด)
      </p>

      {/* Items grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <span className="text-5xl block mb-3">🍵</span>
          <p>ไม่มีเมนูในหมวดนี้</p>
          <button
            onClick={() => { setEditItem(undefined); setShowForm(true); }}
            className="mt-4 text-coffee-700 font-medium text-sm hover:underline"
          >
            + เพิ่มเมนูแรก
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${item.isAvailable ? 'border-gray-100' : 'border-red-100 opacity-70'}`}
            >
              <div className="h-28 bg-gradient-to-br from-coffee-100 to-cream-200 flex items-center justify-center relative">
                <span className="text-4xl">☕</span>
                {!item.isAvailable && (
                  <div className="absolute inset-0 bg-gray-500/30 flex items-center justify-center">
                    <span className="text-xs font-bold bg-red-500 text-white px-2 py-0.5 rounded">หมด</span>
                  </div>
                )}
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between gap-1 mb-1">
                  <p className="font-bold text-gray-900 text-sm leading-tight">{item.name}</p>
                  <div className="flex gap-1 flex-wrap justify-end">
                    {item.tags.map(t => <TagBadge key={t} tag={t} />)}
                  </div>
                </div>
                {item.description && (
                  <p className="text-xs text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-coffee-700">฿{item.price}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(item)}
                      className={`text-xs px-2 py-1 rounded-lg font-medium transition ${
                        item.isAvailable
                          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-700'
                          : 'bg-red-100 text-red-700 hover:bg-green-100 hover:text-green-700'
                      }`}
                    >
                      {item.isAvailable ? 'เปิด' : 'ปิด'}
                    </button>
                    <button
                      onClick={() => { setEditItem(item); setShowForm(true); }}
                      className="text-xs px-2 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="text-xs px-2 py-1 rounded-lg bg-red-50 text-red-700 font-medium hover:bg-red-100 transition"
                    >
                      ลบ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      <Modal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditItem(undefined); }}
        title={editItem ? `แก้ไข: ${editItem.name}` : 'เพิ่มเมนูใหม่'}
        size="md"
      >
        <MenuItemForm
          initial={editItem}
          categories={categories}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditItem(undefined); }}
        />
      </Modal>
    </div>
  );
}
