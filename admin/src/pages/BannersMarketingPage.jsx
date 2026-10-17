import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Trash2, Megaphone } from 'lucide-react';

export default function BannersMarketingPage() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [link, setLink] = useState('/products');

  const loadBanners = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getBanners();
      if (res.success && res.banners) setBanners(res.banners);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await adminApi.createBanner({ title, image, link });
      setTitle('');
      setImage('');
      setIsModalOpen(false);
      loadBanners();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete banner?')) {
      await adminApi.deleteBanner(id);
      loadBanners();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Homepage Banners & Marketing ({banners.length})</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Hero carousels, flash sale banners, and promo sliders</p>
        </div>
        <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
          <Plus size={16} /> Add Hero Banner
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {banners.map((b) => (
          <div key={b.id} className="admin-card" style={{ padding: '0', overflow: 'hidden' }}>
            <div style={{ height: '140px', backgroundColor: '#e2e8f0', position: 'relative' }}>
              <img src={b.image} alt={b.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '13px' }}>{b.title}</strong>
                <div style={{ fontSize: '11px', color: '#2563eb' }}>Link: {b.link}</div>
              </div>
              <button onClick={() => handleDelete(b.id)} style={{ background: 'none', color: '#ef4444', cursor: 'pointer' }}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Hero Banner" maxWidth="500px">
        <form onSubmit={handleCreate}>
          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Campaign Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Flipkart Big Billion Days"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Banner Image URL *</label>
              <input
                type="url"
                required
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Target Link</label>
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/products?category=mobiles"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>
          </div>
          <div className="admin-modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Banner</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
