// routes/studentRoutes.js
const express = require("express");
const {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent
} = require( "../controller/student.controller.js");

const router = express.Router();

// @route   POST /api/students
// @desc    Create new student
router.post("/", createStudent);

// @route   GET /api/students
// @desc    Get all students (with filters: sem, branch)
router.get("/", getStudents);

// @route   GET /api/students/:id
// @desc    Get single student by ID
router.get("/:id", getStudentById);

// @route   PUT /api/students/:id
// @desc    Update student
router.put("/:id", updateStudent);

// @route   DELETE /api/students/:id
// @desc    Delete student
router.delete("/:id", deleteStudent);

module.exports = router;
