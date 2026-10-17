import React, { useState, useEffect } from 'react';
import { adminApi } from '../services/api';
import Modal from '../components/Modal';
import { Search, Eye, Download, Truck, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const statuses = [
    'all', 'Ordered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'
  ];

  const loadOrders = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getOrders({ status: statusFilter, search });
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter, search]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await adminApi.updateOrderStatus(orderId, newStatus, `Status updated to ${newStatus} by admin.`);
      loadOrders();
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({ ...prev, order_status: newStatus }));
      }
    } catch (err) {
      alert('Failed to update status: ' + err.message);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header & Search */}
      <div className="admin-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '16px', fontWeight: 700 }}>Customer Orders Pipeline ({orders.length})</h2>
          <p style={{ fontSize: '12px', color: '#64748b' }}>Fulfill, track, and update live order states</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border-color)', borderRadius: '6px', padding: '6px 12px', width: '280px', backgroundColor: '#fff' }}>
          <Search size={16} color="#64748b" style={{ marginRight: '8px' }} />
          <input
            type="text"
            placeholder="Search Order ID / Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ border: 'none', width: '100%', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            style={{
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: 600,
              backgroundColor: statusFilter === s ? '#2874f0' : '#fff',
              color: statusFilter === s ? '#fff' : '#64748b',
              border: statusFilter === s ? 'none' : '1px solid var(--border-color)',
              cursor: 'pointer',
              textTransform: 'capitalize'
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Payment</th>
              <th>Order Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>Loading orders...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan="7" style={{ textAlign: 'center', padding: '30px' }}>No orders found for selected filter.</td></tr>
            ) : (
              orders.map((ord) => {
                const isDelivered = ord.order_status === 'Delivered';
                const isCancelled = ord.order_status === 'Cancelled';
                const badgeClass =
                  isDelivered ? 'badge-success' :
                  isCancelled ? 'badge-danger' :
                  ord.order_status === 'Shipped' || ord.order_status === 'Packed' ? 'badge-info' : 'badge-warning';

                return (
                  <tr key={ord.id}>
                    <td>
                      <strong style={{ color: '#2563eb' }}>{ord.order_number}</strong>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>
                        {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{ord.customer_name || 'Customer'}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>{ord.customer_phone || ''}</div>
                    </td>
                    <td>
                      <span style={{ backgroundColor: '#f1f5f9', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 600 }}>
                        {(ord.items && ord.items.length) || 1} items
                      </span>
                    </td>
                    <td>
                      <strong style={{ fontSize: '14px' }}>₹{(ord.total_amount || 0).toLocaleString()}</strong>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px' }}>{ord.payment_method}</div>
                      <span className={`badge-status ${ord.payment_status === 'Paid' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: '10px', marginTop: '2px' }}>
                        {ord.payment_status}
                      </span>
                    </td>
                    <td>
                      {/* Live Status Selector */}
                      <select
                        value={ord.order_status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value)}
                        style={{
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '4px 8px',
                          fontSize: '12px',
                          fontWeight: 600,
                          backgroundColor: isDelivered ? '#dcfce7' : '#fff',
                          color: isDelivered ? '#15803d' : '#0f172a'
                        }}
                      >
                        {statuses.filter(s => s !== 'all').map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <button
                        onClick={() => setSelectedOrder(ord)}
                        className="btn-secondary"
                        style={{ padding: '5px 10px', fontSize: '12px' }}
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedOrder(null)}
          title={`Order Details - ${selectedOrder.order_number}`}
          maxWidth="700px"
        >
          <div className="admin-modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Header pill */}
            <div style={{ display: 'flex', justifyContent: 'space-between', backgroundColor: '#f8fafc', padding: '14px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Order Number</div>
                <strong>{selectedOrder.order_number}</strong>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Current Status</div>
                <span className="badge-status badge-info">{selectedOrder.order_status}</span>
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Total Paid</div>
                <strong style={{ color: '#16a34a' }}>₹{(selectedOrder.total_amount || 0).toLocaleString()}</strong>
              </div>
            </div>

            {/* Shipping Address */}
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', padding: '14px' }}>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '6px', color: '#475569' }}>Shipping / Delivery Address</div>
              <div style={{ fontSize: '13px', lineHeight: 1.6 }}>
                <strong>{selectedOrder.shipping_address?.name}</strong> | Phone: {selectedOrder.shipping_address?.phone}<br />
                {selectedOrder.shipping_address?.address}, {selectedOrder.shipping_address?.locality}<br />
                {selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state} - {selectedOrder.shipping_address?.pincode}
              </div>
            </div>

            {/* Items */}
            <div>
              <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '8px', color: '#475569' }}>Order Items</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                    <img src={item.primary_image} alt={item.title} style={{ width: '44px', height: '44px', objectFit: 'contain' }} />
                    <div style={{ flex: 1, fontSize: '13px' }}>
                      <div style={{ fontWeight: 600 }}>{item.title}</div>
                      <div style={{ color: '#64748b', fontSize: '12px' }}>Qty: {item.quantity} × ₹{item.selling_price.toLocaleString()}</div>
                    </div>
                    <strong>₹{(item.selling_price * item.quantity).toLocaleString()}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="admin-modal-footer">
            <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
            <button className="btn-primary" onClick={() => window.print()}>
              <Download size={14} /> Print Invoice
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
