import React, { useState } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import SellerModal from './components/SellerModal';
import HelpCenterModal from './components/HelpCenterModal';
import LocationModal from './components/LocationModal';
import MobileMenuDrawer from './components/MobileMenuDrawer';
import MobileBottomNav from './components/MobileBottomNav';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';

function ShopContent() {
  const { toast, addToCart, setActiveCategory, setSearchQuery } = useShop();

  const [page, setPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState('Location not set');

  // Modals & Navigation Drawer
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const navigateTo = (pageName) => {
    setPage(pageName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (prod) => {
    setSelectedProduct(prod);
    navigateTo('detail');
  };

  const handleSelectCategory = (catSlug, subItemName = '') => {
    setFilterCategory(catSlug);
    setActiveCategory(catSlug);
    if (subItemName) {
      setSearchKeyword(subItemName);
      setSearchQuery(subItemName);
    } else {
      setSearchKeyword('');
    }
    navigateTo('products');
  };

  const handleAddToCart = (prod) => {
    addToCart(prod, 1);
  };

  const handleBuyNow = (prod) => {
    addToCart(prod, 1);
    navigateTo('checkout');
  };

  const handleOrderPlaced = (order) => {
    setLastPlacedOrder(order);
    navigateTo('order-success');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f1f3f6' }}>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: 'fixed',
          top: '76px',
          right: '24px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#2874f0',
          color: '#fff',
          padding: '12px 24px',
          borderRadius: '4px',
          boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
          zIndex: 3000,
          fontWeight: 600,
          fontSize: '14px',
          animation: 'fadeIn 0.2s ease-in'
        }}>
          {toast.message}
        </div>
      )}

      {/* Modern Flipkart Header */}
      <Header
        onNavigate={navigateTo}
        currentPage={page}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        onOpenLocationModal={() => setIsLocationModalOpen(true)}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        deliveryLocation={deliveryLocation}
      />

      {/* Category Strip (Visible on Home and Product Catalog) */}
      {(page === 'home' || page === 'products') && (
        <CategoryNav onSelectCategory={handleSelectCategory} />
      )}

      {/* Main Pages */}
      <main style={{ flex: 1, paddingBottom: '30px' }}>
        {page === 'home' && (
          <HomePage
            onSelectProduct={handleSelectProduct}
            onSelectCategory={handleSelectCategory}
            onViewCategory={(cat) => handleSelectCategory(cat)}
          />
        )}

        {page === 'products' && (
          <ProductListPage
            onSelectProduct={handleSelectProduct}
            initialCategory={filterCategory}
            searchKeyword={searchKeyword}
          />
        )}

        {page === 'detail' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
            onBack={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {page === 'cart' && (
          <CartPage
            onProceedToCheckout={() => navigateTo('checkout')}
            onContinueShopping={() => navigateTo('home')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {page === 'checkout' && (
          <CheckoutPage
            onOrderPlaced={handleOrderPlaced}
            onBackToCart={() => navigateTo('cart')}
          />
        )}

        {page === 'order-success' && (
          <OrderSuccessPage
            order={lastPlacedOrder}
            onViewOrders={() => navigateTo('orders')}
            onContinueShopping={() => navigateTo('home')}
          />
        )}

        {page === 'orders' && (
          <OrdersPage onSelectProduct={handleSelectProduct} />
        )}

        {page === 'wishlist' && (
          <WishlistPage onSelectProduct={handleSelectProduct} />
        )}

        {page === 'account' && (
          <AccountPage onNavigate={navigateTo} />
        )}
      </main>

      {/* Mobile Slide-Out Navigation Drawer */}
      <MobileMenuDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onNavigate={navigateTo}
        onSelectCategory={handleSelectCategory}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        onOpenHelpModal={() => setIsHelpModalOpen(true)}
        deliveryLocation={deliveryLocation}
      />

      {/* Mobile Persistent Bottom Navigation Bar (Hidden on detail & checkout so buy/order buttons dock cleanly) */}
      {page !== 'detail' && page !== 'checkout' && (
        <MobileBottomNav
          currentPage={page}
          onNavigate={navigateTo}
          onOpenDrawer={() => setIsDrawerOpen(true)}
        />
      )}

      {/* Flipkart Modals */}
      <LoginModal />
      <SellerModal isOpen={isSellerModalOpen} onClose={() => setIsSellerModalOpen(false)} />
      <HelpCenterModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={deliveryLocation}
        onSelectLocation={(loc) => setDeliveryLocation(loc)}
      />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <ShopContent />
    </ShopProvider>
  );
}
