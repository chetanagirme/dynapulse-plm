const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['ADMIN', 'ENGINEER', 'MANAGER', 'DGM', 'SUPPLIER'],
        default: 'ENGINEER'
    },
    avatar: String
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
