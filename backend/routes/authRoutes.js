
const express = require("express");
const router = express.Router();

const { signInUser } = require("../controllers/authController");

router.post("/signin", signInUser);

module.exports = router;
