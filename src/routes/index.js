const express = require('express');
// const userRoute = require('./user');
const authRoute = require('./auth');
const blogRoute = require('./blog');
const productRoute = require('./productRoutes');
const categoryRoute = require('./categoryRoutes');

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
}

module.exports = route;
