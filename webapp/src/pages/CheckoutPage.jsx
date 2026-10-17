import React, { useState, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { 
  Check, 
  Plus, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  Landmark, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  X, 
  Lock, 
  QrCode 
} from 'lucide-react';

// Google Pay Brand Icon
const GPayBrandIcon = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
    <svg width="20" height="20" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
    </svg>
    <span style={{ fontWeight: 600, fontSize: '14px', color: '#3c4043' }}>Google Pay</span>
  </div>
);

// PhonePe Brand Icon
const PhonePeBrandIcon = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
    <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#5f259f', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '11px' }}>
      पे
    </div>
    <span style={{ fontWeight: 600, fontSize: '14px', color: '#5f259f' }}>PhonePe</span>
  </div>
);

// Paytm Brand Icon
const PaytmBrandIcon = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
    <span style={{ fontWeight: 800, fontSize: '15px', color: '#002970', letterSpacing: '-0.5px' }}>
      Pay<span style={{ color: '#00b9f5' }}>tm</span>
    </span>
    <span style={{ fontSize: '11px', fontWeight: 600, color: '#00b9f5', border: '1px solid #00b9f5', borderRadius: '2px', padding: '1px 3px' }}>UPI</span>
  </div>
);

// Any UPI ID Brand Icon
const AnyUpiBrandIcon = () => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
    <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#2874f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '12px' }}>
      @
    </div>
    <span style={{ fontWeight: 600, fontSize: '14px', color: '#212121' }}>Any UPI ID</span>
  </div>
);

