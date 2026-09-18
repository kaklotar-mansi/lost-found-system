const Item = require('../models/Item');
const Claim = require('../models/Claim');
const asyncHandler = require('../middleware/errorHandler');

// @desc    Create a new lost/found item report
// @route   POST /api/items
const createItem = asyncHandler(async (req, res) => {
  const { title, description, category, type, location, date } = req.body;

  if (!title || !description || !category || !type || !location || !date) {
    return res.status(400).json({ message: 'Please fill in all required fields' });
  }
  if (!['Lost', 'Found'].includes(type)) {
    return res.status(400).json({ message: 'Type must be either Lost or Found' });
  }

  const item = await Item.create({
    title,
    description,
    category,
    type,
    location,
    date,
    image: req.file ? `/uploads/${req.file.filename}` : '',
    reportedBy: req.user._id,
  });

  res.status(201).json(item);
});

// @desc    Get all items with search & filters
// @route   GET /api/items
const getItems = asyncHandler(async (req, res) => {
  const { search, type, category, location, status } = req.query;
  const query = {};

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }
  if (type) query.type = type;
  if (category) query.category = category;
  if (location) query.location = { $regex: location, $options: 'i' };
  if (status) query.status = status;

  const items = await Item.find(query)
    .populate('reportedBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(items);
});

// @desc    Get single item by id
// @route   GET /api/items/:id
const getItemById = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id).populate('reportedBy', 'name email');
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  res.json(item);
});

// @desc    Get items reported by the logged-in user
// @route   GET /api/items/mine/reports
const getMyItems = asyncHandler(async (req, res) => {
  const items = await Item.find({ reportedBy: req.user._id }).sort({ createdAt: -1 });
  res.json(items);
});

// @desc    Update an item
// @route   PUT /api/items/:id
const updateItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  if (item.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to update this item' });
  }

  const fields = ['title', 'description', 'category', 'type', 'location', 'date', 'status'];
  fields.forEach((field) => {
    if (req.body[field] !== undefined) item[field] = req.body[field];
  });
  if (req.file) {
    item.image = `/uploads/${req.file.filename}`;
  }

  const updated = await item.save();
  res.json(updated);
});

// @desc    Delete an item
// @route   DELETE /api/items/:id
const deleteItem = asyncHandler(async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) {
    return res.status(404).json({ message: 'Item not found' });
  }
  if (item.reportedBy.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: 'Not authorized to delete this item' });
  }

  await Claim.deleteMany({ item: item._id });
  await item.deleteOne();

  res.json({ message: 'Item deleted successfully' });
});

module.exports = {
  createItem,
  getItems,
  getItemById,
  getMyItems,
  updateItem,
  deleteItem,
};
