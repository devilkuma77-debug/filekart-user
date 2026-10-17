import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Trash2, Tag } from 'lucide-react';

export default function BrandsPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [logo, setLogo] = useState('');

  const loadBrands = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBrands();
      if (res.success && res.brands) setBrands(res.brands);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name) return;
    try {
      await adminApi.createBrand({ name, logo });
      setName('');
      setLogo('');
      setIsModalOpen(false);
      loadBrands();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete brand?')) {
      await adminApi.deleteBrand(id);
      loadBrands();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Brand Partners ({brands.length})</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Manage product brands & manufacturer logos</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Brand
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' }}>
        {brands.map((b) => (
          <div key={b.id} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={b.logo || 'https://cdn-icons-png.flaticon.com/512/0/747.png'}
                alt={b.name}
                style={{ width: '36px', height: '36px', objectFit: 'contain' }}
              />
              <strong style={{ fontSize: '14px' }}>{b.name}</strong>
            </div>
            <button onClick={() => handleDelete(b.id)} style={{ background: 'none', color: '#ef4444', cursor: 'pointer' }}>
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Brand" maxWidth="460px">
        <form onSubmit={handleCreate}>
          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Brand Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sony, Apple, Nike"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Logo URL</label>
              <input
                type="url"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                placeholder="https://..."
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add Brand</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
