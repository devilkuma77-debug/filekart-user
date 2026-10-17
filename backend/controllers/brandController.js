const { query, getIsConnected, memoryStore } = require('../config/db');

exports.getBrands = async (req, res) => {
  try {
    if (getIsConnected()) {
      const brands = await query('SELECT * FROM brands ORDER BY name ASC');
      return res.json({ success: true, brands });
    } else {
      return res.json({ success: true, brands: memoryStore.brands });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBrand = async (req, res) => {
  try {
    const { name, logo } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Brand name required' });

    if (getIsConnected()) {
      const result = await query('INSERT INTO brands (name, logo) VALUES (?, ?)', [name, logo || '']);
      return res.status(201).json({ success: true, message: 'Brand created', brandId: result.insertId });
    } else {
      const b = { id: memoryStore.brands.length + 1, name, logo: logo || '', is_active: 1 };
      memoryStore.brands.push(b);
      return res.status(201).json({ success: true, message: 'Brand created', brand: b });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await query('DELETE FROM brands WHERE id = ?', [id]);
    } else {
      const idx = memoryStore.brands.findIndex(b => b.id === parseInt(id));
      if (idx !== -1) memoryStore.brands.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Brand deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
