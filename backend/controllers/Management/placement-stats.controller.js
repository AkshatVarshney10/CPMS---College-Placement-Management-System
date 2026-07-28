const User = require('../../models/user.model');
const Job = require('../../models/job.model');

const GetPlacementStats = async (req, res) => {
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

    // Group students by branch
    const branchGroups = {};
    students.forEach(student => {
      const branch = student.studentProfile?.department || 'Unknown';
      if (!branchGroups[branch]) {
        branchGroups[branch] = [];
      }
      branchGroups[branch].push(student);
    });

    // Helper functions for stats
    const calculateAvg = arr => arr.length ? parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2)) : 0;
    const calculateHighest = arr => arr.length ? Math.max(...arr) : 0;
    const calculateLowest = arr => arr.length ? Math.min(...arr) : 0;
    const calculateMedian = arr => {
      if (!arr.length) return 0;
      const sorted = [...arr].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      return sorted.length % 2 !== 0 ? sorted[mid] : parseFloat(((sorted[mid - 1] + sorted[mid]) / 2).toFixed(2));
    };

    const branchStats = [];

    // Process stats for each branch
    Object.keys(branchGroups).forEach(branchName => {
      const branchStudents = branchGroups[branchName];
      const totalStrength = branchStudents.length;
      let placedCount = 0;
      let unplacedCount = 0;
      let multipleOffersCount = 0;
      let onCampusCount = 0;
      let offCampusCount = 0;

      const packages = []; // LPA
      const stipends = []; // INR/mo

      branchStudents.forEach(student => {
        const hiredApps = (student.studentProfile?.appliedJobs || []).filter(app => app.status === 'hired');
        const reportedPlacements = (student.studentProfile?.reportedPlacements || []);
        
        const totalPlacements = hiredApps.length + reportedPlacements.length;

        if (totalPlacements > 0) {
          placedCount++;
          if (totalPlacements > 1) {
            multipleOffersCount++;
          }

          hiredApps.forEach(app => {
            const job = jobsMap[app.jobId?.toString()];
            const placementType = job?.placementType || 'On-Campus';

            if (placementType === 'On-Campus') {
              onCampusCount++;
            } else {
              offCampusCount++;
            }

            // Package CTC (LPA)
            const ctc = app.package || job?.expectedCTC || job?.salary || 0;
            if (ctc > 0) {
              packages.push(ctc);
            }

            // Stipend (INR)
            const stipend = job?.stipend || 0;
            if (stipend > 0) {
              stipends.push(stipend);
            }
          });

          reportedPlacements.forEach(rp => {
            if (rp.placementType === 'On-Campus') {
              onCampusCount++;
            } else {
              offCampusCount++;
            }
            if (rp.package > 0) packages.push(rp.package);
          });

        } else {
          unplacedCount++;
        }

        // Also add stipends from the separate internships array
        const internships = student.studentProfile?.internships || [];
        internships.forEach(internship => {
          if (internship.monthlyStipend > 0) {
            stipends.push(internship.monthlyStipend);
          }
        });
      });

      const percentPlaced = totalStrength > 0 ? parseFloat(((placedCount / totalStrength) * 100).toFixed(2)) : 0;

      branchStats.push({
        branch: branchName,
        totalStrength,
        placed: placedCount,
        unplaced: unplacedCount,
        percentPlaced,
        onCampus: onCampusCount,
        offCampus: offCampusCount,
        multipleOffers: multipleOffersCount,
        // CTC stats
        avgLPA: calculateAvg(packages),
        highestLPA: calculateHighest(packages),
        lowestLPA: calculateLowest(packages),
        medianLPA: calculateMedian(packages),
        // Stipend stats
        avgStipend: calculateAvg(stipends),
        highestStipend: calculateHighest(stipends),
        lowestStipend: calculateLowest(stipends),
        medianStipend: calculateMedian(stipends)
      });
    });

    return res.status(200).json({ branchStats });
  } catch (error) {
    console.error("Error generating placement stats => ", error);
    return res.status(500).json({ msg: 'Server error generating stats' });
  }
};

module.exports = {
  GetPlacementStats
};
