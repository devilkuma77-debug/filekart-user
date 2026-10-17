import React from 'react';
import { Bell, Search, ExternalLink, User, Menu } from 'lucide-react';

export default function TopNavbar({ title, onToggleSidebar }) {
  return (
    <header className="admin-topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Mobile Hamburger Toggle Button */}
        <button
          className="admin-mobile-toggle-btn"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
        >
          <Menu size={22} />
        </button>

        <div>
          <h1 className="admin-page-title">{title}</h1>
          <div className="admin-page-subtitle">Flipkart Central E-Commerce Console</div>
        </div>
      </div>

      <div className="admin-topbar-actions">
        {/* Quick View Store */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          className="btn-secondary admin-view-store-btn"
          style={{ textDecoration: 'none' }}
        >
          <ExternalLink size={15} />
          <span className="admin-btn-text">View Customer Website</span>
        </a>

        {/* Notifications */}
        <div style={{ position: 'relative', cursor: 'pointer', padding: '6px' }}>
          <Bell size={20} color="#64748b" />
          <span style={{ position: 'absolute', top: 2, right: 2, width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }} />
        </div>

        {/* Admin Profile */}
        <div className="admin-profile-pill">
          <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#2874f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px', flexShrink: 0 }}>
            A
          </div>
          <div className="admin-profile-info">
            <div style={{ fontSize: '13px', fontWeight: 600 }}>Super Admin</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>admin@flipkart.com</div>
          </div>
        </div>
      </div>
    </header>
  );
}
