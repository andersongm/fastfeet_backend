const express = require('express');
const routes = express.Router();

// Define some routes to project
routes.get('/', (req,res) => {
    res.send('Start Page by Routes');
})

module.exports = routes;