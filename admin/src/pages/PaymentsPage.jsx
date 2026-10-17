import React, { useState } from 'react';
import { CreditCard, IndianRupee, ShieldCheck } from 'lucide-react';

export default function PaymentsPage() {
  const [transactions] = useState([
    { txId: 'TXN948201948', order: 'OD1092837482', mode: 'UPI (PhonePe)', amount: 65999, status: 'Success', date: '2026-10-15 11:20 AM' },
    { txId: 'TXN948201949', order: 'OD1092837483', mode: 'Credit Card (HDFC)', amount: 26990, status: 'Success', date: '2026-10-15 10:45 AM' },
    { txId: 'TXN948201950', order: 'OD1092837484', mode: 'Cash on Delivery', amount: 3899, status: 'Pending Collection', date: '2026-10-15 09:15 AM' }
  ]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Payments, COD Reconciliation & Finance</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Gateway settlements, transaction IDs, payment gateway logs, and cashier payouts</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
        <div className="admin-card">
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>SETTLED ONLINE PAYMENTS</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#16a34a' }}>₹12,45,900.00</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>UPI, Cards, NetBanking direct to merchant</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>PENDING COD COLLECTIONS</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#f59e0b' }}>₹2,43,100.00</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Held by delivery riders for remittance</div>
        </div>

        <div className="admin-card">
          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>PROCESSED REFUNDS</div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: '#ef4444' }}>₹5,398.00</div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>Reversed to buyer source accounts</div>
        </div>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', fontWeight: 600, fontSize: '14px' }}>
          Recent Transactions Audit Log
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Transaction Reference</th>
              <th>Order Number</th>
              <th>Payment Method</th>
              <th>Settled Amount</th>
              <th>Gateway Status</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, idx) => (
              <tr key={idx}>
                <td><strong style={{ fontFamily: 'monospace' }}>{t.txId}</strong></td>
                <td><strong style={{ color: '#2563eb' }}>{t.order}</strong></td>
                <td>{t.mode}</td>
                <td><strong>₹{t.amount.toLocaleString()}</strong></td>
                <td>
                  <span className={`badge-status ${t.status === 'Success' ? 'badge-success' : 'badge-warning'}`}>
                    {t.status}
                  </span>
                </td>
                <td style={{ color: '#64748b', fontSize: '12px' }}>{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
