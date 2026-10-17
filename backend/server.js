const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { initDB, getIsConnected } = require('./config/db');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    project: 'Flipkart Clone Dynamic Backend API',
    database: getIsConnected() ? 'MySQL Connected (flipkart)' : 'Active (Fallback Mode)',
    version: '1.0.0',
    endpoints: '/api'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    db_connected: getIsConnected(),
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

// Bootstrapping
async function startServer() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 Flipkart Backend Server running on port ${PORT}`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`📊 DB Name: ${process.env.DB_NAME || 'flipkart'}`);
    console.log(`===============================================`);
  });
}

startServer();
