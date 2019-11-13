const express = require('express');
const routes = express.Router();

// Define your routes into project
routes.get('/', (req,res) => {
    res.send('Start Page by Routes');
})

module.exports = routes;