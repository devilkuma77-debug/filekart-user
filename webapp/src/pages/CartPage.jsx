import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { api } from '../services/api';
import { ShieldCheck, Tag, Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';

export default function CartPage({ onProceedToCheckout, onContinueShopping, onSelectProduct }) {
  const { cart, updateQuantity, removeFromCart, totals, coupon, setCoupon, showToast, selectedAddress } = useShop();
  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setApplying(true);
    try {
      const res = await api.validateCoupon(couponInput.trim(), totals.totalSellingPrice);
      if (res.success && res.coupon) {
        setCoupon(res.coupon);
        showToast(res.message, 'success');
        setCouponInput('');
      } else {
        showToast(res.message || 'Invalid coupon', 'error');
      }
    } catch {
      // Demo coupon fallback
      if (couponInput.toUpperCase() === 'WELCOME100') {
        setCoupon({ code: 'WELCOME100', discount_amount: 100, description: 'Flat ₹100 Off' });
        showToast('Coupon WELCOME100 applied successfully!', 'success');
        setCouponInput('');
      } else {
        showToast('Invalid coupon. Try WELCOME100 or FKMEGA20', 'error');
      }
    } finally {
      setApplying(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCoupon(null);
    showToast('Coupon removed', 'info');
  };

  if (cart.length === 0) {
    return (
      <div style={{ maxWidth: '1000px', margin: '30px auto', backgroundColor: '#fff', padding: '60px', textAlign: 'center', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
        <img
          src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
          alt="Empty Cart"
          style={{ width: '220px', marginBottom: '20px' }}
        />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>Your cart is empty!</h2>
        <p style={{ color: '#878787', fontSize: '14px', marginBottom: '24px' }}>Explore our top categories and add items to your cart.</p>
        <button
          onClick={onContinueShopping}
          style={{
            backgroundColor: '#2874f0',
            color: '#fff',
            padding: '12px 48px',
            borderRadius: '2px',
            fontWeight: 600,
            fontSize: '14px',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.2)'
          }}
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-layout" style={{ maxWidth: '1280px', margin: '14px auto', padding: '0 12px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
      {/* Left: Cart Items */}
      <div style={{ flex: 1 }}>
        {/* Delivery Address Bar */}
        <div style={{
          backgroundColor: '#fff',
          padding: '14px 20px',
          borderRadius: '2px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          marginBottom: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '13px', color: '#878787' }}>Deliver to: </span>
            <strong style={{ fontSize: '14px' }}>{selectedAddress?.name || 'Aarav Kumar'}, {selectedAddress?.pincode || '560103'}</strong>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
              {selectedAddress?.address || 'Outer Ring Road, Bellandur, Bengaluru'}
            </div>
          </div>
          <button
            onClick={onProceedToCheckout}
            style={{
              border: '1px solid #e0e0e0',
              backgroundColor: '#fff',
              color: '#2874f0',
              fontWeight: 600,
              fontSize: '13px',
              padding: '8px 16px',
              borderRadius: '2px'
            }}
          >
            Change
          </button>
        </div>

        {/* Cart Items List */}
        <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
          {cart.map((item) => (
            <div
              key={item.id}
              className="cart-item-row"
              style={{
                display: 'flex',
                gap: '24px',
                padding: '24px',
                borderBottom: '1px solid #f0f0f0'
              }}
            >
              {/* Product Thumbnail */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '112px' }}>
                <div
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  style={{ width: '100px', height: '100px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <img
                    src={item.primary_image || (item.images && item.images[0])}
                    alt={item.title}
                    style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                  />
                </div>

                {/* Quantity Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px' }}>
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    disabled={item.quantity <= 1}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #c2c2c2',
                      background: item.quantity <= 1 ? '#f5f5f5' : '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <Minus size={14} color={item.quantity <= 1 ? '#bbb' : '#212121'} />
                  </button>

                  <span style={{
                    width: '36px',
                    textAlign: 'center',
                    border: '1px solid #e0e0e0',
                    borderRadius: '2px',
                    padding: '3px 0',
                    fontSize: '14px',
                    fontWeight: 600
                  }}>
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      border: '1px solid #c2c2c2',
                      background: '#fff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Plus size={14} color="#212121" />
                  </button>
                </div>
              </div>

              {/* Product Details */}
              <div style={{ flex: 1 }}>
                <div
                  onClick={() => onSelectProduct && onSelectProduct(item)}
                  style={{ fontSize: '16px', fontWeight: 500, color: '#212121', cursor: 'pointer', marginBottom: '6px' }}
                >
                  {item.title}
                </div>

                <div style={{ fontSize: '12px', color: '#878787', marginBottom: '10px' }}>
                  Seller: RetailNet <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="fa" style={{ height: '14px', verticalAlign: 'middle', marginLeft: '6px' }} />
                </div>

                {/* Price */}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>
                    ₹{(item.selling_price * item.quantity).toLocaleString()}
                  </span>
                  {item.original_price > item.selling_price && (
                    <>
                      <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>
                        ₹{(item.original_price * item.quantity).toLocaleString()}
                      </span>
                      <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: 600 }}>
                        {item.discount_percent || 15}% Off
                      </span>
                    </>
                  )}
                </div>

                {/* Remove & Save for Later */}
                <div style={{ display: 'flex', gap: '24px', fontSize: '14px', fontWeight: 600 }}>
                  <span
                    onClick={() => removeFromCart(item.id)}
                    style={{ cursor: 'pointer', color: '#212121', textTransform: 'uppercase' }}
                  >
                    REMOVE
                  </span>
                  <span
                    onClick={() => { removeFromCart(item.id); showToast('Saved for later', 'info'); }}
                    style={{ cursor: 'pointer', color: '#212121', textTransform: 'uppercase' }}
                  >
                    SAVE FOR LATER
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* Place Order Sticky Bottom Strip */}
          <div className="cart-place-order-bar" style={{
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 -2px 10px 0 rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', color: '#878787', textTransform: 'uppercase' }}>Total Amount</span>
              <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>₹{totals.finalPayable.toLocaleString()}</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="cart-place-order-btn"
              style={{
                backgroundColor: '#fb641b',
                color: '#fff',
                fontWeight: 600,
                fontSize: '15px',
                padding: '12px 36px',
                borderRadius: '2px',
                boxShadow: '0 1px 2px 0 rgba(0,0,0,0.2)',
                textTransform: 'uppercase',
                letterSpacing: '0.3px'
              }}
            >
              PLACE ORDER
            </button>
          </div>
        </div>
      </div>

      {/* Right: Price Details & Coupons */}
      <div className="cart-price-sidebar">
        {/* Coupon Card */}
        <div style={{
          backgroundColor: '#fff',
          padding: '16px 20px',
          borderRadius: '2px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>
            <Tag size={16} color="#2874f0" /> Apply Coupon
          </div>

          {coupon ? (
            <div style={{ backgroundColor: '#e8f5e9', border: '1px dashed #388e3c', padding: '10px 14px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#2e7d32', fontSize: '13px' }}>{coupon.code}</strong>
                <div style={{ fontSize: '11px', color: '#388e3c' }}>Saving ₹{coupon.discount_amount} on this order</div>
              </div>
              <button onClick={handleRemoveCoupon} style={{ background: 'none', color: '#d32f2f', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                REMOVE
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Enter Coupon (e.g. WELCOME100)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                style={{
                  flex: 1,
                  border: '1px solid #e0e0e0',
                  borderRadius: '2px',
                  padding: '8px 12px',
                  fontSize: '13px',
                  textTransform: 'uppercase'
                }}
              />
              <button
                type="submit"
                disabled={applying}
                style={{
                  backgroundColor: '#2874f0',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '13px',
                  padding: '0 16px',
                  borderRadius: '2px'
                }}
              >
                APPLY
              </button>
            </form>
          )}
          <div style={{ fontSize: '11px', color: '#878787', marginTop: '6px' }}>
            Try code <strong>WELCOME100</strong> or <strong>FLIPSUPER</strong>
          </div>
        </div>

        {/* Price Details Card */}
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '2px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '14px 20px',
            borderBottom: '1px solid #f0f0f0',
            fontWeight: 600,
            color: '#878787',
            fontSize: '13px',
            textTransform: 'uppercase'
          }}>
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
              <span style={{ color: '#388e3c' }}>
                {totals.deliveryCharge === 0 ? <><span style={{ textDecoration: 'line-through', color: '#878787', marginRight: '4px' }}>₹40</span> FREE</> : `₹${totals.deliveryCharge}`}
              </span>
            </div>

            <div style={{
              borderTop: '1px dashed #e0e0e0',
              paddingTop: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 700,
              fontSize: '18px',
              color: '#212121'
            }}>
              <span>Total Amount</span>
              <span>₹{totals.finalPayable.toLocaleString()}</span>
            </div>

            <div style={{
              borderTop: '1px solid #f0f0f0',
              paddingTop: '12px',
              color: '#388e3c',
              fontWeight: 600,
              fontSize: '13px'
            }}>
              You will save ₹{totals.totalSavings.toLocaleString()} on this order
            </div>
          </div>
        </div>

        {/* Safe Payments Guarantee */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', color: '#878787', fontSize: '12px', padding: '0 8px' }}>
          <ShieldCheck size={28} color="#878787" />
          <span>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
        </div>
      </div>
    </div>
  );
}
