const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { fileURLToPath } = require('url');
const connectDB = require('./config/db.js');
const { constants } = require('buffer');


const asyncHandler = require('./middleware/asyncHandler.middelware.js');
const notFound = require('./middleware/notFound.middelware.js');
const errorHandler = require('./middleware/error.middleware.js');

// importing routes
const adminRoutes = require('./routes/admin.route.js');
const studentRoutes = require('./routes/student.route.js');
const companyRoutes = require('./routes/company.route.js');
const applicationRoutes = require('./routes/application.route.js');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());
// CORS configuration - allow multiple origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
  process.env.CLIENT_URL,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
  process.env.FRONTEND_URL,
  // Add your Vercel frontend URL here
  process.env.FRONTEND_VERCEL_URL,
].filter(Boolean); // Remove null/undefined values

// Log allowed origins for debugging
console.log('Allowed CORS origins:', allowedOrigins.length > 0 ? allowedOrigins : 'All origins');

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // In development, allow all origins
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, check against allowed list
    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS: Blocked request from origin: ${origin}`);
      // Still allow but log it for debugging
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Authorization'],
}));

// MongoDB connection
connectDB();

app.get('/', (req, res) =>{
    res.send('API is running...');
})

// API Routes
app.use('/api/admin', adminRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/applications', applicationRoutes);

// 404 handler and error handler should be registered after routes
app.use(notFound);
// Error handler must be last and have 4 parameters (err, req, res, next)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});