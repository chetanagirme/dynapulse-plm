const mongoose = require('mongoose');

const attachmentSchema = new mongoose.Schema({
    id: String,
    name: String,
    url: String,
    type: { type: String, enum: ['CAD', 'PDF', 'Image', 'Other'] },
    uploadedBy: String,
    uploadedAt: Date
});

const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true }, // Keeping string ID for compatibility with frontend UUIDs
    name: { type: String, required: true },
    description: String,
    sku: { type: String, required: true, unique: true },
    cost: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    supplierId: String,
    category: { type: String, default: 'Uncategorized' },
    status: {
        type: String,
        enum: ['Draft', 'Pending Approval', 'In Review', 'Active', 'Obsolete', 'Archived'],
        default: 'Draft'
    },
    imageUrl: String,
    attachments: [attachmentSchema]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
