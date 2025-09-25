const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Pet = require('../models/Pet');

// Get all pets (for admin)
router.get('/admin', protect, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    const pets = await Pet.find().populate('owner', 'username email');
    res.json({ success: true, count: pets.length, data: pets });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all pets with optional filtering (for customers)
router.get('/', async (req, res) => {
  try {
    console.log('GET /pets - Query params:', req.query);
    
    const { species, gender, size, status, search } = req.query;

    // Build filter object
    const filter = {};
    
    // Always filter by status if not specified
    if (!status) {
      filter.status = 'Available';
      console.log('No status specified, defaulting to Available');
    } else {
      filter.status = status;
      console.log('Using status filter:', status);
    }

    // Add other filters if provided
    if (species) {
      filter.species = { $regex: new RegExp(species, 'i') };
      console.log('Adding species filter:', species);
    }
    if (gender) {
      filter.gender = gender;
      console.log('Adding gender filter:', gender);
    }
    if (size) {
      filter.size = size;
      console.log('Adding size filter:', size);
    }
    
    // Text search across name, breed, and description
    if (search) {
      filter.$or = [
        { name: { $regex: new RegExp(search, 'i') } },
        { breed: { $regex: new RegExp(search, 'i') } },
        { description: { $regex: new RegExp(search, 'i') } }
      ];
      console.log('Adding search filter for:', search);
    }

    console.log('Final filter object:', JSON.stringify(filter, null, 2));

    const pets = await Pet.find(filter)
      .populate({
        path: 'owner',
        select: 'username email role',  // Include role in the populated data
        options: { lean: true }
      })
      .select('-owner.password')
      .sort({ createdAt: -1 })
      .lean(); // Convert to plain JavaScript objects

    console.log(`Found ${pets.length} pets matching the criteria`);
    
    res.json({ 
      success: true, 
      count: pets.length, 
      data: pets 
    });
  } catch (err) {
    console.error('Error in GET /pets:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pets',
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});


// Get pets by owner with statistics - IMPORTANT: This route must be defined before the /:id route
router.get('/owner', protect, async (req, res) => {
  try {
    console.log('🔍 GET /pets/owner - User info:', {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    });
    
    // Check if user is pet owner
    if (req.user.role !== 'petowner') {
      console.log('❌ User is not a pet owner:', req.user.role);
      return res.status(403).json({ message: 'Not authorized to access this resource' });
    }

    console.log('🔍 Searching for pets with owner:', req.user._id);
    const pets = await Pet.find({ owner: req.user._id })
      .populate('owner', 'username email')
      .sort({ createdAt: -1 });
      
    console.log('📊 Found pets for owner:', pets.length);
    if (pets.length > 0) {
      pets.forEach((pet, index) => {
        console.log(`Pet ${index + 1}:`, {
          id: pet._id,
          name: pet.name,
          owner: pet.owner?._id,
          ownerUsername: pet.owner?.username
        });
      });
    }

    // Calculate statistics
    const totalPets = pets.length;
    const availablePets = pets.filter(pet => pet.status === 'Available').length;
    const adoptedPets = pets.filter(pet => pet.status === 'Adopted').length;
    const pendingPets = pets.filter(pet => pet.status === 'Pending').length;

    // Get adoption requests for owner's pets
    const Adoption = require('../models/Adoption');
    const petIds = pets.map(pet => pet._id);
    const pendingRequests = await Adoption.countDocuments({
      pet: { $in: petIds },
      status: 'Pending'
    });
      
    res.json({ 
      success: true, 
      count: pets.length, 
      data: pets,
      statistics: {
        totalPets,
        availablePets,
        adoptedPets,
        pendingPets,
        pendingRequests
      }
    });
  } catch (err) {
    console.error('Error fetching owner pets:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching pets',
      error: err.message 
    });
  }
});

// Get single pet (for public viewing)
router.get('/:id', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
      .populate('owner', 'username email');

    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new pet (for pet owners)
router.post('/', protect, async (req, res) => {
  try {
    console.log('=== New Pet Request ===');
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Authenticated User:', req.user);
    console.log('Request Body:', req.body);
    
    // Check if user is pet owner
    if (req.user.role !== 'petowner') {
      console.log('Unauthorized user attempted to add pet:', req.user);
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to add pets' 
      });
    }

    const { name, species, breed, age, description, imageUrl, gender, size, location } = req.body;
    
    // Validate required fields with detailed logging
    const requiredFields = { name, species, breed, age, description, imageUrl, gender, size, location };
    console.log('Validating required fields:', requiredFields);
    
    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => {
        const isEmpty = !value || (typeof value === 'string' && value.trim() === '');
        if (isEmpty) {
          console.log(`Field "${key}" is missing or empty:`, value);
        }
        return isEmpty;
      })
      .map(([key]) => key);
      
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        missingFields,
        receivedData: req.body
      });
    }
    
    console.log('✅ All required fields present');
    
    console.log('Creating pet with data:', {
      name, species, breed, age, gender, size, description, location, imageUrl,
      status: 'Available',
      owner: req.user._id
    });

    // Create the pet with all required fields
    const petData = {
      name: name.trim(),
      species: species.trim(),
      breed: breed.trim(),
      age: age.toString().trim(), // Keep as string as per model
      gender,
      size,
      description: description.trim(),
      location: location.trim(),
      imageUrl: imageUrl.trim(),
      status: 'Available',
      owner: req.user._id
    };

    console.log('Attempting to create pet with data:', JSON.stringify(petData, null, 2));
    
    // Create the pet in the database
    const pet = await Pet.create(petData);
    console.log('✅ Pet successfully saved to database with ID:', pet._id);
    console.log('Pet document:', JSON.stringify(pet, null, 2));
    
    // Verify the pet was actually saved by fetching it back
    const savedPet = await Pet.findById(pet._id);
    if (!savedPet) {
      throw new Error('Pet was not properly saved to database');
    }
    console.log('✅ Verified pet exists in database');
    
    // Populate the owner field for the response
    const populatedPet = await Pet.findById(pet._id).populate('owner', 'username email');
    console.log('✅ Pet populated with owner data:', populatedPet.owner);
    
    // Log database collection stats
    const petCount = await Pet.countDocuments({ owner: req.user.id });
    console.log(`✅ Total pets for owner ${req.user.username}: ${petCount}`);
    
    res.status(201).json({ 
      success: true, 
      message: `Pet "${pet.name}" has been successfully added to the database`,
      data: populatedPet 
    });
  } catch (err) {
    console.error('Error creating pet:', err);
    res.status(400).json({ 
      success: false,
      message: err.message 
    });
  }
});

