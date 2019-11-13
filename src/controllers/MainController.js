module.exports = {
    
    async index(req, res) {
        res.send('MainController - Index Method');
    },

    async store(req, res) {
        res.send('MainController - Store Method');
    },

    async update(req, res){
        res.send('MainController - Update Method');
    },

    async destroy(req, res)  {
        res.send('MainController - Destroy Method');
    },
};