import React, { useState, useEffect } from 'react';
import FestiveBulbStrip from './FestiveBulbStrip';

export default function HeroFestiveBanners({ onSelectProduct, onSelectCategory }) {
  const [activeSlide, setActiveSlide] = useState(1);

  // Carousel auto-rotate for the middle slide
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev % 6) + 1);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ position: 'relative', margin: '8px 0 16px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' }}>
      {/* Top Diwali Bulb Garland */}
      <FestiveBulbStrip />

      {/* 3-Column Festive Grid */}
      <div className="hero-festive-grid" style={{ margin: 0, padding: '10px 12px', backgroundColor: '#1a0b2e' }}>
        {/* BANNER 1: Samsung Galaxy Book4 PC */}
        <div
          className="hero-banner-card"
          onClick={() => onSelectProduct ? onSelectProduct({ slug: 'samsung-galaxy-book4-pc-intel-16gb-512gb', title: 'Samsung Galaxy Book4 PC Core i5 / i7' }) : onSelectCategory('electronics')}
          style={{
            background: 'linear-gradient(135deg, #1f0b3d 0%, #351268 60%, #4c1888 100%)',
            color: '#fff',
            padding: '16px 18px 12px',
            position: 'relative',
            border: '1px solid rgba(255, 215, 0, 0.35)',
            boxShadow: 'inset 0 0 20px rgba(255, 215, 0, 0.15)'
          }}
        >
          {/* Top Row Badges: Big Billion Days + Bank Offer Refreshed */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '10px' }}>
            {/* The Big Billion Days Badge */}
            <div style={{
              background: 'radial-gradient(circle, #ffe500 0%, #ff9800 100%)',
              color: '#002f6c',
              fontWeight: 900,
              fontSize: '9px',
              padding: '4px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1.5px solid #fff'
            }}>
              <span>★</span> THE BIG BILLION DAYS
            </div>

            {/* Bank Offer Refreshed Pill */}
            <div style={{
              background: 'linear-gradient(90deg, #fffae6 0%, #ffe082 100%)',
              color: '#422006',
              fontWeight: 800,
              fontSize: '9.5px',
              padding: '3px 10px',
              borderRadius: '12px',
              letterSpacing: '0.3px',
              border: '1px solid #ffb300',
              boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
            }}>
              BANK OFFER REFRESHED
            </div>
          </div>

          {/* Main Info + Image Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, gap: '8px' }}>
            <div style={{ zIndex: 2, flex: 1 }}>
              <h2 style={{ fontSize: '19px', fontWeight: 800, lineHeight: 1.2, margin: '4px 0 6px', color: '#ffffff', letterSpacing: '-0.2px' }}>
                Samsung Book4 PCs
              </h2>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#ffeb3b', margin: '2px 0 6px' }}>
                Starts ₹45,990*
              </div>
              <div style={{ fontSize: '11.5px', color: '#e0d4fc', fontWeight: 500, lineHeight: 1.3 }}>
                Up to Intel i7 | 16/512 GB
              </div>
            </div>

            {/* Laptop Product Visual */}
            <div style={{ width: '135px', height: '115px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(255,235,59,0.25) 0%, transparent 70%)', borderRadius: '50%' }} />
              <img
                src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80"
                alt="Samsung Galaxy Book4"
                style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.5))' }}
              />
              {/* Super AMOLED sticker */}
              <div style={{
                position: 'absolute',
                top: 4,
                right: 0,
                backgroundColor: '#002f6c',
                color: '#fff',
                fontSize: '7.5px',
                fontWeight: 700,
                padding: '2px 4px',
                borderRadius: '3px',
                border: '1px solid #4fc3f7',
                zIndex: 3
              }}>
                SUPER AMOLED
              </div>
            </div>
          </div>

          {/* Bank Offer Bottom Strip */}
          <div style={{
            marginTop: '8px',
            padding: '5px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '9.5px',
            color: '#1a1a1a',
            fontWeight: 700,
            boxShadow: '0 1px 4px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#880038', fontWeight: 800 }}>AXIS BANK</span>
              <span style={{ color: '#aaa' }}>|</span>
              <span style={{ color: '#d9531e', fontWeight: 800 }}>i ICICI Bank</span>
            </div>
            <div style={{ color: '#0d47a1', fontSize: '9px', fontWeight: 800 }}>
              10% Instant Discount*
            </div>
          </div>
        </div>

        {/* BANNER 2: Google Pixel 11 (Carousel) */}
        <div
          className="hero-banner-card"
          onClick={() => onSelectProduct ? onSelectProduct({ slug: 'google-pixel-11-5g-obsidian-256gb', title: 'Google Pixel 11 5G' }) : onSelectCategory('mobiles')}
          style={{
            background: 'linear-gradient(135deg, #eef4fc 0%, #e1ebfa 50%, #ccdcf7 100%)',
            color: '#1a1a1a',
            padding: '16px 18px 10px',
            position: 'relative',
            border: '1px solid #b3cdef'
          }}
        >
          {/* Top Row Badges: Google Logo + Big Billion Days Badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
            {/* Google Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <svg width="22" height="22" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.36 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.97 0 12s.46 3.83 1.26 5.42l4.02-3.15z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
              </svg>
            </div>

            {/* The Big Billion Days Badge */}
            <div style={{
              background: 'radial-gradient(circle, #ffe500 0%, #ff9800 100%)',
              color: '#002f6c',
              fontWeight: 900,
              fontSize: '9px',
              padding: '3px 8px',
              borderRadius: '20px',
              textTransform: 'uppercase',
              letterSpacing: '0.4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1.5px solid #fff'
            }}>
              <span>★</span> THE BIG BILLION DAYS
            </div>
          </div>

          {/* Main Info + Phone Image */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flex: 1, gap: '8px' }}>
            <div style={{ zIndex: 2, flex: 1 }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2, margin: '2px 0 4px', color: '#172337', letterSpacing: '-0.3px' }}>
                Google Pixel 11
              </h2>
              <div style={{ fontSize: '20px', fontWeight: 900, color: '#1a73e8', margin: '2px 0 4px' }}>
                From ₹69,999*
              </div>
              <div style={{ fontSize: '11px', color: '#5f6368', fontWeight: 600 }}>
                1<sup>st</sup> ever deal on new launch
              </div>
            </div>

            {/* Google Pixel Phone Visual */}
            <div style={{ width: '110px', height: '120px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80"
                alt="Google Pixel 11"
                style={{ width: '100%', height: '100%', objectFit: 'contain', zIndex: 2, filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.2))' }}
              />
            </div>
          </div>

          {/* Bank Offer Bottom Strip with AD Badge */}
          <div style={{
            marginTop: '8px',
            padding: '5px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '9px',
            fontWeight: 700,
            color: '#333',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#880038' }}>AXIS BANK</span>
              <span style={{ color: '#ccc' }}>|</span>
              <span style={{ color: '#d9531e' }}>ICICI Bank</span>
              <span style={{ color: '#ccc' }}>|</span>
              <span style={{ fontSize: '8.5px', color: '#1565c0' }}>Flipkart Axis Bank</span>
            </div>
            <div style={{
              backgroundColor: '#e0e0e0',
              color: '#444',
              padding: '1px 4px',
              borderRadius: '2px',
              fontSize: '8px',
              fontWeight: 700
            }}>
              AD
            </div>
          </div>

          {/* Slide Indicator Dots (8 dots matching screenshot) */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', marginTop: '8px' }}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((dot) => (
              <div
                key={dot}
                onClick={(e) => { e.stopPropagation(); setActiveSlide(dot); }}
                style={{
                  width: dot === activeSlide ? '14px' : '5px',
                  height: '5px',
                  borderRadius: '3px',
                  backgroundColor: dot === activeSlide ? '#878787' : '#cfd8dc',
                  cursor: 'pointer',
                  transition: 'all 0.25s'
                }}
              />
            ))}
          </div>
        </div>

        {/* BANNER 3: Nova 2 Pro 5G */}
        <div
          className="hero-banner-card"
          onClick={() => onSelectProduct ? onSelectProduct({ slug: 'nova-2-pro-5g-midnight-black-128gb', title: 'Nova 2 Pro 5G' }) : onSelectCategory('mobiles')}
          style={{
            background: 'linear-gradient(135deg, #d8e5f7 0%, #c4d9f6 50%, #afccf3 100%)',
            color: '#1a1a1a',
            padding: '16px 18px 12px',
            position: 'relative',
            border: '1px solid #9dc2ec'
          }}
        >
          {/* Header Strip: Ai+ Smartphone | Flipkart Unique */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 800, fontSize: '11px', color: '#0d47a1' }}>
              <span style={{ background: '#0d47a1', color: '#fff', padding: '1px 4px', borderRadius: '3px', fontSize: '10px' }}>Ai+</span>
              <span>Smartphone</span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: '#fff',
              padding: '2px 6px',
              borderRadius: '3px',
              fontSize: '9px',
              fontWeight: 800,
              color: '#2874f0',
              border: '1px solid #bbdefb'
            }}>
              <span>Flipkart Unique</span>
              <span style={{ color: '#ff9800' }}>★</span>
            </div>
          </div>

          {/* Main Info */}
          <div style={{ flex: 1, zIndex: 2 }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.2, margin: '6px 0 4px', color: '#172337', letterSpacing: '-0.3px' }}>
              Nova 2 Pro<sup>5G</sup>
            </h2>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#1a237e', margin: '2px 0 6px' }}>
              From ₹16,999*
            </div>
            <div style={{ fontSize: '11.5px', color: '#37474f', fontWeight: 600 }}>
              Safe. Secure. Yours.
            </div>
          </div>

          {/* Bank Offer Bottom Strip */}
          <div style={{
            marginTop: 'auto',
            padding: '5px 8px',
            backgroundColor: '#ffffff',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '9px',
            fontWeight: 700,
            color: '#333',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#880038' }}>AXIS BANK</span>
              <span style={{ color: '#ccc' }}>|</span>
              <span style={{ color: '#d9531e' }}>ICICI Bank</span>
            </div>
            <div style={{ color: '#1565c0', fontSize: '8.5px', fontWeight: 800 }}>
              10% Instant Discount*
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Diwali Bulb Garland */}
      <FestiveBulbStrip isBottom={true} />
    </div>
  );
}
