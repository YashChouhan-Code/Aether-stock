import React, { useState, useEffect } from 'react';
import {
  AreaChart, Area, PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend
} from 'recharts';
import { Package, ShoppingCart, Layers, AlertTriangle, Users, TrendingUp } from 'lucide-react';

const expenseData = [
  { month: 'Dec', expense: 20000, profit: 18000 },
  { month: 'Jan', expense: 22000, profit: 19500 },
  { month: 'Feb', expense: 21000, profit: 20000 },
  { month: 'Mar', expense: 25000, profit: 22000 },
  { month: 'Apr', expense: 27000, profit: 26000 },
  { month: 'May', expense: 31000, profit: 34000 },
  { month: 'Jun', expense: 29000, profit: 36000 },
];

const topStores = [
  { name: 'Gateway Str', value: 874 },
  { name: 'The Rustic Fox', value: 721 },
  { name: 'Velvet Vine', value: 598 },
  { name: 'Blue Harbor', value: 508 },
  { name: 'Nebula Novelties', value: 395 },
  { name: 'Crimson Crafters', value: 344 },
];

const PIE_COLORS = ['#0b1d3a', '#f36c21'];

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, orders: 0, stock: 0, outOfStock: 0 });
  const [pieData, setPieData] = useState([
    { name: 'Sold units', value: 68 },
    { name: 'Total units', value: 32 },
  ]);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(r => r.json())
      .then(d => {
        if (d.message === 'success') {
          const items = d.data;
          const outOfStock = items.filter(i => i.stock === 0).length;
          const totalStock = items.reduce((acc, i) => acc + (i.stock || 0), 0);
          setStats({ total: items.length, orders: 0, stock: totalStock, outOfStock });
          if (items.length > 0) {
            const inStock = items.filter(i => i.stock > 0).length;
            setPieData([
              { name: 'In Stock', value: Math.round((inStock / items.length) * 100) },
              { name: 'Out of Stock', value: Math.round((outOfStock / items.length) * 100) || 0 },
            ]);
          }
        }
      }).catch(() => {});

    fetch('http://localhost:5000/api/invoices')
      .then(r => r.json())
      .then(d => {
        if (d.message === 'success') {
          setStats(prev => ({ ...prev, orders: d.data.length }));
        }
      }).catch(() => {});
  }, []);

  const statCards = [
    { icon: <Package size={24} />, iconClass: 'stat-icon-teal', value: stats.total, label: 'Total Products' },
    { icon: <ShoppingCart size={24} />, iconClass: 'stat-icon-blue', value: stats.orders, label: 'Orders' },
    { icon: <Layers size={24} />, iconClass: 'stat-icon-green', value: stats.stock.toLocaleString(), label: 'Total Stock' },
    { icon: <AlertTriangle size={24} />, iconClass: 'stat-icon-orange', value: stats.outOfStock, label: 'Out of Stock' },
  ];

  return (
    <div>
      {/* Page title */}
      <div className="page-header">
        <h1 className="page-title">Over View</h1>
      </div>

      {/* Stat Cards */}
      <div className="stats-row">
        {statCards.map((c, i) => (
          <div className="stat-card" key={i}>
            <div className={`stat-card-icon ${c.iconClass}`}>{c.icon}</div>
            <div className="stat-card-info">
              <div className="stat-card-value">{c.value}</div>
              <div className="stat-card-label">{c.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Grid: 3 cols */}
      <div className="dashboard-grid">
        {/* No of Customers */}
        <div className="box" style={{ marginBottom: 0 }}>
          <div className="box-header">No. of Customers</div>
          <div className="box-body" style={{ textAlign: 'center', padding: '32px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
              <div style={{ background: 'rgba(11, 29, 58, 0.1)', borderRadius: '50%', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={28} color="#0b1d3a" />
              </div>
            </div>
            <div style={{ fontSize: '32px', fontWeight: '800', color: 'var(--text-main)' }}>583 K</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>Total Customers</div>
          </div>
        </div>

        {/* Pie Chart: Inventory Values */}
        <div className="box" style={{ marginBottom: 0 }}>
          <div className="box-header">Inventory Values</div>
          <div className="box-body" style={{ padding: '12px 16px' }}>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  dataKey="value"
                  label={({ value }) => `${value}%`}
                  labelLine={false}
                >
                  {pieData.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend iconType="circle" iconSize={10} />
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Stores Bar Chart */}
        <div className="box" style={{ marginBottom: 0 }}>
          <div className="box-header">Top Stores by Sales</div>
          <div className="box-body" style={{ padding: '12px 16px' }}>
            {topStores.map((store, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '3px', color: 'var(--text-sub)' }}>
                  <span>{store.name}</span>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{store.value}k</span>
                </div>
                <div style={{ height: '6px', background: '#e8f4f8', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(store.value / 874) * 100}%`,
                    height: '100%',
                    background: i === 0 ? '#0b1d3a' : i === 1 ? '#f36c21' : '#cbd5e1',
                    borderRadius: '4px',
                    transition: 'width 0.6s ease'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Expense vs Profit Chart */}
      <div className="box" style={{ marginTop: '20px' }}>
        <div className="box-header">
          <span>Expense vs Profit</span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 'normal' }}>Last 6 months</span>
        </div>
        <div className="box-body" style={{ padding: '16px 20px' }}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={expenseData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f36c21" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#f36c21" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0b1d3a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0b1d3a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `${v / 1000}k`} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Legend iconType="circle" iconSize={10} />
              <Area type="monotone" dataKey="expense" name="Expense" stroke="#f36c21" strokeWidth={2} fill="url(#gradExpense)" dot={false} />
              <Area type="monotone" dataKey="profit" name="Profit" stroke="#0b1d3a" strokeWidth={2} fill="url(#gradProfit)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
