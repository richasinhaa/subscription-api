const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    is_valid: {
        type: Boolean,
        default: true
    },
    has_trial: {
        type: Boolean,
        default: false
    },
    trial_period: {
        type: Number
    },
    service_provider_id: {
        type: String,
        required: true
    },
    service_provider: {
        type: Object, 
        ref: 'User' 
    }
});


module.exports = mongoose.model('Products', ProductSchema);