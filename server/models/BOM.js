const mongoose = require('mongoose');

const bomComponentSchema = new mongoose.Schema({
    id: String,
    componentProductId: { type: String, required: true }, // Reference to Product ID (string)
    quantity: { type: Number, required: true },
    unit: String
});

const bomSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    productId: { type: String, required: true }, // Parent Product ID
    name: { type: String, required: true },
    version: { type: String, default: '1.0' },
    status: {
        type: String,
        enum: ['Draft', 'Pending Approval', 'In Review', 'Approved', 'Obsolete'],
        default: 'Draft'
    },
    components: [bomComponentSchema]
}, { timestamps: true });

module.exports = mongoose.model('BOM', bomSchema);