// Update pet (for pet owners)
router.put('/:id', protect, async (req, res) => {
  try {
    // Check if user is pet owner
    if (req.user.role !== 'petowner') {
      return res.status(403).json({ message: 'Not authorized to update pets' });
    }

    let pet = await Pet.findById(req.params.id);

    // Check if pet exists
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this pet' });
    }

    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({ success: true, data: pet });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete pet (for pet owners)
router.delete('/:id', protect, async (req, res) => {
  try {
    console.log('Delete request received for pet ID:', req.params.id);
    console.log('User making request:', req.user);

    // Check if user is pet owner
    if (req.user.role !== 'petowner') {
      console.log('User is not a pet owner');
      return res.status(403).json({ success: false, message: 'Not authorized to delete pets' });
    }

    const pet = await Pet.findById(req.params.id);
    console.log('Found pet:', pet);

    // Check if pet exists
    if (!pet) {
      console.log('Pet not found');
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Check if user owns the pet
    if (pet.owner.toString() !== req.user.id) {
      console.log('User does not own this pet');
      return res.status(403).json({ success: false, message: 'Not authorized to delete this pet' });
    }

    console.log('Deleting pet...');
    const result = await Pet.findByIdAndDelete(req.params.id);
    console.log('Delete result:', result);

    if (!result) {
      console.log('Pet not found during deletion');
      return res.status(404).json({ success: false, message: 'Pet not found during deletion' });
    }

    console.log('Pet deleted successfully');
    res.status(200).json({
      success: true,
      data: {},
      message: 'Pet deleted successfully'
    });
  } catch (err) {
    console.error('Error deleting pet:', err);
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

// Database health check endpoint
router.get('/db-status', protect, async (req, res) => {
  try {
    // Check if user is admin or petowner
    if (req.user.role !== 'admin' && req.user.role !== 'petowner') {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to access database status' 
      });
    }

    // Get collection stats
    const totalPets = await Pet.countDocuments();
    const availablePets = await Pet.countDocuments({ status: 'Available' });
    const adoptedPets = await Pet.countDocuments({ status: 'Adopted' });
    const pendingPets = await Pet.countDocuments({ status: 'Pending' });
    
    // Get recent pets (last 5)
    const recentPets = await Pet.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('owner', 'username email')
      .select('name species breed status createdAt owner');

    // Get pets by owner if not admin
    let ownerPets = null;
    if (req.user.role === 'petowner') {
      ownerPets = await Pet.find({ owner: req.user.id })
        .sort({ createdAt: -1 })
        .select('name species breed status createdAt');
    }

    res.json({
      success: true,
      message: 'Database connection healthy',
      data: {
        totalPets,
        availablePets,
        adoptedPets,
        pendingPets,
        recentPets,
        ownerPets,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    console.error('Database status check error:', err);
    res.status(500).json({
      success: false,
      message: 'Database connection error',
      error: err.message
    });
  }
});

module.exports = router;
