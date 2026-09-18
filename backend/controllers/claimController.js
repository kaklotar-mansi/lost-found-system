const Claim = require('../models/Claim');
const Item = require('../models/Item');
const asyncHandler = require('../middleware/errorHandler');

// @desc    Submit a claim request for an item
// @route   POST /api/claims
const createClaim = asyncHandler(async (req, res) => {
  const { itemId, message } = req.body;

  if (!itemId || !message) {
    return res.status(400).json({ message: 'Please provide item and a message' });
  }

  const item = await Item.findById(itemId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  if (item.reportedBy.toString() === req.user._id.toString()) {
    return res.status(400).json({ message: 'You cannot claim your own reported item' });
  }

  const existingClaim = await Claim.findOne({ item: itemId, claimant: req.user._id });
  if (existingClaim) {
    return res.status(400).json({ message: 'You have already submitted a claim for this item' });
  }

  const claim = await Claim.create({
    item: itemId,
    claimant: req.user._id,
    message,
  });

  const populated = await claim.populate([
    { path: 'item', select: 'title type status' },
    { path: 'claimant', select: 'name email' },
  ]);

  res.status(201).json(populated);
});

// @desc    Get claims made by the logged-in user
// @route   GET /api/claims/mine
const getMyClaims = asyncHandler(async (req, res) => {
  const claims = await Claim.find({ claimant: req.user._id })
    .populate('item', 'title type status image')
    .sort({ createdAt: -1 });
  res.json(claims);
});

// @desc    Get claims received on items the logged-in user reported
// @route   GET /api/claims/received
const getReceivedClaims = asyncHandler(async (req, res) => {
  const myItems = await Item.find({ reportedBy: req.user._id }).select('_id');
  const myItemIds = myItems.map((i) => i._id);

  const claims = await Claim.find({ item: { $in: myItemIds } })
    .populate('item', 'title type status image')
    .populate('claimant', 'name email')
    .sort({ createdAt: -1 });

  res.json(claims);
});

// @desc    Approve or reject a claim
// @route   PUT /api/claims/:id
const updateClaimStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Status must be Approved or Rejected' });
  }

  const claim = await Claim.findById(req.params.id).populate('item');
  if (!claim) {
    return res.status(404).json({ message: 'Claim not found' });
  }
  if (claim.item.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this claim' });
  }

  claim.status = status;
  await claim.save();

  if (status === 'Approved') {
    await Item.findByIdAndUpdate(claim.item._id, { status: 'Claimed' });
    await Claim.updateMany(
      { item: claim.item._id, _id: { $ne: claim._id }, status: 'Pending' },
      { status: 'Rejected' }
    );
  }

  res.json(claim);
});

module.exports = { createClaim, getMyClaims, getReceivedClaims, updateClaimStatus };
