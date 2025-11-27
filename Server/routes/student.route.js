// routes/studentRoutes.js
const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  getStudentByUSN,
  updateStudent,
  deleteStudent,
  getDashboardStats,
  getCompanySelections,
  getStatusDistribution,
  bulkUpdateStudents
} = require( "../controller/student.controller.js");

const router = express.Router();

// @route   POST /api/students
// @desc    Create new student
router.post("/", createStudent);

// @route   GET /api/students
// @desc    Get all students (with filters: sem, branch, course, name, usn, pagination)
router.get("/", getStudents);

// @route   GET /api/students/stats
// @desc    Get dashboard statistics
router.get("/stats", getDashboardStats);

// @route   GET /api/students/company-selections
// @desc    Get company-wise selections
router.get("/company-selections", getCompanySelections);

// @route   GET /api/students/status-distribution
// @desc    Get status distribution
router.get("/status-distribution", getStatusDistribution);

// @route   GET /api/students/usn/:usn
// @desc    Get single student by USN
router.get("/usn/:usn", getStudentByUSN);

// @route   GET /api/students/:id
// @desc    Get single student by ID
router.get("/:id", getStudentById);

// @route   PUT /api/students/:id
// @desc    Update student
router.put("/:id", updateStudent);

router.put("/b-update", bulkUpdateStudents);


// @route   DELETE /api/students/:id
// @desc    Delete student
router.delete("/:id", deleteStudent);

module.exports = router;
