const User = require('../../models/user.model');
const Job = require('../../models/job.model');

const GetDetailedPlacementStats = async (req, res) => {
  try {
    // Check role authorization
    const callerRole = req.user?.role;
    if (!['superuser', 'management_admin', 'tpo_admin'].includes(callerRole)) {
      return res.status(403).json({ msg: 'Unauthorized: Access restricted to admins, management and TPOs.' });
    }

    // Fetch all jobs and map them by ID
    const jobs = await Job.find().lean();
    const jobsMap = {};
    jobs.forEach(job => {
      jobsMap[job._id.toString()] = job;
    });

    // Fetch all students
    const students = await User.find({ role: 'student' }).lean();

    const result = {};

    students.forEach(student => {
      let rollNoStr = student.studentProfile?.rollNumber?.toString() || '';
      let batch = 'Unknown Batch';
      let branch = student.studentProfile?.department || 'Unknown Branch';
      
      // Parse roll number based on format YYBRR (e.g., 23156 -> 23 batch, 1 branch, 56 roll)
      if (rollNoStr.length >= 4) {
        batch = '20' + rollNoStr.substring(0, 2) + ' Batch';
        // Branch could be derived from the 3rd digit, but it's better to use the department string
        // The user said "from roll number we can get the info of the student's batch, branch and actual roll number"
        // Since we already have department in the model, we can just use department for branch grouping 
        // to avoid mapping numbers to branch strings manually. Or we can just use department directly.
      }

      if (!result[batch]) {
        result[batch] = {};
      }
      
      if (!result[batch][branch]) {
        result[batch][branch] = [];
      }

      // Collect placement info
      const hiredApps = (student.studentProfile?.appliedJobs || []).filter(app => app.status === 'hired');
      const reportedPlacements = (student.studentProfile?.reportedPlacements || []);
      const internships = (student.studentProfile?.internships || []);

      const placements = [];

      hiredApps.forEach(app => {
        const job = jobsMap[app.jobId?.toString()];
        placements.push({
          company: job?.companyName || 'Unknown',
          package: app.package || job?.expectedCTC || job?.salary || null,
          monthlyStipend: job?.stipend || null,
          role: job?.role || job?.title || 'N/A',
          campusType: job?.placementType || 'On-Campus'
        });
      });

      reportedPlacements.forEach(rp => {
        placements.push({
          company: rp.companyName || 'Unknown',
          package: rp.package || null,
          monthlyStipend: null, // Reported placements usually don't have stipend in the current schema
          role: 'N/A',
          campusType: rp.placementType || 'Off-Campus'
        });
      });

      // Also get stipend from internships if any
      let maxInternshipStipend = null;
      internships.forEach(internship => {
        if (internship.monthlyStipend > (maxInternshipStipend || 0)) {
          maxInternshipStipend = internship.monthlyStipend;
        }
      });

      const hasMultipleOffers = placements.length > 1;
      const isPlaced = placements.length > 0;
      
      let primaryPlacement = isPlaced ? placements[0] : {};
      let secondaryPlacement = hasMultipleOffers ? placements[1] : {};

      // If no placement stipend, use internship stipend
      if (!primaryPlacement.monthlyStipend && maxInternshipStipend) {
        primaryPlacement.monthlyStipend = maxInternshipStipend;
      }

      result[batch][branch].push({
        rollNumber: rollNoStr,
        studentName: `${student.first_name || ''} ${student.last_name || ''}`.trim(),
        remark: isPlaced ? 'Placed' : 'Unplaced',
        company: primaryPlacement.company || '-',
        packageLPA: primaryPlacement.package || '-',
        monthlyStipend: primaryPlacement.monthlyStipend || '-',
        designation: primaryPlacement.role || '-',
        campusType: primaryPlacement.campusType || '-',
        multipleOffers: hasMultipleOffers ? 'Yes' : 'No',
        secondCompany: secondaryPlacement.company || '-',
        secondPackageLPA: secondaryPlacement.package || '-'
      });
    });

    return res.status(200).json({ detailedStats: result });
  } catch (error) {
    console.error("Error generating detailed placement stats => ", error);
    return res.status(500).json({ msg: 'Server error generating detailed stats' });
  }
};

module.exports = {
  GetDetailedPlacementStats
};
