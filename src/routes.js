const express = require('express');
const routes = express.Router();


// Import Controllers
const MainController = require('./controllers/MainController');

// Define your routes into project
// routes.get('/', (req,res) => {
//     res.send('Start Page by Routes');
// })

// Route with Controller
routes.get('/', MainController.index);

module.exports = routes;