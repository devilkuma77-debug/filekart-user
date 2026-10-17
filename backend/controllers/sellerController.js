const { query, getIsConnected, memoryStore } = require('../config/db');

// Sellers
exports.getSellers = async (req, res) => {
  try {
    if (getIsConnected()) {
      const sellers = await query('SELECT * FROM sellers ORDER BY id DESC');
      return res.json({ success: true, sellers });
    } else {
      return res.json({ success: true, sellers: memoryStore.sellers });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.registerSeller = async (req, res) => {
  try {
    const { name, email, phone, business_name, gstin } = req.body;
    if (!name || !email || !business_name) {
      return res.status(400).json({ success: false, message: 'All seller fields are required' });
    }
    if (getIsConnected()) {
      const result = await query(
        'INSERT INTO sellers (name, email, phone, business_name, gstin, status) VALUES (?, ?, ?, ?, ?, "Approved")',
        [name, email, phone, business_name, gstin]
      );
      return res.status(201).json({ success: true, message: 'Seller registered successfully', sellerId: result.insertId });
    } else {
      const s = { id: memoryStore.sellers.length + 1, name, email, phone, business_name, gstin, status: 'Approved', commission_rate: 10, rating: 5.0 };
      memoryStore.sellers.push(s);
      return res.status(201).json({ success: true, message: 'Seller registered successfully', seller: s });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateSellerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (getIsConnected()) {
      await query('UPDATE sellers SET status = ? WHERE id = ?', [status, id]);
    } else {
      const s = memoryStore.sellers.find(item => item.id === parseInt(id));
      if (s) s.status = status;
    }
    return res.json({ success: true, message: `Seller status updated to ${status}` });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