export default function CheckoutPage({ onOrderPlaced, onBackToCart }) {
  const { cart, totals, user, openLoginModal, addresses, setAddresses, selectedAddress, setSelectedAddress, clearCart, showToast } = useShop();

  const [activeStep, setActiveStep] = useState(selectedAddress ? 3 : 2); // 1: Login, 2: Address, 3: Summary, 4: Payment
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'COD'
  const [upiOption, setUpiOption] = useState('GPay');
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [upiVerifiedName, setUpiVerifiedName] = useState('');
  
  // UPI Processing Modal & Live Timer State
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiTimer, setUpiTimer] = useState(300);
  const [upiDeepLink, setUpiDeepLink] = useState('');
  const [upiPaymentState, setUpiPaymentState] = useState('waiting'); // 'waiting', 'verifying', 'success'

  const [cardData, setCardData] = useState({ number: '', name: '', expiry: '', cvv: '' });
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode] = useState('834');
  const [submitting, setSubmitting] = useState(false);

  // New Address Form State
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    pincode: '',
    locality: '',
    address: '',
    city: '',
    state: '',
    landmark: '',
    address_type: 'HOME'
  });

  // Live UPI Countdown Timer Effect
  useEffect(() => {
    let interval;
    if (upiModalOpen && upiTimer > 0 && upiPaymentState === 'waiting') {
      interval = setInterval(() => {
        setUpiTimer(t => (t <= 1 ? 0 : t - 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [upiModalOpen, upiTimer, upiPaymentState]);

  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleVerifyUpiId = () => {
    const trimmed = upiId.trim();
    if (!trimmed || !trimmed.includes('@') || trimmed.length < 5) {
      showToast('Please enter a valid UPI ID (e.g. mobile@upi)', 'error');
      setUpiVerified(false);
      return;
    }
    setUpiVerified(true);
    setUpiVerifiedName(user?.name ? `${user.name.toUpperCase()} (VERIFIED)` : 'VERIFIED CUSTOMER');
    showToast('UPI ID verified successfully!', 'success');
  };

  const triggerUpiPayment = (option = upiOption) => {
    if (!user) {
      openLoginModal();
      return;
    }
    if (!selectedAddress) {
      showToast('Please select a delivery address first', 'error');
      setActiveStep(2);
      return;
    }
    if (option === 'Any UPI ID' && (!upiId || !upiId.includes('@'))) {
      showToast('Please enter a valid UPI ID first (e.g. name@okhdfcbank)', 'error');
      return;
    }

    const payeeVpa = 'flipkart.pay@okaxis';
    const payeeName = 'Flipkart Internet Pvt Ltd';
    const amount = totals.finalPayable;
    const note = `Flipkart Order`;

    const genericLink = `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;

    let link = genericLink;
    if (option === 'GPay') {
      link = `tez://upi/pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (option === 'PhonePe') {
      link = `phonepe://upi/pay?pa=${encodeURIComponent('flipkart.pay@ybl')}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    } else if (option === 'Paytm') {
      link = `paytmmp://upi/pay?pa=${encodeURIComponent('flipkart.pay@paytm')}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    }

    setUpiDeepLink(link);
    setUpiTimer(300);
    setUpiPaymentState('waiting');
    setUpiModalOpen(true);

    // Try launching the UPI app directly on the user's mobile device
    try {
      const a = document.createElement('a');
      a.href = link;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (document.body.contains(a)) document.body.removeChild(a);
      }, 500);
    } catch (e) {
      console.log('UPI intent launch attempt', e);
    }
  };

  const handleConfirmUpiPayment = async () => {
    setUpiPaymentState('verifying');
    // Simulate real bank webhook acknowledgment
    setTimeout(async () => {
      setUpiPaymentState('success');
      showToast('Payment verified successfully!', 'success');
      setTimeout(async () => {
        setUpiModalOpen(false);
        await executeFinalOrder(`UPI (${upiOption})`);
      }, 1000);
    }, 1500);
  };

  const handleAddNewAddress = (e) => {
    e.preventDefault();
    if (!newAddr.name || !newAddr.phone || !newAddr.pincode || !newAddr.address) {
      showToast('Please fill all required address fields', 'error');
      return;
    }
    const created = { id: Date.now(), ...newAddr, is_default: 1 };
    setAddresses(prev => [created, ...prev]);
    setSelectedAddress(created);
    setShowAddAddress(false);
    setActiveStep(3);
    showToast('New delivery address added!', 'success');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      openLoginModal();
      return;
    }

    if (!selectedAddress) {
      showToast('Please select a delivery address', 'error');
      setActiveStep(2);
      return;
    }

    if (paymentMethod === 'UPI') {
      triggerUpiPayment(upiOption);
      return;
    }

    if (paymentMethod === 'COD' && captchaInput !== captchaCode) {
      showToast('Please enter correct captcha verification code', 'error');
      return;
    }

    await executeFinalOrder();
  };

  const executeFinalOrder = async (customMethod = null) => {
    setSubmitting(true);
    try {
      const selectedMethod = customMethod || (paymentMethod === 'COD' ? 'Cash On Delivery' : `${paymentMethod} (${paymentMethod === 'UPI' ? upiOption : 'Online'})`);
      const orderPayload = {
        items: cart,
        shipping_address: selectedAddress,
        payment_method: selectedMethod,
        total_amount: totals.finalPayable,
        discount_amount: totals.couponDiscount,
        delivery_charge: totals.deliveryCharge
      };

      const res = await api.createOrder(orderPayload);
      if (res.success) {
        clearCart();
        onOrderPlaced({
          id: res.orderId,
          order_number: res.orderNumber || `OD${Date.now()}`,
          total_amount: totals.finalPayable,
          items: cart,
          shipping_address: selectedAddress,
          payment_method: orderPayload.payment_method,
          created_at: new Date()
        });
      } else {
        showToast(res.message || 'Failed to place order', 'error');
      }
    } catch {
      // Offline fallback
      clearCart();
      const mockOrder = {
        id: Math.floor(Math.random() * 9000 + 1000),
        order_number: 'OD' + Math.floor(100000000000 + Math.random() * 900000000000),
        total_amount: totals.finalPayable,
        items: cart,
        shipping_address: selectedAddress,
        payment_method: customMethod || (paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod),
        created_at: new Date()
      };
      onOrderPlaced(mockOrder);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-container-layout" style={{ maxWidth: '1280px', margin: '14px auto', padding: '0 12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {/* Checkout Steps */}
      <div className="checkout-steps-column" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Step 1: Login */}
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px',
            backgroundColor: user ? '#fff' : '#2874f0',
            color: user ? '#878787' : '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
              <span style={{
                backgroundColor: user ? '#f0f0f0' : '#fff',
                color: user ? '#2874f0' : '#2874f0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontSize: '12px'
              }}>1</span>
              <span>LOGIN</span>
              {user && <Check size={16} color="#2874f0" />}
            </div>
            {user ? (
              <span style={{ fontSize: '13px', color: '#212121', fontWeight: 500 }}>
                {user.name} ({user.email || user.phone})
              </span>
            ) : (
              <button onClick={openLoginModal} style={{ backgroundColor: '#fff', color: '#2874f0', fontWeight: 600, padding: '4px 16px', borderRadius: '2px' }}>
                SIGN IN
              </button>
            )}
          </div>
        </div>

        {/* Step 2: Delivery Address */}
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px',
            backgroundColor: activeStep === 2 ? '#2874f0' : '#fff',
            color: activeStep === 2 ? '#fff' : '#878787',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
              <span style={{
                backgroundColor: activeStep === 2 ? '#fff' : '#f0f0f0',
                color: '#2874f0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontSize: '12px'
              }}>2</span>
              <span>DELIVERY ADDRESS</span>
              {activeStep > 2 && selectedAddress && <Check size={16} color="#2874f0" />}
            </div>
            {activeStep > 2 && selectedAddress && (
              <button
                onClick={() => setActiveStep(2)}
                style={{ border: '1px solid #e0e0e0', backgroundColor: '#fff', color: '#2874f0', fontWeight: 600, padding: '4px 16px', borderRadius: '2px', fontSize: '12px' }}
              >
                CHANGE
              </button>
            )}
          </div>

          {activeStep === 2 && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    style={{
                      display: 'flex',
                      gap: '12px',
                      padding: '14px',
                      border: selectedAddress?.id === addr.id ? '1px solid #2874f0' : '1px solid #e0e0e0',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: selectedAddress?.id === addr.id ? '#f7faff' : '#fff'
                    }}
                  >
                    <input
                      type="radio"
                      name="selected_addr"
                      checked={selectedAddress?.id === addr.id}
                      onChange={() => setSelectedAddress(addr)}
                      style={{ marginTop: '4px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <strong style={{ fontSize: '14px' }}>{addr.name}</strong>
                        <span style={{ fontSize: '11px', backgroundColor: '#f0f0f0', padding: '2px 6px', borderRadius: '2px', fontWeight: 600 }}>
                          {addr.address_type}
                        </span>
                        <strong style={{ fontSize: '14px' }}>{addr.phone}</strong>
                      </div>
                      <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>
                        {addr.address}, {addr.locality}, {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </div>
                      {selectedAddress?.id === addr.id && (
                        <button
                          onClick={() => setActiveStep(3)}
                          style={{
                            marginTop: '12px',
                            backgroundColor: '#fb641b',
                            color: '#fff',
                            fontWeight: 600,
                            padding: '10px 24px',
                            borderRadius: '2px',
                            fontSize: '13px'
                          }}
                        >
                          DELIVER HERE
                        </button>
                      )}
                    </div>
                  </label>
                ))}
              </div>

              {!showAddAddress ? (
                <button
                  onClick={() => setShowAddAddress(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#2874f0',
                    fontWeight: 600,
                    fontSize: '14px',
                    background: 'none',
                    padding: '8px 0'
                  }}
                >
                  <Plus size={18} /> Add a new address
                </button>
              ) : (
                <form onSubmit={handleAddNewAddress} style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                  <h4 style={{ marginBottom: '14px', fontSize: '14px' }}>ADD NEW ADDRESS</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Name *"
                      value={newAddr.name}
                      onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                      style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="10-digit mobile number *"
                      value={newAddr.phone}
                      onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                      style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                    <input
                      type="text"
                      required
                      placeholder="Pincode *"
                      value={newAddr.pincode}
                      onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                      style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="Locality *"
                      value={newAddr.locality}
                      onChange={(e) => setNewAddr({ ...newAddr, locality: e.target.value })}
                      style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                  </div>
                  <div style={{ marginBottom: '12px' }}>
                    <textarea
                      required
                      placeholder="Address (Area and Street) *"
                      rows={2}
                      value={newAddr.address}
                      onChange={(e) => setNewAddr({ ...newAddr, address: e.target.value })}
                      style={{ width: '100%', border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                    <input
                      type="text"
                      required
                      placeholder="City/District/Town *"
                      value={newAddr.city}
                      onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                      style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                    <input
                      type="text"
                      required
                      placeholder="State *"
                      value={newAddr.state}
                      onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                      style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '2px' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button
                      type="submit"
                      style={{ backgroundColor: '#fb641b', color: '#fff', fontWeight: 600, padding: '10px 24px', borderRadius: '2px' }}
                    >
                      SAVE AND DELIVER HERE
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      style={{ background: 'none', color: '#2874f0', fontWeight: 600, padding: '10px' }}
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* Step 3: Order Summary */}
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px',
            backgroundColor: activeStep === 3 ? '#2874f0' : '#fff',
            color: activeStep === 3 ? '#fff' : '#878787',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 600 }}>
              <span style={{
                backgroundColor: activeStep === 3 ? '#fff' : '#f0f0f0',
                color: '#2874f0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '2px',
                fontSize: '12px'
              }}>3</span>
              <span>ORDER SUMMARY</span>
              {activeStep > 3 && <Check size={16} color="#2874f0" />}
            </div>
            {activeStep > 3 && (
              <button
                onClick={() => setActiveStep(3)}
                style={{ border: '1px solid #e0e0e0', backgroundColor: '#fff', color: '#2874f0', fontWeight: 600, padding: '4px 16px', borderRadius: '2px', fontSize: '12px' }}
              >
                CHANGE
              </button>
            )}
          </div>

          {activeStep === 3 && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
                {cart.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #f0f0f0', paddingBottom: '12px' }}>
                    <img src={item.primary_image} alt={item.title} style={{ width: '60px', height: '60px', objectFit: 'contain' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.title}</div>
                      <div style={{ fontSize: '12px', color: '#878787', marginTop: '2px' }}>Qty: {item.quantity}</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, marginTop: '4px' }}>
                        ₹{(item.selling_price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#878787' }}>
                  Order confirmation email will be sent to <strong>{user?.email || 'customer@flipkart.com'}</strong>
                </span>
                <button
                  onClick={() => setActiveStep(4)}
                  style={{ backgroundColor: '#fb641b', color: '#fff', fontWeight: 600, padding: '12px 32px', borderRadius: '2px', textTransform: 'uppercase' }}
                >
                  CONTINUE
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 4: Payment Options */}
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
          <div style={{
            padding: '14px 24px',
            backgroundColor: activeStep === 4 ? '#2874f0' : '#fff',
            color: activeStep === 4 ? '#fff' : '#878787',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontWeight: 600
          }}>
            <span style={{
              backgroundColor: activeStep === 4 ? '#fff' : '#f0f0f0',
              color: '#2874f0',
              width: '20px',
              height: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '2px',
              fontSize: '12px'
            }}>4</span>
            <span>PAYMENT OPTIONS</span>
          </div>

          {activeStep === 4 && (
            <div style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* UPI (Google Pay, PhonePe, Paytm, BHIM) */}
                <div style={{
                  border: paymentMethod === 'UPI' ? '1px solid #2874f0' : '1px solid #e0e0e0',
                  borderRadius: '4px',
                  backgroundColor: paymentMethod === 'UPI' ? '#fbfdff' : '#fff',
                  overflow: 'hidden'
                }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '16px',
                    cursor: 'pointer',
                    backgroundColor: paymentMethod === 'UPI' ? '#f0f5ff' : '#fff',
                    borderBottom: paymentMethod === 'UPI' ? '1px solid #d0e2ff' : 'none'
                  }}>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      style={{ width: '16px', height: '16px', accentColor: '#2874f0' }}
                    />
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600, fontSize: '15px' }}>
                        <Smartphone size={18} color="#2874f0" />
                        <span>UPI (Google Pay, PhonePe, Paytm, BHIM)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', backgroundColor: '#e8f5e9', color: '#2e7d32', padding: '3px 8px', borderRadius: '3px', fontWeight: 600 }}>
                          FASTEST & ZERO CHARGES
                        </span>
                      </div>
                    </div>
                  </label>

                  {paymentMethod === 'UPI' && (
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ fontSize: '13px', color: '#666', fontWeight: 500, marginBottom: '2px' }}>
                        Select your preferred UPI App or enter any UPI ID:
                      </div>

                      {/* 1. GPay */}
                      <div
                        onClick={() => setUpiOption('GPay')}
                        style={{
                          border: upiOption === 'GPay' ? '1.5px solid #2874f0' : '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '12px 14px',
                          backgroundColor: upiOption === 'GPay' ? '#f5f8ff' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="upi_sub_option"
                              checked={upiOption === 'GPay'}
                              onChange={() => setUpiOption('GPay')}
                              style={{ accentColor: '#2874f0' }}
                            />
                            <GPayBrandIcon />
                          </div>
                          <span style={{ fontSize: '12px', color: '#878787' }}>Instant via Google Pay</span>
                        </div>

                        {upiOption === 'GPay' && (
                          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #d0e2ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#444' }}>
                              Tap to open <strong>Google Pay</strong> app and pay directly.
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); triggerUpiPayment('GPay'); }}
                              style={{
                                backgroundColor: '#2874f0',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '2px',
                                fontWeight: 700,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 4px rgba(40,116,240,0.3)',
                                textTransform: 'uppercase'
                              }}
                            >
                              <ExternalLink size={14} /> PAY NOW ₹{totals.finalPayable.toLocaleString()}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 2. PhonePe */}
                      <div
                        onClick={() => setUpiOption('PhonePe')}
                        style={{
                          border: upiOption === 'PhonePe' ? '1.5px solid #5f259f' : '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '12px 14px',
                          backgroundColor: upiOption === 'PhonePe' ? '#faf5ff' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="upi_sub_option"
                              checked={upiOption === 'PhonePe'}
                              onChange={() => setUpiOption('PhonePe')}
                              style={{ accentColor: '#5f259f' }}
                            />
                            <PhonePeBrandIcon />
                          </div>
                          <span style={{ fontSize: '12px', color: '#878787' }}>Instant via PhonePe</span>
                        </div>

                        {upiOption === 'PhonePe' && (
                          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #e9d5ff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#444' }}>
                              Tap to open <strong>PhonePe</strong> app and approve payment.
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); triggerUpiPayment('PhonePe'); }}
                              style={{
                                backgroundColor: '#5f259f',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '2px',
                                fontWeight: 700,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 4px rgba(95,37,159,0.3)',
                                textTransform: 'uppercase'
                              }}
                            >
                              <ExternalLink size={14} /> PAY NOW ₹{totals.finalPayable.toLocaleString()}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 3. Paytm */}
                      <div
                        onClick={() => setUpiOption('Paytm')}
                        style={{
                          border: upiOption === 'Paytm' ? '1.5px solid #002970' : '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '12px 14px',
                          backgroundColor: upiOption === 'Paytm' ? '#f0f9ff' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="upi_sub_option"
                              checked={upiOption === 'Paytm'}
                              onChange={() => setUpiOption('Paytm')}
                              style={{ accentColor: '#002970' }}
                            />
                            <PaytmBrandIcon />
                          </div>
                          <span style={{ fontSize: '12px', color: '#878787' }}>Instant via Paytm</span>
                        </div>

                        {upiOption === 'Paytm' && (
                          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                            <div style={{ fontSize: '13px', color: '#444' }}>
                              Tap to open <strong>Paytm</strong> app and approve payment request.
                            </div>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); triggerUpiPayment('Paytm'); }}
                              style={{
                                backgroundColor: '#002970',
                                color: '#fff',
                                border: 'none',
                                padding: '10px 22px',
                                borderRadius: '2px',
                                fontWeight: 700,
                                fontSize: '13px',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                boxShadow: '0 2px 4px rgba(0,41,112,0.3)',
                                textTransform: 'uppercase'
                              }}
                            >
                              <ExternalLink size={14} /> PAY NOW ₹{totals.finalPayable.toLocaleString()}
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 4. Any UPI ID */}
                      <div
                        onClick={() => setUpiOption('Any UPI ID')}
                        style={{
                          border: upiOption === 'Any UPI ID' ? '1.5px solid #2874f0' : '1px solid #e0e0e0',
                          borderRadius: '4px',
                          padding: '12px 14px',
                          backgroundColor: upiOption === 'Any UPI ID' ? '#fbfdff' : '#fff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <input
                              type="radio"
                              name="upi_sub_option"
                              checked={upiOption === 'Any UPI ID'}
                              onChange={() => setUpiOption('Any UPI ID')}
                              style={{ accentColor: '#2874f0' }}
                            />
                            <AnyUpiBrandIcon />
                          </div>
                          <span style={{ fontSize: '12px', color: '#878787' }}>BHIM / Cred / Any Bank UPI</span>
                        </div>

                        {upiOption === 'Any UPI ID' && (
                          <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px dashed #d0e2ff' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                              <input
                                type="text"
                                placeholder="e.g. 9876543210@paytm, name@okhdfcbank"
                                value={upiId}
                                onClick={(e) => e.stopPropagation()}
                                onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                                style={{
                                  border: upiVerified ? '1px solid #388e3c' : '1px solid #ccc',
                                  padding: '9px 12px',
                                  borderRadius: '2px',
                                  flex: '1 1 200px',
                                  maxWidth: '100%',
                                  fontSize: '13px',
                                  outline: 'none'
                                }}
                              />
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); handleVerifyUpiId(); }}
                                style={{
                                  backgroundColor: upiVerified ? '#e8f5e9' : '#fff',
                                  color: upiVerified ? '#2e7d32' : '#2874f0',
                                  border: upiVerified ? '1px solid #a5d6a7' : '1px solid #2874f0',
                                  padding: '9px 16px',
                                  borderRadius: '2px',
                                  fontWeight: 600,
                                  fontSize: '12px',
                                  cursor: 'pointer',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {upiVerified ? '✓ VERIFIED' : 'VERIFY'}
                              </button>
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); triggerUpiPayment('Any UPI ID'); }}
                                style={{
                                  backgroundColor: '#fb641b',
                                  color: '#fff',
                                  border: 'none',
                                  padding: '9px 24px',
                                  borderRadius: '2px',
                                  fontWeight: 700,
                                  fontSize: '13px',
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  textTransform: 'uppercase',
                                  flexGrow: 1,
                                  justifyContent: 'center'
                                }}
                              >
                                <ExternalLink size={14} /> PAY NOW ₹{totals.finalPayable.toLocaleString()}
                              </button>
                            </div>
                            {upiVerified && (
                              <div style={{ marginTop: '8px', fontSize: '12px', color: '#2e7d32', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <CheckCircle2 size={13} /> {upiVerifiedName}
                              </div>
                            )}
                            <div style={{ fontSize: '11px', color: '#878787', marginTop: '6px' }}>
                              A collect request will be sent to your UPI ID. Open your UPI app and approve payment.
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Credit / Debit Card */}
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: paymentMethod === 'CARD' ? '1px solid #2874f0' : '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === 'CARD' ? '#f7faff' : '#fff' }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => setPaymentMethod('CARD')}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                      <CreditCard size={16} color="#2874f0" /> Credit / Debit / ATM Card
                    </div>
                    {paymentMethod === 'CARD' && (
                      <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '340px' }}>
                        <input
                          type="text"
                          placeholder="Card Number"
                          maxLength={19}
                          value={cardData.number}
                          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                          style={{ border: '1px solid #ccc', padding: '8px 12px', borderRadius: '2px' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            style={{ border: '1px solid #ccc', padding: '8px 12px', borderRadius: '2px' }}
                          />
                          <input
                            type="password"
                            placeholder="CVV"
                            maxLength={3}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            style={{ border: '1px solid #ccc', padding: '8px 12px', borderRadius: '2px' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </label>

                {/* Net Banking */}
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: paymentMethod === 'NETBANKING' ? '1px solid #2874f0' : '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === 'NETBANKING' ? '#f7faff' : '#fff' }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'NETBANKING'}
                    onChange={() => setPaymentMethod('NETBANKING')}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                      <Landmark size={16} color="#2874f0" /> Net Banking (All Indian Banks Supported)
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: paymentMethod === 'COD' ? '1px solid #2874f0' : '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === 'COD' ? '#f7faff' : '#fff' }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                      <Banknote size={16} color="#388e3c" /> Cash on Delivery (Pay at your doorstep)
                    </div>
                    {paymentMethod === 'COD' && (
                      <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ backgroundColor: '#f0f0f0', padding: '8px 14px', letterSpacing: '4px', fontWeight: 700, fontSize: '16px', color: '#2874f0' }}>
                          {captchaCode}
                        </span>
                        <input
                          type="text"
                          placeholder="Enter characters"
                          maxLength={3}
                          value={captchaInput}
                          onChange={(e) => setCaptchaInput(e.target.value)}
                          style={{ border: '1px solid #ccc', padding: '8px 12px', borderRadius: '2px', width: '140px' }}
                        />
                      </div>
                    )}
                  </div>
                </label>
              </div>

              {/* Confirm Order Button */}
              <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting}
                  style={{
                    backgroundColor: '#fb641b',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '16px',
                    padding: '14px 44px',
                    borderRadius: '2px',
                    boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)',
                    textTransform: 'uppercase'
                  }}
                >
                  {submitting ? 'PROCESSING...' : `CONFIRM ORDER (₹${totals.finalPayable.toLocaleString()})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right: Price Summary */}
      <div className="checkout-summary-column" style={{ width: '360px' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', fontWeight: 600, color: '#878787', fontSize: '13px' }}>
            PRICE DETAILS
          </div>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Price ({totals.itemCount} items)</span>
              <span>₹{totals.totalMrp.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Discount</span>
              <span style={{ color: '#388e3c' }}>- ₹{totals.totalDiscount.toLocaleString()}</span>
            </div>
            {totals.couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Coupon Discount</span>
                <span style={{ color: '#388e3c' }}>- ₹{totals.couponDiscount.toLocaleString()}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Delivery Charges</span>
              <span style={{ color: '#388e3c' }}>{totals.deliveryCharge === 0 ? 'FREE' : `₹${totals.deliveryCharge}`}</span>
            </div>
            <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px' }}>
              <span>Total Payable</span>
              <span>₹{totals.finalPayable.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', color: '#878787', fontSize: '12px', padding: '0 8px' }}>
          <ShieldCheck size={28} color="#878787" />
          <span>Safe and Secure Payments. 100% Authentic products guaranteed.</span>
        </div>
      </div>

      {/* UPI Payment Processing Modal */}
      {upiModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#fff',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.2s ease-out'
          }}>
            {/* Modal Header */}
            <div style={{
              backgroundColor: '#2874f0',
              color: '#fff',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ backgroundColor: '#fff', borderRadius: '3px', padding: '2px 6px', display: 'flex' }}>
                  <span style={{ color: '#2874f0', fontWeight: 900, fontSize: '12px', fontStyle: 'italic' }}>Flipkart</span>
                </div>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>UPI Payment Gateway</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Are you sure you want to cancel this UPI payment?')) {
                    setUpiModalOpen(false);
                  }
                }}
                style={{ background: 'transparent', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Content */}
            <div style={{ padding: '24px 20px', textAlign: 'center' }}>
              {upiPaymentState === 'waiting' && (
                <>
                  {/* Timer Badge */}
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    backgroundColor: '#fff8e1',
                    border: '1px solid #ffe082',
                    color: '#b78103',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}>
                    <Clock size={15} /> Complete payment in {formatTimer(upiTimer)}
                  </div>

                  {/* Amount to Pay */}
                  <div style={{ fontSize: '12px', color: '#878787', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    Total Payable Amount
                  </div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#212121', margin: '4px 0 16px' }}>
                    ₹{totals.finalPayable.toLocaleString()}
                  </div>

                  {/* Payment Target Box */}
                  <div style={{
                    backgroundColor: '#f8f9fa',
                    border: '1px solid #e9ecef',
                    borderRadius: '6px',
                    padding: '12px 16px',
                    marginBottom: '18px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#878787' }}>Payment via</div>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#212121', marginTop: '2px' }}>
                        {upiOption === 'GPay' ? 'Google Pay' : upiOption === 'PhonePe' ? 'PhonePe' : upiOption === 'Paytm' ? 'Paytm' : upiId || 'UPI App'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '11px', color: '#878787' }}>Payee: Flipkart Internet</div>
                      <div style={{ fontSize: '11px', color: '#2874f0', fontWeight: 600 }}>flipkart.pay@okaxis</div>
                    </div>
                  </div>

                  {/* Open App Now Button */}
                  <a
                    href={upiDeepLink}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      width: '100%',
                      backgroundColor: upiOption === 'PhonePe' ? '#5f259f' : upiOption === 'Paytm' ? '#002970' : '#2874f0',
                      color: '#fff',
                      padding: '13px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      fontSize: '15px',
                      textDecoration: 'none',
                      boxShadow: '0 3px 8px rgba(0,0,0,0.18)',
                      marginBottom: '16px',
                      textTransform: 'uppercase'
                    }}
                  >
                    <ExternalLink size={18} /> OPEN {upiOption.toUpperCase()} APP & PAY NOW
                  </a>

                  {/* QR Code Section for desktop */}
                  <div style={{ margin: '14px 0', borderTop: '1px dashed #e0e0e0', paddingTop: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                      OR scan QR code on phone using any UPI app
                    </div>
                    <div style={{
                      display: 'inline-block',
                      padding: '8px',
                      background: '#fff',
                      border: '1px solid #e0e0e0',
                      borderRadius: '6px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                    }}>
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiDeepLink)}`}
                        alt="UPI QR Code"
                        style={{ width: '150px', height: '150px', display: 'block' }}
                      />
                    </div>
                  </div>

                  {/* Confirm / Simulate Button */}
                  <div style={{ marginTop: '16px' }}>
                    <button
                      type="button"
                      onClick={handleConfirmUpiPayment}
                      style={{
                        width: '100%',
                        backgroundColor: '#388e3c',
                        color: '#fff',
                        border: 'none',
                        padding: '12px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        fontSize: '14px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <CheckCircle2 size={18} /> I HAVE COMPLETED PAYMENT
                    </button>
                    <div style={{ fontSize: '11px', color: '#878787', marginTop: '8px' }}>
                      Order confirms automatically once UPI approval is detected
                    </div>
                  </div>
                </>
              )}

              {upiPaymentState === 'verifying' && (
                <div style={{ padding: '36px 16px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    border: '4px solid #f3f3f3',
                    borderTop: '4px solid #2874f0',
                    borderRadius: '50%',
                    margin: '0 auto 16px',
                    animation: 'spin 1s linear infinite'
                  }} />
                  <div style={{ fontSize: '17px', fontWeight: 700, color: '#212121' }}>
                    Verifying Payment with Bank Gateway...
                  </div>
                  <div style={{ fontSize: '13px', color: '#878787', marginTop: '6px' }}>
                    Please do not refresh or close this screen
                  </div>
                </div>
              )}

              {upiPaymentState === 'success' && (
                <div style={{ padding: '36px 16px' }}>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '50%',
                    backgroundColor: '#e8f5e9',
                    color: '#388e3c',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px'
                  }}>
                    <CheckCircle2 size={36} color="#388e3c" />
                  </div>
                  <div style={{ fontSize: '19px', fontWeight: 700, color: '#388e3c' }}>
                    Payment Received Successfully!
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', marginTop: '6px' }}>
                    Redirecting to your order confirmation...
                  </div>
                </div>
              )}

              {/* Security Footer */}
              <div style={{
                marginTop: '18px',
                paddingTop: '12px',
                borderTop: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#878787'
              }}>
                <Lock size={12} color="#388e3c" /> 100% Safe & Secure UPI Payments | NPCI Verified
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
