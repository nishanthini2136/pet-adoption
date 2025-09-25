const mongoose = require('mongoose');
const Pet = require('./models/Pet');
const User = require('./models/User');
require('dotenv').config();

async function verifyPetsDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check pets collection
    const pets = await Pet.find({}).populate('owner', 'username email role');
    console.log('\n=== PETS IN DATABASE ===');
    console.log(`Total pets found: ${pets.length}`);
    
    if (pets.length > 0) {
      pets.forEach((pet, index) => {
        console.log(`\n--- Pet ${index + 1} ---`);
        console.log(`ID: ${pet._id}`);
        console.log(`Name: ${pet.name}`);
        console.log(`Species: ${pet.species}`);
        console.log(`Breed: ${pet.breed}`);
        console.log(`Age: ${pet.age}`);
        console.log(`Gender: ${pet.gender}`);
        console.log(`Size: ${pet.size}`);
        console.log(`Description: ${pet.description.substring(0, 50)}...`);
        console.log(`Location: ${pet.location}`);
        console.log(`Status: ${pet.status}`);
        console.log(`Owner: ${pet.owner ? pet.owner.username : 'No owner'} (${pet.owner ? pet.owner.email : 'N/A'})`);
        console.log(`Created: ${pet.createdAt}`);
        console.log(`Image URL: ${pet.imageUrl}`);
      });
    } else {
      console.log('No pets found in database');
    }
    
    // Check users with petowner role
    const petOwners = await User.find({ role: 'petowner' });
    console.log(`\n=== PET OWNERS ===`);
    console.log(`Total pet owners: ${petOwners.length}`);
    
    petOwners.forEach((owner, index) => {
      console.log(`${index + 1}. ${owner.username} (${owner.email}) - ID: ${owner._id}`);
    });
    
    // Check database collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\n=== DATABASE COLLECTIONS ===');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check pets collection stats
    const petsCollection = mongoose.connection.db.collection('pets');
    const petStats = await petsCollection.stats();
    console.log('\n=== PETS COLLECTION STATS ===');
    console.log(`Documents: ${petStats.count}`);
    console.log(`Size: ${petStats.size} bytes`);
    console.log(`Storage Size: ${petStats.storageSize} bytes`);
    
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

verifyPetsDatabase();
