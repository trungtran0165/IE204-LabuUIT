const express = require('express');
// const userRoute = require('./user');
const authRoute = require('./auth');
const blogRoute = require('./blog');

function route(app) {
    // API route
    app.get('/api', (req, res) => {
        res.json({ message: 'API is running!' });
    });
    // app.use('/api/users', userRoute);
    app.use('/api/auth', authRoute);
    app.use('/api/blogs', blogRoute);
}

module.exports = route;
