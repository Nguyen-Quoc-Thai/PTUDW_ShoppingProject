var express = require("express");
var router = express.Router();
const contactController = require("../controllers/contact.controller");

/* GET home page. */
router.get("/", contactController.get);

module.exports = router;
