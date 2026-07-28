const JobSchema = require("../../models/job.model");
const { notifyEligibleStudentsForJob } = require("../../utlis/placement");

const PostJob = async (req, res) => {
  try {
    const company = req.body.company;
    const jobTitle = req.body.jobTitle;
    const jobDescription = req.body.jobDescription;
    const eligibility = req.body.eligibility;
    const stipend = req.body.stipend;
    const expectedCTC = req.body.expectedCTC;
    const salary = req.body.salary; // keep for backward compatibility
    const howToApply = req.body.howToApply;
    const applicationDeadline = req.body.applicationDeadline;

    // Retrieve the new eligibility criteria fields
    const minCG = req.body.minCG || 0;
    const noBacklog = req.body.noBacklog === true || req.body.noBacklog === 'true';
    const eligibleBatches = req.body.eligibleBatches || [];
    const eligibleBranches = req.body.eligibleBranches || [];
    const companyCategory = req.body.companyCategory || 'Generic';
    const placementType = req.body.placementType || 'On-Campus';

    if (!jobTitle || !jobDescription || !company) {
      return res.status(400).json({ msg: 'Job title, job description, and company name are required.' });
    }

    const job = await JobSchema.findById(req.body._id);

    if (job) {
      await job.updateOne({
        company,
        jobTitle,
        jobDescription,
        eligibility,
        salary,
        stipend,
        expectedCTC,
        howToApply,
        applicationDeadline,
        minCG,
        noBacklog,
        eligibleBatches,
        eligibleBranches,
        companyCategory,
        placementType
      });
      res.status(201).json({ msg: 'Job Updated successfully' });
    } else {
      // Create a new job object with the eligibility criteria
      const newJob = new JobSchema({
        jobTitle,
        jobDescription,
        eligibility,
        salary,
        stipend,
        expectedCTC,
        howToApply,
        postedAt: new Date(),
        applicationDeadline,
        company,
        minCG,
        noBacklog,
        eligibleBatches,
        eligibleBranches,
        companyCategory,
        placementType
      });
      await newJob.save();
      
      // Automatically send emails to all eligible students (asynchronous/non-blocking)
      notifyEligibleStudentsForJob(newJob._id);

      return res.status(201).json({ msg: 'Job posted successfully' });
    }

  } catch (error) {
    console.log("tpo.post-job.controller.js => ", error);
    return res.status(500).json({ msg: 'Server error', error: error });
  }
}

module.exports = PostJob;