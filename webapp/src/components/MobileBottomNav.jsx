import React from 'react';
import { Home, Grid, Tag, User, ShoppingCart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export default function MobileBottomNav({ currentPage, onNavigate, onOpenDrawer }) {
  const { totals, user, openLoginModal } = useShop();

  const handleAccountClick = () => {
    if (user) {
      onNavigate('account');
    } else {
      openLoginModal();
    }
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: (active) => <Home size={20} color={active ? '#2874f0' : '#717478'} />,
      onClick: () => onNavigate('home')
    },
    {
      id: 'categories',
      label: 'Categories',
      icon: (active) => <Grid size={20} color={active ? '#2874f0' : '#717478'} />,
      onClick: () => onOpenDrawer ? onOpenDrawer() : onNavigate('products')
    },
    {
      id: 'deals',
      label: 'Deals',
      icon: (active) => <Tag size={20} color={active ? '#2874f0' : '#717478'} />,
      onClick: () => onNavigate('products')
    },
    {
      id: 'account',
      label: 'Account',
      icon: (active) => <User size={20} color={active ? '#2874f0' : '#717478'} />,
      onClick: handleAccountClick
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: (active) => (
        <div style={{ position: 'relative' }}>
          <ShoppingCart size={20} color={active ? '#2874f0' : '#717478'} />
          {totals.itemCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: -6,
                right: -10,
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
                padding: '0 4px',
                border: '1.5px solid #fff'
              }}
            >
              {totals.itemCount}
            </span>
          )}
        </div>
      ),
      onClick: () => onNavigate('cart')
    }
  ];

  return (
    <div className="mobile-bottom-nav">
      {navItems.map((item) => {
        const isActive = currentPage === item.id;
        return (
          <div
            key={item.id}
            onClick={item.onClick}
            className={`mobile-bottom-nav-item ${isActive ? 'active' : ''}`}
          >
            {item.icon(isActive)}
            <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isActive ? '#2874f0' : '#717478', marginTop: '2px' }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
