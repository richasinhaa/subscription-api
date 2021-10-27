const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');
const CustomerSubscription = require('../models/CustomerSubscription');
const moment = require('moment');


//ROUTES
router.get('/', async (req, res) => {
    try {
        const subscriptions = await CustomerSubscription.find();
        res.status(200).json(subscriptions);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/:subscriptionId', async (req, res) => {
    try {
        const subscription = await CustomerSubscription.findById(req.params.subscriptionId);
        const customer = await User.findById(subscription.customer_id);
        subscription.customer = customer;
        const product = await Product.findById(subscription.product_id);
        subscription.product = product;
        res.status(200).json(subscription);
    } catch (err) {
        res.status(400).json({ message: err });
    }
});

router.get('/byCustomerId/:customerId', async (req, res) => {
        const customerId = req.params.customerId;
        const subscriptions = await CustomerSubscription.find({ customer_id: customerId }).exec();
        res.status(200).json(subscriptions);
    
});

router.post('/buy', async (req, res) => {

    const isTrial = req.body.is_trial;
    var trialUsed = false;
    if(isTrial) {
        trialUsed = true;
    } 

    try {
        const subscription = new CustomerSubscription({
            customer_id: req.body.customer_id,
            product_id: req.body.product_id,
            is_active: req.body.is_active,
            is_trial: isTrial,
            trial_used: trialUsed,
            service_provider_id: req.body.service_provider_id
        });

            const savedSubscription = await subscription.save();
            const customer = await User.findById(subscription.customer_id);
            savedSubscription.customer = customer;

            const product = await Product.findById(subscription.product_id);
            savedSubscription.product = product;

            const subscriptionPeriod = (isTrial == true) ? product.trial_period : product.subscription_period;
            const current = new Date();
            const renewDate = current.setDate(current.getDate() + subscriptionPeriod);
            savedSubscription.renew_date = renewDate;
            
            res.status(200).json(savedSubscription);
    } catch (err) {
        res.status(400).json({ message: err });
    }
    
});

/**
 * Feature 3 : User B can also offer a 1,3,7 Day trial offer for user A to chat. Trial will only be applicable
 * once and in future no more trials can be offered by user B to user A.
 */

router.put('/renew/:subscriptionId', async (req, res) => {
    const subscriptionId = req.params.subscriptionId;
        try{
            const subscription = await CustomerSubscription.findById(subscriptionId);
            if(subscription) {
                const trialUsed = subscription.trial_used;
                if(trialUsed) {
                    res.status(400).json({ message: 'Trial has already been used' });
                } else {
                    const product = await Product.findById(subscription.product_id);
                    const subscriptionPeriod = product.subscription_period;
                    var currentRenewDate = subscription.renew_date;
                    var nextRenewDate = subscription.renew_date;
                    nextRenewDate = await nextRenewDate.setDate(currentRenewDate.getDate() + subscriptionPeriod);
                    subscription.start_date = currentRenewDate;
                    subscription.renew_date = nextRenewDate;
                    const savedSubscription = await subscription.save();

                    res.status(200).json(savedSubscription);
                }
            }
        } catch (err) {
            res.status(400).json({ message: err });
        }
    
});




module.exports = router;