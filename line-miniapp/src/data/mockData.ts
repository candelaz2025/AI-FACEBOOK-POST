import { MenuCategory, MenuItem, Member, Order } from '@/types';

// ============================================================
// Menu Categories
// ============================================================
export const INITIAL_CATEGORIES: MenuCategory[] = [
  { id: 'cat-1', name: 'กาแฟร้อน', nameEn: 'Hot Coffee', emoji: '☕', order: 1, isActive: true },
  { id: 'cat-2', name: 'กาแฟเย็น', nameEn: 'Iced Coffee', emoji: '🧊', order: 2, isActive: true },
  { id: 'cat-3', name: 'เครื่องดื่มปั่น', nameEn: 'Blended', emoji: '🥤', order: 3, isActive: true },
  { id: 'cat-4', name: 'ชา & เฮิร์บ', nameEn: 'Tea & Herb', emoji: '🍵', order: 4, isActive: true },
  { id: 'cat-5', name: 'เบเกอรี่', nameEn: 'Bakery', emoji: '🥐', order: 5, isActive: true },
  { id: 'cat-6', name: 'เครื่องดื่มอื่นๆ', nameEn: 'Others', emoji: '🧃', order: 6, isActive: true },
];

// ============================================================
// Menu Items
// ============================================================
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // Hot Coffee
  {
    id: 'item-1',
    categoryId: 'cat-1',
    name: 'เอสเปรสโซ่',
    nameEn: 'Espresso',
    description: 'กาแฟเข้มข้นแบบดั้งเดิม หอมกลิ่นถั่ว',
    price: 55,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'Single', priceDiff: 0 },
          { label: 'Double', priceDiff: 15 },
        ],
      },
    ],
    tags: ['แนะนำ'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-2',
    categoryId: 'cat-1',
    name: 'อเมริกาโน่ร้อน',
    nameEn: 'Hot Americano',
    description: 'เอสเปรสโซ่ผสมน้ำร้อน รสชาติกลมกล่อม',
    price: 65,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'S (8oz)', priceDiff: 0 },
          { label: 'M (12oz)', priceDiff: 10 },
          { label: 'L (16oz)', priceDiff: 20 },
        ],
      },
      {
        id: 'opt-sweet',
        name: 'ความหวาน',
        required: false,
        choices: [
          { label: 'ไม่หวาน', priceDiff: 0 },
          { label: 'หวานน้อย', priceDiff: 0 },
          { label: 'หวานปกติ', priceDiff: 0 },
          { label: 'หวานมาก', priceDiff: 0 },
        ],
      },
    ],
    tags: ['ขายดี'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-3',
    categoryId: 'cat-1',
    name: 'ลาเต้ร้อน',
    nameEn: 'Hot Latte',
    description: 'เอสเปรสโซ่ผสมนมสด ฟองนมนุ่มละมุน',
    price: 75,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'S (8oz)', priceDiff: 0 },
          { label: 'M (12oz)', priceDiff: 10 },
          { label: 'L (16oz)', priceDiff: 20 },
        ],
      },
      {
        id: 'opt-milk',
        name: 'นม',
        required: false,
        choices: [
          { label: 'นมสด', priceDiff: 0 },
          { label: 'นมอัลมอนด์', priceDiff: 15 },
          { label: 'นมโอ๊ต', priceDiff: 15 },
          { label: 'นมถั่วเหลือง', priceDiff: 10 },
        ],
      },
    ],
    tags: ['ขายดี', 'แนะนำ'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-4',
    categoryId: 'cat-1',
    name: 'คาปูชิโน่',
    nameEn: 'Cappuccino',
    description: 'เอสเปรสโซ่ นมสด ฟองนมหนา อัตราส่วน 1:1:1',
    price: 75,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'S', priceDiff: 0 },
          { label: 'M', priceDiff: 10 },
        ],
      },
    ],
    tags: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Iced Coffee
  {
    id: 'item-5',
    categoryId: 'cat-2',
    name: 'อเมริกาโน่เย็น',
    nameEn: 'Iced Americano',
    description: 'เอสเปรสโซ่ผสมน้ำเย็น ดับกระหายได้ดี',
    price: 65,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'M (16oz)', priceDiff: 0 },
          { label: 'L (22oz)', priceDiff: 15 },
        ],
      },
      {
        id: 'opt-sweet',
        name: 'ความหวาน',
        required: false,
        choices: [
          { label: 'ไม่หวาน', priceDiff: 0 },
          { label: 'หวานน้อย', priceDiff: 0 },
          { label: 'หวานปกติ', priceDiff: 0 },
          { label: 'หวานมาก', priceDiff: 0 },
        ],
      },
    ],
    tags: ['ขายดี'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-6',
    categoryId: 'cat-2',
    name: 'ลาเต้เย็น',
    nameEn: 'Iced Latte',
    description: 'กาแฟผสมนมสด เย็นชื่นใจ',
    price: 80,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'M', priceDiff: 0 },
          { label: 'L', priceDiff: 15 },
        ],
      },
      {
        id: 'opt-milk',
        name: 'นม',
        required: false,
        choices: [
          { label: 'นมสด', priceDiff: 0 },
          { label: 'นมอัลมอนด์', priceDiff: 15 },
          { label: 'นมโอ๊ต', priceDiff: 15 },
        ],
      },
    ],
    tags: ['ขายดี', 'แนะนำ'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-7',
    categoryId: 'cat-2',
    name: 'โคลด์บรู',
    nameEn: 'Cold Brew',
    description: 'กาแฟแช่เย็น 12 ชั่วโมง รสชาติเข้มข้นนุ่มนวล',
    price: 90,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'M', priceDiff: 0 },
          { label: 'L', priceDiff: 20 },
        ],
      },
    ],
    tags: ['ใหม่', 'แนะนำ'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Blended
  {
    id: 'item-8',
    categoryId: 'cat-3',
    name: 'ฟราปเป้กาแฟ',
    nameEn: 'Coffee Frappe',
    description: 'กาแฟปั่นเย็น นุ่มละมุน เต็มอิ่ม',
    price: 95,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'M (16oz)', priceDiff: 0 },
          { label: 'L (22oz)', priceDiff: 20 },
        ],
      },
      {
        id: 'opt-cream',
        name: 'วิปครีม',
        required: false,
        choices: [
          { label: 'ใส่วิปครีม', priceDiff: 15 },
          { label: 'ไม่ใส่วิปครีม', priceDiff: 0 },
        ],
      },
    ],
    tags: ['ขายดี'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-9',
    categoryId: 'cat-3',
    name: 'ช็อคโกแลตปั่น',
    nameEn: 'Chocolate Frappe',
    description: 'ช็อคโกแลตปั่นเย็น เข้มข้น หอมหวาน',
    price: 95,
    isAvailable: true,
    options: [
      {
        id: 'opt-size',
        name: 'ขนาด',
        required: true,
        choices: [
          { label: 'M', priceDiff: 0 },
          { label: 'L', priceDiff: 20 },
        ],
      },
      {
        id: 'opt-cream',
        name: 'วิปครีม',
        required: false,
        choices: [
          { label: 'ใส่วิปครีม', priceDiff: 15 },
          { label: 'ไม่ใส่วิปครีม', priceDiff: 0 },
        ],
      },
    ],
    tags: [],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Tea
  {
    id: 'item-10',
    categoryId: 'cat-4',
    name: 'ชาไทยนมสด',
    nameEn: 'Thai Tea Latte',
    description: 'ชาไทยแท้ผสมนมสด รสหวานหอม',
    price: 70,
    isAvailable: true,
    options: [
      {
        id: 'opt-temp',
        name: 'อุณหภูมิ',
        required: true,
        choices: [
          { label: 'ร้อน', priceDiff: 0 },
          { label: 'เย็น', priceDiff: 0 },
          { label: 'ปั่น', priceDiff: 10 },
        ],
      },
    ],
    tags: ['ขายดี'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-11',
    categoryId: 'cat-4',
    name: 'มัทฉะลาเต้',
    nameEn: 'Matcha Latte',
    description: 'มัทฉะญี่ปุ่นแท้ผสมนม รสชาติเข้มข้น',
    price: 85,
    isAvailable: true,
    options: [
      {
        id: 'opt-temp',
        name: 'อุณหภูมิ',
        required: true,
        choices: [
          { label: 'ร้อน', priceDiff: 0 },
          { label: 'เย็น', priceDiff: 0 },
        ],
      },
      {
        id: 'opt-milk',
        name: 'นม',
        required: false,
        choices: [
          { label: 'นมสด', priceDiff: 0 },
          { label: 'นมโอ๊ต', priceDiff: 15 },
        ],
      },
    ],
    tags: ['ใหม่'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  // Bakery
  {
    id: 'item-12',
    categoryId: 'cat-5',
    name: 'ครัวซองต์เนย',
    nameEn: 'Butter Croissant',
    description: 'ครัวซองต์ฝรั่งเศส เกล็ดหอม นุ่มอร่อย',
    price: 65,
    isAvailable: true,
    options: [
      {
        id: 'opt-heat',
        name: 'อุ่นร้อน',
        required: false,
        choices: [
          { label: 'อุ่นร้อน', priceDiff: 0 },
          { label: 'ไม่อุ่น', priceDiff: 0 },
        ],
      },
    ],
    tags: ['แนะนำ'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'item-13',
    categoryId: 'cat-5',
    name: 'ชีสเค้ก',
    nameEn: 'Cheesecake',
    description: 'ชีสเค้กญี่ปุ่นนุ่มละมุน หอมชีส',
    price: 85,
    isAvailable: true,
    options: [],
    tags: ['ขายดี'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
];

// ============================================================
// Mock Members
// ============================================================
export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem-1',
    lineUserId: 'Uxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    displayName: 'สมชาย ใจดี',
    phone: '081-234-5678',
    points: 1250,
    tier: 'silver',
    totalSpent: 12500,
    joinDate: '2024-01-15T10:00:00Z',
    lastVisit: '2024-12-20T09:30:00Z',
    orderCount: 48,
    isActive: true,
  },
  {
    id: 'mem-2',
    lineUserId: 'Uyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy',
    displayName: 'สมหญิง รักกาแฟ',
    phone: '089-876-5432',
    points: 3800,
    tier: 'gold',
    totalSpent: 38000,
    joinDate: '2023-08-01T10:00:00Z',
    lastVisit: '2024-12-21T08:00:00Z',
    orderCount: 142,
    isActive: true,
  },
  {
    id: 'mem-3',
    lineUserId: 'Uzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz',
    displayName: 'วิชัย มีสุข',
    phone: '092-111-2222',
    points: 450,
    tier: 'bronze',
    totalSpent: 4500,
    joinDate: '2024-10-01T10:00:00Z',
    lastVisit: '2024-12-18T14:30:00Z',
    orderCount: 18,
    isActive: true,
  },
  {
    id: 'mem-4',
    lineUserId: 'Uaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    displayName: 'นิดา สวยงาม',
    phone: '095-333-4444',
    points: 7200,
    tier: 'platinum',
    totalSpent: 72000,
    joinDate: '2023-01-10T10:00:00Z',
    lastVisit: '2024-12-22T11:00:00Z',
    orderCount: 280,
    isActive: true,
  },
  {
    id: 'mem-5',
    lineUserId: 'Ubbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
    displayName: 'ประยุทธ์ ดีเลิศ',
    phone: '088-555-6666',
    points: 120,
    tier: 'bronze',
    totalSpent: 1200,
    joinDate: '2024-11-15T10:00:00Z',
    lastVisit: '2024-12-10T16:00:00Z',
    orderCount: 5,
    isActive: true,
  },
];

// ============================================================
// Mock Orders
// ============================================================
const today = new Date();
const formatDate = (d: Date) => d.toISOString();
const daysAgo = (n: number) => {
  const d = new Date(today);
  d.setDate(d.getDate() - n);
  return d;
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-0001',
    memberId: 'mem-2',
    memberName: 'สมหญิง รักกาแฟ',
    memberPhone: '089-876-5432',
    items: [
      {
        cartItemId: 'ci-1',
        menuItemId: 'item-6',
        name: 'ลาเต้เย็น',
        basePrice: 80,
        quantity: 1,
        selectedOptions: [
          { optionId: 'opt-size', optionName: 'ขนาด', choiceLabel: 'L', priceDiff: 15 },
          { optionId: 'opt-milk', optionName: 'นม', choiceLabel: 'นมโอ๊ต', priceDiff: 15 },
        ],
        itemTotal: 110,
      },
      {
        cartItemId: 'ci-2',
        menuItemId: 'item-12',
        name: 'ครัวซองต์เนย',
        basePrice: 65,
        quantity: 1,
        selectedOptions: [],
        itemTotal: 65,
      },
    ],
    subtotal: 175,
    discountAmount: 0,
    total: 175,
    pointsEarned: 17,
    pointsUsed: 0,
    pointsDiscount: 0,
    status: 'completed',
    paymentMethod: 'promptpay',
    isPaid: true,
    createdAt: formatDate(daysAgo(0)),
    updatedAt: formatDate(daysAgo(0)),
    completedAt: formatDate(daysAgo(0)),
    estimatedMinutes: 5,
    queueNumber: 12,
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-0002',
    memberId: 'mem-1',
    memberName: 'สมชาย ใจดี',
    memberPhone: '081-234-5678',
    items: [
      {
        cartItemId: 'ci-3',
        menuItemId: 'item-5',
        name: 'อเมริกาโน่เย็น',
        basePrice: 65,
        quantity: 2,
        selectedOptions: [
          { optionId: 'opt-size', optionName: 'ขนาด', choiceLabel: 'M (16oz)', priceDiff: 0 },
          { optionId: 'opt-sweet', optionName: 'ความหวาน', choiceLabel: 'ไม่หวาน', priceDiff: 0 },
        ],
        itemTotal: 130,
      },
    ],
    subtotal: 130,
    discountAmount: 0,
    total: 130,
    pointsEarned: 13,
    pointsUsed: 0,
    pointsDiscount: 0,
    status: 'preparing',
    paymentMethod: 'cash',
    isPaid: true,
    createdAt: formatDate(new Date()),
    updatedAt: formatDate(new Date()),
    estimatedMinutes: 7,
    queueNumber: 13,
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-0003',
    memberId: 'mem-4',
    memberName: 'นิดา สวยงาม',
    memberPhone: '095-333-4444',
    items: [
      {
        cartItemId: 'ci-4',
        menuItemId: 'item-8',
        name: 'ฟราปเป้กาแฟ',
        basePrice: 95,
        quantity: 1,
        selectedOptions: [
          { optionId: 'opt-size', optionName: 'ขนาด', choiceLabel: 'L (22oz)', priceDiff: 20 },
          { optionId: 'opt-cream', optionName: 'วิปครีม', choiceLabel: 'ใส่วิปครีม', priceDiff: 15 },
        ],
        itemTotal: 130,
      },
      {
        cartItemId: 'ci-5',
        menuItemId: 'item-13',
        name: 'ชีสเค้ก',
        basePrice: 85,
        quantity: 1,
        selectedOptions: [],
        itemTotal: 85,
      },
    ],
    subtotal: 215,
    discountAmount: 21,
    discountNote: 'สมาชิก Platinum ลด 10%',
    total: 194,
    pointsEarned: 19,
    pointsUsed: 0,
    pointsDiscount: 0,
    status: 'pending',
    paymentMethod: 'linepay',
    isPaid: false,
    createdAt: formatDate(new Date()),
    updatedAt: formatDate(new Date()),
    estimatedMinutes: 10,
    queueNumber: 14,
  },
];

// Sales data for charts (last 7 days)
export const MOCK_DAILY_SALES = Array.from({ length: 7 }, (_, i) => {
  const d = daysAgo(6 - i);
  const dayLabel = d.toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' });
  return {
    date: dayLabel,
    revenue: Math.floor(Math.random() * 8000) + 3000,
    orders: Math.floor(Math.random() * 40) + 15,
  };
});

export const MOCK_MONTHLY_SALES = Array.from({ length: 12 }, (_, i) => {
  const month = new Date(2024, i, 1).toLocaleDateString('th-TH', { month: 'short' });
  return {
    month,
    revenue: Math.floor(Math.random() * 150000) + 80000,
    orders: Math.floor(Math.random() * 600) + 300,
  };
});

export const MOCK_TOP_PRODUCTS = [
  { name: 'ลาเต้เย็น', count: 284, revenue: 22720 },
  { name: 'อเมริกาโน่เย็น', count: 231, revenue: 15015 },
  { name: 'ฟราปเป้กาแฟ', count: 198, revenue: 18810 },
  { name: 'ลาเต้ร้อน', count: 176, revenue: 13200 },
  { name: 'ชาไทยนมสด', count: 163, revenue: 11410 },
];
