const mongoose = require('mongoose');

const today = new Date();

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
    subscription_period: {
        type: Number,
        default: 30
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
    },
    has_active_campaign: {
        type: Boolean, 
        default: false 
    },
    campaign_id: {
        type: String
    },
    is_bundle: {
        type: Boolean,
        default: false
    },
    bundle_discount: {
        type: Number
    }
});


module.exports = mongoose.model('Products', ProductSchema);