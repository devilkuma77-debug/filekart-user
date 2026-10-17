import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';

export default function CategoryNav({ onSelectCategory }) {
  const [activeTab, setActiveTab] = useState('for_you');
  const [hoveredTab, setHoveredTab] = useState(null);

  // Exact 14 category icons matching the user's screenshot
  const categories = [
    {
      id: 'for_you',
      label: 'For You',
      slug: 'all',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      )
    },
    {
      id: 'fashion',
      label: 'Fashion',
      slug: 'fashion',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
        </svg>
      ),
      subcategories: ['Men T-Shirts', 'Men Jeans', 'Women Sarees', 'Casual Shoes']
    },
    {
      id: 'mobiles',
      label: 'Mobiles',
      slug: 'mobiles',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18" strokeWidth="2.5"></line>
        </svg>
      ),
      subcategories: ['iPhone 15', 'Samsung S24', 'OnePlus 12', '5G Smartphones']
    },
    {
      id: 'electronics',
      label: 'Electronics',
      slug: 'electronics',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
      subcategories: ['Laptops', 'Bluetooth Headphones', 'Smartwatches', 'Soundbars']
    },
    {
      id: 'beauty',
      label: 'Beauty',
      slug: 'beauty-grooming',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M10 2h4v4h-4z"></path>
          <path d="M8 6h8v16H8z"></path>
          <path d="M12 2v4"></path>
        </svg>
      ),
      subcategories: ['Makeup', 'Perfumes', 'Skincare', 'Beard Trimmers']
    },
    {
      id: 'home',
      label: 'Home',
      slug: 'home-kitchen',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M9 2h6l3 7H6z"></path>
          <path d="M12 9v13"></path>
          <path d="M8 22h8"></path>
        </svg>
      ),
      subcategories: ['Kitchenware', 'Cookware Sets', 'Dinner Sets', 'Gas Stoves']
    },
    {
      id: 'appliances',
      label: 'Appliances',
      slug: 'appliances',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <rect x="2" y="4" width="20" height="15" rx="2"></rect>
          <polyline points="17 2 12 7 7 2"></polyline>
        </svg>
      ),
      subcategories: ['Smart 4K TVs', 'Washing Machines', 'Refrigerators', 'Air Conditioners']
    },
    {
      id: 'toys',
      label: 'Toys, ba...',
      slug: 'beauty-grooming',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <circle cx="12" cy="12" r="7"></circle>
          <circle cx="6" cy="6" r="3"></circle>
          <circle cx="18" cy="6" r="3"></circle>
          <circle cx="9" cy="11" r="1" fill="#212121"></circle>
          <circle cx="15" cy="11" r="1" fill="#212121"></circle>
          <path d="M10 15c.67.67 1.33 1 2 1s1.33-.33 2-1"></path>
        </svg>
      )
    },
    {
      id: 'food',
      label: 'Food & H...',
      slug: 'grocery',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M7 8h10M7 12h10M7 16h10"></path>
          <rect x="5" y="4" width="14" height="18" rx="2"></rect>
          <line x1="8" y1="2" x2="16" y2="2"></line>
        </svg>
      )
    },
    {
      id: 'auto',
      label: 'Auto Acc...',
      slug: 'vehicles',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M12 2a9 9 0 0 0-9 9c0 3.87 2.45 7.17 5.92 8.44L10 22h4l1.08-2.56A9.002 9.002 0 0 0 21 11a9 9 0 0 0-9-9z"></path>
          <path d="M7 13h10"></path>
        </svg>
      )
    },
    {
      id: 'sports',
      label: 'Sports & ...',
      slug: 'fashion',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          <path d="M2 12h20"></path>
        </svg>
      )
    },
    {
      id: 'furniture',
      label: 'Furniture',
      slug: 'home-kitchen',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3"></path>
          <path d="M3 11v5a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2z"></path>
          <line x1="6" y1="18" x2="6" y2="21"></line>
          <line x1="18" y1="18" x2="18" y2="21"></line>
        </svg>
      )
    },
    {
      id: 'books',
      label: 'Books',
      slug: 'electronics',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      )
    },
    {
      id: '2wheelers',
      label: '2 Wheele...',
      slug: 'vehicles',
      icon: (active) => (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke={active ? '#2874f0' : '#212121'} strokeWidth="1.8">
          <circle cx="5.5" cy="17.5" r="3.5"></circle>
          <circle cx="18.5" cy="17.5" r="3.5"></circle>
          <path d="M15 6h-3l-3 6h7l2-4h3"></path>
        </svg>
      )
    }
  ];

  const handleTabClick = (item) => {
    setActiveTab(item.id);
    onSelectCategory(item.slug);
  };

  return (
    <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e0e0e0', position: 'relative' }}>
      <div style={{
        maxWidth: '1360px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: '4px',
        padding: '8px 12px 0',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}>
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;

          return (
            <div
              key={cat.id}
              onClick={() => handleTabClick(cat)}
              onMouseEnter={() => cat.subcategories && setHoveredTab(cat.id)}
              onMouseLeave={() => setHoveredTab(null)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                padding: '4px 8px 8px',
                minWidth: '72px',
                flexShrink: 0,
                position: 'relative',
                userSelect: 'none'
              }}
            >
              {/* Icon Container with active blue outline on For You */}
              <div style={{
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: cat.id === 'for_you' ? '8px' : '4px',
                border: cat.id === 'for_you' ? '2px solid #2874f0' : 'none',
                backgroundColor: cat.id === 'for_you' ? '#f0f5ff' : 'transparent',
                transition: 'transform 0.15s ease'
              }}>
                {cat.icon(isActive || cat.id === 'for_you')}
              </div>

              {/* Label */}
              <span style={{
                fontSize: '12px',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2874f0' : '#212121',
                whiteSpace: 'nowrap'
              }}>
                {cat.label}
              </span>

              {/* Active Blue Bottom Underline Indicator */}
              {isActive && (
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 4,
                  right: 4,
                  height: '3px',
                  backgroundColor: '#2874f0',
                  borderRadius: '2px 2px 0 0'
                }} />
              )}

              {/* Dropdown Flyout on Hover */}
              {hoveredTab === cat.id && cat.subcategories && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                  borderRadius: '4px',
                  border: '1px solid #e0e0e0',
                  padding: '12px 16px',
                  zIndex: 1200,
                  minWidth: '180px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  {cat.subcategories.map((sub, sIdx) => (
                    <div
                      key={sIdx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setHoveredTab(null);
                        onSelectCategory(cat.slug, sub);
                      }}
                      style={{
                        fontSize: '13px',
                        color: '#444',
                        padding: '4px 6px',
                        cursor: 'pointer',
                        borderRadius: '2px'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#2874f0'; e.currentTarget.style.backgroundColor = '#f0f5ff'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = '#444'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                    >
                      {sub}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
