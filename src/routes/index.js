const express = require('express');
// const userRoute = require('./user');
const authRoute = require('./auth');

function route(app) {
    // API route
    app.get('/api', (req, res) => {
        res.json({ message: 'API is running!' });
    });
    // app.use('/api/users', userRoute);
    app.use('/api/auth', authRoute);
}

module.exports = route;
