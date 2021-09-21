const multer = require('multer');

module.exports = {
   create: async (req, res) => {
      const pageTitle = 'Create Video'
      res.render('video/create', { pageTitle });
   },

   postCreate: async (req, res) => {

   }
}