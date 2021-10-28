const mongoose = require('mongoose');
const moment = require('moment');

const today = new Date();
const future = new Date();

const CustomerSubscriptionSchema = mongoose.Schema({
    customer_id: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    service_provider_id: {
        type: String
    },
    is_active: {
        type: Boolean,
        default: true
    },
    start_date: {
        type: Date,
        default: today
    },
    renew_date: {
        type: Date
    },
    customer: {
        type: Object, 
        ref: 'User' 
    },
    product: {
        type: Object, 
        ref: 'Product' 
    },
    is_trial: {
        type: Boolean,
        default: false
    },
    trial_used: {
        type: Boolean,
        default: false
    }
});


module.exports = mongoose.model('CustomerSubscriptions', CustomerSubscriptionSchema);