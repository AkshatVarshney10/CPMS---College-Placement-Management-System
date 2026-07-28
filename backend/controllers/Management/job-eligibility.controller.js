const mongoose = require("mongoose");
const Job = require("../../models/job.model");
const User = require("../../models/user.model");
const { checkStudentEligibility } = require("../../utlis/placement");

const GetJobEligibilityReport = async (req, res) => {
  try {
    // 1. Role Authorization Check
    if (req.user.role !== "management_admin" && req.user.role !== "superuser") {
      return res.status(403).json({ msg: "Access Denied. Management or Superuser only." });
    }

    // 2. Fetch all jobs with populated company details
    const jobs = await Job.find({}).populate("company");
    
    // 3. Fetch all student users
    const students = await User.find({ role: "student" });

    // 4. Precompute hired categories for each student to speed up checks
    const studentHiredCategoriesMap = {};
    for (const student of students) {
      const hiredJobs = await Job.find({
        "applicants": {
          $elemMatch: {
            studentId: student._id,
            status: "hired"
          }
        }
      }).populate("company");
      
      studentHiredCategoriesMap[student._id.toString()] = hiredJobs
        .map(j => j.company && j.company.category)
        .filter(Boolean);
    }

    // 5. Generate report for each job
    const report = [];

    for (const job of jobs) {
      const eligibleList = [];
      const appliedList = [];

      for (const student of students) {
        const studentIdStr = student._id.toString();

        // Check if student applied to this job
        const applicantInfo = job.applicants.find(
          app => app.studentId && app.studentId.toString() === studentIdStr
        );

        if (applicantInfo) {
          appliedList.push({
            _id: student._id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            number: student.number,
            rollNumber: student.studentProfile?.rollNumber,
            department: student.studentProfile?.department,
            cgpa: student.studentProfile?.cgpa,
            liveKT: student.studentProfile?.liveKT,
            appliedAt: applicantInfo.appliedAt,
            status: applicantInfo.status,
            currentRound: applicantInfo.currentRound,
            roundStatus: applicantInfo.roundStatus
          });
        }

        // Check eligibility
        const hiredCategories = studentHiredCategoriesMap[studentIdStr] || [];
        const check = checkStudentEligibility(student, job, hiredCategories);
        if (check.eligible) {
          eligibleList.push({
            _id: student._id,
            first_name: student.first_name,
            last_name: student.last_name,
            email: student.email,
            number: student.number,
            rollNumber: student.studentProfile?.rollNumber,
            department: student.studentProfile?.department,
            cgpa: student.studentProfile?.cgpa,
            liveKT: student.studentProfile?.liveKT,
            hasNOC: student.studentProfile?.hasNOC
          });
        }
      }

      report.push({
        jobId: job._id,
        jobTitle: job.jobTitle,
        companyName: job.company?.companyName || "Unknown Company",
        companyCategory: job.companyCategory || job.company?.category || "Generic",
        minCG: job.minCG,
        noBacklog: job.noBacklog,
        eligibleBatches: job.eligibleBatches,
        eligibleBranches: job.eligibleBranches,
        eligibleStudents: eligibleList,
        appliedStudents: appliedList
      });
    }

    return res.json({ report });
  } catch (error) {
    console.error("Error in GetJobEligibilityReport controller:", error);
    return res.status(500).json({ msg: "Server Error", error: error.message });
  }
};

module.exports = {
  GetJobEligibilityReport
};
