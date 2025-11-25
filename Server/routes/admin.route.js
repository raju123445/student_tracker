// routes/adminRoutes.js
const express = require("express");
const { 
  registerAdmin,
  loginAdmin,
  getAdminProfile,
} = require( "../controller/admin.controller.js");

const router = express.Router();

// Register new admin
router.post("/register", registerAdmin);

// Login admin
router.post("/login", loginAdmin);

// Get admin profile (this should be protected, but leaving open for now)
router.get("/profile", getAdminProfile);

module.exports = router;
