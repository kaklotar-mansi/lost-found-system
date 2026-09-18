const Item = require('../models/Item');
const asyncHandler = require('../middleware/errorHandler');

// @desc    Get overall statistics for the dashboard
// @route   GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const [totalLost, totalFound, resolved, active] = await Promise.all([
    Item.countDocuments({ type: 'Lost' }),
    Item.countDocuments({ type: 'Found' }),
    Item.countDocuments({ status: { $in: ['Claimed', 'Resolved'] } }),
    Item.countDocuments({ status: 'Active' }),
  ]);

  res.json({ totalLost, totalFound, resolved, active });
});

module.exports = { getStats };
