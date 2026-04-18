const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const productRoutes = require('./routes/product');
const uploadRoutes = require('./routes/upload');
const healthRoutes = require('./routes/health');

const app = express();

// Security headers
app.use(helmet());

// Request logging (skip in test to keep output clean)
if (process.env.NODE_ENV !== 'test') {
    const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';
    app.use(morgan(format));
}

// CORS
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({
    origin: corsOrigin === '*' ? true : corsOrigin.split(','),
    credentials: true
}));

// Body parsing
app.use(bodyParser.json());

// Rate limiting on auth endpoints
const authLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later' }
});
app.use('/auth/login', authLimiter);

// Routes
app.use('/', healthRoutes);
app.use('/', authRoutes);
app.use('/', profileRoutes);
app.use('/', productRoutes);
app.use('/', uploadRoutes);

// Global error handler — catches errors thrown by async route handlers
// that aren't caught by their own try/catch blocks.
app.use((err, req, res, _next) => {
    console.error(err.stack || err.message || err);
    res.status(err.status || 500).json({ error: 'Internal server error' });
});

module.exports = app;
