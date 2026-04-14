import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useCart } from '@/contexts/AppContext';

interface NavItem {
  to: string;
  label: string;
  icon: string;
  activeIcon: string;
}

const navItems: NavItem[] = [
  { to: '/',        label: 'เมนู',    icon: '🍵', activeIcon: '☕' },
  { to: '/cart',    label: 'ตะกร้า', icon: '🛒', activeIcon: '🛍️' },
  { to: '/orders',  label: 'ออเดอร์', icon: '📋', activeIcon: '📦' },
  { to: '/profile', label: 'โปรไฟล์', icon: '👤', activeIcon: '🧑' },
];

export function CustomerLayout({ children }: { children: React.ReactNode }) {
  const { cartCount } = useCart();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-coffee-50 flex flex-col pb-20">
      {/* Header */}
      <header className="bg-coffee-800 text-white px-4 pt-safe-top pb-3 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-3xl">☕</span>
          <div>
            <h1 className="text-lg font-bold leading-tight">Coffee Corner</h1>
            <p className="text-xs text-coffee-200">ร้านกาแฟพรีเมียม</p>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30 pb-safe-bottom">
        <div className="flex">
          {navItems.map(item => {
            const isActive = item.to === '/'
              ? location.pathname === '/'
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className="flex-1 flex flex-col items-center py-2 relative"
              >
                {({ isActive: navActive }) => (
                  <>
                    <span className={`text-2xl transition-transform ${navActive ? 'scale-110' : 'scale-100'}`}>
                      {navActive ? item.activeIcon : item.icon}
                    </span>
                    <span className={`text-xs mt-0.5 font-medium ${navActive ? 'text-coffee-700' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                    {item.to === '/cart' && cartCount > 0 && (
                      <span className="absolute top-1 right-1/4 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
                        {cartCount > 99 ? '99+' : cartCount}
                      </span>
                    )}
                    {navActive && (
                      <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-coffee-700 rounded-full" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
