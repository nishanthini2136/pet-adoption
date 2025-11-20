const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { adminAuth, adminOrOwnerAuth } = require('../middleware/adminAuth');
const User = require('../models/User');
const Pet = require('../models/Pet');
const Adoption = require('../models/Adoption');

// Apply protect middleware to all routes
router.use(protect);

// Test endpoint to verify admin routes are working
router.get('/test', adminAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Admin routes are working!',
      user: {
        id: req.user.id,
        role: req.user.role,
        username: req.user.username
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Admin test error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =============================================
// DYNAMIC ADMIN FUNCTIONS FOR USER MANAGEMENT
// =============================================

// Get all users with filtering and pagination
router.get('/users', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      role, 
      search, 
      sortBy = 'createdAt', 
      sortOrder = 'desc' 
    } = req.query;

    // Build dynamic query
    let query = {};
    if (role && ['customer', 'petowner', 'admin'].includes(role)) {
      query.role = role;
    }
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const users = await User.find(query)
      .select('-password -resetPasswordToken -resetPasswordExpire')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: users,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get user statistics
router.get('/users/stats', adminAuth, async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalUsers = await User.countDocuments();
    const recentUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        recentUsers,
        roleDistribution: stats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update user role or status
router.put('/users/:id', adminAuth, async (req, res) => {
  try {
    const { role, isEmailVerified } = req.body;
    const updateData = {};

    if (role && ['customer', 'petowner', 'admin'].includes(role)) {
      updateData.role = role;
    }
    if (typeof isEmailVerified === 'boolean') {
      updateData.isEmailVerified = isEmailVerified;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      data: user,
      message: 'User updated successfully'
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Check if user has active adoptions
    const activeAdoptions = await Adoption.countDocuments({
      $or: [
        { user: req.params.id, status: { $in: ['Pending', 'Approved'] } },
        { petOwner: req.params.id, status: { $in: ['Pending', 'Approved'] } }
      ]
    });

    if (activeAdoptions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete user with active adoptions'
      });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get detailed pet owner analytics
router.get('/petowners/detailed', adminAuth, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      sortBy = 'petCount', 
      sortOrder = 'desc',
      minPets = 0,
      maxPets = 1000
    } = req.query;

    const petOwnerDetails = await User.aggregate([
      { $match: { role: 'petowner' } },
      {
        $lookup: {
          from: 'pets',
          localField: '_id',
          foreignField: 'owner',
          as: 'pets'
        }
      },
      {
        $addFields: {
          petCount: { $size: '$pets' },
          activePets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { $in: ['$$this.status', ['Available', 'Pending']] }
              }
            }
          },
          adoptedPets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { $eq: ['$$this.status', 'Adopted'] }
              }
            }
          },
          recentPets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { 
                  $gte: ['$$this.createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)]
                }
              }
            }
          }
        }
      },
      {
        $match: {
          petCount: { $gte: parseInt(minPets), $lte: parseInt(maxPets) }
        }
      },
      {
        $lookup: {
          from: 'adoptions',
          localField: '_id',
          foreignField: 'petOwner',
          as: 'adoptionRequests'
        }
      },
      {
        $addFields: {
          totalAdoptionRequests: { $size: '$adoptionRequests' },
          successfulAdoptions: {
            $size: {
              $filter: {
                input: '$adoptionRequests',
                cond: { $in: ['$$this.status', ['Approved', 'Completed']] }
              }
            }
          },
          pendingRequests: {
            $size: {
              $filter: {
                input: '$adoptionRequests',
                cond: { $eq: ['$$this.status', 'Pending'] }
              }
            }
          }
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          createdAt: 1,
          petCount: 1,
          activePets: 1,
          adoptedPets: 1,
          recentPets: 1,
          totalAdoptionRequests: 1,
          successfulAdoptions: 1,
          pendingRequests: 1,
          successRate: {
            $cond: [
              { $gt: ['$totalAdoptionRequests', 0] },
              { $multiply: [{ $divide: ['$successfulAdoptions', '$totalAdoptionRequests'] }, 100] },
              0
            ]
          }
        }
      },
      { $sort: { [sortBy]: sortOrder === 'desc' ? -1 : 1 } },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) }
    ]);

    const totalPetOwners = await User.countDocuments({ role: 'petowner' });

    res.json({
      success: true,
      data: petOwnerDetails,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(totalPetOwners / limit),
        total: totalPetOwners,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Pet owner details error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =============================================
// DYNAMIC ADMIN FUNCTIONS FOR PET MANAGEMENT
// =============================================

// Get all pets with advanced filtering
router.get('/pets', adminOrOwnerAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      species,
      breed,
      status,
      location,
      ageRange,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build dynamic query
    let query = {};
    
    // Role-based filtering
    if (req.user.role === 'petowner') {
      query.owner = req.user.id;
    }

    if (species) query.species = species;
    if (breed) query.breed = { $regex: breed, $options: 'i' };
    if (status && ['Available', 'Pending', 'Adopted'].includes(status)) {
      query.status = status;
    }
    if (location) query.location = { $regex: location, $options: 'i' };
    
    if (ageRange) {
      const [min, max] = ageRange.split('-').map(Number);
      if (min !== undefined) query.age = { $gte: min };
      if (max !== undefined) query.age = { ...query.age, $lte: max };
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { breed: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const pets = await Pet.find(query)
      .populate('owner', 'username email')
      .populate('adoptedBy', 'username email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Pet.countDocuments(query);

    res.json({
      success: true,
      data: pets,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get pets error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get pet statistics
router.get('/pets/stats', adminAuth, async (req, res) => {
  try {
    const stats = await Pet.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const speciesStats = await Pet.aggregate([
      {
        $group: {
          _id: '$species',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalPets = await Pet.countDocuments();
    const recentPets = await Pet.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        totalPets,
        recentPets,
        statusDistribution: stats,
        speciesDistribution: speciesStats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Pet stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Update pet status or details
router.put('/pets/:id', adminOrOwnerAuth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Check ownership for pet owners
    if (req.user.role === 'petowner' && pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this pet' 
      });
    }

    const allowedUpdates = [
      'name', 'species', 'breed', 'age', 'gender', 'size', 'color',
      'description', 'location', 'status', 'imageUrl', 'medicalHistory',
      'vaccinated', 'spayedNeutered', 'houseTrained', 'goodWithKids',
      'goodWithPets', 'energyLevel', 'specialNeeds'
    ];

    const updateData = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updateData[key] = req.body[key];
      }
    });

    const updatedPet = await Pet.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('owner', 'username email');

    res.json({
      success: true,
      data: updatedPet,
      message: 'Pet updated successfully'
    });
  } catch (error) {
    console.error('Update pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Delete pet
router.delete('/pets/:id', adminOrOwnerAuth, async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id);
    if (!pet) {
      return res.status(404).json({ success: false, message: 'Pet not found' });
    }

    // Check ownership for pet owners
    if (req.user.role === 'petowner' && pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this pet' 
      });
    }

    // Check for active adoptions
    const activeAdoptions = await Adoption.countDocuments({
      pet: req.params.id,
      status: { $in: ['Pending', 'Approved'] }
    });

    if (activeAdoptions > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete pet with active adoption requests'
      });
    }

    await Pet.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: 'Pet deleted successfully'
    });
  } catch (error) {
    console.error('Delete pet error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// =============================================
// DYNAMIC ADMIN FUNCTIONS FOR ADOPTION MANAGEMENT
// =============================================

// Get all adoptions with advanced filtering
router.get('/adoptions', adminAuth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      petSpecies,
      adopterUsername,
      ownerUsername,
      dateRange,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build dynamic query
    let query = {};
    
    if (status && ['Pending', 'Approved', 'Rejected', 'Completed'].includes(status)) {
      query.status = status;
    }

    if (adopterUsername) {
      query.adopterUsername = { $regex: adopterUsername, $options: 'i' };
    }

    if (dateRange) {
      const [startDate, endDate] = dateRange.split(',');
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        };
      }
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    let adoptionsQuery = Adoption.find(query)
      .populate('pet', 'name species breed imageUrl location')
      .populate('user', 'username email')
      .populate('petOwner', 'username email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Add pet species filter if specified
    if (petSpecies) {
      adoptionsQuery = adoptionsQuery.populate({
        path: 'pet',
        match: { species: petSpecies },
        select: 'name species breed imageUrl location'
      });
    }

    const adoptions = await adoptionsQuery;

    // Filter out null pets if species filter was applied
    const filteredAdoptions = petSpecies ? 
      adoptions.filter(adoption => adoption.pet !== null) : 
      adoptions;

    const total = await Adoption.countDocuments(query);

    res.json({
      success: true,
      data: filteredAdoptions,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total,
        limit
      }
    });
  } catch (error) {
    console.error('Get adoptions error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get adoption statistics
router.get('/adoptions/stats', adminAuth, async (req, res) => {
  try {
    const statusStats = await Adoption.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const monthlyStats = await Adoption.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);

    const totalAdoptions = await Adoption.countDocuments();
    const completedAdoptions = await Adoption.countDocuments({ status: 'Completed' });
    const pendingAdoptions = await Adoption.countDocuments({ status: 'Pending' });

    res.json({
      success: true,
      data: {
        totalAdoptions,
        completedAdoptions,
        pendingAdoptions,
        statusDistribution: statusStats,
        monthlyTrends: monthlyStats,
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Adoption stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Bulk update adoption status
router.put('/adoptions/bulk-update', adminAuth, async (req, res) => {
  try {
    const { adoptionIds, status, ownerNotes } = req.body;

    if (!adoptionIds || !Array.isArray(adoptionIds) || adoptionIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Adoption IDs array is required'
      });
    }

    if (!['Pending', 'Approved', 'Rejected', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const updateData = { status };
    if (ownerNotes) updateData.ownerNotes = ownerNotes;
    if (status === 'Approved') updateData.approvalDate = new Date();
    if (status === 'Completed') updateData.completionDate = new Date();

    const result = await Adoption.updateMany(
      { _id: { $in: adoptionIds } },
      updateData
    );

    res.json({
      success: true,
      data: {
        modifiedCount: result.modifiedCount,
        matchedCount: result.matchedCount
      },
      message: `${result.modifiedCount} adoptions updated successfully`
    });
  } catch (error) {
    console.error('Bulk update error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get comprehensive historical and future analytics
router.get('/analytics/comprehensive', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);

    // Historical User Analytics
    const userAnalytics = await User.aggregate([
      {
        $facet: {
          totalByRole: [
            { $group: { _id: '$role', count: { $sum: 1 } } }
          ],
          monthlyGrowth: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  role: '$role'
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 24 }
          ],
          recentActivity: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: '$role', count: { $sum: 1 } } }
          ],
          pastPeriods: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                last30Days: {
                  $sum: { $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, 1, 0] }
                },
                last60Days: {
                  $sum: { $cond: [{ $gte: ['$createdAt', sixtyDaysAgo] }, 1, 0] }
                },
                last90Days: {
                  $sum: { $cond: [{ $gte: ['$createdAt', ninetyDaysAgo] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    // Pet Owner Analytics with Pet Counts
    const petOwnerAnalytics = await User.aggregate([
      { $match: { role: 'petowner' } },
      {
        $lookup: {
          from: 'pets',
          localField: '_id',
          foreignField: 'owner',
          as: 'pets'
        }
      },
      {
        $addFields: {
          petCount: { $size: '$pets' },
          activePets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { $in: ['$$this.status', ['Available', 'Pending']] }
              }
            }
          },
          adoptedPets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { $eq: ['$$this.status', 'Adopted'] }
              }
            }
          }
        }
      },
      {
        $group: {
          _id: null,
          totalPetOwners: { $sum: 1 },
          avgPetsPerOwner: { $avg: '$petCount' },
          totalPetsManaged: { $sum: '$petCount' },
          totalActivePets: { $sum: '$activePets' },
          totalAdoptedPets: { $sum: '$adoptedPets' },
          ownersWithNoPets: {
            $sum: { $cond: [{ $eq: ['$petCount', 0] }, 1, 0] }
          },
          ownersWithMultiplePets: {
            $sum: { $cond: [{ $gt: ['$petCount', 1] }, 1, 0] }
          }
        }
      }
    ]);

    // Pet Addition Trends
    const petTrends = await Pet.aggregate([
      {
        $facet: {
          monthlyAdditions: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  species: '$species'
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 24 }
          ],
          statusDistribution: [
            { $group: { _id: '$status', count: { $sum: 1 } } }
          ],
          speciesDistribution: [
            { $group: { _id: '$species', count: { $sum: 1 } } }
          ],
          recentAdditions: [
            { $match: { createdAt: { $gte: thirtyDaysAgo } } },
            { $group: { _id: '$species', count: { $sum: 1 } } }
          ],
          pastPeriods: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                last30Days: {
                  $sum: { $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, 1, 0] }
                },
                last60Days: {
                  $sum: { $cond: [{ $gte: ['$createdAt', sixtyDaysAgo] }, 1, 0] }
                },
                last90Days: {
                  $sum: { $cond: [{ $gte: ['$createdAt', ninetyDaysAgo] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    // Adoption Success Analytics
    const adoptionAnalytics = await Adoption.aggregate([
      {
        $facet: {
          statusTrends: [
            {
              $group: {
                _id: {
                  year: { $year: '$createdAt' },
                  month: { $month: '$createdAt' },
                  status: '$status'
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 24 }
          ],
          successRate: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                completed: {
                  $sum: { $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0] }
                },
                approved: {
                  $sum: { $cond: [{ $eq: ['$status', 'Approved'] }, 1, 0] }
                },
                pending: {
                  $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] }
                },
                rejected: {
                  $sum: { $cond: [{ $eq: ['$status', 'Rejected'] }, 1, 0] }
                }
              }
            }
          ]
        }
      }
    ]);

    // Calculate growth rates and predictions
    const userGrowthData = userAnalytics[0].pastPeriods[0] || {};
    const petGrowthData = petTrends[0].pastPeriods[0] || {};
    
    // Simple growth rate calculation
    const userGrowthRate = userGrowthData.last30Days && userGrowthData.last60Days ? 
      ((userGrowthData.last30Days - (userGrowthData.last60Days - userGrowthData.last30Days)) / 
       (userGrowthData.last60Days - userGrowthData.last30Days)) * 100 : 0;
    
    const petGrowthRate = petGrowthData.last30Days && petGrowthData.last60Days ? 
      ((petGrowthData.last30Days - (petGrowthData.last60Days - petGrowthData.last30Days)) / 
       (petGrowthData.last60Days - petGrowthData.last30Days)) * 100 : 0;

    // Future projections (simple linear projection)
    const projectedUsers30Days = Math.round(userGrowthData.total + (userGrowthData.last30Days * 1.1));
    const projectedPets30Days = Math.round(petGrowthData.total + (petGrowthData.last30Days * 1.1));

    res.json({
      success: true,
      data: {
        users: {
          historical: userAnalytics[0],
          growthRate: Math.round(userGrowthRate * 100) / 100,
          projections: {
            next30Days: projectedUsers30Days,
            expectedGrowth: userGrowthData.last30Days
          }
        },
        petOwners: petOwnerAnalytics[0] || {},
        pets: {
          historical: petTrends[0],
          growthRate: Math.round(petGrowthRate * 100) / 100,
          projections: {
            next30Days: projectedPets30Days,
            expectedGrowth: petGrowthData.last30Days
          }
        },
        adoptions: adoptionAnalytics[0],
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Comprehensive analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Get system dashboard data
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      totalPets,
      totalAdoptions,
      pendingAdoptions,
      recentUsers,
      recentPets,
      recentAdoptions,
      userGrowth,
      petOwnerStats,
      petGrowth
    ] = await Promise.all([
      User.countDocuments(),
      Pet.countDocuments(),
      Adoption.countDocuments(),
      Adoption.countDocuments({ status: 'Pending' }),
      User.find().sort({ createdAt: -1 }).limit(5).select('username email role createdAt'),
      Pet.find().sort({ createdAt: -1 }).limit(5).populate('owner', 'username'),
      Adoption.find().sort({ createdAt: -1 }).limit(5)
        .populate('pet', 'name species')
        .populate('user', 'username'),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      User.countDocuments({ role: 'petowner' }),
      Pet.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    ]);

    // Get pet owners with their pet counts
    const petOwnerDetails = await User.aggregate([
      { $match: { role: 'petowner' } },
      {
        $lookup: {
          from: 'pets',
          localField: '_id',
          foreignField: 'owner',
          as: 'pets'
        }
      },
      {
        $project: {
          username: 1,
          email: 1,
          createdAt: 1,
          petCount: { $size: '$pets' },
          activePets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { $in: ['$$this.status', ['Available', 'Pending']] }
              }
            }
          },
          adoptedPets: {
            $size: {
              $filter: {
                input: '$pets',
                cond: { $eq: ['$$this.status', 'Adopted'] }
              }
            }
          }
        }
      },
      { $sort: { petCount: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalUsers,
          totalPets,
          totalAdoptions,
          pendingAdoptions,
          totalPetOwners: petOwnerStats,
          newUsersThisMonth: userGrowth,
          newPetsThisMonth: petGrowth
        },
        petOwners: {
          total: petOwnerStats,
          topOwners: petOwnerDetails,
          totalPetsManaged: petOwnerDetails.reduce((sum, owner) => sum + owner.petCount, 0)
        },
        recent: {
          users: recentUsers,
          pets: recentPets,
          adoptions: recentAdoptions
        },
        trends: {
          userGrowth: {
            thisMonth: userGrowth,
            total: totalUsers
          },
          petGrowth: {
            thisMonth: petGrowth,
            total: totalPets
          }
        },
        lastUpdated: new Date()
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
