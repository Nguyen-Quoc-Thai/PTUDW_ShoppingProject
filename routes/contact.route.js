const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

/*-------------- Routes ---------------*/
/* Get contact page */
router.get('/', contactController.get);

module.exports = router;
