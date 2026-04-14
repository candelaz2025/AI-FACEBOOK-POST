import React, { useMemo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { orderService, memberService } from '@/services/dataService';
import { MOCK_DAILY_SALES, MOCK_TOP_PRODUCTS } from '@/data/mockData';
import { OrderStatusBadge } from '@/components/shared/Badge';

// ============================================================
// Stat Card
// ============================================================
function StatCard({
  label, value, sub, icon, trend, color = 'bg-white',
}: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  trend?: { value: number; label: string };
  color?: string;
}) {
  return (
    <div className={`${color} rounded-2xl shadow-sm border border-gray-100 p-4`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}% {trend.label}</span>
        </div>
      )}
    </div>
  );
}

const PIE_COLORS = ['#b86c10', '#d4891a', '#e2a53a', '#ecc26d'];

// ============================================================
// Dashboard
// ============================================================
export default function DashboardPage() {
  const stats = useMemo(() => orderService.getStats(7), []);
  const memberStats = useMemo(() => memberService.getStats(), []);
  const dailyData = useMemo(() => orderService.getDailyRevenue(7), []);
  const activeOrders = useMemo(() => orderService.getActive(), []);
  const allOrders = useMemo(() => orderService.getAll().slice(0, 5), []);

  const tierData = [
    { name: 'บรอนซ์',   value: memberStats.tiers.bronze,   color: PIE_COLORS[0] },
    { name: 'ซิลเวอร์', value: memberStats.tiers.silver,   color: PIE_COLORS[1] },
    { name: 'โกลด์',    value: memberStats.tiers.gold,     color: PIE_COLORS[2] },
    { name: 'แพลทินัม', value: memberStats.tiers.platinum, color: PIE_COLORS[3] },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">แดชบอร์ด</h1>
        <p className="text-gray-500 text-sm mt-1">ภาพรวมร้านกาแฟ 7 วันที่ผ่านมา</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="รายได้ (7 วัน)"
          value={`฿${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          trend={{ value: 12, label: 'vs 7 วันก่อน' }}
        />
        <StatCard
          label="ออเดอร์ (7 วัน)"
          value={stats.totalOrders.toLocaleString()}
          sub={`เฉลี่ย ฿${stats.avgOrderValue.toFixed(0)}/ออเดอร์`}
          icon="🧾"
          trend={{ value: 8, label: 'vs 7 วันก่อน' }}
        />
        <StatCard
          label="ออเดอร์รอดำเนินการ"
          value={stats.pendingOrders.toLocaleString()}
          icon="⏳"
        />
        <StatCard
          label="สมาชิกทั้งหมด"
          value={memberStats.total.toLocaleString()}
          sub={`+${memberStats.newThisMonth} คน/เดือนนี้`}
          icon="👥"
          trend={{ value: 5, label: 'vs เดือนก่อน' }}
        />
      </div>

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">รายได้รายวัน (7 วัน)</h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={dailyData.length > 1 ? dailyData : MOCK_DAILY_SALES} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b86c10" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#b86c10" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `฿${(v/1000).toFixed(0)}K`} />
            <Tooltip
              formatter={(v: number) => [`฿${v.toLocaleString()}`, 'รายได้']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#b86c10" strokeWidth={2} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Orders chart + Tier pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">จำนวนออเดอร์รายวัน</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyData.length > 1 ? dailyData : MOCK_DAILY_SALES} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                formatter={(v: number) => [v, 'ออเดอร์']}
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              />
              <Bar dataKey="orders" fill="#d4891a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">สัดส่วนสมาชิก</h2>
          {tierData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={tierData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {tierData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v: number, n: string) => [v, n]}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              ไม่มีข้อมูลสมาชิก
            </div>
          )}
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">เมนูขายดี</h2>
        <div className="space-y-3">
          {MOCK_TOP_PRODUCTS.map((item, i) => {
            const maxCount = MOCK_TOP_PRODUCTS[0].count;
            return (
              <div key={item.name} className="flex items-center gap-3">
                <span className="w-6 text-center font-bold text-gray-400 text-sm">{i + 1}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                    <span className="text-xs text-gray-500">{item.count} แก้ว</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className="h-2 rounded-full bg-coffee-500"
                      style={{ width: `${(item.count / maxCount) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold text-coffee-700 w-20 text-right">
                  ฿{item.revenue.toLocaleString()}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-800">ออเดอร์ล่าสุด</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="pb-2 text-left font-medium">ออเดอร์</th>
                <th className="pb-2 text-left font-medium">ลูกค้า</th>
                <th className="pb-2 text-left font-medium">สถานะ</th>
                <th className="pb-2 text-right font-medium">ยอด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {allOrders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-2.5 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="py-2.5 text-gray-600">{order.memberName}</td>
                  <td className="py-2.5">
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td className="py-2.5 text-right font-bold text-coffee-700">
                    ฿{order.total.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active orders quick view */}
      {activeOrders.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <h2 className="font-bold text-orange-800 mb-3">🔥 ออเดอร์กำลังดำเนินการ ({activeOrders.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {activeOrders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-3 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-gray-900 text-sm">{order.orderNumber}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-gray-500">{order.memberName}</p>
                {order.queueNumber && (
                  <p className="text-orange-600 font-bold mt-1">คิว #{order.queueNumber}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
