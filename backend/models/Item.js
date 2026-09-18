const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Title is required'], trim: true },
    description: { type: String, required: [true, 'Description is required'] },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Electronics', 'Documents', 'Accessories', 'Clothing', 'Bags', 'Keys', 'Pets', 'Books', 'Other'],
    },
    type: { type: String, required: true, enum: ['Lost', 'Found'] },
    location: { type: String, required: [true, 'Location is required'] },
    date: { type: Date, required: [true, 'Date is required'] },
    image: { type: String, default: '' },
    status: { type: String, enum: ['Active', 'Claimed', 'Resolved'], default: 'Active' },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

itemSchema.index({ title: 'text', description: 'text', location: 'text' });

module.exports = mongoose.model('Item', itemSchema);
