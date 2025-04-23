const express = require("express");
const {
  register,
  login,
  getUserData,
} = require("../../controllers/authController");
const { protect } = require("../../middlewares/auth");
const { validateRequestParams } = require("../../utils/validationUtils");
const validations = require("./params");

const router = express.Router();

router.post("/signup", validateRequestParams(validations.signup), register);
router.post("/login", validateRequestParams(validations.login), login);
router.get("/get-user-data", protect, getUserData);

module.exports = router;
