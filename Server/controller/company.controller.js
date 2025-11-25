const Company = require("../models/company.model.js");

// --------------------------------------------
// Create Company
// --------------------------------------------
const createCompany = async (req, res) => {
  try {
    const company = await Company.create(req.body);

    res.status(201).json({
      success: true,
      message: "Company added successfully",
      data: company,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Get All Companies
// --------------------------------------------
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ companyName: 1 });

    res.status(200).json({
      success: true,
      count: companies.length,
      data: companies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Get Company By ID
// --------------------------------------------
const getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, data: company });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Update Company
// --------------------------------------------
const updateCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: company,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// --------------------------------------------
// Delete Company
// --------------------------------------------
const deleteCompany = async (req, res) => {
  try {
    const company = await Company.findByIdAndDelete(req.params.id);

    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }

    res.status(200).json({ success: true, message: "Company removed successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
