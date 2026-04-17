/**
 * dataService.ts
 * Handles all CRUD operations using localStorage as the persistence layer.
 * In production, replace the localStorage calls with real API requests.
 */

import { v4 as uuidv4 } from 'uuid';
import {
  Member,
  MenuItem,
  MenuCategory,
  Order,
  OrderStatus,
  CartItem,
  MemberTier,
  Promotion,
} from '@/types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MENU_ITEMS,
  INITIAL_MEMBERS,
  INITIAL_ORDERS,
} from '@/data/mockData';

const KEYS = {
  categories:  'coffeeCRM_categories',
  menuItems:   'coffeeCRM_menuItems',
  members:     'coffeeCRM_members',
  orders:      'coffeeCRM_orders',
  orderSeq:    'coffeeCRM_orderSeq',
  queueSeq:    'coffeeCRM_queueSeq',
  promotions:  'coffeeCRM_promotions',
};

// ---- helpers ----
function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

function nextSeq(key: string, prefix: string, pad = 4): string {
  const n = (load<number>(key, 0) + 1);
  save(key, n);
  return `${prefix}${String(n).padStart(pad, '0')}`;
}

// ---- Seed / Init ----
export function seedIfEmpty(): void {
  if (!localStorage.getItem(KEYS.categories)) save(KEYS.categories, INITIAL_CATEGORIES);
  if (!localStorage.getItem(KEYS.menuItems))  save(KEYS.menuItems,  INITIAL_MENU_ITEMS);
  if (!localStorage.getItem(KEYS.members))    save(KEYS.members,    INITIAL_MEMBERS);
  if (!localStorage.getItem(KEYS.orders))     save(KEYS.orders,     INITIAL_ORDERS);
}

// ---- Tier Logic ----
function calcTier(totalSpent: number): MemberTier {
  if (totalSpent >= 50000) return 'platinum';
  if (totalSpent >= 20000) return 'gold';
  if (totalSpent >= 5000)  return 'silver';
  return 'bronze';
}

function tierDiscount(tier: MemberTier): number {
  const map: Record<MemberTier, number> = { bronze: 0, silver: 0.03, gold: 0.05, platinum: 0.10 };
  return map[tier];
}

// ============================================================
// Categories
// ============================================================
export const categoryService = {
  getAll: (): MenuCategory[] => load<MenuCategory[]>(KEYS.categories, []).sort((a, b) => a.order - b.order),

  upsert: (cat: Omit<MenuCategory, 'id'> & { id?: string }): MenuCategory => {
    const all = categoryService.getAll();
    const existing = all.find(c => c.id === cat.id);
    const updated: MenuCategory = existing
      ? { ...existing, ...cat, id: existing.id }
      : { ...cat, id: uuidv4() } as MenuCategory;
    const list = existing ? all.map(c => c.id === updated.id ? updated : c) : [...all, updated];
    save(KEYS.categories, list);
    return updated;
  },

  delete: (id: string): void => {
    const list = categoryService.getAll().filter(c => c.id !== id);
    save(KEYS.categories, list);
  },
};

