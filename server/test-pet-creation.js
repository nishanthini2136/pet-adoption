const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Pet = require('./models/Pet');
const User = require('./models/User');

dotenv.config();

// Test pet creation functionality
async function testPetCreation() {
  try {
    console.log('🧪 Testing Pet Creation Functionality...\n');
    
    // Connect to MongoDB
    console.log('📡 Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      maxPoolSize: 10,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!\n');
    
    // Check if we have any pet owners in the database
    const petOwners = await User.find({ role: 'petowner' }).limit(5);
    console.log(`👥 Found ${petOwners.length} pet owners in database`);
    
    if (petOwners.length === 0) {
      console.log('⚠️  No pet owners found. Creating a test pet owner...');
      
      // Create a test pet owner
      const testOwner = await User.create({
        username: 'testowner',
        email: 'testowner@example.com',
        password: 'password123',
        role: 'petowner'
      });
      
      console.log('✅ Test pet owner created:', testOwner.username);
      petOwners.push(testOwner);
    }
    
    // Use the first pet owner for testing
    const testOwner = petOwners[0];
    console.log(`🧑‍💼 Using pet owner: ${testOwner.username} (${testOwner.email})\n`);
    
    // Create a test pet
    console.log('🐕 Creating test pet...');
    const testPetData = {
      name: 'Buddy Test',
      species: 'Dog',
      breed: 'Golden Retriever',
      age: '3 years',
      gender: 'Male',
      size: 'Large',
      description: 'A friendly and energetic dog looking for a loving home. Great with kids and other pets.',
      location: 'New York, NY',
      imageUrl: 'https://example.com/buddy.jpg',
      status: 'Available',
      owner: testOwner._id
    };
    
    const testPet = await Pet.create(testPetData);
    console.log('✅ Test pet created successfully!');
    console.log('   Pet ID:', testPet._id);
    console.log('   Pet Name:', testPet.name);
    console.log('   Owner:', testOwner.username);
    console.log('   Created At:', testPet.createdAt);
    
    // Verify the pet was saved by fetching it back
    const savedPet = await Pet.findById(testPet._id).populate('owner', 'username email');
    if (savedPet) {
      console.log('✅ Pet successfully retrieved from database');
      console.log('   Populated Owner:', savedPet.owner.username);
    } else {
      console.log('❌ Failed to retrieve pet from database');
    }
    
    // Get statistics
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'Available' });
    const ownerPets = await Pet.countDocuments({ owner: testOwner._id });
    
    console.log('\n📊 Database Statistics:');
    console.log(`   Total pets: ${totalPets}`);
    console.log(`   Available pets: ${availablePets}`);
    console.log(`   Pets owned by ${testOwner.username}: ${ownerPets}`);
    
    console.log('\n🎉 Pet creation test completed successfully!');
    console.log('✅ Your pet adoption platform is properly configured to store pets in MongoDB Atlas.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Full error:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\n📡 Database connection closed.');
  }
}

// Run the test
testPetCreation();
