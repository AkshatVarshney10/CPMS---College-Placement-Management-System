const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const JobSchema = require('./job.model');

const companySchema = new Schema({
  companyName: { type: String, required: true },
  companyDescription: { type: String },
  companyWebsite: { type: String },
  companyLocation: { type: String, trim: true },
  // Category of the company (Generic, Core, or Dream) used for student eligibility check
  category: { type: String, enum: ['Generic', 'Core', 'Dream'], default: 'Generic' },
  hrName: { type: String, trim: true },
  hrPhone: { type: String, trim: true },
  hrEmail: { type: String, trim: true },
  hrLinkedin: { type: String, trim: true }
});


// Pre middleware to delete jobs when the company is deleted
companySchema.pre('deleteOne', { document: true, query: false }, async function () {
  try {
    const companyId = this._id; // Get the current company's ID

    // Dynamically load the Job model to avoid circular dependency
    const Job = mongoose.model('Job');

    // Delete all jobs associated with this company
    await Job.deleteMany({ company: companyId });
  } catch (error) {
    console.error("Error in company pre-deleteOne middleware:", error);
    throw error;
  }
});


module.exports = mongoose.model('Company', companySchema);
