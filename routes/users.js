const express = require('express');
const router = express.Router();
const User = require('../models/User');

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




module.exports = router;