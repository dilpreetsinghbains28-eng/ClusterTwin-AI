const ResourceTransfer = require('../models/ResourceTransfer');
const Factory = require('../models/Factory');

exports.recommendTransfer = async (req, res) => {
  try {
    const { sourceFactoryId, resourceType, quantity } = req.body;

    if (!sourceFactoryId || !resourceType || !quantity) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    const sourceFactory = await Factory.findById(sourceFactoryId);
    if (!sourceFactory) {
      return res.status(404).json({ success: false, error: 'Source factory not found' });
    }

    // Find all other factories to act as potential destinations
    const potentialDestinations = await Factory.find({ _id: { $ne: sourceFactoryId } }).lean();

    if (potentialDestinations.length === 0) {
      return res.status(400).json({ success: false, error: 'No other factories available in cluster' });
    }

    // Determine the optimal destination (heuristic mock for AI engine)
    // We pick a random destination to simulate an AI choice, but in a real app this would use GIS & supply chain data.
    const optimalDest = potentialDestinations[Math.floor(Math.random() * potentialDestinations.length)];

    // Heuristics based on resourceType
    let distance = Math.floor(Math.random() * 500) + 50; // miles
    let cost = 0;
    let etaHours = 0;
    let expectedSavings = 0;
    let carbonSavings = 0;

    switch (resourceType) {
      case 'Machines':
        cost = distance * 50 + 2000; // Heavy haul
        etaHours = Math.ceil(distance / 40) + 24; // Slow
        expectedSavings = 15000 * quantity; // Avoid buying new
        carbonSavings = 1200 * quantity; // kg CO2e
        break;
      case 'Workers':
        cost = distance * 2 + 500 * quantity; // Travel + per diem
        etaHours = Math.ceil(distance / 60) + 12; // Fast
        expectedSavings = 4000 * quantity; // Avoid lost production
        carbonSavings = 0; 
        break;
      case 'Raw Materials':
        cost = distance * 5 * quantity; 
        etaHours = Math.ceil(distance / 50) + 4;
        expectedSavings = 2500 * quantity;
        carbonSavings = 300 * quantity;
        break;
      case 'Spare Parts':
        cost = distance * 1.5; // Express shipping
        etaHours = Math.ceil(distance / 70) + 2; 
        expectedSavings = 8000; // Prevent downtime
        carbonSavings = 50;
        break;
      case 'Warehouse Space':
        cost = distance * 4; 
        etaHours = Math.ceil(distance / 45) + 6;
        expectedSavings = 6000;
        carbonSavings = 150;
        break;
      case 'Transport':
        cost = distance * 3;
        etaHours = Math.ceil(distance / 55);
        expectedSavings = 3500;
        carbonSavings = 400;
        break;
      default:
        cost = 1000;
        etaHours = 24;
        expectedSavings = 5000;
        carbonSavings = 100;
    }

    return res.status(200).json({
      success: true,
      data: {
        sourceFactory: sourceFactory,
        destinationFactory: optimalDest,
        resourceType,
        quantity,
        recommendation: {
          distance,
          cost,
          etaHours,
          expectedSavings,
          carbonSavings
        }
      }
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.executeTransfer = async (req, res) => {
  try {
    const { sourceFactoryId, destinationFactoryId, resourceType, quantity, distance, cost, etaHours, expectedSavings, carbonSavings } = req.body;

    const transfer = await ResourceTransfer.create({
      sourceFactory: sourceFactoryId,
      destinationFactory: destinationFactoryId,
      resourceType,
      quantity,
      distance,
      cost,
      etaHours,
      expectedSavings,
      carbonSavings,
      status: 'In Transit',
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      data: transfer
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};

exports.getTransferHistory = async (req, res) => {
  try {
    const { sourceFactoryId } = req.query;
    const query = {};
    if (sourceFactoryId) {
      query.$or = [{ sourceFactory: sourceFactoryId }, { destinationFactory: sourceFactoryId }];
    }

    const history = await ResourceTransfer.find(query)
      .populate('sourceFactory destinationFactory', 'name location')
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      data: history
    });

  } catch (error) {
    
    return res.status(500).json({ success: false, error: 'Server Error' });
  }
};
