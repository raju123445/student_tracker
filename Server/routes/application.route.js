// routes/applicationRoutes.js
const express = require("express");
const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication
} = require("../controller/application.controller.js");

const router = express.Router();

router.post("/", createApplication);
router.get("/", getApplications);
router.get("/:id", getApplicationById);
router.put("/:id", updateApplication);
router.delete("/:id", deleteApplication);

module.exports = router;