// ============================================================
// Menu Items
// ============================================================
export const menuService = {
  getAll: (): MenuItem[] => load<MenuItem[]>(KEYS.menuItems, []),

  getByCategory: (categoryId: string): MenuItem[] =>
    menuService.getAll().filter(m => m.categoryId === categoryId),

  getById: (id: string): MenuItem | undefined =>
    menuService.getAll().find(m => m.id === id),

  create: (data: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem => {
    const item: MenuItem = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const all = menuService.getAll();
    save(KEYS.menuItems, [...all, item]);
    return item;
  },

  update: (id: string, data: Partial<MenuItem>): MenuItem => {
    const all = menuService.getAll();
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('ไม่พบเมนู');
    const updated = { ...all[idx], ...data, id, updatedAt: new Date().toISOString() };
    all[idx] = updated;
    save(KEYS.menuItems, all);
    return updated;
  },

  delete: (id: string): void => {
    save(KEYS.menuItems, menuService.getAll().filter(m => m.id !== id));
  },

  toggleAvailability: (id: string): MenuItem => {
    const item = menuService.getById(id);
    if (!item) throw new Error('ไม่พบเมนู');
    return menuService.update(id, { isAvailable: !item.isAvailable });
  },
};

// ============================================================
// Members
// ============================================================
export const memberService = {
  getAll: (): Member[] => load<Member[]>(KEYS.members, []),

  getById: (id: string): Member | undefined =>
    memberService.getAll().find(m => m.id === id),

  getByLineUserId: (lineUserId: string): Member | undefined =>
    memberService.getAll().find(m => m.lineUserId === lineUserId),

  createOrUpdate: (data: { lineUserId: string; displayName: string; pictureUrl?: string }): Member => {
    const all = memberService.getAll();
    const existing = all.find(m => m.lineUserId === data.lineUserId);
    if (existing) {
      const updated: Member = {
        ...existing,
        displayName: data.displayName,
        pictureUrl: data.pictureUrl,
        lastVisit: new Date().toISOString(),
      };
      save(KEYS.members, all.map(m => m.id === updated.id ? updated : m));
      return updated;
    }
    const newMember: Member = {
      id: uuidv4(),
      lineUserId: data.lineUserId,
      displayName: data.displayName,
      pictureUrl: data.pictureUrl,
      points: 0,
      tier: 'bronze',
      totalSpent: 0,
      joinDate: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      orderCount: 0,
      isActive: true,
    };
    save(KEYS.members, [...all, newMember]);
    return newMember;
  },

  update: (id: string, data: Partial<Member>): Member => {
    const all = memberService.getAll();
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) throw new Error('ไม่พบสมาชิก');
    const updated = { ...all[idx], ...data };
    all[idx] = updated;
    save(KEYS.members, all);
    return updated;
  },

  addPoints: (id: string, points: number): Member => {
    const member = memberService.getById(id);
    if (!member) throw new Error('ไม่พบสมาชิก');
    const newPoints = member.points + points;
    const newTier = calcTier(member.totalSpent);
    return memberService.update(id, { points: newPoints, tier: newTier });
  },

  usePoints: (id: string, points: number): Member => {
    const member = memberService.getById(id);
    if (!member) throw new Error('ไม่พบสมาชิก');
    if (member.points < points) throw new Error('แต้มไม่เพียงพอ');
    return memberService.update(id, { points: member.points - points });
  },

  getTierDiscount: (tier: MemberTier): number => tierDiscount(tier),

  getStats: () => {
    const members = memberService.getAll();
    const tiers = { bronze: 0, silver: 0, gold: 0, platinum: 0 };
    members.forEach(m => { tiers[m.tier]++; });
    const now = Date.now();
    const thisMonth = members.filter(m => {
      const joinMs = new Date(m.joinDate).getTime();
      return now - joinMs < 30 * 24 * 3600 * 1000;
    }).length;
    return { total: members.length, tiers, newThisMonth: thisMonth };
  },
};

// ============================================================
// Orders
// ============================================================
export const orderService = {
  getAll: (): Order[] =>
    load<Order[]>(KEYS.orders, []).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ),

  getById: (id: string): Order | undefined =>
    orderService.getAll().find(o => o.id === id),

  getByMember: (memberId: string): Order[] =>
    orderService.getAll().filter(o => o.memberId === memberId),

  getActive: (): Order[] =>
    orderService.getAll().filter(o =>
      ['pending', 'confirmed', 'preparing', 'ready'].includes(o.status)
    ),

  create: (params: {
    memberId: string;
    memberName: string;
    memberPhone?: string;
    items: CartItem[];
    pointsUsed?: number;
    paymentMethod: Order['paymentMethod'];
    note?: string;
    memberTier: MemberTier;
  }): Order => {
    const subtotal = params.items.reduce((s, i) => s + i.itemTotal, 0);
    const member = memberService.getById(params.memberId);
    const discount = member ? subtotal * tierDiscount(params.memberTier) : 0;
    const pointsDiscount = (params.pointsUsed || 0) * 0.1; // 1 point = 0.10 THB
    const total = Math.max(0, subtotal - discount - pointsDiscount);
    const pointsEarned = Math.floor(total / 10); // 1 point per 10 THB

    const order: Order = {
      id: uuidv4(),
      orderNumber: nextSeq(KEYS.orderSeq, 'ORD-'),
      memberId: params.memberId,
      memberName: params.memberName,
      memberPhone: params.memberPhone,
      items: params.items,
      subtotal,
      discountAmount: discount,
      discountNote: discount > 0 ? `สมาชิก ${params.memberTier} ลด ${(discount / subtotal * 100).toFixed(0)}%` : undefined,
      total,
      pointsEarned,
      pointsUsed: params.pointsUsed || 0,
      pointsDiscount,
      status: 'pending',
      paymentMethod: params.paymentMethod,
      isPaid: params.paymentMethod !== 'cash',
      note: params.note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedMinutes: 10,
      queueNumber: load<number>(KEYS.queueSeq, 0) + 1,
    };

    save(KEYS.queueSeq, order.queueNumber!);

    const all = orderService.getAll();
    save(KEYS.orders, [order, ...all]);

    // Update member stats
    if (member) {
      memberService.update(params.memberId, {
        totalSpent: member.totalSpent + total,
        orderCount: member.orderCount + 1,
        lastVisit: new Date().toISOString(),
        tier: calcTier(member.totalSpent + total),
        points: member.points + pointsEarned - (params.pointsUsed || 0),
      });
    }

    return order;
  },

  updateStatus: (id: string, status: OrderStatus): Order => {
    const all = load<Order[]>(KEYS.orders, []);
    const idx = all.findIndex(o => o.id === id);
    if (idx === -1) throw new Error('ไม่พบออเดอร์');
    all[idx] = {
      ...all[idx],
      status,
      updatedAt: new Date().toISOString(),
      completedAt: status === 'completed' ? new Date().toISOString() : all[idx].completedAt,
    };
    save(KEYS.orders, all);
    return all[idx];
  },

  getStats: (days = 7) => {
    const orders = orderService.getAll();
    const cutoff = Date.now() - days * 24 * 3600 * 1000;
    const recent = orders.filter(o => new Date(o.createdAt).getTime() > cutoff && o.status !== 'cancelled');
    const revenue = recent.reduce((s, o) => s + o.total, 0);
    return {
      totalOrders: recent.length,
      totalRevenue: revenue,
      avgOrderValue: recent.length ? revenue / recent.length : 0,
      pendingOrders: orders.filter(o => ['pending', 'confirmed', 'preparing'].includes(o.status)).length,
    };
  },

  getDailyRevenue: (days = 7) => {
    const orders = orderService.getAll().filter(o => o.status !== 'cancelled');
    const result: { date: string; revenue: number; orders: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      const dayOrders = orders.filter(o => o.createdAt.slice(0, 10) === key);
      result.push({
        date: d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
        revenue: dayOrders.reduce((s, o) => s + o.total, 0),
        orders: dayOrders.length,
      });
    }
    return result;
  },
};

