const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query, getIsConnected, memoryStore } = require('../config/db');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'flipkart_super_secret_jwt_key_2025';

// OTP simulator store
const otpCache = new Map();

exports.sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ success: false, message: 'Please provide Email or Phone Number' });
    }

    // Generate 6-digit OTP (Default 789123 or random for convenience)
    const otp = '789123'; // Fixed default easy OTP for fast developer testing, also valid for real test
    otpCache.set(contact, { otp, expiresAt: Date.now() + 5 * 60 * 1000 });

    return res.json({
      success: true,
      message: `OTP sent successfully to ${contact}. Use OTP: 789123 to verify.`,
      demoOtp: '789123'
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { contact, otp, name } = req.body;
    if (!contact || !otp) {
      return res.status(400).json({ success: false, message: 'Contact and OTP are required' });
    }

    const cached = otpCache.get(contact);
    if (!cached || (cached.otp !== otp && otp !== '789123')) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    otpCache.delete(contact);

    let user = null;
    const isEmail = contact.includes('@');

    if (getIsConnected()) {
      const q = isEmail ? 'SELECT * FROM users WHERE email = ?' : 'SELECT * FROM users WHERE phone = ?';
      const rows = await query(q, [contact]);

      if (rows && rows.length > 0) {
        user = rows[0];
      } else {
        // Auto register on OTP login
        const defaultName = name || (isEmail ? contact.split('@')[0] : `Customer_${contact.slice(-4)}`);
        const hashedPwd = await bcrypt.hash('flipkart@123', 10);
        const insertQ = isEmail 
          ? 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
          : 'INSERT INTO users (name, phone, password, role) VALUES (?, ?, ?, ?)';
        
        const result = await query(insertQ, [defaultName, contact, hashedPwd, 'customer']);
        const newRows = await query('SELECT * FROM users WHERE id = ?', [result.insertId]);
        user = newRows[0];
      }
    } else {
      // Memory fallback
      user = memoryStore.users.find(u => isEmail ? u.email === contact : u.phone === contact);
      if (!user) {
        user = {
          id: memoryStore.users.length + 1,
          name: name || (isEmail ? contact.split('@')[0] : `Customer_${contact.slice(-4)}`),
          email: isEmail ? contact : `${contact}@flipkart-user.com`,
          phone: isEmail ? '9876543210' : contact,
          role: 'customer',
          created_at: new Date()
        };
        memoryStore.users.push(user);
      }
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful via OTP',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ success: false, message: 'Please provide name, password, and email or phone' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (getIsConnected()) {
      const existing = await query('SELECT id FROM users WHERE email = ? OR (phone = ? AND phone IS NOT NULL)', [email || '', phone || '']);
      if (existing && existing.length > 0) {
        return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
      }

      const result = await query(
        'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
        [name, email || null, phone || null, hashedPassword, 'customer']
      );

      const token = jwt.sign({ id: result.insertId, email, name, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: { id: result.insertId, name, email, phone, role: 'customer' }
      });
    } else {
      const newUser = {
        id: memoryStore.users.length + 1,
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'customer',
        created_at: new Date()
      };
      memoryStore.users.push(newUser);
      const token = jwt.sign({ id: newUser.id, email, name, role: 'customer' }, JWT_SECRET, { expiresIn: '7d' });
      return res.status(201).json({
        success: true,
        message: 'Account registered successfully',
        token,
        user: { id: newUser.id, name, email, phone, role: 'customer' }
      });
    }
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { emailOrPhone, password } = req.body;
    if (!emailOrPhone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide credentials' });
    }

    let user = null;
    if (getIsConnected()) {
      const rows = await query('SELECT * FROM users WHERE email = ? OR phone = ?', [emailOrPhone, emailOrPhone]);
      if (rows && rows.length > 0) {
        user = rows[0];
      }
    } else {
      user = memoryStore.users.find(u => u.email === emailOrPhone || u.phone === emailOrPhone);
      // Fallback pre-seeded test accounts
      if (!user && (emailOrPhone === 'admin@flipkart.com' || emailOrPhone === '9999999999')) {
        user = { id: 1, name: 'Flipkart Administrator', email: 'admin@flipkart.com', phone: '9999999999', role: 'admin' };
      } else if (!user && (emailOrPhone === 'customer@flipkart.com' || emailOrPhone === '9888888888')) {
        user = { id: 2, name: 'Aarav Kumar', email: 'customer@flipkart.com', phone: '9888888888', role: 'customer' };
      }
    }

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // In demo/test fallback if password is admin123 or password123 or bcrypt matches
    let isValid = true;
    if (user.password) {
      isValid = await bcrypt.compare(password, user.password).catch(() => false);
    }
    if (!isValid && (password === 'admin123' || password === 'password123' || password === 'flipkart@123')) {
      isValid = true;
    }

    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Admin email and password required' });
    }

    // Default admin check
    if (email === 'admin@flipkart.com' && (password === 'admin123' || password === 'admin@2025')) {
      const token = jwt.sign(
        { id: 1, email: 'admin@flipkart.com', name: 'Flipkart Admin Portal', role: 'admin' },
        JWT_SECRET,
        { expiresIn: '7d' }
      );
      return res.json({
        success: true,
        message: 'Admin authorization successful',
        token,
        user: { id: 1, name: 'Flipkart Admin Portal', email: 'admin@flipkart.com', role: 'admin' }
      });
    }

    // Check DB
    if (getIsConnected()) {
      const rows = await query('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
      if (rows && rows.length > 0) {
        const adminUser = rows[0];
        const match = await bcrypt.compare(password, adminUser.password);
        if (match) {
          const token = jwt.sign(
            { id: adminUser.id, email: adminUser.email, name: adminUser.name, role: 'admin' },
            JWT_SECRET,
            { expiresIn: '7d' }
          );
          return res.json({
            success: true,
            message: 'Admin authorization successful',
            token,
            user: { id: adminUser.id, name: adminUser.name, email: adminUser.email, role: 'admin' }
          });
        }
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    if (getIsConnected()) {
      const rows = await query('SELECT id, name, email, phone, role, avatar, created_at FROM users WHERE id = ?', [userId]);
      if (rows && rows.length > 0) {
        return res.json({ success: true, user: rows[0] });
      }
    }
    return res.json({
      success: true,
      user: {
        id: userId,
        name: req.user.name || 'Flipkart User',
        email: req.user.email || 'user@flipkart.com',
        role: req.user.role || 'customer'
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
