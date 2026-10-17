const { query, getIsConnected, memoryStore } = require('../config/db');

// Helper to sanitize JSON
function safeJsonParse(data, defaultVal = []) {
  if (!data) return defaultVal;
  if (typeof data === 'object') return data;
  try {
    return JSON.parse(data);
  } catch (e) {
    return defaultVal;
  }
}

// Get all products with rich filters & sorting
exports.getProducts = async (req, res) => {
  try {
    const {
      category,
      brand,
      search,
      minPrice,
      maxPrice,
      rating,
      assured,
      deal_of_day,
      featured,
      sort,
      page = 1,
      limit = 24
    } = req.query;

    if (getIsConnected()) {
      let sql = `
        SELECT p.*, c.name as category_name, c.slug as category_slug, b.name as brand_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE 1=1
      `;
      const params = [];

      if (category && category !== 'all') {
        sql += ` AND (c.slug = ? OR c.name = ?)`;
        params.push(category, category);
      }

      if (brand) {
        const brandList = brand.split(',');
        sql += ` AND b.name IN (${brandList.map(() => '?').join(',')})`;
        params.push(...brandList);
      }

      if (search) {
        sql += ` AND (p.title LIKE ? OR p.description LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
      }

      if (minPrice) {
        sql += ` AND p.selling_price >= ?`;
        params.push(parseFloat(minPrice));
      }

      if (maxPrice) {
        sql += ` AND p.selling_price <= ?`;
        params.push(parseFloat(maxPrice));
      }

      if (rating) {
        sql += ` AND p.rating >= ?`;
        params.push(parseFloat(rating));
      }

      if (assured === '1' || assured === 'true') {
        sql += ` AND p.is_assured = 1`;
      }

      if (deal_of_day === '1' || deal_of_day === 'true') {
        sql += ` AND p.is_deal_of_day = 1`;
      }

      if (featured === '1' || featured === 'true') {
        sql += ` AND p.is_featured = 1`;
      }

      // Sorting
      if (sort === 'price_asc') {
        sql += ` ORDER BY p.selling_price ASC`;
      } else if (sort === 'price_desc') {
        sql += ` ORDER BY p.selling_price DESC`;
      } else if (sort === 'rating_desc') {
        sql += ` ORDER BY p.rating DESC`;
      } else if (sort === 'newest') {
        sql += ` ORDER BY p.id DESC`;
      } else {
        // Default: popularity / rating_count
        sql += ` ORDER BY p.rating_count DESC, p.id DESC`;
      }

      // Pagination
      const offset = (parseInt(page) - 1) * parseInt(limit);
      sql += ` LIMIT ? OFFSET ?`;
      params.push(parseInt(limit), offset);

      const rows = await query(sql, params);
      const formatted = rows.map(p => ({
        ...p,
        images: safeJsonParse(p.images, [p.primary_image]),
        highlights: safeJsonParse(p.highlights, []),
        specifications: safeJsonParse(p.specifications, {})
      }));

      // Count total
      const countRes = await query('SELECT COUNT(*) as total FROM products');
      const total = countRes && countRes[0] ? countRes[0].total : formatted.length;

      return res.json({
        success: true,
        count: formatted.length,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        products: formatted
      });
    } else {
      // Memory store fallback
      let filtered = [...memoryStore.products];

      if (category && category !== 'all') {
        filtered = filtered.filter(p => 
          (p.category_name && p.category_name.toLowerCase() === category.toLowerCase()) ||
          (p.category_slug && p.category_slug.toLowerCase() === category.toLowerCase())
        );
      }

      if (brand) {
        const brandList = brand.toLowerCase().split(',');
        filtered = filtered.filter(p => p.brand_name && brandList.includes(p.brand_name.toLowerCase()));
      }

      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(p => 
          (p.title && p.title.toLowerCase().includes(s)) ||
          (p.description && p.description.toLowerCase().includes(s))
        );
      }

      if (minPrice) filtered = filtered.filter(p => p.selling_price >= parseFloat(minPrice));
      if (maxPrice) filtered = filtered.filter(p => p.selling_price <= parseFloat(maxPrice));
      if (rating) filtered = filtered.filter(p => p.rating >= parseFloat(rating));
      if (assured === '1' || assured === 'true') filtered = filtered.filter(p => p.is_assured);
      if (deal_of_day === '1' || deal_of_day === 'true') filtered = filtered.filter(p => p.is_deal_of_day);
      if (featured === '1' || featured === 'true') filtered = filtered.filter(p => p.is_featured);

      if (sort === 'price_asc') filtered.sort((a, b) => a.selling_price - b.selling_price);
      else if (sort === 'price_desc') filtered.sort((a, b) => b.selling_price - a.selling_price);
      else if (sort === 'rating_desc') filtered.sort((a, b) => b.rating - a.rating);
      else if (sort === 'newest') filtered.sort((a, b) => b.id - a.id);
      else filtered.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));

      const total = filtered.length;
      const offset = (parseInt(page) - 1) * parseInt(limit);
      const paginated = filtered.slice(offset, offset + parseInt(limit));

      return res.json({
        success: true,
        count: paginated.length,
        total,
        page: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        products: paginated
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Get single product details
exports.getProduct = async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    if (getIsConnected()) {
      const isNum = !isNaN(idOrSlug);
      const sql = `
        SELECT p.*, c.name as category_name, b.name as brand_name 
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        WHERE ${isNum ? 'p.id = ?' : 'p.slug = ?'}
      `;
      const rows = await query(sql, [idOrSlug]);

      if (!rows || rows.length === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const p = rows[0];
      const product = {
        ...p,
        images: safeJsonParse(p.images, [p.primary_image]),
        highlights: safeJsonParse(p.highlights, []),
        specifications: safeJsonParse(p.specifications, {})
      };

      // Also fetch reviews for this product
      const reviews = await query('SELECT * FROM reviews WHERE product_id = ? ORDER BY id DESC', [p.id]);

      return res.json({
        success: true,
        product,
        reviews: reviews || []
      });
    } else {
      const isNum = !isNaN(idOrSlug);
      const p = memoryStore.products.find(item => isNum ? item.id === parseInt(idOrSlug) : item.slug === idOrSlug);
      if (!p) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      return res.json({
        success: true,
        product: p,
        reviews: [
          { id: 1, user_name: 'Vikram Mehta', rating: 5, title: 'Superb Quality & Value!', comment: 'Received within 2 days. Packaging was top-notch and product is genuine!', verified_purchase: 1, created_at: new Date() }
        ]
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Create product (Admin)
exports.createProduct = async (req, res) => {
  try {
    const {
      title,
      description,
      category_id,
      subcategory_id,
      brand_id,
      original_price,
      selling_price,
      stock = 50,
      is_assured = 1,
      is_featured = 0,
      is_deal_of_day = 0,
      primary_image,
      images = [],
      highlights = [],
      specifications = {}
    } = req.body;

    if (!title || !original_price || !selling_price || !primary_image) {
      return res.status(400).json({ success: false, message: 'Title, original price, selling price, and primary image are required' });
    }

    const discount_percent = Math.max(0, Math.round(((original_price - selling_price) / original_price) * 100));
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

    if (getIsConnected()) {
      const sql = `
        INSERT INTO products 
        (title, slug, description, category_id, subcategory_id, brand_id, original_price, selling_price, discount_percent, stock, is_assured, is_featured, is_deal_of_day, primary_image, images, highlights, specifications)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const result = await query(sql, [
        title,
        slug,
        description || '',
        category_id || null,
        subcategory_id || null,
        brand_id || null,
        original_price,
        selling_price,
        discount_percent,
        stock,
        is_assured ? 1 : 0,
        is_featured ? 1 : 0,
        is_deal_of_day ? 1 : 0,
        primary_image,
        JSON.stringify(images.length > 0 ? images : [primary_image]),
        JSON.stringify(highlights),
        JSON.stringify(specifications)
      ]);

      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        productId: result.insertId
      });
    } else {
      const newProduct = {
        id: memoryStore.products.length + 1,
        title,
        slug,
        description,
        original_price: parseFloat(original_price),
        selling_price: parseFloat(selling_price),
        discount_percent,
        stock: parseInt(stock),
        rating: 4.5,
        rating_count: 1,
        review_count: 0,
        is_assured: !!is_assured,
        is_featured: !!is_featured,
        is_deal_of_day: !!is_deal_of_day,
        primary_image,
        images: images.length > 0 ? images : [primary_image],
        highlights: Array.isArray(highlights) ? highlights : [],
        specifications: specifications || {},
        created_at: new Date()
      };
      memoryStore.products.unshift(newProduct);
      return res.status(201).json({
        success: true,
        message: 'Product created successfully',
        product: newProduct
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Update product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (getIsConnected()) {
      const fields = [];
      const values = [];

      const allowedFields = [
        'title', 'description', 'category_id', 'subcategory_id', 'brand_id',
        'original_price', 'selling_price', 'stock', 'is_assured', 'is_featured', 'is_deal_of_day',
        'primary_image'
      ];

      for (const key of allowedFields) {
        if (body[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(body[key]);
        }
      }

      if (body.images) {
        fields.push(`images = ?`);
        values.push(JSON.stringify(body.images));
      }
      if (body.highlights) {
        fields.push(`highlights = ?`);
        values.push(JSON.stringify(body.highlights));
      }
      if (body.specifications) {
        fields.push(`specifications = ?`);
        values.push(JSON.stringify(body.specifications));
      }

      if (body.original_price && body.selling_price) {
        const discount_percent = Math.max(0, Math.round(((body.original_price - body.selling_price) / body.original_price) * 100));
        fields.push(`discount_percent = ?`);
        values.push(discount_percent);
      }

      if (fields.length === 0) {
        return res.status(400).json({ success: false, message: 'No fields provided to update' });
      }

      values.push(id);
      await query(`UPDATE products SET ${fields.join(', ')} WHERE id = ?`, values);

      return res.json({ success: true, message: 'Product updated successfully' });
    } else {
      const p = memoryStore.products.find(item => item.id === parseInt(id));
      if (!p) return res.status(404).json({ success: false, message: 'Product not found' });
      Object.assign(p, body);
      return res.json({ success: true, message: 'Product updated successfully', product: p });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// Delete product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (getIsConnected()) {
      await query('DELETE FROM products WHERE id = ?', [id]);
      return res.json({ success: true, message: 'Product deleted successfully' });
    } else {
      const idx = memoryStore.products.findIndex(p => p.id === parseInt(id));
      if (idx !== -1) memoryStore.products.splice(idx, 1);
      return res.json({ success: true, message: 'Product deleted successfully' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
