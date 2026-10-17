const { query, getIsConnected, memoryStore } = require('../config/db');

exports.getCategories = async (req, res) => {
  try {
    if (getIsConnected()) {
      const sql = `
        SELECT c.*, COUNT(p.id) as product_count 
        FROM categories c
        LEFT JOIN products p ON c.id = p.category_id
        GROUP BY c.id
        ORDER BY c.display_order ASC, c.id ASC
      `;
      const categories = await query(sql);
      return res.json({ success: true, categories });
    } else {
      const categories = memoryStore.categories.map((c, idx) => ({
        id: idx + 1,
        ...c,
        product_count: memoryStore.products.filter(p => p.category_name === c.name).length
      }));
      return res.json({ success: true, categories });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, image, description } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    if (getIsConnected()) {
      const result = await query(
        'INSERT INTO categories (name, slug, image, description) VALUES (?, ?, ?, ?)',
        [name, slug, image || '', description || '']
      );
      return res.status(201).json({ success: true, message: 'Category created', categoryId: result.insertId });
    } else {
      const newCat = { id: memoryStore.categories.length + 1, name, slug, image, description, is_active: 1 };
      memoryStore.categories.push(newCat);
      return res.status(201).json({ success: true, message: 'Category created', category: newCat });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, description, is_active } = req.body;

    if (getIsConnected()) {
      await query(
        'UPDATE categories SET name = COALESCE(?, name), image = COALESCE(?, image), description = COALESCE(?, description), is_active = COALESCE(?, is_active) WHERE id = ?',
        [name, image, description, is_active, id]
      );
      return res.json({ success: true, message: 'Category updated' });
    } else {
      const c = memoryStore.categories.find(item => item.id === parseInt(id));
      if (c) Object.assign(c, req.body);
      return res.json({ success: true, message: 'Category updated' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await query('DELETE FROM categories WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Category deleted' });
    } else {
      const idx = memoryStore.categories.findIndex(c => c.id === parseInt(id));
      if (idx !== -1) memoryStore.categories.splice(idx, 1);
      return res.json({ success: true, message: 'Category deleted' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
