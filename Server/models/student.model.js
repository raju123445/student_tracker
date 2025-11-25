const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email'
    ]
  },
  mobileNumber: {
    type: String,
    required: true,
    unique: true, // Ensures no two users have the same mobile number
    trim: true, // Removes whitespace from both ends of the string
    // You can add a regex for validation if needed
    match: [/^(\+\d{1,3}[- ]?)?\d{10}$/, 'Please fill a valid mobile number']
  },
  usn:{
    type: String,
    required: [true, 'USN is required'],
    unique: true,
    trim: true,
    uppercase: true,
    match: [
  /^[A-Z0-9]{1}[A-Z]{2}\d{2}[A-Z]{2}\d{3}$/,
  'Please enter a valid USN (e.g., 4VZ22CS001)'
]

  },
  course :{
    type: String,
    required: [true, 'Course is required'],
    trim: true,
    maxlength: [100, 'Course cannot exceed 100 characters']
  },
  sem:{
    type: Number,
    required: [true, 'Semester is required'],
    min: [1, 'Semester cannot be less than 1'],
    max: [8, 'Semester cannot be more than 8']
  },
  branch: {
    type: String, // Add branch field
    required: [true, 'Branch is required'],
    trim: true
  },
  role: {
    type: String,
    default: 'student'
  }
});

// Add indexes for better query performance
studentSchema.index({ sem: 1 });
studentSchema.index({ course: 1 });
studentSchema.index({ sem: 1, course: 1 }); // Compound index for common filter combinations
studentSchema.index({ branch: 1 });

module.exports = mongoose.model('Student', studentSchema);