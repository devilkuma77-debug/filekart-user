import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { Check, Plus, ShieldCheck, CreditCard, Smartphone, Banknote, Landmark } from 'lucide-react';

export default function CheckoutPage({ onOrderPlaced, onBackToCart }) {
  const { cart, totals, user, openLoginModal, addresses, setAddresses, selectedAddress, setSelectedAddress, clearCart, showToast } = useShop();

  const [activeStep, setActiveStep] = useState(selectedAddress ? 3 : 2); // 1: Login, 2: Address, 3: Summary, 4: Payment
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'UPI', 'CARD', 'NETBANKING', 'COD'
  const [upiOption, setUpiOption] = useState('GPay');
  const [upiId, setUpiId] = useState('');
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

    if (paymentMethod === 'COD' && captchaInput !== captchaCode) {
      showToast('Please enter correct captcha verification code', 'error');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: cart,
        shipping_address: selectedAddress,
        payment_method: paymentMethod === 'COD' ? 'Cash On Delivery' : `${paymentMethod} (${paymentMethod === 'UPI' ? upiOption : 'Online'})`,
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
        payment_method: paymentMethod === 'COD' ? 'Cash On Delivery' : paymentMethod,
        created_at: new Date()
      };
      onOrderPlaced(mockOrder);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '14px auto', padding: '0 12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {/* Checkout Steps */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
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
                {/* UPI */}
                <label style={{ display: 'flex', gap: '12px', padding: '14px', border: paymentMethod === 'UPI' ? '1px solid #2874f0' : '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', backgroundColor: paymentMethod === 'UPI' ? '#f7faff' : '#fff' }}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, fontSize: '14px' }}>
                      <Smartphone size={16} color="#2874f0" /> UPI (Google Pay, PhonePe, Paytm, BHIM)
                    </div>
                    {paymentMethod === 'UPI' && (
                      <div style={{ marginTop: '12px' }}>
                        <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
                          {['GPay', 'PhonePe', 'Paytm', 'Any UPI ID'].map(app => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setUpiOption(app)}
                              style={{
                                padding: '6px 14px',
                                border: upiOption === app ? '2px solid #2874f0' : '1px solid #ccc',
                                borderRadius: '4px',
                                background: '#fff',
                                fontWeight: 500,
                                fontSize: '13px'
                              }}
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                        {upiOption === 'Any UPI ID' && (
                          <input
                            type="text"
                            placeholder="username@okhdfcbank"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            style={{ border: '1px solid #ccc', padding: '8px 12px', borderRadius: '2px', width: '260px' }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </label>

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
      <div style={{ width: '360px' }}>
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
    </div>
  );
}
