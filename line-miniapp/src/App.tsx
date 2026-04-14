import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import { CustomerLayout } from '@/components/layout/CustomerLayout';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { NotificationToast } from '@/components/shared/NotificationToast';

// Customer pages
import HomePage from '@/pages/customer/HomePage';
import CartPage from '@/pages/customer/CartPage';
import OrderTrackingPage from '@/pages/customer/OrderTrackingPage';
import ProfilePage from '@/pages/customer/ProfilePage';

// Admin pages
import DashboardPage from '@/pages/admin/DashboardPage';
import OrderManagementPage from '@/pages/admin/OrderManagementPage';
import MenuManagementPage from '@/pages/admin/MenuManagementPage';
import MemberManagementPage from '@/pages/admin/MemberManagementPage';
import ReportsPage from '@/pages/admin/ReportsPage';

// ============================================================
// Loading screen
// ============================================================
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-coffee-800 flex flex-col items-center justify-center">
      <div className="text-center">
        <span className="text-8xl block mb-4 animate-bounce-gentle">☕</span>
        <h1 className="text-white text-2xl font-bold mb-2">Coffee Corner</h1>
        <p className="text-coffee-300 text-sm">กำลังโหลด...</p>
        <div className="mt-6 flex gap-1 justify-center">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-2 h-2 bg-coffee-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Customer Routes
// ============================================================
function CustomerRoutes() {
  return (
    <CustomerLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/orders" element={<OrderTrackingPage />} />
        <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </CustomerLayout>
  );
}

// ============================================================
// Admin Routes
// ============================================================
function AdminRoutes() {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/orders" element={<OrderManagementPage />} />
        <Route path="/admin/menu" element={<MenuManagementPage />} />
        <Route path="/admin/members" element={<MemberManagementPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </AdminLayout>
  );
}

// ============================================================
// Root App
// ============================================================
export default function App() {
  const { isAuthLoading, appView } = useApp();

  if (isAuthLoading) return <LoadingScreen />;

  return (
    <>
      <NotificationToast />
      {appView === 'admin' ? <AdminRoutes /> : <CustomerRoutes />}
    </>
  );
}
