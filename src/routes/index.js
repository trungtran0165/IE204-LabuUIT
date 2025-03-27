const express = require('express');
// const userRoute = require('./user');
const authRoute = require('./authRoutes');
const blogRoute = require('./blogRoutes');
const productRoute = require('./productRoutes');
const categoryRoute = require('./categoryRoutes');
const cartRoute = require('./cartRoutes');
const searchRoute = require('./searchRoutes');

function route(app) {
    // API route
    app.get('/api', (req, res) => {
        res.json({ message: 'API is running!' });
    });
    // app.use('/api/users', userRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/blogs', blogRoute);
    app.use('/api/products', productRoute);
    app.use('/api/categories', categoryRoute);
    app.use('/api/cart', cartRoute);
    app.use('/api/search', searchRoute);
}

module.exports = route;
