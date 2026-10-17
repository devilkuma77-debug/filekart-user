const { query, getIsConnected, memoryStore } = require('../config/db');

exports.validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) return res.status(400).json({ success: false, message: 'Please provide coupon code' });

    let coupon = null;
    if (getIsConnected()) {
      const rows = await query('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code.toUpperCase()]);
      if (rows && rows.length > 0) coupon = rows[0];
    } else {
      coupon = memoryStore.coupons.find(c => c.code.toUpperCase() === code.toUpperCase() && c.is_active);
    }

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code' });
    }

    if (cartTotal && cartTotal < coupon.min_order_value) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires minimum order value of ₹${coupon.min_order_value}`
      });
    }

    let discount = 0;
    if (coupon.discount_type === 'PERCENTAGE') {
      discount = Math.min((cartTotal * coupon.discount_value) / 100, coupon.max_discount || 1000);
    } else {
      discount = coupon.discount_value;
    }

    return res.json({
      success: true,
      message: `Coupon '${coupon.code}' applied successfully!`,
      coupon: {
        code: coupon.code,
        discount_amount: Math.round(discount),
        description: coupon.description
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    if (getIsConnected()) {
      const coupons = await query('SELECT * FROM coupons ORDER BY id DESC');
      return res.json({ success: true, coupons });
    } else {
      return res.json({ success: true, coupons: memoryStore.coupons });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const { code, description, discount_type, discount_value, min_order_value, max_discount, valid_until } = req.body;
    if (!code || !discount_value) return res.status(400).json({ success: false, message: 'Code and discount value required' });

    if (getIsConnected()) {
      const result = await query(
        'INSERT INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [code.toUpperCase(), description || '', discount_type || 'PERCENTAGE', discount_value, min_order_value || 0, max_discount || 1000, valid_until || null]
      );
      return res.status(201).json({ success: true, message: 'Coupon created', couponId: result.insertId });
    } else {
      const c = { id: memoryStore.coupons.length + 1, code: code.toUpperCase(), description, discount_type, discount_value, min_order_value, max_discount, valid_until, is_active: 1 };
      memoryStore.coupons.push(c);
      return res.status(201).json({ success: true, message: 'Coupon created', coupon: c });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await query('DELETE FROM coupons WHERE id = ?', [id]);
    } else {
      const idx = memoryStore.coupons.findIndex(c => c.id === parseInt(id));
      if (idx !== -1) memoryStore.coupons.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Coupon deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
