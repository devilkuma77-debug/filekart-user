const express = require('express');
const router = express.Router();

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

const authCtrl = require('../controllers/authController');
const prodCtrl = require('../controllers/productController');
const catCtrl = require('../controllers/categoryController');
const brandCtrl = require('../controllers/brandController');
const orderCtrl = require('../controllers/orderController');
const couponCtrl = require('../controllers/couponController');
const bannerCtrl = require('../controllers/bannerController');
const custCtrl = require('../controllers/customerController');
const sellerCtrl = require('../controllers/sellerController');
const supportCtrl = require('../controllers/supportController');
const analyticsCtrl = require('../controllers/analyticsController');
const settingsCtrl = require('../controllers/settingsController');

// --- Auth Routes ---
router.post('/auth/send-otp', authCtrl.sendOtp);
router.post('/auth/verify-otp', authCtrl.verifyOtp);
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.post('/auth/admin-login', authCtrl.adminLogin);
router.get('/auth/profile', verifyToken, authCtrl.getProfile);

// --- Product Routes ---
router.get('/products', prodCtrl.getProducts);
router.get('/products/:idOrSlug', prodCtrl.getProduct);
router.post('/products', prodCtrl.createProduct);
router.put('/products/:id', prodCtrl.updateProduct);
router.delete('/products/:id', prodCtrl.deleteProduct);

// --- Category & Brand Routes ---
router.get('/categories', catCtrl.getCategories);
router.post('/categories', catCtrl.createCategory);
router.put('/categories/:id', catCtrl.updateCategory);
router.delete('/categories/:id', catCtrl.deleteCategory);

router.get('/brands', brandCtrl.getBrands);
router.post('/brands', brandCtrl.createBrand);
router.delete('/brands/:id', brandCtrl.deleteBrand);

// --- Order Routes ---
router.post('/orders', orderCtrl.createOrder);
router.get('/orders/my-orders', verifyToken, orderCtrl.getUserOrders);
router.get('/orders/:id', orderCtrl.getOrderById);
router.put('/orders/:id/cancel', orderCtrl.cancelOrder);

// --- Customer & Addresses ---
router.get('/customer/addresses', verifyToken, custCtrl.getAddresses);
router.post('/customer/addresses', verifyToken, custCtrl.addAddress);

// --- Coupons & Offers ---
router.post('/coupons/validate', couponCtrl.validateCoupon);
router.get('/coupons', couponCtrl.getCoupons);

// --- Banners ---
router.get('/banners', bannerCtrl.getBanners);

// --- Support Tickets ---
router.get('/support/tickets', supportCtrl.getTickets);
router.post('/support/tickets', supportCtrl.createTicket);

// --- Sellers ---
router.get('/sellers', sellerCtrl.getSellers);
router.post('/sellers/register', sellerCtrl.registerSeller);

// --- General Settings & Payment Gateways ---
router.get('/settings', settingsCtrl.getSettings);
router.put('/settings', settingsCtrl.updateSettings);
router.post('/settings', settingsCtrl.updateSettings);
router.get('/payment-gateway', settingsCtrl.getSettings);
router.put('/payment-gateway', settingsCtrl.updateSettings);
router.put('/admin/settings', settingsCtrl.updateSettings);

// ================= ADMIN ROUTES =================
router.get('/admin/analytics/dashboard', analyticsCtrl.getDashboardStats);
router.get('/admin/orders', orderCtrl.getAllOrders);
router.put('/admin/orders/:id/status', orderCtrl.updateOrderStatus);
router.get('/admin/customers', custCtrl.getAllCustomers);
router.put('/admin/customers/:id/toggle', custCtrl.toggleCustomerStatus);
router.get('/admin/coupons', couponCtrl.getCoupons);
router.post('/admin/coupons', couponCtrl.createCoupon);
router.delete('/admin/coupons/:id', couponCtrl.deleteCoupon);
router.get('/admin/banners', bannerCtrl.getAllBanners);
router.post('/admin/banners', bannerCtrl.createBanner);
router.delete('/admin/banners/:id', bannerCtrl.deleteBanner);
router.put('/admin/sellers/:id/status', sellerCtrl.updateSellerStatus);
router.put('/admin/support/tickets/:id/status', supportCtrl.updateTicketStatus);
const seedCtrl = require('../controllers/seedController');

// --- Seeding Dummy Data ---
router.post('/seed', seedCtrl.seedDatabase);
router.get('/seed', seedCtrl.seedDatabase);

module.exports = router;
