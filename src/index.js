const express = require('express');
const routes = require('./routes');

const api = express();

// api.get('/',(req,res) => {
//     res.send('Start Page')
// })

api.use(routes);


api.listen(4000, () => {
    console.log('Servidor no Ar')
});