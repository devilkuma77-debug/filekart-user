import React, { useState } from 'react';
import { RotateCcw, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsRefundsPage() {
  const [returns, setReturns] = useState([
    {
      id: 1,
      order_number: 'OD8291048591',
      customer_name: 'Rahul Sharma',
      product_title: 'boAt Rockerz 450 Bluetooth Headphone',
      reason: 'Sound defect in left earcup',
      type: 'Replacement',
      amount: 1499,
      status: 'Pending Verification',
      date: '2026-10-14'
    },
    {
      id: 2,
      order_number: 'OD8291048595',
      customer_name: 'Ananya Verma',
      product_title: 'Nike Air Max SC Running Shoes (Size 9)',
      reason: 'Size too large',
      type: 'Refund',
      amount: 3899,
      status: 'Approved',
      date: '2026-10-12'
    }
  ]);

  const handleUpdateStatus = (id, newStatus) => {
    setReturns(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Returns, Replacements & Refund Management</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Process 7-day buyer return claims and approve instant wallet/bank refunds</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Item & Reason</th>
              <th>Claim Type</th>
              <th>Refund Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {returns.map((r) => (
              <tr key={r.id}>
                <td><strong>{r.order_number}</strong></td>
                <td>{r.customer_name}</td>
                <td>
                  <strong>{r.product_title}</strong>
                  <div style={{ fontSize: '11px', color: '#ef4444' }}>Reason: {r.reason}</div>
                </td>
                <td>
                  <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                    {r.type}
                  </span>
                </td>
                <td><strong>₹{r.amount.toLocaleString()}</strong></td>
                <td>
                  <span className={`badge-status ${r.status === 'Approved' ? 'badge-success' : r.status === 'Rejected' ? 'badge-danger' : 'badge-warning'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  {r.status === 'Pending Verification' && (
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'Approved')}
                        style={{ backgroundColor: '#10b981', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(r.id, 'Rejected')}
                        style={{ backgroundColor: '#ef4444', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}
                      >
                        Reject
                      </button>
                    </div>
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
