import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { Users, UserX, UserCheck, Shield } from 'lucide-react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCustomers();
      if (res.success && res.customers) setCustomers(res.customers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleToggleStatus = async (id) => {
    try {
      await adminApi.toggleCustomerStatus(id);
      loadCustomers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Customer Accounts ({customers.length})</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>View registered buyers, total order values, and account status</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact Details</th>
              <th>Total Orders</th>
              <th>Lifetime Spent</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Loading customers...</td></tr>
            ) : customers.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Joined {new Date(c.created_at || Date.now()).toLocaleDateString('en-IN')}</div>
                </td>
                <td>
                  <div>{c.email || 'N/A'}</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>{c.phone || ''}</div>
                </td>
                <td>
                  <strong>{c.total_orders || 0} orders</strong>
                </td>
                <td>
                  <strong style={{ color: '#16a34a' }}>₹{(c.total_spent || 0).toLocaleString()}</strong>
                </td>
                <td>
                  <span className={`badge-status ${c.is_active ? 'badge-success' : 'badge-danger'}`}>
                    {c.is_active ? 'Active' : 'Blocked'}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleToggleStatus(c.id)}
                    style={{
                      backgroundColor: c.is_active ? '#fee2e2' : '#dcfce7',
                      color: c.is_active ? '#b91c1c' : '#15803d',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 600
                    }}
                  >
                    {c.is_active ? 'Block Account' : 'Unblock Account'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
