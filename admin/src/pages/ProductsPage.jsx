import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import Modal from '../components/Modal';
import { Plus, Search, Edit2, Trash2, CheckCircle, Star } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category_id: '',
    brand_id: '',
    original_price: '',
    selling_price: '',
    stock: 50,
    primary_image: '',
    is_assured: true,
    is_deal_of_day: false,
    is_featured: false,
    highlights: '',
    description: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, brandRes] = await Promise.all([
        adminApi.getProducts({ limit: 100 }),
        adminApi.getCategories(),
        adminApi.getBrands()
      ]);

      if (prodRes.success && prodRes.products) setProducts(prodRes.products);
      if (catRes.success && catRes.categories) setCategories(catRes.categories);
      if (brandRes.success && brandRes.brands) setBrands(brandRes.brands);
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      title: '',
      category_id: categories[0]?.id || '',
      brand_id: brands[0]?.id || '',
      original_price: '',
      selling_price: '',
      stock: 50,
      primary_image: '',
      is_assured: true,
      is_deal_of_day: false,
      is_featured: false,
      highlights: '1 Year Warranty\nFast Delivery\nAssured Genuine',
      description: ''
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p) => {
    setEditingProduct(p);
    setFormData({
      title: p.title,
      category_id: p.category_id || '',
      brand_id: p.brand_id || '',
      original_price: p.original_price,
      selling_price: p.selling_price,
      stock: p.stock,
      primary_image: p.primary_image,
      is_assured: !!p.is_assured,
      is_deal_of_day: !!p.is_deal_of_day,
      is_featured: !!p.is_featured,
      highlights: Array.isArray(p.highlights) ? p.highlights.join('\n') : '',
      description: p.description || ''
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const highlightsArr = formData.highlights.split('\n').map(h => h.trim()).filter(Boolean);

    const payload = {
      ...formData,
      original_price: parseFloat(formData.original_price),
      selling_price: parseFloat(formData.selling_price),
      stock: parseInt(formData.stock),
      highlights: highlightsArr
    };

    try {
      if (editingProduct) {
        await adminApi.updateProduct(editingProduct.id, payload);
      } else {
        await adminApi.createProduct(payload);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      alert('Failed to save product: ' + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await adminApi.deleteProduct(id);
        loadData();
      } catch (err) {
        alert('Failed to delete: ' + err.message);
      }
    }
  };

  const filteredProducts = products.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || (p.category_name && p.category_name.toLowerCase() === categoryFilter.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Controls Bar */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, maxWidth: '500px' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', width: '100%', backgroundColor: '#fff' }}>
            <Search size={16} color="#64748b" style={{ marginRight: '8px' }} />
            <input
              type="text"
              placeholder="Search product title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ border: 'none', width: '100%', fontSize: '13px' }}
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ border: '1px solid var(--border-color)', borderRadius: '6px', padding: '8px 12px', fontSize: '13px', backgroundColor: '#fff' }}
          >
            <option value="all">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <button className="btn-primary" onClick={handleOpenAddModal}>
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Products Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Details</th>
              <th>Category</th>
              <th>Price (MRP / Sell)</th>
              <th>Stock</th>
              <th>Badges</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading catalog...</td></tr>
            ) : filteredProducts.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No products found.</td></tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id}>
                  <td style={{ width: '60px' }}>
                    <img
                      src={p.primary_image}
                      alt={p.title}
                      style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '4px', border: '1px solid #e2e8f0', backgroundColor: '#fff' }}
                    />
                  </td>
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '4px' }}>{p.title}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>Brand: {p.brand_name || 'Generic'}</div>
                  </td>
                  <td>
                    <span style={{ backgroundColor: '#f1f5f9', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 500 }}>
                      {p.category_name || 'General'}
                    </span>
                  </td>
                  <td>
                    <div>
                      <strong style={{ color: '#0f172a' }}>₹{(p.selling_price || 0).toLocaleString()}</strong>
                      <span style={{ fontSize: '11px', color: '#64748b', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ₹{(p.original_price || 0).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>{p.discount_percent || 0}% Off</div>
                  </td>
                  <td>
                    <span className={`badge-status ${p.stock < 10 ? 'badge-danger' : 'badge-success'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
                      {p.is_assured ? <span style={{ color: '#2563eb', fontWeight: 600 }}>★ Assured</span> : null}
                      {p.is_deal_of_day ? <span style={{ color: '#d97706', fontWeight: 600 }}>⚡ Deal of Day</span> : null}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        style={{ background: 'none', color: '#2874f0', padding: '4px', cursor: 'pointer' }}
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        style={{ background: 'none', color: '#ef4444', padding: '4px', cursor: 'pointer' }}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProduct ? 'Edit Flipkart Product' : 'Add New Flipkart Product'}
        maxWidth="740px"
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Product Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Apple iPhone 15 (Black, 128 GB)"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Category *</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                >
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Brand</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => setFormData({ ...formData, brand_id: e.target.value })}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                >
                  {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>MRP Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.original_price}
                  onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
                  placeholder="79900"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Selling Price (₹) *</label>
                <input
                  type="number"
                  required
                  value={formData.selling_price}
                  onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                  placeholder="65999"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Stock Units</label>
                <input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="50"
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Primary Image URL *</label>
              <input
                type="url"
                required
                value={formData.primary_image}
                onChange={(e) => setFormData({ ...formData, primary_image: e.target.value })}
                placeholder="https://images.unsplash.com/photo-..."
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Highlights (One per line)</label>
              <textarea
                rows={3}
                value={formData.highlights}
                onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                placeholder="128 GB ROM&#10;15.49 cm (6.1 inch) Super Retina XDR Display&#10;A16 Bionic Chip"
                style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '8px 12px', fontSize: '13px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '20px', paddingTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_assured}
                  onChange={(e) => setFormData({ ...formData, is_assured: e.target.checked })}
                />
                Flipkart Assured
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_deal_of_day}
                  onChange={(e) => setFormData({ ...formData, is_deal_of_day: e.target.checked })}
                />
                Deal of the Day
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                />
                Featured Store Product
              </label>
            </div>
          </div>

          <div className="admin-modal-footer">
            <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Save Product Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
