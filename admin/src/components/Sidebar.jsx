import React from 'react';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  RotateCcw,
  Users,
  Store,
  Warehouse,
  Truck,
  CreditCard,
  TicketPercent,
  Megaphone,
  Star,
  LifeBuoy,
  BarChart3,
  Globe,
  ShieldCheck,
  Settings,
  LogOut
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onLogout, isOpen = false, onClose }) {
  const menuSections = [
    {
      title: 'CORE MANAGEMENT',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'categories', label: 'Categories', icon: Layers },
        { id: 'brands', label: 'Brands', icon: Tag },
        { id: 'orders', label: 'Orders', icon: ShoppingBag },
        { id: 'returns', label: 'Returns & Refunds', icon: RotateCcw }
      ]
    },
    {
      title: 'USERS & OPERATIONS',
      items: [
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'sellers', label: 'Sellers', icon: Store },
        { id: 'inventory', label: 'Inventory & Stock', icon: Warehouse },
        { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
        { id: 'payments', label: 'Payments & Finance', icon: CreditCard }
      ]
    },
    {
      title: 'MARKETING & SUPPORT',
      items: [
        { id: 'coupons', label: 'Coupons & Offers', icon: TicketPercent },
        { id: 'marketing', label: 'Marketing & Banners', icon: Megaphone },
        { id: 'reviews', label: 'Reviews & Ratings', icon: Star },
        { id: 'support', label: 'Support Tickets', icon: LifeBuoy },
        { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 }
      ]
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { id: 'website', label: 'Website Management', icon: Globe },
        { id: 'admin-users', label: 'Admin Users & Roles', icon: ShieldCheck },
        { id: 'settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      {/* Sidebar Header */}
      <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            backgroundColor: '#2874f0',
            color: '#fff',
            fontWeight: 800,
            fontStyle: 'italic',
            padding: '6px 12px',
            borderRadius: '4px',
            fontSize: '18px',
            letterSpacing: '-0.5px'
          }}>
            Flipkart
          </div>
          <div>
            <div style={{ color: '#fff', fontWeight: 600, fontSize: '14px' }}>Admin Portal</div>
            <div style={{ color: '#64748b', fontSize: '11px' }}>Operations Suite</div>
          </div>
        </div>

        {/* Mobile Close Button */}
        {onClose && (
          <button
            className="admin-sidebar-close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Menu Sections */}
      <div className="sidebar-menu-list">
        {menuSections.map((sec, idx) => (
          <div key={idx}>
            <div className="sidebar-category-label">{sec.title}</div>
            {sec.items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div
                  key={item.id}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (onClose) onClose();
                  }}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
              );
            })}
          </div>
        ))}

        {/* Logout */}
        <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div
            className="sidebar-item"
            style={{ color: '#f87171' }}
            onClick={onLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
