const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const CustomerSubscription = require('../models/CustomerSubscription');
const moment = require('moment');
const { test } = require('media-typer');

//ROUTES
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    }catch(err) {
        res.status(400).json({message: err});
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        res.status(200).json(user);
    }catch(err) {
        res.status(400).json({message: err});
    }
});

router.post('/', async (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.first_name,
        last_name:req.body.last_name,
        user_type:req.body.user_type
    });

    try {
         const savedUser = await user.save();
        res.status(200).json(savedUser);

    }catch(err) {
        res.status(500).json({message: err});
    }
    
});

/**
 * Feature 1 : There will be a monthly subscription which user A can buy and upon ending of
*  subscription if no renewal is done then user A will not be able to converse with user B.
 */
router.post('/chat', async (req, res) => {
    try {
        const customer = await User.findById(req.body.customer);
        const serviceProviderId = req.body.service_provider;
        
        const today = new Date();
        const subscriptions = await CustomerSubscription.find({ 
            customer_id: customer._id, service_provider_id: serviceProviderId, is_active: true, renew_date: { $gt: today }
        }).exec();
        
        const chatAllowed = (subscriptions.length > 0)? true : false;

        var response = [{"chat_allowed":chatAllowed}];
        res.status(200).json(response);
    }catch(err) {
        var response = [{"chat_allowed":chatAllowed}];
        res.status(500).json({response, message: err});
    }
});

/**
 * Feature 2 : User A should be reminded about renewal of subscription 7,3,1,0 days before the expiry
 * & 1,3,7 day post expiry if no renewal is done
 * 
 * Can be run as a cron job
 */
router.post('/reminder', async (req, res) => {
        const subscriptions = await CustomerSubscription.find({ 
            is_active: true,
        }).exec();

        var reminderList = new Array();

        for (var i in subscriptions) {
            s = subscriptions[i];
            var product = await Product.findById(s.product_id);
            var str = s.renew_date;
            var date = moment(str);
            var renewsOn = date.utc().format('DD-MM-YYYY');

            var plusOne = moment().add(1, 'days').format('DD-MM-YYYY');
            var plusThree = moment().add(3, 'days').format('DD-MM-YYYY'); 
            var plusSeven = moment().add(7, 'days').format('DD-MM-YYYY'); 
            var zero = moment().format('DD-MM-YYYY'); 
            var minusOne = moment().subtract(1, 'days').format('DD-MM-YYYY'); 
            var minusThree = moment().subtract(3, 'days').format('DD-MM-YYYY'); 
            var minusSeven = moment().subtract(7, 'days').format('DD-MM-YYYY'); 

            if(renewsOn == plusOne || renewsOn == plusThree || renewsOn == plusSeven || renewsOn == zero
                || renewsOn == minusOne || renewsOn == minusThree || renewsOn == minusSeven) {
                    var message = 'Your subscription for ' + product.name + ' will expire on ' + renewsOn + '. Please renew.';

                    const reminder = {
                        message: message,
                        customer_id: s.customer_id
                      };

                    reminderList.push(reminder);
                }
        };
        
        const count = reminderList.length;

        var response = [{"reminder_list":reminderList, "count": count}];
        res.status(200).json(response);
});




module.exports = router;