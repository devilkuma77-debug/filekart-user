const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const seedData = require('../database/seedData');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let pool = null;
let isConnected = false;

// In-memory fallback in case MySQL is temporarily stopped
const memoryStore = {
  users: [
    { id: 1, name: 'Aarav Kumar', email: 'customer@flipkart.com', phone: '9888888888', role: 'customer' },
    { id: 2, name: 'Flipkart Admin', email: 'admin@flipkart.com', phone: '9999999999', role: 'admin' }
  ],
  categories: JSON.parse(JSON.stringify(seedData.categories)),
  brands: JSON.parse(JSON.stringify(seedData.brands)),
  products: JSON.parse(JSON.stringify(seedData.products)),
  orders: JSON.parse(JSON.stringify(seedData.orders || [])),
  coupons: JSON.parse(JSON.stringify(seedData.coupons)),
  banners: JSON.parse(JSON.stringify(seedData.banners)),
  sellers: [
    { id: 1, name: 'RetailNet Tech', email: 'seller@retailnet.com', phone: '9876543210', business_name: 'RetailNet Pvt Ltd', gstin: '29AAAAA0000A1Z5', status: 'Approved', commission_rate: 8.5, rating: 4.8 }
  ],
  support_tickets: [
    { id: 1, ticket_number: 'TIC-1001', user_name: 'Rahul Sharma', subject: 'Refund delay', message: 'I requested refund for order #OD1002 3 days ago.', status: 'Open', priority: 'High', created_at: new Date() }
  ],
  settings: {
    site_name: 'Flipkart',
    currency: '₹',
    support_email: 'support@flipkart.com',
    support_phone: '1800 202 9898',
    free_delivery_above: 500,
    cod_charge: 40,
    tax_rate: 18
  }
};

// Seed in-memory products with IDs
memoryStore.products = memoryStore.products.map((p, idx) => ({
  id: p.id || (idx + 1),
  ...p,
  created_at: new Date()
}));

async function initDB() {
  try {
    // 1. Connect without DB first to ensure `flipkart` DB exists
    const initialConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      port: dbConfig.port
    });

    await initialConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'flipkart'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await initialConn.end();

    // 2. Create pool connected to `flipkart`
    pool = mysql.createPool({
      ...dbConfig,
      database: process.env.DB_NAME || 'flipkart'
    });

    // Test connection
    const testConn = await pool.getConnection();
    console.log('✅ Connected successfully to MySQL database: ' + (process.env.DB_NAME || 'flipkart'));
    testConn.release();
    isConnected = true;

    // 3. Create tables if not exist
    await createTables();
    // 4. Seed initial data
    await seedInitialData();

  } catch (err) {
    console.warn('⚠️ MySQL connection warning:', err.message);
    console.warn('ℹ️ Running in resilient fallback mode. Start your MySQL / XAMPP service for full MySQL synchronization.');
    isConnected = false;
  }
}

