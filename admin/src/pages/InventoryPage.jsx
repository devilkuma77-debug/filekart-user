import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import { Warehouse, AlertTriangle, ArrowUpDown, Check } from 'lucide-react';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [stockVal, setStockVal] = useState('');

  const loadStock = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getProducts({ limit: 100 });
      if (res.success && res.products) setProducts(res.products);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStock();
  }, []);

  const handleUpdateStock = async (id) => {
    try {
      await adminApi.updateProduct(id, { stock: parseInt(stockVal) });
      setEditingId(null);
      loadStock();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div className="admin-card">
        <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Warehouse Inventory & Stock Adjustments</h2>
        <p style={{ fontSize: '12px', color: '#64748b' }}>Monitor stock levels across all fulfillment centers and adjust inventory in real time</p>
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>SKU / Product</th>
              <th>Category</th>
              <th>Current Stock</th>
              <th>Stock Status</th>
              <th>Warehouse Hub</th>
              <th>Adjust Inventory</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px' }}>Loading inventory...</td></tr>
            ) : products.map((p) => {
              const isLow = p.stock < 10;
              return (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{p.title}</div>
                    <div style={{ fontSize: '11px', color: '#64748b', fontFamily: 'monospace' }}>SKU-FK-{p.id}902</div>
                  </td>
                  <td>{p.category_name || 'General'}</td>
                  <td><strong>{p.stock} units</strong></td>
                  <td>
                    <span className={`badge-status ${isLow ? 'badge-danger' : 'badge-success'}`}>
                      {isLow ? 'Low Stock Alert' : 'In Stock'}
                    </span>
                  </td>
                  <td>Bengaluru Central Hub (WH-01)</td>
                  <td>
                    {editingId === p.id ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <input
                          type="number"
                          value={stockVal}
                          onChange={(e) => setStockVal(e.target.value)}
                          style={{ width: '70px', padding: '4px 8px', border: '1px solid #2874f0', borderRadius: '4px' }}
                        />
                        <button
                          onClick={() => handleUpdateStock(p.id)}
                          style={{ backgroundColor: '#2874f0', color: '#fff', padding: '5px 10px', borderRadius: '4px' }}
                        >
                          <Check size={14} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setEditingId(p.id); setStockVal(p.stock); }}
                        className="btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '12px' }}
                      >
                        Adjust
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
