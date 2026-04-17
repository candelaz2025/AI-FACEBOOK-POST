import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Member,
  CartItem,
  MenuItem,
  MenuOption,
  CartItemOption,
  Notification,
  AppView,
} from '@/types';
import { liffService } from '@/services/liffService';
import { memberService, seedIfEmpty } from '@/services/dataService';

// ============================================================
// Cart helpers
// ============================================================
function calcItemTotal(basePrice: number, opts: CartItemOption[], qty: number): number {
  const optSum = opts.reduce((s, o) => s + o.priceDiff, 0);
  return (basePrice + optSum) * qty;
}

// ============================================================
// Context shape
// ============================================================
interface AppContextValue {
  // Auth / Member
  currentMember: Member | null;
  isAuthLoading: boolean;
  refreshMember: () => void;

  // View
  appView: AppView;
  setAppView: (v: AppView) => void;

  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (item: MenuItem, selectedOptions: CartItemOption[], qty: number, note?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQty: (cartItemId: string, qty: number) => void;
  clearCart: () => void;

  // Notifications
  notifications: Notification[];
  notify: (type: Notification['type'], message: string) => void;
  dismissNotification: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

// ============================================================
// Provider
// ============================================================
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [appView, setAppView] = useState<AppView>('customer');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const timerRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  // ---- Init ----
  useEffect(() => {
    seedIfEmpty();
    initAuth();
  }, []);

  async function initAuth() {
    try {
      await liffService.init();
      if (liffService.isLoggedIn()) {
        const profile = await liffService.getProfile();
        const member = memberService.createOrUpdate({
          lineUserId: profile.userId,
          displayName: profile.displayName,
          pictureUrl: profile.pictureUrl,
        });
        setCurrentMember(member);
      }
    } catch (err) {
      console.error('Auth init error:', err);
    } finally {
      setIsAuthLoading(false);
    }
  }

  const refreshMember = useCallback(() => {
    if (!currentMember) return;
    const updated = memberService.getById(currentMember.id);
    if (updated) setCurrentMember(updated);
  }, [currentMember]);

  // ---- Cart ----
  const addToCart = useCallback(
    (item: MenuItem, selectedOptions: CartItemOption[], qty: number, note?: string) => {
      const cartItemId = uuidv4();
      const newCartItem: CartItem = {
        cartItemId,
        menuItemId: item.id,
        name: item.name,
        basePrice: item.price,
        quantity: qty,
        selectedOptions,
        itemTotal: calcItemTotal(item.price, selectedOptions, qty),
        note,
      };
      setCartItems(prev => [...prev, newCartItem]);
    },
    []
  );

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prev => prev.filter(i => i.cartItemId !== cartItemId));
  }, []);

  const updateCartQty = useCallback((cartItemId: string, qty: number) => {
    setCartItems(prev =>
      prev.map(i =>
        i.cartItemId === cartItemId
          ? { ...i, quantity: qty, itemTotal: calcItemTotal(i.basePrice, i.selectedOptions, qty) }
          : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setCartItems([]), []);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);
  const cartTotal = cartItems.reduce((s, i) => s + i.itemTotal, 0);

  // ---- Notifications ----
  const notify = useCallback((type: Notification['type'], message: string) => {
    const id = uuidv4();
    const n: Notification = { id, type, message, createdAt: Date.now() };
    setNotifications(prev => [...prev, n]);

    const timer = setTimeout(() => {
      setNotifications(prev => prev.filter(x => x.id !== id));
      timerRef.current.delete(id);
    }, 3500);
    timerRef.current.set(id, timer);
  }, []);

  const dismissNotification = useCallback((id: string) => {
    const t = timerRef.current.get(id);
    if (t) { clearTimeout(t); timerRef.current.delete(id); }
    setNotifications(prev => prev.filter(x => x.id !== id));
  }, []);

  return (
    <AppContext.Provider
      value={{
        currentMember,
        isAuthLoading,
        refreshMember,
        appView,
        setAppView,
        cartItems,
        cartCount,
        cartTotal,
        addToCart,
        removeFromCart,
        updateCartQty,
        clearCart,
        notifications,
        notify,
        dismissNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

// Convenience
export function useCart() {
  const { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateCartQty, clearCart } = useApp();
  return { cartItems, cartCount, cartTotal, addToCart, removeFromCart, updateCartQty, clearCart };
}

export function useNotify() {
  const { notify } = useApp();
  return notify;
}
