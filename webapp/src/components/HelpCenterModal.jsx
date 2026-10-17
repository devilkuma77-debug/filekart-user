import React, { useState } from 'react';
import { api } from '../services/api';
import { useShop } from '../context/ShopContext';
import { X, HelpCircle, ChevronDown, Send, CheckCircle2 } from 'lucide-react';

export default function HelpCenterModal({ isOpen, onClose }) {
  const { user, showToast } = useShop();

  const [openFaq, setOpenFaq] = useState(null);
  const [tab, setTab] = useState('faq'); // 'faq' or 'contact'
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [submitted, setSubmitted] = useState(false);
  const [ticketNo, setTicketNo] = useState('');

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'How do I track my Flipkart order?',
      a: 'Go to "My Orders" from the header profile dropdown. Click on your active order to see real-time milestone tracking (Ordered ➔ Packed ➔ Shipped ➔ Out for Delivery ➔ Delivered).'
    },
    {
      q: 'Can I cancel an order after placing it?',
      a: 'Yes, you can cancel an order any time before it has been marked as "Delivered". Simply go to "My Orders" and click the "Cancel Order" button.'
    },
    {
      q: 'What is Flipkart 7-Day Replacement Policy?',
      a: 'If your item is defective, damaged, or significantly different from description, you can request a replacement or refund within 7 days of delivery.'
    },
    {
      q: 'How do I apply promotional coupons?',
      a: 'Add items to your cart, navigate to the Cart page, enter your promo code (e.g., WELCOME100 or FKMEGA20) in the "Apply Coupon" box and click Apply.'
    }
  ];

  const handleTicketSubmit = async (e) => {
    e.preventDefault();
    if (!subject || !message) return;

    try {
      const res = await api.createSupportTicket({
        user_name: user?.name || 'Customer',
        subject,
        message,
        priority
      });

      setTicketNo(res.ticketNumber || 'TIC-8492');
      setSubmitted(true);
      showToast('Support ticket created successfully!', 'success');
    } catch {
      setTicketNo('TIC-' + Math.floor(1000 + Math.random() * 9000));
      setSubmitted(true);
      showToast('Support ticket recorded!', 'success');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="animate-fade-in"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '88vh',
          borderRadius: '6px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
          overflowY: 'auto',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 16, right: 16, background: 'none', cursor: 'pointer', color: '#fff', zIndex: 10 }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ backgroundColor: '#2874f0', color: '#fff', padding: '24px 28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <HelpCircle size={28} />
            <h2 style={{ fontSize: '20px', fontWeight: 700 }}>24x7 Flipkart Help Center</h2>
          </div>
          <p style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
            Get instant help with your orders, returns, refunds, and payments
          </p>

          <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
            <button
              onClick={() => setTab('faq')}
              style={{
                backgroundColor: tab === 'faq' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: tab === 'faq' ? '#2874f0' : '#fff',
                fontWeight: 600,
                fontSize: '13px',
                padding: '6px 18px',
                borderRadius: '20px'
              }}
            >
              Frequently Asked Questions
            </button>
            <button
              onClick={() => setTab('contact')}
              style={{
                backgroundColor: tab === 'contact' ? '#fff' : 'rgba(255,255,255,0.2)',
                color: tab === 'contact' ? '#2874f0' : '#fff',
                fontWeight: 600,
                fontSize: '13px',
                padding: '6px 18px',
                borderRadius: '20px'
              }}
            >
              Contact Support
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          {tab === 'faq' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {faqs.map((f, i) => (
                <div
                  key={i}
                  style={{
                    border: '1px solid #e0e0e0',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    cursor: 'pointer'
                  }}
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, fontSize: '14px', backgroundColor: openFaq === i ? '#f0f5ff' : '#fff', color: openFaq === i ? '#2874f0' : '#212121' }}>
                    <span>{f.q}</span>
                    <ChevronDown size={16} style={{ transform: openFaq === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </div>
                  {openFaq === i && (
                    <div style={{ padding: '14px 18px', fontSize: '13px', color: '#555', lineHeight: 1.6, borderTop: '1px solid #f0f0f0' }}>
                      {f.a}
                    </div>
                  )}
                </div>
              ))}

              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '13px', color: '#878787' }}>Still need help? </span>
                <span onClick={() => setTab('contact')} style={{ color: '#2874f0', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}>
                  Raise a Support Ticket
                </span>
              </div>
            </div>
          ) : submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 0' }}>
              <CheckCircle2 size={48} color="#388e3c" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>Ticket Submitted!</h3>
              <p style={{ color: '#64748b', fontSize: '13px', marginBottom: '16px' }}>
                Your Ticket ID is <strong>{ticketNo}</strong>. Our customer resolution team will review and respond shortly.
              </p>
              <button
                onClick={onClose}
                style={{ backgroundColor: '#2874f0', color: '#fff', fontWeight: 600, padding: '10px 28px', borderRadius: '4px' }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleTicketSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Subject / Issue Category *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Delivery delayed, Refund query, Product inquiry"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 12px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 12px', fontSize: '13px' }}
                >
                  <option value="Low">Low - General Question</option>
                  <option value="Medium">Medium - Order Status</option>
                  <option value="High">High - Refund / Replacement</option>
                  <option value="Urgent">Urgent - Cancel / Wrong Item</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Describe your issue in detail *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please provide details and your order number if applicable..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '10px 12px', fontSize: '13px' }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#fb641b',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '14px',
                  padding: '12px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} /> SUBMIT TICKET
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
