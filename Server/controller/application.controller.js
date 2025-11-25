const Application = require("../models/applications.model.js");
const Student = require("../models/student.model.js");
const Company = require("../models/company.model.js");

// --------------------------------------------
// Create Application
// --------------------------------------------
const createApplication = async (req, res) => {
  try {
    const { studentId, companyId } = req.body;

    // Validate student & company
    const student = await Student.findById(studentId);
    const company = await Company.findById(companyId);

    if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });

    const application = await Application.create(req.body);

    res.status(201).json({
      success: true,
      message: "Application submitted",
      data: application,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Get All Applications
// --------------------------------------------
const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("studentId", "name usn branch sem")
      .populate("companyId", "companyName jobRole ctc");

    res.status(200).json({
      success: true,
      count: applications.length,
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
      .populate("studentId")
      .populate("companyId");

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
      { new: true }
    );

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
