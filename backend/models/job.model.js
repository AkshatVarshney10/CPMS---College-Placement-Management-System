const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const jobSchema = new mongoose.Schema({
  jobTitle: { type: String, required: true },
  jobDescription: { type: String, required: true },
  eligibility: { type: String },
  salary: { type: Number },
  stipend: { type: Number }, // in Rs. per month
  expectedCTC: { type: Number }, // in LPA
  howToApply: { type: String },
  postedAt: { type: Date, default: Date.now },
  applicationDeadline: { type: Date },
  // Eligibility criteria fields
  minCG: { type: Number, default: 0 },
  noBacklog: { type: Boolean, default: false },
  eligibleBatches: [{ type: Number }], // e.g., [2027, 2028, 2029, 2030]
  eligibleBranches: [{ type: String }], // e.g., ['CSE', 'IT', 'ECE', 'CSE with DS', 'CSE with Cyber security']
  companyCategory: { type: String, enum: ['Generic', 'Core', 'Dream'], default: 'Generic' },
  placementType: { type: String, enum: ['On-Campus', 'Off-Campus'], default: 'On-Campus' },
  // company details
  company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  // applicants details
  applicants: [
    {
      studentId: { type: Schema.Types.ObjectId, ref: 'Users' },
      currentRound: {
        type: String,
        enum: ['Aptitude Test', 'Technical Interview', 'HR Interview', 'Group Discussion']
      },
      roundStatus: { type: String, enum: ['pending', 'passed', 'failed'] },
      selectionDate: { type: Date },
      joiningDate: { type: Date },
      offerLetter: { type: String },
      status: { type: String, enum: ['applied', 'interview', 'hired', 'rejected'], default: 'applied' },
      appliedAt: { type: Date, default: Date.now }
    }
  ]
});


// Middleware to delete the jobId from user's appliedJobs array before deleting the job
jobSchema.pre('deleteOne', { document: true, query: false }, async function () {
  try {
    const jobId = this._id; // Get the current job's ID

    const User = mongoose.model('Users');

    // Remove the jobId from all users' appliedJobs array
    await User.updateMany(
      { 'studentProfile.appliedJobs.jobId': jobId }, // Find users who applied to this job
      { $pull: { 'studentProfile.appliedJobs': { jobId: jobId } } } // Remove the jobId from appliedJobs array
    );
  } catch (error) {
    console.error("Error in job pre-deleteOne middleware:", error);
    throw error;
  }
});


module.exports = mongoose.model('Job', jobSchema);
