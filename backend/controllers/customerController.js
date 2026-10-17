const { query, getIsConnected, memoryStore } = require('../config/db');

// Customer Addresses
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;
    if (getIsConnected()) {
      const addresses = await query('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC', [userId]);
      return res.json({ success: true, addresses });
    } else {
      return res.json({
        success: true,
        addresses: [
          {
            id: 1,
            user_id: userId,
            name: req.user.name || 'Flipkart User',
            phone: req.user.phone || '9876543210',
            pincode: '560103',
            locality: 'Bellandur',
            address: 'Embassy Tech Village, Outer Ring Road, Devarabisanahalli',
            city: 'Bengaluru',
            state: 'Karnataka',
            landmark: 'Near New Horizon College',
            address_type: 'HOME',
            is_default: 1
          }
        ]
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, pincode, locality, address, city, state, landmark, alternate_phone, address_type = 'HOME', is_default = 0 } = req.body;

    if (!name || !phone || !pincode || !address || !city || !state) {
      return res.status(400).json({ success: false, message: 'Please fill in all required address fields' });
    }

    if (getIsConnected()) {
      if (is_default) {
        await query('UPDATE addresses SET is_default = 0 WHERE user_id = ?', [userId]);
      }
      const result = await query(
        `INSERT INTO addresses (user_id, name, phone, pincode, locality, address, city, state, landmark, alternate_phone, address_type, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, name, phone, pincode, locality || '', address, city, state, landmark || '', alternate_phone || '', address_type, is_default ? 1 : 0]
      );
      return res.status(201).json({ success: true, message: 'Address saved', addressId: result.insertId });
    } else {
      return res.status(201).json({ success: true, message: 'Address saved successfully' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all customers
exports.getAllCustomers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const customers = await query(`
        SELECT u.id, u.name, u.email, u.phone, u.role, u.is_active, u.created_at,
        COUNT(o.id) as total_orders,
        COALESCE(SUM(o.total_amount), 0) as total_spent
        FROM users u
        LEFT JOIN orders o ON u.id = o.user_id
        WHERE u.role = 'customer'
        GROUP BY u.id
        ORDER BY u.id DESC
      `);
      return res.json({ success: true, customers });
    } else {
      const customers = [
        { id: 2, name: 'Aarav Kumar', email: 'customer@flipkart.com', phone: '9888888888', role: 'customer', is_active: 1, total_orders: 4, total_spent: 42999, created_at: new Date() },
        { id: 3, name: 'Priya Sharma', email: 'priya@gmail.com', phone: '9876501234', role: 'customer', is_active: 1, total_orders: 2, total_spent: 12490, created_at: new Date() }
      ];
      return res.json({ success: true, customers });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Toggle block/unblock customer
exports.toggleCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await query('UPDATE users SET is_active = NOT is_active WHERE id = ?', [id]);
    }
    return res.json({ success: true, message: 'Customer status updated' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
