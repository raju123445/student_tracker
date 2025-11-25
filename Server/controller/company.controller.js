const Company = require("../models/company.model.js");

// --------------------------------------------
// Create Company
// --------------------------------------------
// const createCompany = async (req, res) => {
//   try {
//     const company = await Company.create(req.body);

//     res.status(201).json({
//       success: true,
//       message: "Company added successfully",
//       data: company,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };
const createCompany = async (req, res) => {
  try {
    let companies;

    // If array → bulk insert
    if (Array.isArray(req.body)) {
      companies = await Company.insertMany(req.body);
    } 
    else {
      // Single insert
      companies = await Company.create(req.body);
    }

    res.status(201).json({
      success: true,
      message: "Company data added successfully",
      data: companies,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// --------------------------------------------
// Get All Companies (with filters)
// --------------------------------------------
const getCompanies = async (req, res) => {
  try {
    const query = {};

    // Apply filters from query parameters
    if (req.query.jobType) {
      query.jobType = req.query.jobType;
    }

    if (req.query.location) {
      query.location = req.query.location;
    }

    if (req.query.companyName) {
      query.companyName = new RegExp(req.query.companyName, 'i'); // Case-insensitive search
    }

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const companies = await Company.find(query).sort({ companyName: 1 }).limit(limit).skip(skip);

    // Count total documents for pagination info
    const total = await Company.countDocuments(query);

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      page,
      pages: Math.ceil(total / limit),
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
