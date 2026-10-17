import React from 'react';
import { X, Printer, Download } from 'lucide-react';

export default function InvoiceModal({ order, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const address = order.shipping_address || {};

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '750px',
          maxHeight: '90vh',
          borderRadius: '4px',
          overflowY: 'auto',
          padding: '20px 16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', cursor: 'pointer', color: '#666' }}
        >
          <X size={22} />
        </button>

        {/* Invoice Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #2874f0', paddingBottom: '16px', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
          <div>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#2874f0', fontStyle: 'italic' }}>Flipkart</div>
            <div style={{ fontSize: '11px', color: '#666' }}>Tax Invoice / Bill of Supply / Cash Receipt</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: 700 }}>Invoice #{order.order_number}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>Date: {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}</div>
          </div>
        </div>

        {/* Address and Sold By */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px', fontSize: '12px' }}>
          <div style={{ border: '1px solid #eee', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ fontSize: '13px', color: '#212121' }}>Sold By:</strong>
            <p style={{ marginTop: '4px', color: '#555' }}>
              RetailNet Private Limited<br />
              Plot No. 12, Tech Park, Bellandur<br />
              Bengaluru, Karnataka - 560103<br />
              GSTIN: 29AABCU9603R1ZM
            </p>
          </div>

          <div style={{ border: '1px solid #eee', padding: '12px', borderRadius: '4px' }}>
            <strong style={{ fontSize: '13px', color: '#212121' }}>Billing / Delivery Address:</strong>
            <p style={{ marginTop: '4px', color: '#555' }}>
              <strong>{address.name || 'Flipkart Customer'}</strong><br />
              {address.address}, {address.locality}<br />
              {address.city}, {address.state} - {address.pincode}<br />
              Phone: {address.phone}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '24px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f3f6', textAlign: 'left' }}>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>#</th>
              <th style={{ padding: '8px', border: '1px solid #ddd' }}>Description</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>Qty</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Price</th>
              <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {(order.items || []).map((item, idx) => (
              <tr key={idx}>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{idx + 1}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.title}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'center' }}>{item.quantity}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>₹{item.selling_price.toLocaleString()}</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'right' }}>₹{(item.selling_price * item.quantity).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Summary Totals */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
          <div style={{ width: '280px', fontSize: '13px', lineHeight: 1.8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Charges:</span>
              <span style={{ color: '#388e3c' }}>{order.delivery_charge ? `₹${order.delivery_charge}` : 'FREE'}</span>
            </div>
            {order.discount_amount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Discount / Coupon:</span>
                <span style={{ color: '#388e3c' }}>- ₹{order.discount_amount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '2px solid #212121', paddingTop: '6px', fontWeight: 700, fontSize: '15px' }}>
              <span>Grand Total:</span>
              <span>₹{(order.total_amount || 0).toLocaleString()}</span>
            </div>
            <div style={{ fontSize: '11px', color: '#666', textAlign: 'right', marginTop: '2px' }}>
              Payment: {order.payment_method} ({order.payment_status})
            </div>
          </div>
        </div>

        {/* Print / Download Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button
            onClick={handlePrint}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#2874f0',
              color: '#fff',
              padding: '8px 18px',
              borderRadius: '2px',
              fontWeight: 600,
              fontSize: '13px'
            }}
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}
