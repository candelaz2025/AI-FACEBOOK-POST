// ============================================================
// Member / Customer Types
// ============================================================
export type MemberTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Member {
  id: string;
  lineUserId: string;
  displayName: string;
  pictureUrl?: string;
  phone?: string;
  email?: string;
  points: number;
  tier: MemberTier;
  totalSpent: number;
  joinDate: string;        // ISO string
  lastVisit: string;       // ISO string
  orderCount: number;
  birthday?: string;       // MM-DD
  notes?: string;
  isActive: boolean;
}

// ============================================================
// Menu Types
// ============================================================
export interface MenuCategory {
  id: string;
  name: string;
  nameEn: string;
  emoji: string;
  order: number;
  isActive: boolean;
}

export interface MenuOptionChoice {
  label: string;
  priceDiff: number;       // positive = add cost, negative = discount
}

export interface MenuOption {
  id: string;
  name: string;            // e.g. "ความหวาน", "ขนาด"
  required: boolean;
  choices: MenuOptionChoice[];
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  nameEn?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  isAvailable: boolean;
  options: MenuOption[];
  tags: string[];           // e.g. ["ขายดี", "ใหม่", "แนะนำ"]
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// Order / Cart Types
// ============================================================
export interface CartItemOption {
  optionId: string;
  optionName: string;
  choiceLabel: string;
  priceDiff: number;
}

export interface CartItem {
  cartItemId: string;       // unique per cart line
  menuItemId: string;
  name: string;
  basePrice: number;
  quantity: number;
  selectedOptions: CartItemOption[];
  itemTotal: number;        // (basePrice + sum(priceDiff)) * quantity
  note?: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'promptpay' | 'linepay' | 'creditcard';

export interface Order {
  id: string;
  orderNumber: string;      // e.g. "ORD-0001"
  memberId: string;
  memberName: string;
  memberPhone?: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discountNote?: string;
  total: number;
  pointsEarned: number;
  pointsUsed: number;
  pointsDiscount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  note?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  estimatedMinutes?: number;
  queueNumber?: number;
}

// ============================================================
// Promotion / Coupon Types
// ============================================================
export type DiscountType = 'percent' | 'baht' | 'free_item';

export interface Promotion {
  id: string;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;    // percent or baht amount
  minOrderAmount?: number;
  maxDiscount?: number;     // cap for percent discounts
  requiredTier?: MemberTier;
  requiredPoints?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
}

// ============================================================
// Report / Analytics Types
// ============================================================
export interface DailySummary {
  date: string;             // YYYY-MM-DD
  revenue: number;
  orderCount: number;
  newMembers: number;
  avgOrderValue: number;
  topItems: { name: string; count: number }[];
}

export interface ReportPeriod {
  startDate: string;
  endDate: string;
}

// ============================================================
// App State Types
// ============================================================
export type AppView = 'customer' | 'admin';

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  createdAt: number;
}

// ============================================================
// LIFF Types (augments window)
// ============================================================
export interface LiffProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
}
