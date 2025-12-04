const mongoose = require('mongoose');

const approvalSchema = new mongoose.Schema({
    userId: String,
    role: String,
    status: { type: String, enum: ['Pending', 'Approved', 'Rejected'] },
    timestamp: Date,
    comments: String
});

const ecoSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    status: {
        type: String,
        enum: ['Draft', 'Pending Review', 'Pending Approval', 'Approved', 'Implemented', 'Rejected'],
        default: 'Draft'
    },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    productIds: [String], // Affected Products
    initiatorId: String,
    approvals: [approvalSchema]
}, { timestamps: true });

module.exports = mongoose.model('ECO', ecoSchema);
