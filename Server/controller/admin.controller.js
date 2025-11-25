// controllers/adminController.js
const Admin = require("../models/admin.model.js");
const generateToken = require("../utils/generateToken.js");

// ------------------------------------------------------
// Register New Admin
// ------------------------------------------------------
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const admin = await Admin.create({ name, email, password, role });

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      data: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ------------------------------------------------------
// Login Admin
// ------------------------------------------------------
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


// ------------------------------------------------------
// Get Admin Profile
// ------------------------------------------------------
const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.status(200).json({
      success: true,
      data: admin,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  registerAdmin,
  loginAdmin,
  getAdminProfile,
};
