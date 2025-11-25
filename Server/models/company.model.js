const mongoose = require('mongoose');

const CompanySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    trim: true
  },

  jobRole: {
    type: String,
    required: true
  },

  jobType: {
    type: String,
    enum: ["Full-Time", "Internship", "Full-Time + Internship"],
    required: true
  },

  ctc: {
    type: String, // “7 LPA”
    required: true
  },

  location: {
    type: String,
    default: "Multiple"
  },

  eligibilityCriteria: {
    cgpa: { type: Number, default: 0 },
    backlogAllowed: { type: Boolean, default: true }
  },

  recruitmentDate: {
    type: Date,
    required: true
  },

  createdAt: { type: Date, default: Date.now }
});

const Company = mongoose.model('Company', CompanySchema);
module.exports = Company;