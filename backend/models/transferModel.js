const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    convertedAmount: {
        type: Number    
    },
    rate: {
        type: Number    
    }
}, { timestamps: true });

module.exports = mongoose.model('Transfer', transferSchema);