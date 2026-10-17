import React, { useState } from 'react';
import { CheckCircle2, Package, ArrowRight, Download } from 'lucide-react';
import InvoiceModal from '../components/InvoiceModal';

export default function OrderSuccessPage({ order, onViewOrders, onContinueShopping }) {
  const [showInvoice, setShowInvoice] = useState(false);

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', backgroundColor: '#fff', padding: '48px 32px', borderRadius: '2px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', textAlign: 'center' }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#e8f5e9', marginBottom: '20px' }}>
        <CheckCircle2 size={48} color="#388e3c" />
      </div>

      <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>
        Order Placed Successfully!
      </h1>
      <p style={{ color: '#878787', fontSize: '15px', marginBottom: '24px' }}>
        Thank you for shopping with Flipkart! Your order confirmation has been recorded.
      </p>

      {/* Order Summary Pill */}
      <div style={{ backgroundColor: '#f9f9f9', border: '1px solid #eee', borderRadius: '4px', padding: '16px 24px', maxWidth: '480px', margin: '0 auto 30px', textAlign: 'left', fontSize: '13px', lineHeight: 1.8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#878787' }}>Order Number:</span>
          <strong>{order?.order_number || 'OD12948572918'}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#878787' }}>Total Paid:</span>
          <strong style={{ color: '#388e3c', fontSize: '15px' }}>₹{(order?.total_amount || 0).toLocaleString()}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#878787' }}>Payment Mode:</span>
          <span>{order?.payment_method || 'Online'}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#878787' }}>Delivery To:</span>
          <span>{order?.shipping_address?.name || 'Customer'}, {order?.shipping_address?.pincode}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="order-success-actions" style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
        <button
          onClick={() => setShowInvoice(true)}
          style={{
            border: '1px solid #2874f0',
            backgroundColor: '#fff',
            color: '#2874f0',
            fontWeight: 600,
            fontSize: '14px',
            padding: '12px 24px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Download size={16} /> Download Tax Invoice
        </button>

        <button
          onClick={onViewOrders}
          style={{
            backgroundColor: '#2874f0',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            padding: '12px 28px',
            borderRadius: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Package size={16} /> View in My Orders
        </button>

        <button
          onClick={onContinueShopping}
          style={{
            backgroundColor: '#fb641b',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            padding: '12px 28px',
            borderRadius: '2px'
          }}
        >
          Continue Shopping
        </button>
      </div>

      {showInvoice && (
        <InvoiceModal order={order} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}
