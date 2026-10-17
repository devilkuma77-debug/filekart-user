import React, { useState } from 'react';
import {
  X,
  User,
  ShoppingBag,
  Package,
  Heart,
  HelpCircle,
  Award,
  ChevronRight,
  LogOut,
  MapPin,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function MobileMenuDrawer({
  isOpen,
  onClose,
  onNavigate,
  onSelectCategory,
  onOpenSellerModal,
  onOpenHelpModal,
  deliveryLocation = 'Location not set'
}) {
  const { user, logoutUser, openLoginModal } = useShop();
  const [expandedSection, setExpandedSection] = useState(true);

  if (!isOpen) return null;

  const categories = [
    { label: 'For You', slug: 'all', icon: '🛍️' },
    { label: 'Fashion', slug: 'fashion', icon: '👕' },
    { label: 'Mobiles', slug: 'mobiles', icon: '📱' },
    { label: 'Electronics', slug: 'electronics', icon: '💻' },
    { label: 'Beauty & Grooming', slug: 'beauty-grooming', icon: '💄' },
    { label: 'Home & Kitchen', slug: 'home-kitchen', icon: '🏠' },
    { label: 'Appliances', slug: 'appliances', icon: '📺' },
    { label: 'Toys & Baby Care', slug: 'toys-baby', icon: '🧸' },
    { label: 'Food & Health', slug: 'food-health', icon: '🥗' },
    { label: 'Auto Accessories', slug: 'auto-accessories', icon: '🏍️' },
    { label: 'Sports & Fitness', slug: 'sports-fitness', icon: '🏏' },
    { label: 'Furniture', slug: 'furniture', icon: '🛋️' },
    { label: 'Books', slug: 'books', icon: '📚' },
    { label: '2 Wheelers', slug: '2wheelers', icon: '🛵' },
    { label: 'Grocery', slug: 'grocery', icon: '🛒' }
  ];

  const handleCategoryClick = (slug) => {
    onSelectCategory(slug);
    onClose();
  };

  const handleNavClick = (page) => {
    onNavigate(page);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2500,
        display: 'flex'
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(3px)',
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      {/* Drawer Container */}
      <div
        style={{
          position: 'relative',
          width: '82%',
          maxWidth: '320px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 2501,
          animation: 'slideInLeft 0.25s ease-out'
        }}
      >
        {/* Drawer Header (Flipkart Blue Profile Banner) */}
        <div
          style={{
            backgroundColor: '#2874f0',
            color: '#ffffff',
            padding: '20px 16px 16px',
            position: 'relative'
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              background: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)'
            }}
          >
            <X size={18} />
          </button>

          {/* User Profile / Login status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#ffffff',
                color: '#2874f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                fontWeight: 700,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }}
            >
              {user ? user.name.charAt(0).toUpperCase() : <User size={22} color="#2874f0" />}
            </div>

            <div>
              <div style={{ fontSize: '16px', fontWeight: 700, lineHeight: 1.2 }}>
                {user ? user.name : 'Welcome to Flipkart'}
              </div>
              <div style={{ fontSize: '11px', opacity: 0.85, marginTop: '2px' }}>
                {user ? user.email || user.phone : 'Sign in to access your orders & wishlist'}
              </div>
            </div>
          </div>

          {!user ? (
            <button
              onClick={() => { onClose(); openLoginModal(); }}
              style={{
                marginTop: '14px',
                width: '100%',
                backgroundColor: '#ffe500',
                color: '#111',
                padding: '8px 12px',
                borderRadius: '4px',
                fontWeight: 700,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <span>Login / Sign Up</span>
              <ChevronRight size={15} />
            </button>
          ) : (
            <div style={{
              marginTop: '10px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'rgba(255, 235, 59, 0.25)',
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '10.5px',
              fontWeight: 700,
              color: '#ffe500'
            }}>
              <span>★ Flipkart Plus Member</span>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
          {/* Quick Links */}
          <div style={{ padding: '6px 0', borderBottom: '1px solid #f0f0f0' }}>
            <div
              onClick={() => handleNavClick('home')}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', fontWeight: 600, color: '#212121', cursor: 'pointer' }}
            >
              <ShoppingBag size={18} color="#2874f0" />
              <span>Flipkart Home</span>
            </div>

            <div
              onClick={() => handleNavClick('orders')}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', fontWeight: 500, color: '#212121', cursor: 'pointer' }}
            >
              <Package size={18} color="#2874f0" />
              <span>My Orders</span>
            </div>

            <div
              onClick={() => handleNavClick('wishlist')}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', fontWeight: 500, color: '#212121', cursor: 'pointer' }}
            >
              <Heart size={18} color="#e91e63" />
              <span>My Wishlist</span>
            </div>

            <div
              onClick={() => handleNavClick('cart')}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '14px', fontWeight: 500, color: '#212121', cursor: 'pointer' }}
            >
              <ShoppingBag size={18} color="#ff9800" />
              <span>My Cart</span>
            </div>
          </div>

          {/* Shop By Category Accordion */}
          <div style={{ borderBottom: '1px solid #f0f0f0' }}>
            <div
              onClick={() => setExpandedSection(!expandedSection)}
              style={{
                padding: '12px 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12px',
                fontWeight: 700,
                color: '#878787',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                backgroundColor: '#fafafa'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Layers size={15} color="#878787" />
                <span>All Categories ({categories.length})</span>
              </div>
              {expandedSection ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>

            {expandedSection && (
              <div style={{ padding: '4px 0', backgroundColor: '#fff' }}>
                {categories.map((cat, i) => (
                  <div
                    key={i}
                    onClick={() => handleCategoryClick(cat.slug)}
                    style={{
                      padding: '9px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13.5px',
                      color: '#333',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '16px' }}>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </div>
                    <ChevronRight size={14} color="#aaa" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Additional Services */}
          <div style={{ padding: '8px 0' }}>
            <div style={{ padding: '6px 20px', fontSize: '11px', fontWeight: 700, color: '#878787', textTransform: 'uppercase' }}>
              More on Flipkart
            </div>

            <div
              onClick={() => { onClose(); onOpenHelpModal(); }}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13.5px', color: '#333', cursor: 'pointer' }}
            >
              <HelpCircle size={18} color="#2874f0" />
              <span>24x7 Customer Care</span>
            </div>

            <div
              onClick={() => { onClose(); onOpenSellerModal(); }}
              style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13.5px', color: '#333', cursor: 'pointer' }}
            >
              <Award size={18} color="#ff9800" />
              <span>Become a Seller</span>
            </div>

            {user && (
              <div
                onClick={() => { logoutUser(); onClose(); }}
                style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '14px', fontSize: '13.5px', color: '#ef4444', cursor: 'pointer', marginTop: '6px' }}
              >
                <LogOut size={18} />
                <span>Logout</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer info in drawer */}
        <div style={{ padding: '12px 20px', backgroundColor: '#f5f7fa', borderTop: '1px solid #ebeef2', fontSize: '11px', color: '#878787', display: 'flex', justifyContent: 'space-between' }}>
          <span>Flipkart Clone v2.5</span>
          <span>100% Secure Shopping</span>
        </div>
      </div>
    </div>
  );
}
