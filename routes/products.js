const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const User = require('../models/User');

//ROUTES
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
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

router.post('/', async (req, res) => {
    const product = new Product({
        name: req.body.name,
        price: req.body.price,
        is_valid: req.body.is_valid,
        has_trial: req.body.has_trial,
        trial_period: req.body.trial_period,
        service_provider_id: req.body.service_provider_id
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