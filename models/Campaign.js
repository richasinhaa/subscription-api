const mongoose = require('mongoose');

const CampaignSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    product_id: {
        type: String,
        required: true
    },
    discount_percentage: {
        type: String
    },
    campaign_price: {
        type: Number
    },
    start_datetime: {
        type: Date,
        required: true
    },
    end_datetime: {
        type: Date,
        required: true
    }
});


module.exports = mongoose.model('Campaigns', CampaignSchema);