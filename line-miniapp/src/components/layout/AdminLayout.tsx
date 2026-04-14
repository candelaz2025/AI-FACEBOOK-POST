import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';

interface AdminNavItem {
  to: string;
  label: string;
  icon: string;
}

const adminNavItems: AdminNavItem[] = [
  { to: '/admin',         label: 'แดชบอร์ด',    icon: '📊' },
  { to: '/admin/orders',  label: 'ออเดอร์',      icon: '🧾' },
  { to: '/admin/menu',    label: 'จัดการเมนู',   icon: '📋' },
  { to: '/admin/members', label: 'สมาชิก',       icon: '👥' },
  { to: '/admin/reports', label: 'รายงาน',       icon: '📈' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { setAppView } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-coffee-900 text-white z-40 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:flex lg:flex-col`}
      >
        <div className="p-5 border-b border-coffee-700">
          <div className="flex items-center gap-3">
            <span className="text-3xl">☕</span>
            <div>
              <p className="font-bold text-lg">Coffee Corner</p>
              <p className="text-coffee-300 text-xs">ระบบหลังบ้าน</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNavItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/admin'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-coffee-600 text-white'
                    : 'text-coffee-200 hover:bg-coffee-800 hover:text-white'
                }`
              }
            >
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-coffee-700">
          <button
            onClick={() => setAppView('customer')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-coffee-200 hover:bg-coffee-800 hover:text-white text-sm font-medium transition-colors"
          >
            <span className="text-xl">📱</span>
            หน้าลูกค้า
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            ☰
          </button>
          <h1 className="font-bold text-gray-800 text-lg">ระบบจัดการร้านกาแฟ</h1>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-gray-500">
              {new Date().toLocaleDateString('th-TH', { dateStyle: 'long' })}
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
