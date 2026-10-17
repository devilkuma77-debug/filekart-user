import React, { useState, useRef, useEffect } from 'react';
import { useShop } from '../context/ShopContext';
import {
  Search,
  ShoppingCart,
  ChevronDown,
  User,
  Heart,
  Package,
  LogOut,
  MapPin,
  Plane,
  X,
  HelpCircle,
  Bell,
  Award,
  Smartphone,
  ChevronRight,
  Menu
} from 'lucide-react';

export default function Header({
  onNavigate,
  onOpenSellerModal,
  onOpenHelpModal,
  onOpenLocationModal,
  onOpenDrawer,
  deliveryLocation = 'Location not set'
}) {
  const { user, logoutUser, openLoginModal, totals, searchQuery, setSearchQuery } = useShop();

  const [activeTopTab, setActiveTopTab] = useState('flipkart'); // 'flipkart' or 'travel'
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showMoreDropdown, setShowMoreDropdown] = useState(false);

  const searchRef = useRef(null);

  const suggestions = [
    { text: 'mobiles 5g', category: 'mobiles' },
    { text: 'apple iphone 15', category: 'mobiles' },
    { text: 'samsung galaxy s24', category: 'mobiles' },
    { text: 'laptops i5 16gb ram', category: 'electronics' },
    { text: 'wireless bluetooth headphones', category: 'electronics' },
    { text: 'sony bravia 55 inch tv', category: 'appliances' },
    { text: 'nike running shoes', category: 'fashion' },
    { text: 'smart watch for men', category: 'electronics' }
  ];

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setShowSuggestions(false);
    onNavigate('products');
  };

  const handleSelectSuggestion = (s) => {
    setSearchInput(s.text);
    setSearchQuery(s.text);
    setShowSuggestions(false);
    onNavigate('products');
  };

  return (
    <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 1000, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      {/* ================= MOBILE HEADER (< 768px) ================= */}
      <div className="mobile-header-only">
        {/* Top Mobile Bar: Hamburger, Brand, Login, Cart */}
        <div style={{ padding: '10px 14px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Hamburger Button */}
            <button
              onClick={onOpenDrawer}
              style={{
                background: 'none',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#212121'
              }}
              aria-label="Open Navigation Menu"
            >
              <Menu size={24} />
            </button>

            {/* Flipkart Yellow Pill Logo */}
            <div
              onClick={() => onNavigate('home')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                backgroundColor: '#ffe500',
                padding: '4px 10px',
                borderRadius: '16px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '13px',
                color: '#172337',
                fontStyle: 'italic',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)'
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="#2874f0">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/>
              </svg>
              <span>Flipkart</span>
            </div>
          </div>

          {/* Right Mobile Actions: Login & Cart */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              onClick={user ? () => onNavigate('account') : openLoginModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2874f0',
                cursor: 'pointer'
              }}
            >
              <User size={18} color="#212121" />
              <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
            </div>

            <div
              onClick={() => onNavigate('cart')}
              style={{ position: 'relative', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <ShoppingCart size={22} color="#212121" />
              {totals.itemCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -8,
                    backgroundColor: '#ef4444',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 800,
                    borderRadius: '10px',
                    minWidth: '16px',
                    height: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 3px',
                    border: '1.5px solid #fff'
                  }}
                >
                  {totals.itemCount}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Row */}
        <div style={{ padding: '4px 14px 8px', position: 'relative' }} ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f0f5ff',
              borderRadius: '8px',
              height: '38px',
              padding: '0 12px',
              border: '1px solid #dbeafe'
            }}
          >
            <Search size={16} color="#717478" />
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                marginLeft: '8px',
                fontSize: '13px',
                color: '#212121'
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                style={{ background: 'none', color: '#878787', cursor: 'pointer', padding: '2px' }}
              >
                <X size={15} />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown on Mobile */}
          {showSuggestions && (
            <div className="search-suggestions-dropdown animate-fade-in" style={{ left: 14, right: 14, width: 'auto' }}>
              {suggestions
                .filter(s => !searchInput || s.text.toLowerCase().includes(searchInput.toLowerCase()))
                .slice(0, 5)
                .map((s, idx) => (
                  <div
                    key={idx}
                    className="search-suggestion-item"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    <Search size={14} color="#878787" />
                    <span>{s.text}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Mobile Location Strip */}
        <div
          onClick={onOpenLocationModal}
          style={{
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #f1f5f9',
            padding: '5px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '11.5px',
            color: '#334155',
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <MapPin size={13} color="#2874f0" />
            <span style={{ fontWeight: 500 }}>{deliveryLocation}</span>
          </div>
          <span style={{ color: '#2874f0', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            Change <ChevronRight size={13} />
          </span>
        </div>
      </div>

      {/* ================= DESKTOP HEADER (> 768px) ================= */}
      <div className="desktop-header-only">
        {/* 1. Desktop Super Header */}
        <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '8px 24px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Left: Flipkart & Travel Switcher Pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              onClick={() => { setActiveTopTab('flipkart'); onNavigate('home'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTopTab === 'flipkart' ? '#ffe500' : '#f0f2f5',
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '14px',
                color: '#2874f0',
                fontStyle: 'italic',
                letterSpacing: '-0.4px',
                boxShadow: activeTopTab === 'flipkart' ? '0 1px 2px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="#2874f0">
                <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V8h14v12z"/>
              </svg>
              <span style={{ color: '#172337' }}>Flipkart</span>
            </div>

            <div
              onClick={() => { setActiveTopTab('travel'); alert('Welcome to Flipkart Flights & Travel Booking! Flight tickets starting from ₹1,499.'); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: activeTopTab === 'travel' ? '#ffe500' : '#f0f2f5',
                padding: '6px 14px',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '13px',
                color: '#333'
              }}
            >
              <Plane size={15} color="#f05a5b" />
              <span>Travel</span>
            </div>
          </div>

          {/* Right: Delivery Location Indicator */}
          <div
            onClick={onOpenLocationModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              cursor: 'pointer',
              color: '#212121',
              userSelect: 'none'
            }}
          >
            <MapPin size={16} color="#212121" />
            <span style={{ fontWeight: 400 }}>{deliveryLocation}</span>
            <span style={{ color: '#2874f0', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
              Select delivery location <ChevronRight size={14} />
            </span>
          </div>
        </div>

        {/* 2. Desktop Main Header Row (Search Bar & Action Buttons) */}
      <div style={{ maxWidth: '1360px', margin: '0 auto', padding: '6px 24px 12px', display: 'flex', alignItems: 'center', gap: '32px' }}>
        {/* Search Bar */}
        <div style={{ flex: 1, position: 'relative' }} ref={searchRef}>
          <form
            onSubmit={handleSearchSubmit}
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#f0f5ff',
              borderRadius: '8px',
              height: '42px',
              padding: '0 16px',
              border: '1px solid transparent',
              transition: 'all 0.2s'
            }}
          >
            <Search size={18} color="#717478" />
            <input
              type="text"
              placeholder="Search for Products, Brands and More"
              value={searchInput}
              onFocus={() => setShowSuggestions(true)}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                marginLeft: '12px',
                fontSize: '14px',
                color: '#212121'
              }}
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearchQuery(''); }}
                style={{ background: 'none', color: '#878787', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {showSuggestions && (
            <div className="search-suggestions-dropdown animate-fade-in">
              <div style={{ padding: '8px 16px', fontSize: '11px', color: '#878787', fontWeight: 600, textTransform: 'uppercase', backgroundColor: '#fafafa' }}>
                Discover More
              </div>
              {suggestions
                .filter(s => !searchInput || s.text.toLowerCase().includes(searchInput.toLowerCase()))
                .slice(0, 6)
                .map((s, idx) => (
                  <div
                    key={idx}
                    className="search-suggestion-item"
                    onClick={() => handleSelectSuggestion(s)}
                  >
                    <Search size={14} color="#878787" />
                    <span>{s.text}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Right Action Icons: Login, More, Cart */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          {/* Login Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowUserDropdown(true)}
            onMouseLeave={() => setShowUserDropdown(false)}
          >
            <div
              onClick={user ? () => onNavigate('account') : openLoginModal}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 500,
                color: '#212121',
                cursor: 'pointer'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                border: '1.5px solid #212121',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <User size={15} color="#212121" />
              </div>
              <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
              <ChevronDown size={14} color="#717478" />
            </div>

            {/* User Dropdown */}
            {showUserDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: -30,
                width: '230px',
                backgroundColor: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                borderRadius: '4px',
                zIndex: 1300,
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                marginTop: '8px'
              }}>
                {!user ? (
                  <>
                    <div style={{ padding: '14px 18px', borderBottom: '1px solid #f5f5f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: 600 }}>New customer?</span>
                      <span onClick={openLoginModal} style={{ color: '#2874f0', fontWeight: 700, cursor: 'pointer', fontSize: '13px' }}>
                        Sign Up
                      </span>
                    </div>
                    <div onClick={openLoginModal} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                      <User size={16} color="#2874f0" /> My Profile
                    </div>
                    <div onClick={openLoginModal} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}>
                      <Package size={16} color="#2874f0" /> Orders
                    </div>
                    <div onClick={openLoginModal} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px' }}>
                      <Heart size={16} color="#2874f0" /> Wishlist
                    </div>
                  </>
                ) : (
                  <>
                    <div onClick={() => { onNavigate('account'); setShowUserDropdown(false); }} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', fontSize: '14px' }}>
                      <User size={16} color="#2874f0" /> My Profile
                    </div>
                    <div onClick={() => { onNavigate('orders'); setShowUserDropdown(false); }} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', fontSize: '14px' }}>
                      <Package size={16} color="#2874f0" /> Orders
                    </div>
                    <div onClick={() => { onNavigate('wishlist'); setShowUserDropdown(false); }} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', fontSize: '14px' }}>
                      <Heart size={16} color="#2874f0" /> Wishlist
                    </div>
                    <div onClick={() => { logoutUser(); setShowUserDropdown(false); }} style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', color: '#ef4444', fontSize: '14px' }}>
                      <LogOut size={16} /> Logout
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* More Dropdown */}
          <div
            style={{ position: 'relative' }}
            onMouseEnter={() => setShowMoreDropdown(true)}
            onMouseLeave={() => setShowMoreDropdown(false)}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '15px', fontWeight: 500, color: '#212121', cursor: 'pointer' }}>
              <span>More</span>
              <ChevronDown size={14} color="#717478" />
            </div>

            {showMoreDropdown && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: -20,
                width: '230px',
                backgroundColor: '#fff',
                boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                borderRadius: '4px',
                zIndex: 1300,
                overflow: 'hidden',
                border: '1px solid #f0f0f0',
                marginTop: '8px'
              }}>
                <div
                  onClick={() => { onOpenHelpModal(); setShowMoreDropdown(false); }}
                  style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}
                >
                  <HelpCircle size={16} color="#2874f0" /> 24x7 Customer Care
                </div>
                <div
                  onClick={() => { onOpenSellerModal(); setShowMoreDropdown(false); }}
                  style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}
                >
                  <Award size={16} color="#2874f0" /> Become a Seller
                </div>
                <div
                  onClick={() => { alert('Notification preferences saved.'); setShowMoreDropdown(false); }}
                  style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px', borderBottom: '1px solid #f5f5f5' }}
                >
                  <Bell size={16} color="#2874f0" /> Notification Preferences
                </div>
                <div
                  onClick={() => { alert('Download Flipkart App for Android & iOS'); setShowMoreDropdown(false); }}
                  style={{ padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', fontSize: '14px' }}
                >
                  <Smartphone size={16} color="#2874f0" /> Download App
                </div>
              </div>
            )}
          </div>

          {/* Cart with Live Count */}
          <div
            onClick={() => onNavigate('cart')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 500,
              color: '#212121',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <ShoppingCart size={21} color="#212121" />
            {totals.itemCount > 0 && <span className="cart-badge">{totals.itemCount}</span>}
            <span>Cart</span>
          </div>
        </div>
      </div>
    </div>
  </header>
);
}
