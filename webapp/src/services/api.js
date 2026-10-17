const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

function getHeaders() {
  const token = localStorage.getItem('fk_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Products
  async getProducts(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE}/products?${query}`);
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch (err) {
      console.warn('API error, using local fallback:', err.message);
      return { success: true, products: [], total: 0 };
    }
  },

  async getProduct(idOrSlug) {
    try {
      const res = await fetch(`${API_BASE}/products/${idOrSlug}`);
      if (!res.ok) throw new Error('Product not found');
      return await res.json();
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  // Categories & Brands
  async getCategories() {
    try {
      const res = await fetch(`${API_BASE}/categories`);
      return await res.json();
    } catch (err) {
      return { success: false, categories: [] };
    }
  },

  async getBrands() {
    try {
      const res = await fetch(`${API_BASE}/brands`);
      return await res.json();
    } catch (err) {
      return { success: false, brands: [] };
    }
  },

  // Banners
  async getBanners() {
    try {
      const res = await fetch(`${API_BASE}/banners`);
      return await res.json();
    } catch (err) {
      return { success: false, banners: [] };
    }
  },

  // Auth
  async sendOtp(contact) {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact })
    });
    return await res.json();
  },

  async verifyOtp(contact, otp, name) {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contact, otp, name })
    });
    return await res.json();
  },

  async login(emailOrPhone, password) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ emailOrPhone, password })
    });
    return await res.json();
  },

  async getProfile() {
    const res = await fetch(`${API_BASE}/auth/profile`, { headers: getHeaders() });
    return await res.json();
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(orderData)
    });
    return await res.json();
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE}/orders/my-orders`, { headers: getHeaders() });
    return await res.json();
  },

  async getOrder(id) {
    const res = await fetch(`${API_BASE}/orders/${id}`, { headers: getHeaders() });
    return await res.json();
  },

  async cancelOrder(id, reason) {
    const res = await fetch(`${API_BASE}/orders/${id}/cancel`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ reason })
    });
    return await res.json();
  },

  // Addresses
  async getAddresses() {
    const res = await fetch(`${API_BASE}/customer/addresses`, { headers: getHeaders() });
    return await res.json();
  },

  async addAddress(addressData) {
    const res = await fetch(`${API_BASE}/customer/addresses`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(addressData)
    });
    return await res.json();
  },

  // Coupons
  async validateCoupon(code, cartTotal) {
    const res = await fetch(`${API_BASE}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartTotal })
    });
    return await res.json();
  },

  // Support
  async createSupportTicket(data) {
    const res = await fetch(`${API_BASE}/support/tickets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Sellers
  async registerSeller(data) {
    const res = await fetch(`${API_BASE}/sellers/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return await res.json();
  },

  // Store & Payment Settings
  async getSettings() {
    try {
      const res = await fetch(`${API_BASE}/settings`);
      return await res.json();
    } catch {
      return { success: false, settings: {} };
    }
  }
};
