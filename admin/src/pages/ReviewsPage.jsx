import React, { useState } from 'react';
import { Star, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([
    { id: 1, product: 'Apple iPhone 15 (Black, 128 GB)', user: 'Vikram Mehta', rating: 5, comment: 'Received within 2 days. Packaging was top-notch and product is genuine!', status: 'Approved' },
    { id: 2, product: 'Sony WH-1000XM5 Wireless Headphones', user: 'Anjali Nair', rating: 4, comment: 'Active Noise Cancellation is unbeatable. Battery lasts easily 30 hrs.', status: 'Approved' },
    { id: 3, product: 'Nike Air Max SC Running Shoes', user: 'Harish R', rating: 1, comment: 'Box was slightly dented during courier transit.', status: 'Pending Review' }
  ]);

  const handleDelete = (id) => {
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const handleApprove = (id) => {
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' } : r));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Product Reviews & Ratings Moderation</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Moderate customer feedback, approve verified buyer ratings, and filter spam</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Customer</th>
              <th>Rating</th>
              <th>Review Text</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td style={{ maxWidth: '240px', fontWeight: 600 }}>{r.product}</td>
                <td>{r.user}</td>
                <td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', backgroundColor: '#388e3c', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                    {r.rating} <Star size={10} fill="#fff" strokeWidth={0} />
                  </span>
                </td>
                <td style={{ maxWidth: '320px', fontSize: '13px' }}>{r.comment}</td>
                <td>
                  <span className={`badge-status ${r.status === 'Approved' ? 'badge-success' : 'badge-warning'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {r.status !== 'Approved' && (
                      <button onClick={() => handleApprove(r.id)} style={{ backgroundColor: '#2874f0', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>
                        Approve
                      </button>
                    )}
                    <button onClick={() => handleDelete(r.id)} style={{ background: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
