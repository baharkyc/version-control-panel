
const express = require('express');
const router = express.Router();
const firebaseTokenVerify = require("../middleware/firebaseTokenVerify");

const { 
  getParameters,
  createParameter,
  updateParameter,
  deleteParameter 
} = require("../controllers/parameterController.js"); 

router.use(firebaseTokenVerify);

router.route("/").get(getParameters).post(createParameter);
router.route("/:id").put(updateParameter).delete(deleteParameter);


module.exports = router;