async function createTables() {
  if (!pool) return;
  const queries = [
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE,
      phone VARCHAR(20) UNIQUE,
      password VARCHAR(255) NOT NULL,
      role ENUM('customer', 'admin', 'seller') DEFAULT 'customer',
      avatar VARCHAR(255) DEFAULT '',
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      locality VARCHAR(150) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      landmark VARCHAR(150) DEFAULT '',
      alternate_phone VARCHAR(20) DEFAULT '',
      address_type ENUM('HOME', 'WORK') DEFAULT 'HOME',
      is_default TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      slug VARCHAR(120) NOT NULL UNIQUE,
      image VARCHAR(255) DEFAULT '',
      description TEXT,
      is_active TINYINT(1) DEFAULT 1,
      display_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS subcategories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      slug VARCHAR(120) NOT NULL,
      is_active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS brands (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL UNIQUE,
      logo VARCHAR(255) DEFAULT '',
      is_active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(280) NOT NULL UNIQUE,
      description TEXT,
      category_id INT,
      subcategory_id INT,
      brand_id INT,
      original_price DECIMAL(10, 2) NOT NULL,
      selling_price DECIMAL(10, 2) NOT NULL,
      discount_percent INT DEFAULT 0,
      stock INT DEFAULT 50,
      rating DECIMAL(3, 2) DEFAULT 4.2,
      rating_count INT DEFAULT 120,
      review_count INT DEFAULT 45,
      is_assured TINYINT(1) DEFAULT 1,
      is_featured TINYINT(1) DEFAULT 0,
      is_deal_of_day TINYINT(1) DEFAULT 0,
      primary_image TEXT NOT NULL,
      images JSON,
      highlights JSON,
      specifications JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_number VARCHAR(50) NOT NULL UNIQUE,
      user_id INT NOT NULL,
      items JSON NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      discount_amount DECIMAL(10, 2) DEFAULT 0.00,
      delivery_charge DECIMAL(10, 2) DEFAULT 0.00,
      payment_method VARCHAR(50) DEFAULT 'Cash On Delivery',
      payment_status ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
      order_status ENUM('Ordered', 'Confirmed', 'Processing', 'Packed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned') DEFAULT 'Ordered',
      shipping_address JSON NOT NULL,
      tracking_history JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS coupons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      code VARCHAR(50) NOT NULL UNIQUE,
      description VARCHAR(255) NOT NULL,
      discount_type ENUM('PERCENTAGE', 'FLAT') DEFAULT 'PERCENTAGE',
      discount_value DECIMAL(10, 2) NOT NULL,
      min_order_value DECIMAL(10, 2) DEFAULT 0,
      max_discount DECIMAL(10, 2) DEFAULT 1000,
      valid_until DATE,
      is_active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS banners (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(150) NOT NULL,
      image TEXT NOT NULL,
      link VARCHAR(255) DEFAULT '/products',
      section VARCHAR(50) DEFAULT 'home_hero',
      position INT DEFAULT 1,
      is_active TINYINT(1) DEFAULT 1
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS reviews (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      user_id INT,
      user_name VARCHAR(100) NOT NULL,
      rating INT NOT NULL,
      title VARCHAR(150),
      comment TEXT NOT NULL,
      verified_purchase TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS sellers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(120) NOT NULL UNIQUE,
      phone VARCHAR(20) NOT NULL,
      business_name VARCHAR(150) NOT NULL,
      gstin VARCHAR(30) NOT NULL,
      status ENUM('Approved', 'Pending', 'Suspended') DEFAULT 'Approved',
      commission_rate DECIMAL(5,2) DEFAULT 10.00,
      rating DECIMAL(3,2) DEFAULT 4.5,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS support_tickets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      ticket_number VARCHAR(30) UNIQUE,
      user_id INT,
      user_name VARCHAR(100) NOT NULL,
      subject VARCHAR(200) NOT NULL,
      message TEXT NOT NULL,
      status ENUM('Open', 'In Progress', 'Resolved', 'Closed') DEFAULT 'Open',
      priority ENUM('Low', 'Medium', 'High', 'Urgent') DEFAULT 'Medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    `CREATE TABLE IF NOT EXISTS settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value TEXT NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
  ];

  for (const q of queries) {
    await pool.query(q);
  }
}

async function seedInitialData() {
  if (!pool) return;
  try {
    // Check if categories table is empty
    const [cats] = await pool.query('SELECT COUNT(*) as count FROM categories');
    if (cats[0].count === 0) {
      console.log('🌱 Seeding initial Flipkart data into MySQL...');

      // Seed Admin & Test Customer
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const customerPassword = await bcrypt.hash('password123', 10);

      await pool.query(
        `INSERT IGNORE INTO users (name, email, phone, password, role) VALUES 
        (?, ?, ?, ?, ?),
        (?, ?, ?, ?, ?)`,
        [
          'Flipkart Administrator', 'admin@flipkart.com', '9999999999', hashedPassword, 'admin',
          'Aarav Kumar', 'customer@flipkart.com', '9888888888', customerPassword, 'customer'
        ]
      );

      // Seed Categories
      for (const cat of seedData.categories) {
        await pool.query(
          'INSERT IGNORE INTO categories (name, slug, image, description) VALUES (?, ?, ?, ?)',
          [cat.name, cat.slug, cat.image, cat.description]
        );
      }

      // Seed Brands
      for (const brand of seedData.brands) {
        await pool.query(
          'INSERT IGNORE INTO brands (name, logo) VALUES (?, ?)',
          [brand.name, brand.logo]
        );
      }

      // Seed Banners
      for (const banner of seedData.banners) {
        await pool.query(
          'INSERT IGNORE INTO banners (title, image, link, section, position) VALUES (?, ?, ?, ?, ?)',
          [banner.title, banner.image, banner.link, banner.section, banner.position]
        );
      }

      // Seed Coupons
      for (const coupon of seedData.coupons) {
        await pool.query(
          'INSERT IGNORE INTO coupons (code, description, discount_type, discount_value, min_order_value, max_discount, valid_until) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [coupon.code, coupon.description, coupon.discount_type, coupon.discount_value, coupon.min_order_value, coupon.max_discount, coupon.valid_until]
        );
      }

      // Fetch category & brand IDs
      const [allCats] = await pool.query('SELECT id, name FROM categories');
      const [allBrands] = await pool.query('SELECT id, name FROM brands');
      const catMap = Object.fromEntries(allCats.map(c => [c.name, c.id]));
      const brandMap = Object.fromEntries(allBrands.map(b => [b.name, b.id]));

      // Seed Products
      for (const p of seedData.products) {
        const catId = catMap[p.category_name] || null;
        const brandId = brandMap[p.brand_name] || null;

        await pool.query(
          `INSERT IGNORE INTO products 
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
            JSON.stringify(p.images),
            JSON.stringify(p.highlights),
            JSON.stringify(p.specifications)
          ]
        );
      }

      console.log('✅ Flipkart initial data seeded successfully!');
    }
  } catch (seedErr) {
    console.error('Seed error:', seedErr);
  }
}

// Resilient query executor
async function query(sql, params = []) {
  if (isConnected && pool) {
    try {
      const [results] = await pool.query(sql, params);
      return results;
    } catch (err) {
      console.error('MySQL Query Error:', err.message);
      throw err;
    }
  }
  return null;
}

module.exports = {
  initDB,
  query,
  getPool: () => pool,
  getIsConnected: () => isConnected,
  memoryStore
};
