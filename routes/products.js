const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const Campaign = require('../models/Campaign');

//ROUTES
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        for (var i in products) {
            p = products[i];

            //update has_active_campaign flag if campaign has expired.
            if(p.has_active_campaign) {
                var campaign = await Campaign.findById(p.campaign_id);
                var now = new Date();
                if(now > campaign.end_datetime) {
                    p.has_active_campaign = false;
                    await p.save();
                } else {
                    p.campaign = campaign;
                }
            }
            
        }
        res.status(200).json(products);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/:productId', async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId);
        const serviceProvider = await User.findById(product.service_provider_id);
        product.service_provider = serviceProvider;
        res.status(200).json(product);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

/**
 * Create new products/subscription types
 * 
 * Includes solution for Feature 5 : User B can also bundle subscriptions. Eg. 1 month subscription at 1000rs, 3 Month at
2000rs(33% discount on 3 months subscription)
 */
router.post('/', async (req, res) => {
    const isBundle = req.body.is_bundle;
    const bundleDiscount = req.body.bundle_discount;
    var price = req.body.price;
    //if bundle, set price = discounted price
    if(isBundle) {
        price = price - (bundleDiscount/100)*price;
    }
    const product = new Product({
        name: req.body.name,
        price: price,
        subscription_period: req.body.subscription_period,
        is_valid: req.body.is_valid,
        has_trial: req.body.has_trial,
        trial_period: req.body.trial_period,
        service_provider_id: req.body.service_provider_id,
        is_bundle: isBundle,
        bundle_discount: bundleDiscount //percentage
    });

    try {
        const savedProduct = await product.save();
        const serviceProvider = await User.findById(savedProduct.service_provider_id);
        savedProduct.service_provider = serviceProvider;
        res.status(200).json(savedProduct);

    } catch (err) {
        res.status(500).json({ message: err });
    }

});


module.exports = router;