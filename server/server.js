const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth');
const petsRoutes = require('./routes/pets');
const adoptionRoutes = require('./routes/adoption');
const adminRoutes = require('./routes/admin');

dotenv.config();

const app = express();

/* =======================
   ✅ CORS CONFIG (FIXED)
   ======================= */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "https://pet-adoption-warl.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

/* =======================
   ✅ ROOT TEST ROUTE
   ======================= */
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

/* =======================
   ✅ REQUEST LOGGER
   ======================= */
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

/* =======================
   ✅ MONGODB CONNECTION
   ======================= */
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (error) {
    console.error('❌ MongoDB Error:', error.message);
    setTimeout(connectDB, 10000);
  }
};

connectDB();

/* =======================
   ✅ API ROUTES
   ======================= */
app.use('/api/auth', authRoutes);
app.use('/api/pets', petsRoutes);
app.use('/api/adoptions', adoptionRoutes);
app.use('/api/admin', adminRoutes);

/* =======================
   ✅ ERROR HANDLER
   ======================= */
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Server Error' });
});

/* =======================
   ✅ SERVER START
   ======================= */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
