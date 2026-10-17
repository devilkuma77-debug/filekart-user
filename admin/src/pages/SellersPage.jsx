import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { Store, CheckCircle, Ban, Star } from 'lucide-react';

export default function SellersPage() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSellers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getSellers();
      if (res.success && res.sellers) setSellers(res.sellers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSellers();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await adminApi.updateSellerStatus(id, status);
      loadSellers();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Flipkart Marketplace Sellers ({sellers.length})</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Manage authorized retail vendors, GSTIN verification, and commission tiers</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Business / Store Name</th>
              <th>Contact Person</th>
              <th>GSTIN</th>
              <th>Commission Rate</th>
              <th>Seller Rating</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading sellers...</td></tr>
            ) : sellers.map((s) => (
              <tr key={s.id}>
                <td>
                  <strong>{s.business_name}</strong>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>{s.email}</div>
                </td>
                <td>{s.name} ({s.phone})</td>
                <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>{s.gstin}</td>
                <td><strong>{s.commission_rate}%</strong></td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#d97706', fontWeight: 600 }}>
                    {s.rating || 4.8} <Star size={12} fill="#d97706" />
                  </span>
                </td>
                <td>
                  <span className={`badge-status ${s.status === 'Approved' ? 'badge-success' : 'badge-danger'}`}>
                    {s.status}
                  </span>
                </td>
                <td>
                  {s.status === 'Approved' ? (
                    <button
                      onClick={() => handleUpdateStatus(s.id, 'Suspended')}
                      style={{ border: '1px solid #ef4444', backgroundColor: '#fff', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                    >
                      Suspend
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateStatus(s.id, 'Approved')}
                      style={{ backgroundColor: '#2874f0', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                    >
                      Approve
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
