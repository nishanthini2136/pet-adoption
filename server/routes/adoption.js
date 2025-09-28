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
    const pet = await Pet.findById(req.params.petId).populate('owner');
    
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

    // Extract application data from request body
    const {
      firstName, lastName, email, phone, address, city, state, zipCode,
      homeEnvironment, previousPets, reasonForAdoption, timeAtHome, 
      otherPets, children, landlordApproval, notes
    } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !address || !city || !state || !zipCode ||
        !homeEnvironment || !previousPets || !reasonForAdoption || !timeAtHome || 
        !otherPets || !children || !landlordApproval) {
      return res.status(400).json({ message: 'All application fields are required' });
    }

    // Create adoption request with detailed application data
    const adoption = await Adoption.create({
      pet: pet._id,
      user: req.user.id,
      petOwner: pet.owner._id,
      status: 'Pending',
      applicationData: {
        firstName, lastName, email, phone, address, city, state, zipCode,
        homeEnvironment, previousPets, reasonForAdoption, timeAtHome,
        otherPets, children, landlordApproval
      },
      notes: notes || `${reasonForAdoption} - ${homeEnvironment} home with ${timeAtHome} availability`
    });

    // Update pet status to Pending
    pet.status = 'Pending';
    await pet.save();

    // Populate the adoption data for response
    const populatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name breed species imageUrl')
      .populate('user', 'username email')
      .populate('petOwner', 'username email');

    res.status(201).json({ 
      success: true, 
      data: populatedAdoption,
      message: 'Adoption request submitted successfully! The pet owner will review your application.'
    });
  } catch (err) {
    console.error('Adoption request error:', err);
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You already have an adoption request for this pet' });
    }
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

// Get user's adoption requests (for customers)
router.get('/my-requests', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ user: req.user.id })
      .populate('pet', 'name breed species imageUrl location status')
      .populate('petOwner', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: adoptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's adopted pets (completed adoptions)
router.get('/my-adoptions', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ 
      user: req.user.id,
      status: { $in: ['Approved', 'Completed'] }
    })
    .populate({
      path: 'pet',
      populate: {
        path: 'owner',
        select: 'username email'
      }
    })
    .sort({ approvalDate: -1 });

    res.json({ success: true, data: adoptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get adoption requests for pet owner's pets
router.get('/owner-requests', async (req, res) => {
  try {
    const adoptions = await Adoption.find({ petOwner: req.user.id })
      .populate('pet', 'name breed species imageUrl location')
      .populate('user', 'username email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: adoptions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update adoption status (for pet owners/admins)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, ownerNotes } = req.body;
    
    if (!['Approved', 'Rejected', 'Pending', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const adoption = await Adoption.findById(req.params.id)
      .populate('pet')
      .populate('user', 'username email');

    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    const pet = await Pet.findById(adoption.pet._id);
    
    // Only the pet owner or admin can update the status
    if (pet.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this adoption request' });
    }

    // Update adoption status and owner notes
    adoption.status = status;
    if (ownerNotes) {
      adoption.ownerNotes = ownerNotes;
    }

    // Set appropriate dates based on status
    if (status === 'Approved' && adoption.status !== 'Approved') {
      adoption.approvalDate = new Date();
    } else if (status === 'Completed' && adoption.status !== 'Completed') {
      adoption.completionDate = new Date();
    }

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
    } else if (status === 'Rejected') {
      // If this was the only pending request, set pet back to Available
      const otherPendingRequests = await Adoption.countDocuments({
        pet: pet._id,
        _id: { $ne: adoption._id },
        status: 'Pending'
      });

      if (otherPendingRequests === 0) {
        pet.status = 'Available';
        pet.adoptedBy = undefined;
        await pet.save();
      }
    }

    // Populate the updated adoption for response
    const updatedAdoption = await Adoption.findById(adoption._id)
      .populate('pet', 'name breed species imageUrl')
      .populate('user', 'username email')
      .populate('petOwner', 'username email');

    res.json({ 
      success: true, 
      data: updatedAdoption,
      message: `Adoption request ${status.toLowerCase()} successfully`
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get detailed adoption request (for viewing application details)
router.get('/:id', async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('pet', 'name breed species imageUrl location')
      .populate('user', 'username email')
      .populate('petOwner', 'username email');

    if (!adoption) {
      return res.status(404).json({ message: 'Adoption request not found' });
    }

    // Only the user, pet owner, or admin can view the detailed adoption request
    if (adoption.user._id.toString() !== req.user.id && 
        adoption.petOwner._id.toString() !== req.user.id && 
        req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this adoption request' });
    }

    res.json({ success: true, data: adoption });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
