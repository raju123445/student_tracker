const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true
  },

  status: {
    type: String,
    enum: ["Applied", "Shortlisted", "Selected", "Rejected", "In Process"],
    default: "Applied"
  },

  appliedAt: {
    type: Date,
    default: Date.now
  },

  // For detailed tracking
  rounds: [
    {
      roundName: String,      // "Aptitude", "Technical 1"
      result: String,         // "Pass", "Fail", "Pending"
      date: Date
    }
  ],

  remarks: String,

  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for better query performance
ApplicationSchema.index({ studentId: 1 });
ApplicationSchema.index({ companyId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ appliedAt: -1 });
ApplicationSchema.index({ studentId: 1, companyId: 1, status: 1 }); // Compound index for common queries

const Application = mongoose.model('Application', ApplicationSchema);
module.exports = Application;