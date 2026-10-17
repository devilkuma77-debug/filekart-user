import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // User state
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fk_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Cart state persisted to localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('fk_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('fk_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Saved addresses
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: 'Aarav Kumar',
      phone: '9888888888',
      pincode: '560103',
      locality: 'Outer Ring Road, Bellandur',
      address: 'Tower 4, Apt 402, Green Glen Layout',
      city: 'Bengaluru',
      state: 'Karnataka',
      landmark: 'Near Central Mall',
      address_type: 'HOME',
      is_default: 1
    }
  ]);
  const [selectedAddress, setSelectedAddress] = useState(addresses[0]);

  // Applied Coupon
  const [coupon, setCoupon] = useState(null);

  // Search & Navigation
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // Login Modal
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync cart to storage
  useEffect(() => {
    localStorage.setItem('fk_cart', JSON.stringify(cart));
  }, [cart]);

  // Sync wishlist to storage
  useEffect(() => {
    localStorage.setItem('fk_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart Actions
  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added '${product.title.slice(0, 24)}...' to Cart!`, 'success');
  };

  const updateQuantity = (productId, delta) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (productId) => {
    setCart(prev => prev.filter(item => item.id !== productId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  // Wishlist Actions
  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.some(item => item.id === product.id);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(item => item.id !== product.id);
      } else {
        showToast('Added to Wishlist!', 'success');
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId) => {
    return wishlist.some(item => item.id === productId);
  };

  // Auth
  const loginUser = (token, userData) => {
    localStorage.setItem('fk_token', token);
    localStorage.setItem('fk_user', JSON.stringify(userData));
    setUser(userData);
    setIsLoginModalOpen(false);
    showToast(`Welcome back, ${userData.name}!`, 'success');
  };

  const logoutUser = () => {
    localStorage.removeItem('fk_token');
    localStorage.removeItem('fk_user');
    setUser(null);
    showToast('Logged out successfully', 'info');
  };

  // Calculate Cart Totals
  const totalMrp = cart.reduce((sum, item) => sum + (item.original_price * item.quantity), 0);
  const totalSellingPrice = cart.reduce((sum, item) => sum + (item.selling_price * item.quantity), 0);
  const totalDiscount = totalMrp - totalSellingPrice;
  const couponDiscount = coupon ? coupon.discount_amount : 0;
  const deliveryCharge = totalSellingPrice > 500 || totalSellingPrice === 0 ? 0 : 40;
  const finalPayable = Math.max(0, totalSellingPrice - couponDiscount + deliveryCharge);
  const totalSavings = totalDiscount + couponDiscount;

  return (
    <ShopContext.Provider
      value={{
        user,
        loginUser,
        logoutUser,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        addresses,
        setAddresses,
        selectedAddress,
        setSelectedAddress,
        coupon,
        setCoupon,
        searchQuery,
        setSearchQuery,
        activeCategory,
        setActiveCategory,
        isLoginModalOpen,
        openLoginModal: () => setIsLoginModalOpen(true),
        closeLoginModal: () => setIsLoginModalOpen(false),
        toast,
        showToast,
        totals: {
          totalMrp,
          totalSellingPrice,
          totalDiscount,
          couponDiscount,
          deliveryCharge,
          finalPayable,
          totalSavings,
          itemCount: cart.reduce((c, i) => c + i.quantity, 0)
        }
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
