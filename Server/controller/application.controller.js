const Application = require("../models/applications.model.js");
const Student = require("../models/student.model.js");
const Company = require("../models/company.model.js");
const mongoose = require('mongoose');

// --------------------------------------------
// Create Application
// --------------------------------------------
const createApplication = async (req, res) => {
  try {
    let applications = [];

    // CASE 1: Bulk insert (Array of objects)
    if (Array.isArray(req.body)) {
      const appArray = req.body;

      // Validate all studentId & companyId first
      for (const app of appArray) {
        const student = await Student.findById(app.studentId);
        const company = await Company.findById(app.companyId);

        if (!student) {
          return res.status(404).json({
            success: false,
            message: `Student not found for ID: ${app.studentId}`
          });
        }

        if (!company) {
          return res.status(404).json({
            success: false,
            message: `Company not found for ID: ${app.companyId}`
          });
        }
      }

      // Insert all at once
      applications = await Application.insertMany(appArray);
    }

    // CASE 2: Single insert (Object)
    else {
      const { studentId, companyId } = req.body;

      const student = await Student.findById(studentId);
      const company = await Company.findById(companyId);

      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found"
        });
      }

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found"
        });
      }

      applications = await Application.create(req.body);
    }

    res.status(201).json({
      success: true,
      message: "Application(s) submitted successfully",
      data: applications,
    });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------------------------------
// Get All Applications (with filters and pagination)
// --------------------------------------------
const getApplications = async (req, res) => {
  try {
    // Build match conditions for aggregation pipeline
    const matchConditions = {};

    // Direct application filters
    if (req.query.studentId) {
      matchConditions.studentId = mongoose.Types.ObjectId.isValid(req.query.studentId) 
        ? new mongoose.Types.ObjectId(req.query.studentId) 
        : req.query.studentId;
    }

    if (req.query.companyId || req.query.company) {
      const companyId = req.query.companyId || req.query.company;
      matchConditions.companyId = mongoose.Types.ObjectId.isValid(companyId) 
        ? new mongoose.Types.ObjectId(companyId) 
        : companyId;
    }

    if (req.query.status) {
      matchConditions.status = req.query.status;
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

    // Build aggregation pipeline
    const pipeline = [];

    // Step 1: Match applications with direct filters
    if (Object.keys(matchConditions).length > 0) {
      pipeline.push({ $match: matchConditions });
    }

    // Step 2: Lookup students
    pipeline.push({
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student'
      }
    });

    // Step 3: Unwind student
    pipeline.push({ $unwind: '$student' });

    // Step 4: Match students with filters
    if (Object.keys(studentMatch).length > 0) {
      const studentMatchFixed = {};
      Object.keys(studentMatch).forEach(key => {
        studentMatchFixed[`student.${key}`] = studentMatch[key];
      });
      pipeline.push({ $match: studentMatchFixed });
    }

    // Step 5: Lookup companies
    pipeline.push({
      $lookup: {
        from: 'companies',
        localField: 'companyId',
        foreignField: '_id',
        as: 'company'
      }
    });

    // Step 6: Unwind company
    pipeline.push({ $unwind: '$company' });

    // Step 7: Match companies with filters
    if (Object.keys(companyMatch).length > 0) {
      const companyMatchFixed = {};
      Object.keys(companyMatch).forEach(key => {
        companyMatchFixed[`company.${key}`] = companyMatch[key];
      });
      pipeline.push({ $match: companyMatchFixed });
    }

    // Step 8: Create count pipeline before adding projection/sort (more efficient)
    const countPipeline = [...pipeline, { $count: 'total' }];

    // Step 9: Project and format the result
    pipeline.push({
      $project: {
        _id: 1,
        status: 1,
        appliedAt: 1,
        rounds: 1,
        remarks: 1,
        updatedAt: 1,
        studentId: {
          _id: '$student._id',
          name: '$student.name',
          usn: '$student.usn',
          course: '$student.course',
          sem: '$student.sem',
          branch: '$student.branch',
          email: '$student.email',
          mobileNumber: '$student.mobileNumber'
        },
        companyId: {
          _id: '$company._id',
          companyName: '$company.companyName',
          jobRole: '$company.jobRole',
          jobType: '$company.jobType',
          ctc: '$company.ctc',
          location: '$company.location',
          recruitmentDate: '$company.recruitmentDate'
        }
      }
    });

    // Step 10: Sort by appliedAt (newest first)
    pipeline.push({ $sort: { appliedAt: -1 } });

    // Step 11: Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Execute count and data queries in parallel for better performance
    const dataPipeline = [...pipeline, { $skip: skip }, { $limit: limit }];

    const [countResult, applications] = await Promise.all([
      Application.aggregate(countPipeline),
      Application.aggregate(dataPipeline)
    ]);

    const total = countResult.length > 0 ? countResult[0].total : 0;

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: applications,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Get Application By ID
// --------------------------------------------
const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("studentId", "name usn course sem branch email mobileNumber")
      .populate("companyId", "companyName jobRole jobType ctc location recruitmentDate");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Update Application (status, rounds, remarks)
// --------------------------------------------
const updateApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate("studentId", "name usn course sem branch email mobileNumber")
      .populate("companyId", "companyName jobRole jobType ctc location recruitmentDate");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({
      success: true,
      message: "Application updated",
      data: application,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Delete Application
// --------------------------------------------
const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    res.status(200).json({ success: true, message: "Application removed" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
};