// ============================================================
// Promotions
// ============================================================
const INITIAL_PROMOTIONS: Promotion[] = [
  {
    id: 'promo-1',
    name: 'ลด 15% วันเกิด',
    description: 'ส่วนลดพิเศษสำหรับสมาชิกในเดือนเกิด',
    discountType: 'percent',
    discountValue: 15,
    minOrderAmount: 100,
    maxDiscount: 50,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    isActive: true,
    usageCount: 12,
    maxUsage: 100,
  },
  {
    id: 'promo-2',
    name: 'Happy Hour ลด 20 บาท',
    description: 'ทุกวันจันทร์–ศุกร์ เวลา 14:00–16:00',
    discountType: 'baht',
    discountValue: 20,
    minOrderAmount: 80,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    isActive: true,
    usageCount: 45,
  },
  {
    id: 'promo-3',
    name: 'สมาชิกใหม่ลด 30 บาท',
    description: 'สำหรับสมาชิกใหม่ที่เพิ่งสมัคร (ใช้ได้ครั้งแรกเท่านั้น)',
    discountType: 'baht',
    discountValue: 30,
    minOrderAmount: 80,
    startDate: new Date().toISOString().slice(0, 10),
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10),
    isActive: true,
    usageCount: 28,
    maxUsage: 1000,
  },
];

export const promotionService = {
  getAll: (): Promotion[] => {
    const raw = localStorage.getItem(KEYS.promotions);
    return raw ? JSON.parse(raw) : INITIAL_PROMOTIONS;
  },

  getActive: (): Promotion[] => {
    const now = new Date().toISOString().slice(0, 10);
    return promotionService.getAll().filter(p =>
      p.isActive && p.startDate <= now && p.endDate >= now &&
      (!p.maxUsage || p.usageCount < p.maxUsage)
    );
  },

  getById: (id: string): Promotion | undefined =>
    promotionService.getAll().find(p => p.id === id),

  create: (data: Omit<Promotion, 'id' | 'usageCount'>): Promotion => {
    const promo: Promotion = { ...data, id: uuidv4(), usageCount: 0 };
    const all = promotionService.getAll();
    save(KEYS.promotions, [...all, promo]);
    return promo;
  },

  update: (id: string, data: Partial<Promotion>): Promotion => {
    const all = promotionService.getAll();
    const idx = all.findIndex(p => p.id === id);
    if (idx === -1) throw new Error('ไม่พบโปรโมชั่น');
    all[idx] = { ...all[idx], ...data };
    save(KEYS.promotions, all);
    return all[idx];
  },

  delete: (id: string): void => {
    save(KEYS.promotions, promotionService.getAll().filter(p => p.id !== id));
  },

  toggleActive: (id: string): Promotion => {
    const p = promotionService.getById(id);
    if (!p) throw new Error('ไม่พบโปรโมชั่น');
    return promotionService.update(id, { isActive: !p.isActive });
  },

  incrementUsage: (id: string): void => {
    const p = promotionService.getById(id);
    if (p) promotionService.update(id, { usageCount: p.usageCount + 1 });
  },
};
