const multer = require('multer');

const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    }
});

const upload = multer({ storage: storage })

module.exports = {
    postUpload: upload.fields([
        {name: 'image', maxCount:1},
         {name: 'video', maxCount:1}
    ]),

    create: async (req, res) => {
        res.render('video/create', {pageTitle: 'Create Video'})
    },
    postCreate: async (req, res) => {
        console.log(req.files);
    }
}