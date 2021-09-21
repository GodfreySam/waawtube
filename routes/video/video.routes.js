const express = require("express");
const router = express.Router();
const {
	create,
	postCreate,
} = require("../../controllers/video/video.controller");

const authorized = require('../../config/authorization').isLoggedIn;

router.get("/create").get(create).post(authorized, postCreate);

module.exports = router;
