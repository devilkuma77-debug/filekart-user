const bcrypt = require('bcryptjs');
const { getPool, getIsConnected, memoryStore } = require('../config/db');
const seedData = require('../database/seedData');

exports.seedDatabase = async (req, res) => {
  try {
    const isConnected = getIsConnected();
    const pool = getPool();

    // 1. Always refresh in-memory store
    memoryStore.categories = JSON.parse(JSON.stringify(seedData.categories));
    memoryStore.brands = JSON.parse(JSON.stringify(seedData.brands));
    memoryStore.products = seedData.products.map((p, idx) => ({ id: p.id || (idx + 1), ...p, created_at: new Date() }));
    memoryStore.orders = JSON.parse(JSON.stringify(seedData.orders || []));
    memoryStore.coupons = JSON.parse(JSON.stringify(seedData.coupons));
    memoryStore.banners = JSON.parse(JSON.stringify(seedData.banners));

    if (!isConnected || !pool) {
      return res.json({
        success: true,
        mode: 'In-Memory Store Refreshed',
        message: 'Successfully seeded dummy catalog into memory store!',
        categoriesCount: memoryStore.categories.length,
        productsCount: memoryStore.products.length,
        ordersCount: memoryStore.orders.length
      });
    }

    // 2. MySQL Seeding
    console.log('🌱 Force-seeding dummy catalog into MySQL...');

    // Seed Categories
    for (const cat of seedData.categories) {
      await pool.query(
        'INSERT IGNORE INTO categories (name, slug, image, description) VALUES (?, ?, ?, ?)',
        [cat.name, cat.slug, cat.image, cat.description]
      );
    }

    // Seed Brands
    for (const b of seedData.brands) {
      await pool.query('INSERT IGNORE INTO brands (name, logo) VALUES (?, ?)', [b.name, b.logo]);
    }

    // Seed Banners
    for (const bn of seedData.banners) {
      await pool.query(
        'INSERT IGNORE INTO banners (title, image, link, section, position) VALUES (?, ?, ?, ?, ?)',
        [bn.title, bn.image, bn.link, bn.section, bn.position]
      );
    }

    // Seed Coupons
    for (const c of seedData.coupons) {
      await pool.query(
        'INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [c.code, c.description, c.discount_type, c.discount_value, c.min_order_value, c.max_discount, c.valid_until]
      );
    }

    // Category & Brand map
    const [allCats] = await pool.query('SELECT id, name FROM categories');
    const [allBrands] = await pool.query('SELECT id, name FROM brands');
    const catMap = Object.fromEntries(allCats.map(c => [c.name, c.id]));
    const brandMap = Object.fromEntries(allBrands.map(b => [b.name, b.id]));

    // Seed Products
    let insertedCount = 0;
    for (const p of seedData.products) {
      const catId = catMap[p.category_name] || null;
      const brandId = brandMap[p.brand_name] || null;

      const [existing] = await pool.query('SELECT id FROM products WHERE slug = ?', [p.slug]);
      if (existing.length === 0) {
        await pool.query(
          `INSERT INTO products 
          (title, slug, description, category_id, brand_id, original_price, selling_price, discount_percent, stock, rating, rating_count, review_count, is_assured, is_featured, is_deal_of_day, primary_image, images, highlights, specifications) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.title,
            p.slug,
            p.description,
            catId,
            brandId,
            p.original_price,
            p.selling_price,
            p.discount_percent,
            p.stock,
            p.rating,
            p.rating_count,
            p.review_count,
            p.is_assured,
            p.is_featured,
            p.is_deal_of_day,
            p.primary_image,
            JSON.stringify(p.images || [p.primary_image]),
            JSON.stringify(p.highlights || []),
            JSON.stringify(p.specifications || {})
          ]
        );
        insertedCount++;
      }
    }

    // Seed Orders
    if (seedData.orders && seedData.orders.length > 0) {
      for (const ord of seedData.orders) {
        const [existing] = await pool.query('SELECT id FROM orders WHERE order_number = ?', [ord.order_number]);
        if (existing.length === 0) {
          await pool.query(
            `INSERT INTO orders 
            (order_number, user_id, items, total_amount, discount_amount, delivery_charge, payment_method, payment_status, order_status, shipping_address, tracking_history)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              ord.order_number,
              ord.user_id,
              JSON.stringify(ord.items),
              ord.total_amount,
              ord.discount_amount,
              ord.delivery_charge,
              ord.payment_method,
              ord.payment_status,
              ord.order_status,
              JSON.stringify(ord.shipping_address),
              JSON.stringify(ord.tracking_history)
            ]
          );
        }
      }
    }

    return res.json({
      success: true,
      message: 'Dummy catalog successfully seeded into MySQL!',
      newProductsInserted: insertedCount,
      totalCatalogProducts: seedData.products.length,
      categoriesCount: seedData.categories.length
    });
  } catch (err) {
    console.error('Seed API error:', err);
    return res.status(500).json({ success: false, message: err.message });
  }
};
