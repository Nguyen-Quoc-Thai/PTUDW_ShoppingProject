const express = require('express');
const router = express.Router();

const indexController = require('../controllers/index.controller');

// const { homeCache } = require("./../middlewares/redis.middleware");

/*-------------- Routes ---------------*/
/* Get home page */
router.get('/', indexController.index);

module.exports = router;
