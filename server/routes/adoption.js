const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');

// Apply protect middleware to all routes
router.use(protect);

// Adopt a pet
router.post('/:petId', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    if (pet.status === 'Adopted') {
      return res.status(400).json({ message: 'This pet has already been adopted' });
    }

    // Check if user already has a pending or approved adoption request for this pet
    const existingAdoption = await Adoption.findOne({
      pet: pet._id,
      user: req.user.id,
      status: { $in: ['Pending', 'Approved'] }
    });

    if (existingAdoption) {
      return res.status(400).json({ 
        message: `You already have a ${existingAdoption.status.toLowerCase()} adoption request for this pet` 
      });
    }

    // Create adoption request
    const adoption = await Adoption.create({
      pet: pet._id,
      user: req.user.id,
      status: 'Pending'
    });

    // Update pet status to Pending
    pet.status = 'Pending';
    await pet.save();

    res.status(201).json({ 
      success: true, 
      data: adoption 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get adoption requests for a pet (for pet owners)
router.get('/pet/:petId', async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.petId);
    
    if (!pet) {
      return res.status(404).json({ message: 'Pet not found' });
    }

    // Only the pet owner can view adoption requests
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view these adoption requests' });
    }

    const adoptions = await Adoption.find({ pet: pet._id })
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: adoptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's adopted pets
router.get('/my-adoptions', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ 
      user: req.user.id,
      status: 'Approved'
    })
    .populate({
      path: 'pet',
      populate: {
        path: 'owner',
        select: 'username email'
      }
    })
    .sort({ adoptionDate: -1 });

    const adoptedPets = adoptions.map(adoption => ({
      ...adoption.pet.toObject(),
      adoptionDate: adoption.adoptionDate
    }));

    res.json({ success: true, data: adoptedPets });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update adoption status (for pet owners/admins)
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const adoption = await Adoption.findById(req.params.id)
      .populate('pet');

    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    const pet = await Pet.findById(adoption.pet._id);
    
    // Only the pet owner or admin can update the status
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this adoption request' });
    }

    // Update adoption status
    adoption.status = status;
    await adoption.save();

    // If approved, update pet status and adoptedBy
    if (status === 'Approved') {
      pet.status = 'Adopted';
      pet.adoptedBy = adoption.user;
      await pet.save();

      // Reject all other pending requests for this pet
      await Adoption.updateMany(
        { 
          pet: pet._id, 
          _id: { $ne: adoption._id },
          status: 'Pending' 
        },
        { $set: { status: 'Rejected' } }
      );
    }

    res.json({ success: true, data: adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
