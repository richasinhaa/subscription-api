const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv/config');

//Parse Request body
app.use(express.json());

//Default Route
app.get('/', (req, res) => {
    res.send('Hey there!');
});

//Import all routes
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const subscriptionsRoute = require('./routes/customer-subscriptions');
const campaignsRoute = require('./routes/campaigns');

app.use('/users', usersRoute);
app.use('/products', productsRoute);
app.use('/campaigns', campaignsRoute);
app.use('/customerSubscriptions', subscriptionsRoute);

//Connect to DB
mongoose.connect(
    process.env.DB_CONNECTION,
    () => {
    console.log('Connected to DB!');
});


app.listen(3000);