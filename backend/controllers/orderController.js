const { query, getIsConnected, memoryStore } = require('../config/db');

function safeJsonParse(data, defaultVal = []) {
  if (!data) return defaultVal;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultVal;
  }
}

// Create new customer order
exports.createOrder = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : (req.body.user_id || 1);
    const {
      items,
      shipping_address,
      payment_method = 'Cash On Delivery',
      total_amount,
      discount_amount = 0,
      delivery_charge = 0
    } = req.body;

    if (!items || !items.length || !shipping_address || !total_amount) {
      return res.status(400).json({ success: false, message: 'Items, shipping address, and total amount are required' });
    }

    const orderNumber = 'OD' + Math.floor(100000000000 + Math.random() * 900000000000);
    const paymentStatus = payment_method.toLowerCase().includes('cash') ? 'Pending' : 'Paid';
    const trackingHistory = [
      {
        status: 'Ordered',
        title: 'Order Placed',
        time: new Date().toISOString(),
        description: `Your order #${orderNumber} has been placed.`
      }
    ];

    if (getIsConnected()) {
      const sql = `
        INSERT INTO orders 
        (order_number, user_id, items, total_amount, discount_amount, delivery_charge, payment_method, payment_status, order_status, shipping_address, tracking_history)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await query(sql, [
        orderNumber,
        userId,
        JSON.stringify(items),
        total_amount,
        discount_amount,
        delivery_charge,
        payment_method,
        paymentStatus,
        'Ordered',
        JSON.stringify(shipping_address),
        JSON.stringify(trackingHistory)
      ]);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        orderId: result.insertId,
        orderNumber
      });
    } else {
      const newOrder = {
        id: memoryStore.orders.length + 1,
        order_number: orderNumber,
        user_id: userId,
        items,
        total_amount,
        discount_amount,
        delivery_charge,
        payment_method,
        payment_status: paymentStatus,
        order_status: 'Ordered',
        shipping_address,
        tracking_history: trackingHistory,
        created_at: new Date()
      };
      memoryStore.orders.unshift(newOrder);

      return res.status(201).json({
        success: true,
        message: 'Order placed successfully!',
        orderId: newOrder.id,
        orderNumber
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Customer orders
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user ? req.user.id : 1;

    if (getIsConnected()) {
      let rows = await query('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
      if (!rows || rows.length === 0) {
        rows = await query('SELECT * FROM orders ORDER BY id DESC LIMIT 5');
      }
      const orders = rows.map(o => ({
        ...o,
        items: safeJsonParse(o.items, []),
        shipping_address: safeJsonParse(o.shipping_address, {}),
        tracking_history: safeJsonParse(o.tracking_history, [])
      }));
      return res.json({ success: true, orders });
    } else {
      let orders = memoryStore.orders.filter(o => o.user_id === userId);
      if (orders.length === 0 && memoryStore.orders.length > 0) {
        orders = memoryStore.orders;
      }
      return res.json({ success: true, orders });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get single order
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getIsConnected()) {
      const rows = await query('SELECT * FROM orders WHERE id = ? OR order_number = ?', [id, id]);
      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }
      const o = rows[0];
      return res.json({
        success: true,
        order: {
          ...o,
          items: safeJsonParse(o.items, []),
          shipping_address: safeJsonParse(o.shipping_address, {}),
          tracking_history: safeJsonParse(o.tracking_history, [])
        }
      });
    } else {
      const o = memoryStore.orders.find(item => item.id === parseInt(id) || item.order_number === id);
      if (!o) return res.status(404).json({ success: false, message: 'Order not found' });
      return res.json({ success: true, order: o });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all orders with status/search filters
exports.getAllOrders = async (req, res) => {
  try {
    const { status, search } = req.query;

    if (getIsConnected()) {
      let sql = 'SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone FROM orders o LEFT JOIN users u ON o.user_id = u.id WHERE 1=1';
      const params = [];

      if (status && status !== 'all') {
        sql += ' AND o.order_status = ?';
        params.push(status);
      }

      if (search) {
        sql += ' AND (o.order_number LIKE ? OR u.name LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      sql += ' ORDER BY o.id DESC';

      const rows = await query(sql, params);
      const orders = rows.map(o => ({
        ...o,
        items: safeJsonParse(o.items, []),
        shipping_address: safeJsonParse(o.shipping_address, {}),
        tracking_history: safeJsonParse(o.tracking_history, [])
      }));

      return res.json({ success: true, count: orders.length, orders });
    } else {
      let list = [...memoryStore.orders];
      if (status && status !== 'all') {
        list = list.filter(o => o.order_status.toLowerCase() === status.toLowerCase());
      }
      return res.json({ success: true, count: list.length, orders: list });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update order status (Admin pipeline)
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status, notes } = req.body;

    const validStatuses = ['Ordered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ success: false, message: 'Invalid order status' });
    }

    if (getIsConnected()) {
      const rows = await query('SELECT tracking_history FROM orders WHERE id = ?', [id]);
      if (!rows || rows.length === 0) return res.status(404).json({ success: false, message: 'Order not found' });

      const history = safeJsonParse(rows[0].tracking_history, []);
      history.push({
        status: order_status,
        title: `Status updated to ${order_status}`,
        time: new Date().toISOString(),
        description: notes || `Order is now ${order_status.toLowerCase()}.`
      });

      await query(
        'UPDATE orders SET order_status = ?, tracking_history = ? WHERE id = ?',
        [order_status, JSON.stringify(history), id]
      );

      return res.json({ success: true, message: `Order status updated to ${order_status}` });
    } else {
      const order = memoryStore.orders.find(o => o.id === parseInt(id));
      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
      order.order_status = order_status;
      order.tracking_history = order.tracking_history || [];
      order.tracking_history.push({
        status: order_status,
        title: `Status updated to ${order_status}`,
        time: new Date().toISOString(),
        description: notes || `Order is now ${order_status.toLowerCase()}.`
      });
      return res.json({ success: true, message: `Order status updated to ${order_status}` });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Cancel Order
exports.cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by customer' } = req.body;

    if (getIsConnected()) {
      const rows = await query('SELECT tracking_history, order_status FROM orders WHERE id = ?', [id]);
      if (!rows.length) return res.status(404).json({ success: false, message: 'Order not found' });

      if (rows[0].order_status === 'Delivered') {
        return res.status(400).json({ success: false, message: 'Delivered orders cannot be cancelled. You can request a return.' });
      }

      const history = safeJsonParse(rows[0].tracking_history, []);
      history.push({
        status: 'Cancelled',
        title: 'Order Cancelled',
        time: new Date().toISOString(),
        description: reason
      });

      await query('UPDATE orders SET order_status = "Cancelled", tracking_history = ? WHERE id = ?', [JSON.stringify(history), id]);
      return res.json({ success: true, message: 'Order has been cancelled.' });
    } else {
      const o = memoryStore.orders.find(item => item.id === parseInt(id));
      if (o) {
        o.order_status = 'Cancelled';
        o.tracking_history.push({
          status: 'Cancelled',
          title: 'Order Cancelled',
          time: new Date().toISOString(),
          description: reason
        });
      }
      return res.json({ success: true, message: 'Order has been cancelled.' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
