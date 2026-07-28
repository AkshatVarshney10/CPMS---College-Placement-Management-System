const User = require("../../models/user.model");
const JobSchema = require("../../models/job.model");
const { checkStudentEligibility } = require("../../utlis/placement");


const AllJobs = async (req, res) => {
  try {
    // Populate company to know its category for eligibility hierarchy
    const jobs = await JobSchema.find().populate('company');

    // If the logged in user is a student, filter jobs by eligibility
    if (req.user && req.user.role === 'student') {
      const student = req.user;

      // Find the categories of companies the student is hired in
      const hiredJobs = await JobSchema.find({
        "applicants": {
          $elemMatch: {
            studentId: student._id,
            status: "hired"
          }
        }
      }).populate("company");
      const hiredCategories = hiredJobs.map(j => j.company && j.company.category).filter(Boolean);

      const eligibleJobs = jobs.filter(job => {
        const check = checkStudentEligibility(student, job, hiredCategories);
        return check.eligible;
      });

      return res.json({ data: eligibleJobs });
    }

    // TPO and admin users can see all jobs
    return res.json({ data: jobs });
  } catch (error) {
    console.log("user.all-jobs.controller.js => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const DeleteJob = async (req, res) => {
  try {
    if (req.body.jobId) {
      // console.log(req.body.jobId)
      const job = await JobSchema.findById(req.body.jobId);

      // before this middleware pre will run to delete student's appliedJobs
      await job.deleteOne();
      return res.status(200).json({ msg: 'Job deleted successfully!' });
    }
  } catch (error) {
    console.log("user.all-jobs.controller.js => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}


const JobData = async (req, res) => {
  try {
    // pass if tpo is creating new post
    if (req.params.jobId !== 'undefined') {
      const job = await JobSchema.findById(req.params.jobId);
      return res.status(200).json(job);
    }
  } catch (error) {
    // checking if userId is exist or not
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'job data not found' });
    }
    console.log("user.all-jobs.controller.js => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
}

const JobWithApplicants = async (req, res) => {
  try {
    const job = await JobSchema.findById(req.params.jobId)
      .populate({
        path: 'applicants.studentId',
        select: '_id first_name last_name email' // Select only name and email fields
      });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found!' });
    }

    // Transform the applicants data for your table
    const applicantsList = job.applicants.map(applicant => ({
      id: applicant.studentId._id,
      name: applicant.studentId.first_name + " " + applicant.studentId.last_name,
      email: applicant.studentId.email,
      currentRound: applicant.currentRound,
      status: applicant.status,
      appliedAt: applicant.appliedAt,
    }));

    return res.status(200).json({ applicantsList });
  } catch (error) {
    console.log("Error fetching job with applicants => ", error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};


const StudentJobsApplied = async (req, res) => {
  try {
    // Find all jobs where the student has applied
    const appliedJobs = await JobSchema.find({ 'applicants.studentId': req.params.studentId })
      .populate('company', 'companyName') // Populates the company field to get companyName
      .select('jobTitle _id salary stipend expectedCTC applicationDeadline applicants company') // Select the required fields
      .lean(); // Use lean to return plain JS objects, making it faster for read operations
    // console.log(appliedJobs)
    // Add the number of applicants for each job
    const result = appliedJobs.map(job => {
      const applicantDetails = job.applicants.find(applicant => applicant.studentId.toString() === req.params.studentId);
      return {
        jobTitle: job.jobTitle,
        jobId: job._id,
        salary: job.salary,
        stipend: job.stipend,
        expectedCTC: job.expectedCTC,
        applicationDeadline: job.applicationDeadline,
        companyName: job.company.companyName,
        numberOfApplicants: job.applicants.length, // Count number of applicants
        appliedAt: applicantDetails.appliedAt, // Fetch the appliedAt date for this student
        status: applicantDetails.status // Fetch the status for this student's application
      };
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching student applied jobs => ", error);
    return res.status(500).json({ msg: 'Server error' });
  }
};




const DownloadApplicantsCSV = async (req, res) => {
  try {
    const job = await JobSchema.findById(req.params.jobId)
      .populate({
        path: 'applicants.studentId',
        select: 'first_name middle_name last_name email number gender studentProfile'
      });

    if (!job) {
      return res.status(404).json({ msg: 'Job not found!' });
    }

    // CSV Headers
    const headers = [
      'Roll Number',
      'UIN',
      'Student Name',
      'Email',
      'Phone Number',
      'Gender',
      'Department',
      'Graduation Year (Batch)',
      'CGPA',
      'Active Backlogs (liveKT)',
      'Has NOC',
      'Application Status',
      'Applied At'
    ];

    const rows = [];

    for (const applicant of job.applicants) {
      const student = applicant.studentId;
      if (!student) continue;

      const profile = student.studentProfile || {};
      
      // Compute CGPA: use stored cgpa, otherwise calculate average of non-zero SGPAs
      let cgpa = profile.cgpa || 0;
      if (!cgpa && profile.SGPA) {
        const sgpas = [
          profile.SGPA.sem1,
          profile.SGPA.sem2,
          profile.SGPA.sem3,
          profile.SGPA.sem4,
          profile.SGPA.sem5,
          profile.SGPA.sem6,
          profile.SGPA.sem7,
          profile.SGPA.sem8
        ].filter(val => typeof val === 'number' && val > 0);
        if (sgpas.length > 0) {
          cgpa = sgpas.reduce((a, b) => a + b, 0) / sgpas.length;
        }
      }

      const row = [
        profile.rollNumber || 'N/A',
        profile.UIN || 'N/A',
        `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.trim().replace(/\s+/g, ' '),
        student.email || 'N/A',
        student.number || 'N/A',
        student.gender || 'N/A',
        profile.department || 'N/A',
        profile.graduationYear || (profile.addmissionYear ? `${profile.addmissionYear + 4}` : 'N/A'),
        cgpa ? cgpa.toFixed(2) : '0.00',
        profile.liveKT !== undefined ? profile.liveKT : 0,
        profile.hasNOC === true ? 'Yes' : 'No',
        applicant.status || 'N/A',
        applicant.appliedAt ? new Date(applicant.appliedAt).toLocaleDateString('en-IN') : 'N/A'
      ];

      rows.push(row);
    }

    // Build the CSV string, escaping double quotes inside cell values
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${String(val).replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const safeTitle = job.jobTitle.replace(/[^a-zA-Z0-9]/g, '_');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${safeTitle}_applied_students.csv"`);
    
    return res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error generating applicants CSV:', error);
    return res.status(500).json({ msg: 'Server Error' });
  }
};


module.exports = {
  AllJobs,
  DeleteJob,
  JobData,
  JobWithApplicants,
  StudentJobsApplied,
  DownloadApplicantsCSV
};