const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

/* GET home page. */
router.get('/', contactController.get);

module.exports = router;
