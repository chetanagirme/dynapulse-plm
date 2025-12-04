const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    contactName: String,
    email: String,
    phone: String,
    address: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected', 'Blacklisted'],
        default: 'Pending'
    },
    rating: { type: Number, min: 1, max: 5, default: 3 }
}, { timestamps: true });

module.exports = mongoose.model('Supplier', supplierSchema);
