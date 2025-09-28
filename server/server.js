const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const adoptionRoutes = require('./routes/adoption');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  if (req.headers.authorization) {
    console.log('Authorization header present:', req.headers.authorization.substring(0, 20) + '...');
  }
  next();
});

// Connect to MongoDB with improved options
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB Atlas...');
    console.log('Connection URI (masked):', process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000, // Increase timeout to 30s
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState}`);
    
    // Test the connection by counting documents
    const Pet = require('./models/Pet');
    const petCount = await Pet.countDocuments();
    console.log(`   Total pets in database: ${petCount}`);
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Provide helpful troubleshooting information
    if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('💡 Network issue: Check your internet connection and MongoDB Atlas network access settings');
    } else if (error.message.includes('authentication failed')) {
      console.error('💡 Authentication issue: Check your MongoDB Atlas username and password');
    } else if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('💡 SSL/TLS issue: This might be a network firewall or certificate issue');
    }
    
    console.log('🔄 Retrying connection in 10 seconds...');
    setTimeout(connectDB, 10000);
  }
};

// Initialize database connection
connectDB();
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected. Reconnecting...');
  connectDB();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/adoptions', adoptionRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error details:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body
  });

  // Handle mongoose validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: Object.values(err.errors).map(error => error.message).join(', ')
    });
  }

  // Handle mongoose duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      message: `${field} already exists`
    });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Something went wrong!'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});