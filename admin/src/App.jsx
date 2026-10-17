import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';

import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import CategoriesPage from './pages/CategoriesPage';
import BrandsPage from './pages/BrandsPage';
import OrdersPage from './pages/OrdersPage';
import ReturnsRefundsPage from './pages/ReturnsRefundsPage';
import CustomersPage from './pages/CustomersPage';
import SellersPage from './pages/SellersPage';
import InventoryPage from './pages/InventoryPage';
import ShippingPage from './pages/ShippingPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentGatewayPage from './pages/PaymentGatewayPage';
import CouponsOffersPage from './pages/CouponsOffersPage';
import BannersMarketingPage from './pages/BannersMarketingPage';
import ReviewsPage from './pages/ReviewsPage';
import SupportTicketsPage from './pages/SupportTicketsPage';
import ReportsPage from './pages/ReportsPage';
import WebsiteManagementPage from './pages/WebsiteManagementPage';
import AdminUsersPage from './pages/AdminUsersPage';
import SettingsPage from './pages/SettingsPage';

import { Lock, Mail, ShieldAlert } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('fk_admin_logged') === 'true';
  });

  // Admin login form states
  const [email, setEmail] = useState('admin@flipkart.com');
  const [password, setPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  const handleAdminLogin = (e) => {
    e.preventDefault();
    if (email === 'admin@flipkart.com' && (password === 'admin123' || password === 'admin@2025')) {
      localStorage.setItem('fk_admin_logged', 'true');
      localStorage.setItem('fk_admin_token', 'admin_secure_token_flipkart');
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid admin email or password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('fk_admin_logged');
    localStorage.removeItem('fk_admin_token');
    setIsAdminLoggedIn(false);
  };

  if (!isAdminLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f172a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: '#fff',
          width: '100%',
          maxWidth: '420px',
          borderRadius: '8px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{ backgroundColor: '#2874f0', padding: '32px 24px', textAlign: 'center', color: '#fff' }}>
            <div style={{ fontSize: '28px', fontWeight: 800, fontStyle: 'italic', letterSpacing: '-0.5px' }}>
              Flipkart
            </div>
            <div style={{ fontSize: '13px', opacity: 0.9, marginTop: '4px' }}>
              Enterprise Administrator Console
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleAdminLogin} style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {loginError && (
              <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '10px 14px', borderRadius: '4px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldAlert size={16} /> {loginError}
              </div>
            )}

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Admin Email ID
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#94a3b8" style={{ position: 'absolute', top: 12, left: 12 }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px 10px 38px', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', top: 12, left: 12 }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '10px 12px 10px 38px', fontSize: '13px' }}
                />
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px' }}>
                Demo Credentials: <strong>admin@flipkart.com</strong> / <strong>admin123</strong>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '10px', fontSize: '14px' }}
            >
              Sign In to Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Titles mapping
  const titles = {
    dashboard: 'Operations & Performance Dashboard',
    products: 'Products Catalog Management',
    categories: 'Categories & Taxonomy',
    brands: 'Brand Partners',
    orders: 'Customer Orders Fulfillment',
    returns: 'Returns, Replacements & Refunds',
    customers: 'Customer Directory & Accounts',
    sellers: 'Marketplace Sellers & Vendors',
    inventory: 'Inventory & Warehouse Stock',
    shipping: 'Shipping Partners & Courier Logistics',
    payments: 'Payments & COD Reconciliation',
    'payment-gateway': 'Payment Gateway & UPI Configurations',
    coupons: 'Marketing Coupons & Flash Offers',
    marketing: 'Homepage Banners & Advertising',
    reviews: 'Customer Reviews Moderation',
    support: 'Customer Support Tickets',
    reports: 'Business Reports & Analytics',
    website: 'Website & App Configurations',
    'admin-users': 'Admin Users & Role Permissions',
    settings: 'Global Store Settings'
  };

  return (
    <div className="admin-layout">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="admin-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setIsSidebarOpen(false);
        }}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="admin-main-wrapper">
        <TopNavbar
          title={titles[activeTab] || 'Flipkart Management'}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
        />

        <div className="admin-content-area">
          {activeTab === 'dashboard' && <DashboardPage onNavigateTab={setActiveTab} />}
          {activeTab === 'products' && <ProductsPage />}
          {activeTab === 'categories' && <CategoriesPage />}
          {activeTab === 'brands' && <BrandsPage />}
          {activeTab === 'orders' && <OrdersPage />}
          {activeTab === 'returns' && <ReturnsRefundsPage />}
          {activeTab === 'customers' && <CustomersPage />}
          {activeTab === 'sellers' && <SellersPage />}
          {activeTab === 'inventory' && <InventoryPage />}
          {activeTab === 'shipping' && <ShippingPage />}
          {activeTab === 'payments' && <PaymentsPage />}
          {activeTab === 'payment-gateway' && <PaymentGatewayPage />}
          {activeTab === 'coupons' && <CouponsOffersPage />}
          {activeTab === 'marketing' && <BannersMarketingPage />}
          {activeTab === 'reviews' && <ReviewsPage />}
          {activeTab === 'support' && <SupportTicketsPage />}
          {activeTab === 'reports' && <ReportsPage />}
          {activeTab === 'website' && <WebsiteManagementPage />}
          {activeTab === 'admin-users' && <AdminUsersPage />}
          {activeTab === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  );
}
