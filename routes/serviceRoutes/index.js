const express = require("express");
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require("../../controllers/serviceController");
const { protect, authorize } = require("../../middlewares/auth");
const { validateRequestParams } = require("../../utils/validationUtils");
const validations = require("./params");

const router = express.Router();

router
  .route("/")
  .get(getServices)
  .post(
    validateRequestParams(validations.addService),
    protect,
    authorize("provider", "admin"),
    createService
  );

router
  .route("/:id")
  .get(getService)
  .put(
    validateRequestParams(validations.updateService),
    protect,
    authorize("provider", "admin"),
    updateService
  )
  .delete(protect, authorize("provider", "admin"), deleteService);

module.exports = router;
