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
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
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