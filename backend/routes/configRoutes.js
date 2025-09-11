
const express = require('express');
const router = express.Router();

const { getConfig } = require("../controllers/configController");

// Get configuration from DB, for client.
router.route("/").get(getConfig);

module.exports = router;

