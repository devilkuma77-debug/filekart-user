import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { IndianRupee, ShoppingBag, Users, AlertTriangle, TrendingUp, Package, ArrowUpRight } from 'lucide-react';

export default function DashboardPage({ onNavigateTab }) {
  const [metrics, setMetrics] = useState({
    totalRevenue: 1489000,
    totalOrders: 184,
    totalCustomers: 950,
    lowStockCount: 4,
    totalProducts: 24,
    recentOrders: [],
    categoryDistribution: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminApi.getDashboardMetrics();
        if (res.success && res.stats) {
          setMetrics(res.stats);
        }
      } catch (err) {
        console.error('Stats error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const kpis = [
    {
      title: 'TOTAL REVENUE',
      value: `₹${(metrics.totalRevenue || 0).toLocaleString()}`,
      change: '+18.4% vs last month',
      icon: IndianRupee,
      color: '#2874f0',
      bg: '#eff6ff'
    },
    {
      title: 'TOTAL ORDERS',
      value: (metrics.totalOrders || 0).toLocaleString(),
      change: '+12.6% vs last month',
      icon: ShoppingBag,
      color: '#10b981',
      bg: '#ecfdf5'
    },
    {
      title: 'ACTIVE CUSTOMERS',
      value: (metrics.totalCustomers || 0).toLocaleString(),
      change: '+24 new today',
      icon: Users,
      color: '#8b5cf6',
      bg: '#f5f3ff'
    },
    {
      title: 'LOW STOCK ALERTS',
      value: metrics.lowStockCount || 0,
      change: 'Requires replenishment',
      icon: AlertTriangle,
      color: '#ef4444',
      bg: '#fef2f2'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* KPI Cards Grid */}
      <div className="admin-kpis-grid">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '8px' }}>
                  {kpi.title}
                </div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                  {kpi.value}
                </div>
                <div style={{ fontSize: '12px', color: kpi.color, fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <TrendingUp size={14} /> {kpi.change}
                </div>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '8px', backgroundColor: kpi.bg, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Center Grid: Sales Trend & Category Distribution */}
      <div className="admin-charts-grid">
        {/* Sales Performance Visualizer */}
        <div className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Sales & Revenue Performance</h3>
              <p style={{ fontSize: '12px', color: '#64748b' }}>Weekly volume and gross transaction values</p>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#2874f0', backgroundColor: '#eff6ff', padding: '4px 10px', borderRadius: '4px' }}>
              Weekly Live
            </span>
          </div>

          {/* Bar Chart Simulation */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '180px', padding: '10px 10px 0', borderBottom: '1px solid #e2e8f0', gap: '14px' }}>
            {[
              { day: 'Mon', h: 65, val: '₹1.8L' },
              { day: 'Tue', h: 80, val: '₹2.4L' },
              { day: 'Wed', h: 50, val: '₹1.2L' },
              { day: 'Thu', h: 90, val: '₹3.1L' },
              { day: 'Fri', h: 75, val: '₹2.2L' },
              { day: 'Sat', h: 100, val: '₹4.5L' },
              { day: 'Sun', h: 95, val: '₹4.1L' }
            ].map((bar, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: '#64748b' }}>{bar.val}</span>
                <div
                  style={{
                    width: '100%',
                    height: `${bar.h}%`,
                    backgroundColor: i === 5 ? '#2874f0' : '#93c5fd',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>{bar.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Categories Distribution */}
        <div className="admin-card">
          <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '6px' }}>Catalog by Category</h3>
          <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>Top performing store verticals</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {(metrics.categoryDistribution && metrics.categoryDistribution.length > 0 ? metrics.categoryDistribution : [
              { name: 'Mobiles', product_count: 8 },
              { name: 'Electronics', product_count: 6 },
              { name: 'Fashion', product_count: 5 },
              { name: 'Appliances', product_count: 3 },
              { name: 'Home & Kitchen', product_count: 2 }
            ]).map((c, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600 }}>{c.name}</span>
                  <span style={{ color: '#64748b' }}>{c.product_count} products</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, c.product_count * 15)}%`, height: '100%', backgroundColor: '#2874f0', borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Recent Customer Orders</h3>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Latest customer orders ready for fulfillment</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="btn-secondary"
            style={{ fontSize: '12px' }}
          >
            View All Orders <ArrowUpRight size={14} />
          </button>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Placed Time</th>
            </tr>
          </thead>
          <tbody>
            {(metrics.recentOrders && metrics.recentOrders.length > 0 ? metrics.recentOrders : [
              { id: 101, order_number: 'OD1092837482', customer_name: 'Aarav Kumar', total_amount: 65999, order_status: 'Processing', created_at: new Date() },
              { id: 102, order_number: 'OD1092837483', customer_name: 'Priya Sharma', total_amount: 26990, order_status: 'Shipped', created_at: new Date() },
              { id: 103, order_number: 'OD1092837484', customer_name: 'Rohan Verma', total_amount: 3899, order_status: 'Delivered', created_at: new Date() }
            ]).map((ord, idx) => {
              const st = ord.order_status;
              const badgeClass =
                st === 'Delivered' ? 'badge-success' :
                st === 'Shipped' || st === 'Packed' ? 'badge-info' :
                st === 'Processing' || st === 'Ordered' ? 'badge-warning' : 'badge-danger';

              return (
                <tr key={idx}>
                  <td><strong>{ord.order_number}</strong></td>
                  <td>{ord.customer_name || 'Customer'}</td>
                  <td><strong>₹{(ord.total_amount || 0).toLocaleString()}</strong></td>
                  <td><span className={`badge-status ${badgeClass}`}>{ord.order_status}</span></td>
                  <td style={{ color: '#64748b' }}>{new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN')}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
