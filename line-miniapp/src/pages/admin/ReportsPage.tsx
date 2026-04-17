import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
  ComposedChart, Area,
} from 'recharts';
import { orderService, memberService } from '@/services/dataService';
import { MOCK_MONTHLY_SALES, MOCK_TOP_PRODUCTS, MOCK_DAILY_SALES } from '@/data/mockData';

type Period = '7d' | '30d' | '12m';

const PERIOD_LABELS: Record<Period, string> = {
  '7d':  '7 วัน',
  '30d': '30 วัน',
  '12m': '12 เดือน',
};

const COLORS = ['#b86c10', '#d4891a', '#e2a53a', '#ecc26d', '#f4d9a8'];

// ============================================================
// KPI Card
// ============================================================
function KPICard({ label, value, sub, icon, color = 'text-gray-900' }: {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-500 font-medium">{label}</p>
          <p className={`text-2xl font-black mt-1 ${color}`}>{value}</p>
          {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

// ============================================================
// Reports Page
// ============================================================
export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>('7d');

  const stats = useMemo(() => orderService.getStats(period === '7d' ? 7 : 30), [period]);
  const memberStats = useMemo(() => memberService.getStats(), []);
  const dailyData = useMemo(() => orderService.getDailyRevenue(period === '7d' ? 7 : 30), [period]);

  // Use mock data for months if real data is insufficient
  const chartData = useMemo(() => {
    if (period === '12m') return MOCK_MONTHLY_SALES.map(d => ({ date: d.month, revenue: d.revenue, orders: d.orders }));
    if (dailyData.some(d => d.revenue > 0)) return dailyData;
    return MOCK_DAILY_SALES.slice(period === '7d' ? 0 : undefined);
  }, [period, dailyData]);

  const topCategories = [
    { name: 'กาแฟเย็น', value: 38 },
    { name: 'กาแฟร้อน', value: 25 },
    { name: 'เครื่องดื่มปั่น', value: 18 },
    { name: 'ชา & เฮิร์บ', value: 12 },
    { name: 'เบเกอรี่', value: 7 },
  ];

  const paymentData = [
    { name: 'พร้อมเพย์', value: 45 },
    { name: 'เงินสด', value: 30 },
    { name: 'LINE Pay', value: 20 },
    { name: 'บัตรเครดิต', value: 5 },
  ];

  const peakHours = [
    { hour: '07:00', orders: 12 },
    { hour: '08:00', orders: 34 },
    { hour: '09:00', orders: 28 },
    { hour: '10:00', orders: 18 },
    { hour: '11:00', orders: 15 },
    { hour: '12:00', orders: 22 },
    { hour: '13:00', orders: 19 },
    { hour: '14:00', orders: 11 },
    { hour: '15:00', orders: 16 },
    { hour: '16:00', orders: 24 },
    { hour: '17:00', orders: 20 },
    { hour: '18:00', orders: 8 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">รายงาน</h1>
          <p className="text-gray-500 text-sm mt-1">วิเคราะห์ข้อมูลธุรกิจ</p>
        </div>
        <div className="flex gap-2">
          {(Object.keys(PERIOD_LABELS) as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                period === p ? 'bg-coffee-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-coffee-300'
              }`}
            >
              {PERIOD_LABELS[p]}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="รายได้รวม"
          value={`฿${stats.totalRevenue.toLocaleString()}`}
          sub={`${PERIOD_LABELS[period]}ที่ผ่านมา`}
          icon="💰"
          color="text-coffee-700"
        />
        <KPICard
          label="จำนวนออเดอร์"
          value={stats.totalOrders.toLocaleString()}
          sub={`เฉลี่ย ${(stats.totalOrders / (period === '7d' ? 7 : 30)).toFixed(1)} ออเดอร์/วัน`}
          icon="🧾"
        />
        <KPICard
          label="ยอดเฉลี่ย/ออเดอร์"
          value={`฿${stats.avgOrderValue.toFixed(0)}`}
          icon="📊"
        />
        <KPICard
          label="สมาชิกทั้งหมด"
          value={memberStats.total.toLocaleString()}
          sub={`+${memberStats.newThisMonth} คน/เดือนนี้`}
          icon="👥"
        />
      </div>

      {/* Revenue trend */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-1">แนวโน้มรายได้</h2>
        <p className="text-xs text-gray-400 mb-4">{PERIOD_LABELS[period]}ที่ผ่านมา</p>
        <ResponsiveContainer width="100%" height={250}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="revenueGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b86c10" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#b86c10" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 10 }} tickFormatter={v => `฿${(v/1000).toFixed(0)}K`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
              formatter={(v: number, name: string) => [
                name === 'revenue' ? `฿${v.toLocaleString()}` : v,
                name === 'revenue' ? 'รายได้' : 'ออเดอร์',
              ]}
            />
            <Area yAxisId="left" type="monotone" dataKey="revenue" fill="url(#revenueGrad2)" stroke="#b86c10" strokeWidth={2} />
            <Bar yAxisId="right" dataKey="orders" fill="#ecc26d" radius={[4, 4, 0, 0]} opacity={0.6} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Peak hours + Payment methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">ชั่วโมงยอดนิยม</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={peakHours} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f0e8" />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
                formatter={(v: number) => [v, 'ออเดอร์']}
              />
              <Bar dataKey="orders" fill="#d4891a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">วิธีชำระเงิน</h2>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {paymentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top products */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="font-bold text-gray-800 mb-4">สินค้าขายดีสูงสุด</h2>
        <div className="space-y-4">
          {MOCK_TOP_PRODUCTS.map((item, i) => {
            const maxRevenue = MOCK_TOP_PRODUCTS[0].revenue;
            return (
              <div key={item.name}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-coffee-100 text-coffee-700 flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-800">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-coffee-700">฿{item.revenue.toLocaleString()}</span>
                    <span className="text-xs text-gray-400 ml-2">{item.count} แก้ว</span>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(item.revenue / maxRevenue) * 100}%`,
                      backgroundColor: COLORS[i % COLORS.length],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">สัดส่วนตามหมวดหมู่ (%)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={topCategories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                paddingAngle={3}
                dataKey="value"
              >
                {topCategories.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v: number) => [`${v}%`, '']} />
              <Legend iconType="circle" iconSize={10} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 mb-4">สรุปสมาชิก</h2>
          <div className="space-y-3">
            {[
              { label: 'สมาชิกใหม่เดือนนี้', value: `+${memberStats.newThisMonth} คน`, icon: '🆕', color: 'text-green-600' },
              { label: 'สมาชิก Bronze', value: `${memberStats.tiers.bronze} คน`, icon: '🥉', color: 'text-amber-700' },
              { label: 'สมาชิก Silver', value: `${memberStats.tiers.silver} คน`, icon: '🥈', color: 'text-gray-600' },
              { label: 'สมาชิก Gold', value: `${memberStats.tiers.gold} คน`, icon: '🥇', color: 'text-yellow-600' },
              { label: 'สมาชิก Platinum', value: `${memberStats.tiers.platinum} คน`, icon: '💎', color: 'text-purple-600' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span className="text-sm text-gray-700">{item.label}</span>
                </div>
                <span className={`font-bold text-sm ${item.color}`}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export note */}
      <div className="bg-coffee-50 border border-coffee-200 rounded-2xl p-4 flex items-center gap-3">
        <span className="text-2xl">📥</span>
        <div>
          <p className="font-semibold text-coffee-800 text-sm">ส่งออกรายงาน</p>
          <p className="text-xs text-coffee-600">สามารถ Copy ข้อมูลหรือ Screenshot เพื่อแชร์รายงาน</p>
        </div>
      </div>
    </div>
  );
}
