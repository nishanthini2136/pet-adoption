const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

dotenv.config();

// Test authentication functionality
async function testAuthentication() {
  try {
    console.log('🔐 Testing Authentication System...\n');
    
    // Test 1: Check environment variables
    console.log('📋 Environment Variables Check:');
    console.log('   JWT_SECRET exists:', !!process.env.JWT_SECRET);
    console.log('   JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
    console.log('   MONGODB_URI exists:', !!process.env.MONGODB_URI);
    console.log('   MONGODB_URI (masked):', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, '//***:***@') : 'NOT SET');
    
    // Test 2: Connect to MongoDB
    console.log('\n📡 Testing MongoDB Connection...');
    try {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
        retryWrites: true,
        w: 'majority'
      });
      console.log('✅ MongoDB connected successfully');
      console.log('   Database name:', mongoose.connection.name);
      console.log('   Connection state:', mongoose.connection.readyState);
    } catch (error) {
      console.log('❌ MongoDB connection failed:', error.message);
      return;
    }
    
    // Test 3: Test password hashing
    console.log('\n🔒 Testing Password Hashing...');
    const testPassword = 'testpassword123';
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(testPassword, salt);
    const isMatch = await bcrypt.compare(testPassword, hashedPassword);
    console.log('   Password hashing works:', isMatch);
    
    // Test 4: Test JWT token generation
    console.log('\n🎫 Testing JWT Token Generation...');
    const testPayload = { id: 'test123' };
    const token = jwt.sign(testPayload, process.env.JWT_SECRET, { expiresIn: '30d' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('   JWT generation works:', decoded.id === testPayload.id);
    
    // Test 5: Create a test user
    console.log('\n👤 Testing User Creation...');
    
    // Clean up any existing test user
    await User.deleteOne({ email: 'test@example.com' });
    
    const testUser = await User.create({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'customer'
    });
    
    console.log('✅ Test user created:', testUser.username);
    console.log('   User ID:', testUser._id);
    console.log('   Email:', testUser.email);
    console.log('   Role:', testUser.role);
    console.log('   Password hashed:', testUser.password !== 'password123');
    
    // Test 6: Test password comparison
    console.log('\n🔍 Testing Password Comparison...');
    const passwordMatch = await testUser.comparePassword('password123');
    const passwordNoMatch = await testUser.comparePassword('wrongpassword');
    console.log('   Correct password:', passwordMatch);
    console.log('   Wrong password:', passwordNoMatch);
    
    // Test 7: Test login simulation
    console.log('\n🚪 Testing Login Simulation...');
    const loginUser = await User.findOne({ email: 'test@example.com' });
    if (loginUser) {
      const isValidPassword = await loginUser.comparePassword('password123');
      if (isValidPassword) {
        const loginToken = jwt.sign(
          { id: loginUser._id },
          process.env.JWT_SECRET,
          { expiresIn: '30d' }
        );
        console.log('✅ Login simulation successful');
        console.log('   Token generated:', !!loginToken);
        console.log('   Token length:', loginToken.length);
      } else {
        console.log('❌ Password validation failed');
      }
    } else {
      console.log('❌ User not found');
    }
    
    // Test 8: Check database statistics
    console.log('\n📊 Database Statistics:');
    const userCount = await User.countDocuments();
    const customerCount = await User.countDocuments({ role: 'customer' });
    const petownerCount = await User.countDocuments({ role: 'petowner' });
    const adminCount = await User.countDocuments({ role: 'admin' });
    
    console.log('   Total users:', userCount);
    console.log('   Customers:', customerCount);
    console.log('   Pet owners:', petownerCount);
    console.log('   Admins:', adminCount);
    
    // Clean up test user
    await User.deleteOne({ email: 'test@example.com' });
    console.log('\n🧹 Test user cleaned up');
    
    console.log('\n🎉 Authentication system test completed successfully!');
    
  } catch (error) {
    console.error('❌ Authentication test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('\n📡 Database connection closed.');
    }
  }
}

// Run the test
testAuthentication();
