const { query, getIsConnected, memoryStore } = require('../config/db');

exports.getBanners = async (req, res) => {
  try {
    if (getIsConnected()) {
      const banners = await query('SELECT * FROM banners WHERE is_active = 1 ORDER BY position ASC');
      return res.json({ success: true, banners });
    } else {
      return res.json({ success: true, banners: memoryStore.banners.filter(b => b.is_active) });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllBanners = async (req, res) => {
  try {
    if (getIsConnected()) {
      const banners = await query('SELECT * FROM banners ORDER BY position ASC, id DESC');
      return res.json({ success: true, banners });
    } else {
      return res.json({ success: true, banners: memoryStore.banners });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBanner = async (req, res) => {
  try {
    const { title, image, link, section = 'home_hero', position = 1 } = req.body;
    if (!title || !image) return res.status(400).json({ success: false, message: 'Banner title and image required' });

    if (getIsConnected()) {
      const result = await query(
        'INSERT INTO banners (title, image, link, section, position) VALUES (?, ?, ?, ?, ?)',
        [title, image, link || '/products', section, position]
      );
      return res.status(201).json({ success: true, message: 'Banner created', bannerId: result.insertId });
    } else {
      const b = { id: memoryStore.banners.length + 1, title, image, link, section, position, is_active: 1 };
      memoryStore.banners.push(b);
      return res.status(201).json({ success: true, message: 'Banner created', banner: b });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await query('DELETE FROM banners WHERE id = ?', [id]);
    } else {
      const idx = memoryStore.banners.findIndex(b => b.id === parseInt(id));
      if (idx !== -1) memoryStore.banners.splice(idx, 1);
    }
    return res.json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
