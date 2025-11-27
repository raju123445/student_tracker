const Student = require("../models/student.model.js");

// Create Student
const createStudent = async (req, res) => {
  try {
    let students;

    // If req.body is an array → insertMany
    if (Array.isArray(req.body)) {
      students = await Student.insertMany(req.body);
    }
    else {
      // If req.body is a single object → create
      students = await Student.create(req.body);
    }

    res.status(201).json({
      success: true,
      message: "Student(s) created successfully",
      data: students
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Students (with filters)
// /api/students?branch=CSE&sem=7
// --------------------------------------------
const getStudents = async (req, res) => {
  try {
    const query = {};

    if (req.query.branch) {
      query.branch = req.query.branch;
    }

    if (req.query.sem) {
      query.sem = Number(req.query.sem);
    }

    if (req.query.course) {
      query.course = req.query.course;
    }

    // Additional filters for dashboard
    if (req.query.usn) {
      query.usn = req.query.usn;
    }

    if (req.query.name) {
      query.name = new RegExp(req.query.name, 'i'); // Case-insensitive search
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const students = await Student.find(query).sort({ name: 1 }).limit(limit).skip(skip);

    // Count total documents for pagination info
    const total = await Student.countDocuments(query);

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student By ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Student By USN
const getStudentByUSN = async (req, res) => {
  try {
    const { usn } = req.params;

    const student = await Student.findOne({ usn: usn.toUpperCase() });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update Student

const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: student
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Bulk_update

const bulkUpdateStudents = async (req, res) => {
  try {
    // req.body must contain the fields you want to update
    const updateFields = req.body;

    if (!updateFields || Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No update fields provided",
      });
    }

    const result = await Student.updateMany({}, { $set: updateFields });

    res.status(200).json({
      success: true,
      message: "Bulk update completed successfully",
      matched: result.matchedCount,
      modified: result.modifiedCount,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete Student

const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Student deleted successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Dashboard Analytics
const getDashboardStats = async (req, res) => {
  try {
    const Application = require('../models/applications.model.js');
    const Company = require('../models/company.model.js');
    const mongoose = require('mongoose');

    // Build filter pipeline for applications
    const applicationMatch = {};
    if (req.query.status) {
      applicationMatch.status = req.query.status;
    }
    if (req.query.companyId || req.query.company) {
      const companyId = req.query.companyId || req.query.company;
      applicationMatch.companyId = mongoose.Types.ObjectId.isValid(companyId) 
        ? new mongoose.Types.ObjectId(companyId) 
        : companyId;
    }

    // Build student filter conditions
    const studentMatch = {};
    if (req.query.sem) {
      studentMatch.sem = parseInt(req.query.sem);
    }
    if (req.query.course) {
      studentMatch.course = req.query.course;
    }

    // Build company filter conditions
    const companyMatch = {};
    if (req.query.jobType) {
      companyMatch.jobType = req.query.jobType;
    }
    if (req.query.recruitmentMonth) {
      const recruitmentDate = new Date(req.query.recruitmentMonth);
      companyMatch.recruitmentDate = {
        $gte: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth(), 1),
        $lt: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth() + 1, 1)
      };
    }

    // Build aggregation pipeline for filtered counts
    const statsPipeline = [
      { $match: applicationMatch },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' }
    ];

    // Add student filters
    if (Object.keys(studentMatch).length > 0) {
      const studentMatchFixed = {};
      Object.keys(studentMatch).forEach(key => {
        studentMatchFixed[`student.${key}`] = studentMatch[key];
      });
      statsPipeline.push({ $match: studentMatchFixed });
    }

    // Add company filters
    if (Object.keys(companyMatch).length > 0) {
      const companyMatchFixed = {};
      Object.keys(companyMatch).forEach(key => {
        companyMatchFixed[`company.${key}`] = companyMatch[key];
      });
      statsPipeline.push({ $match: companyMatchFixed });
    }

    // Get filtered application counts
    const [filteredApplications, filteredSelected] = await Promise.all([
      Application.aggregate([...statsPipeline, { $count: 'total' }]),
      Application.aggregate([...statsPipeline, { $match: { status: 'Selected' } }, { $count: 'total' }])
    ]);

    // Get student count with filters
    const studentQuery = {};
    if (req.query.sem) studentQuery.sem = parseInt(req.query.sem);
    if (req.query.course) studentQuery.course = req.query.course;
    const totalStudents = await Student.countDocuments(studentQuery);

    // Get company count with filters
    const companyQuery = {};
    if (req.query.jobType) companyQuery.jobType = req.query.jobType;
    if (req.query.recruitmentMonth) {
      const recruitmentDate = new Date(req.query.recruitmentMonth);
      companyQuery.recruitmentDate = {
        $gte: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth(), 1),
        $lt: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth() + 1, 1)
      };
    }
    const totalCompanies = await Company.countDocuments(companyQuery);

    const totalApplications = filteredApplications.length > 0 ? filteredApplications[0].total : 0;
    const totalSelected = filteredSelected.length > 0 ? filteredSelected[0].total : 0;

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalCompanies,
        totalApplications,
        totalSelected
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Company-wise Selections
const getCompanySelections = async (req, res) => {
  try {
    const Application = require('../models/applications.model.js');
    const mongoose = require('mongoose');

    // Build filter pipeline
    const matchConditions = { status: 'Selected' };
    
    if (req.query.companyId || req.query.company) {
      const companyId = req.query.companyId || req.query.company;
      matchConditions.companyId = mongoose.Types.ObjectId.isValid(companyId) 
        ? new mongoose.Types.ObjectId(companyId) 
        : companyId;
    }

    const pipeline = [
      { $match: matchConditions },
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $lookup: {
          from: 'companies',
          localField: 'companyId',
          foreignField: '_id',
          as: 'company'
        }
      },
      { $unwind: '$company' }
    ];

    // Add student filters
    const studentMatch = {};
    if (req.query.sem) {
      studentMatch[`student.sem`] = parseInt(req.query.sem);
    }
    if (req.query.course) {
      studentMatch[`student.course`] = req.query.course;
    }
    if (Object.keys(studentMatch).length > 0) {
      pipeline.push({ $match: studentMatch });
    }

    // Add company filters
    const companyMatch = {};
    if (req.query.jobType) {
      companyMatch[`company.jobType`] = req.query.jobType;
    }
    if (req.query.recruitmentMonth) {
      const recruitmentDate = new Date(req.query.recruitmentMonth);
      companyMatch[`company.recruitmentDate`] = {
        $gte: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth(), 1),
        $lt: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth() + 1, 1)
      };
    }
    if (Object.keys(companyMatch).length > 0) {
      pipeline.push({ $match: companyMatch });
    }

    // Group by company
    pipeline.push({
      $group: {
        _id: '$companyId',
        companyName: { $first: '$company.companyName' },
        selectedCount: { $sum: 1 }
      }
    });

    pipeline.push({ $sort: { selectedCount: -1 } });

    const selections = await Application.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: selections
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Status Distribution
const getStatusDistribution = async (req, res) => {
  try {
    const Application = require('../models/applications.model.js');
    const mongoose = require('mongoose');

    // Build filter pipeline
    const matchConditions = {};
    
    if (req.query.companyId || req.query.company) {
      const companyId = req.query.companyId || req.query.company;
      matchConditions.companyId = mongoose.Types.ObjectId.isValid(companyId) 
        ? new mongoose.Types.ObjectId(companyId) 
        : companyId;
    }
    if (req.query.status) {
      matchConditions.status = req.query.status;
    }

    const pipeline = [];

    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Lookup students
    pipeline.push({
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student'
      }
    });
    pipeline.push({ $unwind: '$student' });

    // Lookup companies
    pipeline.push({
      $lookup: {
        from: 'companies',
        localField: 'companyId',
        foreignField: '_id',
        as: 'company'
      }
    });
    pipeline.push({ $unwind: '$company' });

    // Add student filters
    const studentMatch = {};
    if (req.query.sem) {
      studentMatch[`student.sem`] = parseInt(req.query.sem);
    }
    if (req.query.course) {
      studentMatch[`student.course`] = req.query.course;
    }
    if (Object.keys(studentMatch).length > 0) {
      pipeline.push({ $match: studentMatch });
    }

    // Add company filters
    const companyMatch = {};
    if (req.query.jobType) {
      companyMatch[`company.jobType`] = req.query.jobType;
    }
    if (req.query.recruitmentMonth) {
      const recruitmentDate = new Date(req.query.recruitmentMonth);
      companyMatch[`company.recruitmentDate`] = {
        $gte: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth(), 1),
        $lt: new Date(recruitmentDate.getFullYear(), recruitmentDate.getMonth() + 1, 1)
      };
    }
    if (Object.keys(companyMatch).length > 0) {
      pipeline.push({ $match: companyMatch });
    }

    // Group by status
    pipeline.push({
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    });

    const statusCounts = await Application.aggregate(pipeline);

    res.status(200).json({
      success: true,
      data: statusCounts
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  getStudentByUSN,  // Add this export
  updateStudent,
  deleteStudent,
  getDashboardStats,  // Add this export
  getCompanySelections,  // Add these exports
  getStatusDistribution , // Add this export
  bulkUpdateStudents
};
