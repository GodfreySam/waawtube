const express = require('express');
const router = express.Router();
const {create, postCreate, postUpload} = require('../../controllers/video/video.controller');
const authorized = require('../../config/authorization').isLoggedIn;

router.route('/create')
    .get(create)
    .post(authorized, postUpload, postCreate);

module.exports = router;