import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { Star, ShoppingCart, Zap, Tag, MapPin, ShieldCheck, Heart, ThumbsUp, ThumbsDown, ChevronRight, Award, RefreshCw } from 'lucide-react';

export default function ProductDetailPage({ product, onAddToCart, onBuyNow, onBack, onSelectProduct }) {
  const { toggleWishlist, isInWishlist } = useShop();

  const [selectedImg, setSelectedImg] = useState(
    product.primary_image || (product.images && product.images[0]) || ''
  );
  const [selectedStorage, setSelectedStorage] = useState('128 GB');
  const [selectedColor, setSelectedColor] = useState('Black');
  const [pincode, setPincode] = useState('560103');
  const [pincodeChecked, setPincodeChecked] = useState(true);
  const [helpfulCounts, setHelpfulCounts] = useState({ 1: 42, 2: 18 });

  const images = (product.images && product.images.length > 0)
    ? product.images
    : [product.primary_image, 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600&q=80', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&q=80'];

  const highlights = Array.isArray(product.highlights) && product.highlights.length > 0
    ? product.highlights
    : [
        '128 GB ROM | 6.1 inch Super Retina Display',
        '48MP + 12MP Camera | 12MP Front Camera',
        'A16 Bionic Chip, 6 Core Processor',
        '1 Year Manufacturer Warranty for Device',
        '7 Days Replacement Policy'
      ];

  const specs = (typeof product.specifications === 'object' && product.specifications && Object.keys(product.specifications).length > 0)
    ? product.specifications
    : {
        'In The Box': 'Handset, USB-C Charge Cable, Documentation',
        'Model Number': 'MTP03HN/A',
        'Model Name': product.title,
        'Color': selectedColor,
        'Browse Type': 'Smartphones',
        'SIM Type': 'Dual SIM (nano + eSIM)',
        'Display Size': '15.49 cm (6.1 inch)',
        'Resolution': '2556 x 1179 Pixels',
        'Operating System': 'iOS 17',
        'Processor Type': 'A16 Bionic Chip',
        'Internal Storage': selectedStorage,
        'Primary Camera': '48MP + 12MP',
        'Secondary Camera': '12MP Front Camera',
        'Warranty': '1 Year Manufacturer Warranty for Device'
      };

  const wishlisted = isInWishlist(product.id);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (pincode.trim().length === 6) {
      setPincodeChecked(true);
    }
  };

  const toggleHelpful = (id) => {
    setHelpfulCounts(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  return (
    <div style={{ maxWidth: '1360px', margin: '14px auto', padding: '0 12px' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ fontSize: '12px', color: '#878787', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span onClick={onBack} style={{ cursor: 'pointer', color: '#2874f0' }}>Home</span>
        <span>{'>'}</span>
        <span onClick={onBack} style={{ cursor: 'pointer', color: '#2874f0' }}>{product.category_name || 'Mobiles'}</span>
        <span>{'>'}</span>
        <span style={{ color: '#212121', fontWeight: 500 }}>{product.title}</span>
      </div>

      <div className="product-detail-layout" style={{
        gap: '24px',
        backgroundColor: '#fff',
        padding: '24px',
        borderRadius: '2px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
      }}>
        {/* ================= LEFT GALLERY & ACTION BUTTONS ================= */}
        <div className="detail-left-col">
          <div style={{ position: 'sticky', top: '80px' }}>
            <div className="detail-gallery-row" style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
              {/* Vertical / Horizontal Thumbnail Strip */}
              <div className="detail-thumbnails-strip" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onMouseEnter={() => setSelectedImg(img)}
                    onClick={() => setSelectedImg(img)}
                    style={{
                      width: '60px',
                      height: '60px',
                      border: selectedImg === img ? '2px solid #2874f0' : '1px solid #e0e0e0',
                      borderRadius: '2px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: '#fff'
                    }}
                  >
                    <img src={img} alt="thumbnail" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>

              {/* Main Product Image Container with Wishlist Heart */}
              <div className="detail-main-img-box" style={{
                flex: 1,
                height: '440px',
                border: '1px solid #f0f0f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <button
                  onClick={() => toggleWishlist(product)}
                  style={{
                    position: 'absolute',
                    top: 14,
                    right: 14,
                    background: '#fff',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    zIndex: 10
                  }}
                  title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart size={18} fill={wishlisted ? '#ff4343' : 'none'} color={wishlisted ? '#ff4343' : '#999'} />
                </button>

                <img
                  src={selectedImg}
                  alt={product.title}
                  style={{ maxWidth: '90%', maxHeight: '90%', objectFit: 'contain', transition: 'transform 0.3s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                />
              </div>
            </div>

            {/* Action Buttons: ADD TO CART & BUY NOW */}
            <div className="detail-action-buttons" style={{ display: 'flex', gap: '14px' }}>
              <button className="btn-cart" onClick={() => onAddToCart(product)}>
                <ShoppingCart size={20} /> ADD TO CART
              </button>
              <button className="btn-buy" onClick={() => onBuyNow(product)}>
                <Zap size={20} /> BUY NOW
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PRODUCT SPECIFICATIONS & OFFERS ================= */}
        <div className="detail-right-col">
          {/* Title */}
          <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#212121', lineHeight: 1.4, marginBottom: '8px' }}>
            {product.title}
          </h1>

          {/* Rating Badge + Flipkart Assured */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
            <span className="rating-badge" style={{ fontSize: '13px', padding: '3px 8px' }}>
              {product.rating || '4.5'} <Star size={11} fill="#fff" strokeWidth={0} />
            </span>
            <span style={{ fontSize: '13px', color: '#878787', fontWeight: 500 }}>
              {(product.rating_count || 1240).toLocaleString()} Ratings & {(product.review_count || 320).toLocaleString()} Reviews
            </span>
            {product.is_assured && (
              <img
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png"
                alt="Flipkart Assured"
                style={{ height: '20px', marginLeft: '6px' }}
              />
            )}
          </div>

          {/* Special Price Tag */}
          <div style={{ color: '#388e3c', fontSize: '13px', fontWeight: 700, marginBottom: '4px' }}>
            Special price
          </div>

          {/* Price Block */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '8px' }}>
            <span style={{ fontSize: '28px', fontWeight: 700, color: '#212121' }}>
              ₹{(product.selling_price || 0).toLocaleString()}
            </span>
            {product.original_price > product.selling_price && (
              <>
                <span style={{ fontSize: '16px', color: '#878787', textDecoration: 'line-through' }}>
                  ₹{(product.original_price || 0).toLocaleString()}
                </span>
                <span style={{ fontSize: '16px', color: '#388e3c', fontWeight: 700 }}>
                  {product.discount_percent || 15}% off
                </span>
              </>
            )}
          </div>
          <div style={{ fontSize: '12px', color: '#878787', marginBottom: '16px' }}>
            + ₹99 Secured Packaging Fee
          </div>

          {/* Color & Storage Variants Selector */}
          <div style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '16px 0', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Color */}
            <div className="detail-variant-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ color: '#878787', fontSize: '13px', width: '80px', fontWeight: 500 }}>Color</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['Black', 'Blue', 'Green', 'Titanium'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    style={{
                      border: selectedColor === c ? '2px solid #2874f0' : '1px solid #e0e0e0',
                      backgroundColor: selectedColor === c ? '#f0f5ff' : '#fff',
                      color: selectedColor === c ? '#2874f0' : '#212121',
                      fontWeight: 600,
                      fontSize: '12px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Storage */}
            <div className="detail-variant-row" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{ color: '#878787', fontSize: '13px', width: '80px', fontWeight: 500 }}>Storage</span>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['128 GB', '256 GB', '512 GB'].map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedStorage(s)}
                    style={{
                      border: selectedStorage === s ? '2px solid #2874f0' : '1px solid #e0e0e0',
                      backgroundColor: selectedStorage === s ? '#f0f5ff' : '#fff',
                      color: selectedStorage === s ? '#2874f0' : '#212121',
                      fontWeight: 600,
                      fontSize: '12px',
                      padding: '6px 14px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Available Offers Accordion */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', marginBottom: '10px', color: '#212121' }}>Available Offers</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Tag size={18} color="#388e3c" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span><strong>Bank Offer:</strong> 5% Cashback on Flipkart Axis Bank Card <span style={{ color: '#2874f0', cursor: 'pointer', fontWeight: 600 }}>T&C</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Tag size={18} color="#388e3c" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span><strong>Special Price:</strong> Get extra 10% off (price inclusive of cashback/coupon) <span style={{ color: '#2874f0', cursor: 'pointer', fontWeight: 600 }}>T&C</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Tag size={18} color="#388e3c" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span><strong>No Cost EMI:</strong> Avail No Cost EMI on select cards from ₹5,500/month <span style={{ color: '#2874f0', cursor: 'pointer', fontWeight: 600 }}>View Plans</span></span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <Tag size={18} color="#388e3c" style={{ marginTop: '2px', flexShrink: 0 }} />
                <span><strong>Partner Offer:</strong> Sign up for Flipkart Pay Later and get ₹500 Times Prime benefits</span>
              </div>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '16px 0', marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <span style={{ color: '#878787', fontSize: '14px', width: '90px', fontWeight: 500 }}>Delivery</span>
              <form onSubmit={handlePincodeCheck} style={{ display: 'flex', alignItems: 'center', borderBottom: '2px solid #2874f0', paddingBottom: '4px' }}>
                <MapPin size={16} color="#2874f0" style={{ marginRight: '6px' }} />
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  style={{ border: 'none', width: '90px', fontSize: '14px', fontWeight: 600 }}
                />
                <button type="submit" style={{ background: 'none', color: '#2874f0', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}>
                  Check
                </button>
              </form>
            </div>
            {pincodeChecked && (
              <div style={{ fontSize: '13px', marginLeft: '102px' }}>
                <div style={{ fontWeight: 600 }}>
                  Delivery by Tomorrow, 11:00 PM | <span style={{ color: '#388e3c' }}>Free</span> ₹40
                </div>
                <div style={{ color: '#878787', fontSize: '12px', marginTop: '2px' }}>
                  Cash on Delivery available for pincode {pincode}
                </div>
              </div>
            )}
          </div>

          {/* Highlights */}
          <div style={{ display: 'flex', marginBottom: '24px' }}>
            <span style={{ color: '#878787', fontSize: '14px', width: '100px', fontWeight: 500 }}>Highlights</span>
            <ul style={{ paddingLeft: '18px', fontSize: '13px', lineHeight: 2, color: '#212121' }}>
              {highlights.map((h, i) => (
                <li key={i}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Easy Payment Options */}
          <div style={{ display: 'flex', marginBottom: '24px', alignItems: 'flex-start' }}>
            <span style={{ color: '#878787', fontSize: '14px', width: '100px', fontWeight: 500 }}>Easy Payment</span>
            <div style={{ fontSize: '13px', color: '#212121', lineHeight: 1.8 }}>
              • No Cost EMI available on major credit cards<br />
              • Net banking & UPI options supported<br />
              • Cash on Delivery available
            </div>
          </div>

          {/* Specifications Table */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '14px', color: '#212121' }}>Specifications</h3>
            <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
              <tbody>
                {Object.entries(specs).map(([k, v], i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ color: '#878787', width: '32%', padding: '10px 0' }}>{k}</td>
                    <td style={{ color: '#212121', padding: '10px 0', fontWeight: 500 }}>{String(v)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ratings & Reviews Section with Star Breakdown Bars */}
          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
            <h3 style={{ fontSize: '17px', fontWeight: 700, marginBottom: '16px' }}>Ratings & Reviews</h3>

            <div className="detail-ratings-summary" style={{ display: 'flex', gap: '32px', backgroundColor: '#fafafa', padding: '20px', borderRadius: '4px', marginBottom: '20px', alignItems: 'center' }}>
              <div className="detail-ratings-score-box" style={{ textAlign: 'center', borderRight: '1px solid #e0e0e0', paddingRight: '32px' }}>
                <div style={{ fontSize: '36px', fontWeight: 800, color: '#212121', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  {product.rating || '4.6'} <Star size={24} fill="#388e3c" color="#388e3c" />
                </div>
                <div style={{ fontSize: '12px', color: '#878787', marginTop: '4px' }}>
                  {(product.rating_count || 1240).toLocaleString()} Ratings &<br />{(product.review_count || 320).toLocaleString()} Reviews
                </div>
              </div>

              {/* Progress Bars */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { star: 5, pct: 74, count: '8,420' },
                  { star: 4, pct: 16, count: '1,840' },
                  { star: 3, pct: 6, count: '620' },
                  { star: 2, pct: 2, count: '210' },
                  { star: 1, pct: 2, count: '240' }
                ].map((b) => (
                  <div key={b.star} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px' }}>
                    <span style={{ width: '24px', fontWeight: 600 }}>{b.star} ★</span>
                    <div style={{ flex: 1, height: '6px', backgroundColor: '#e0e0e0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${b.pct}%`, height: '100%', backgroundColor: b.star >= 4 ? '#388e3c' : b.star === 3 ? '#ff9f00' : '#ef4444' }} />
                    </div>
                    <span style={{ color: '#878787', width: '45px', textAlign: 'right' }}>{b.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Reviews Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="rating-badge">5 <Star size={10} fill="#fff" strokeWidth={0} /></span>
                  <strong style={{ fontSize: '14px', color: '#212121' }}>Brilliant purchase! Highly satisfied</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.6, marginBottom: '8px' }}>
                  Delivered on time. Exceptional performance and camera clarity. Battery lasts a full day and a half. Flipkart packing was very safe.
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#878787' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#212121' }}>Kunal Patel</span>
                    <ShieldCheck size={14} color="#388e3c" />
                    <span style={{ color: '#388e3c', fontWeight: 500 }}>Certified Buyer, Mumbai</span>
                  </div>
                  <button
                    onClick={() => toggleHelpful(1)}
                    style={{ background: 'none', color: '#878787', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    <ThumbsUp size={14} /> Helpful ({helpfulCounts[1]})
                  </button>
                </div>
              </div>

              <div style={{ borderBottom: '1px solid #f0f0f0', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <span className="rating-badge">5 <Star size={10} fill="#fff" strokeWidth={0} /></span>
                  <strong style={{ fontSize: '14px', color: '#212121' }}>Must buy! Value for money</strong>
                </div>
                <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.6, marginBottom: '8px' }}>
                  Best in its segment. Super smooth display and premium hand-feel. Go for it without a second thought!
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#878787' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 600, color: '#212121' }}>Megha Sen</span>
                    <ShieldCheck size={14} color="#388e3c" />
                    <span style={{ color: '#388e3c', fontWeight: 500 }}>Certified Buyer, Bangalore</span>
                  </div>
                  <button
                    onClick={() => toggleHelpful(2)}
                    style={{ background: 'none', color: '#878787', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    <ThumbsUp size={14} /> Helpful ({helpfulCounts[2]})
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
