import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Trash2, TicketPercent } from 'lucide-react';

export default function CouponsOffersPage() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    description: '',
    discount_type: 'PERCENTAGE',
    discount_value: '',
    min_order_value: 0,
    max_discount: 1000,
    valid_until: '2026-12-31'
  });

  const loadCoupons = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getCoupons();
      if (res.success && res.coupons) setCoupons(res.coupons);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createCoupon({
        ...formData,
        discount_value: parseFloat(formData.discount_value),
        min_order_value: parseFloat(formData.min_order_value),
        max_discount: parseFloat(formData.max_discount)
      });
      setIsModalOpen(false);
      loadCoupons();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete coupon?')) {
      await adminApi.deleteCoupon(id);
      loadCoupons();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Coupons & Flash Discounts ({coupons.length})</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Configure promo codes, minimum spend thresholds, and maximum discounts</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Coupon Code</th>
              <th>Description</th>
              <th>Discount</th>
              <th>Min Order Spend</th>
              <th>Max Cap</th>
              <th>Validity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading coupons...</td></tr>
            ) : coupons.map((c) => (
              <tr key={c.id}>
                <td>
                  <strong style={{ backgroundColor: '#f1f5f9', border: '1px dashed #2874f0', color: '#2874f0', padding: '4px 10px', borderRadius: '4px', letterSpacing: '1px' }}>
                    {c.code}
                  </strong>
                </td>
                <td style={{ maxWidth: '280px' }}>{c.description}</td>
                <td>
                  <strong style={{ color: '#16a34a' }}>
                    {c.discount_type === 'PERCENTAGE' ? `${c.discount_value}%` : `₹${c.discount_value}`}
                  </strong>
                </td>
                <td>₹{(c.min_order_value || 0).toLocaleString()}</td>
                <td>₹{(c.max_discount || 0).toLocaleString()}</td>
                <td style={{ color: '#64748b' }}>{c.valid_until ? new Date(c.valid_until).toLocaleDateString('en-IN') : 'Ongoing'}</td>
                <td>
                  <button onClick={() => handleDelete(c.id)} style={{ background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create Promotional Coupon" maxWidth="520px">
        <form onSubmit={handleCreate}>
          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Promo Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g. MEGAFEST500"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', textTransform: 'uppercase' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Description *</label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Get flat ₹500 off on orders above ₹2499"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Discount Type</label>
                <select
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                >
                  <option value="PERCENTAGE">Percentage (%)</option>
                  <option value="FLAT">Flat Cash (₹)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Discount Value *</label>
                <input
                  type="number"
                  required
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                  placeholder="20"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Min Order Spend (₹)</label>
                <input
                  type="number"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                  placeholder="999"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Max Discount Cap (₹)</label>
                <input
                  type="number"
                  value={formData.max_discount}
                  onChange={(e) => setFormData({ ...formData, max_discount: e.target.value })}
                  placeholder="1000"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Coupon</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
