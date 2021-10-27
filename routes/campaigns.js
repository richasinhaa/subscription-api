const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Campaign = require('../models/Campaign');
const moment = require('moment');


//ROUTES
router.get('/', async (req, res) => {
    try {
        const campaigns = await Campaign.find();
        res.status(200).json(campaigns);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

/**
 * Feature 4 : User B can anytime give an offer on the fixed subscription price.Eq - If User B has set
 * 1000rs for 30 days as his/her subscription charge, then on some days, he/she can give
 * 25% discount on 1000 rs for anyone to join the subscription. The offer will have an expiry
 * (eg. 6 hours or 1 days etc) and post expiry, fixed subscription amount will be applicable
 * for any new purchase.
 */
router.post('/create', async (req, res) => {
    try{
        //In hours
        var runsFor = req.body.runs_for;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setTime(startDate.getTime() + (runsFor*60*60*1000));

        //Calculate price of product to customer while the campaign is running
        const product = await Product.findById(req.body.product_id);
        const discount = req.body.discount_percentage;
        const finalPrice = product.price - (discount/100)*product.price;

        const campaign = new Campaign({
            name: req.body.name,
            product_id: req.body.product_id,
            discount_percentage: discount,
            campaign_price: finalPrice,
            start_datetime: startDate,
            end_datetime: endDate
        });

        const savedCampaign = await campaign.save();

        
        product.has_active_campaign = true;
        product.campaign_id = savedCampaign._id;
        await product.save();

        savedCampaign.product = product;
        
        res.status(200).json(savedCampaign);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});


module.exports = router;