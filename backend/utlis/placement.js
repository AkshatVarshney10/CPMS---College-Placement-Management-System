const mongoose = require("mongoose");
const sendMail = require("../config/Nodemailer");

/**
 * Normalizes department/branch names to allow flexible matching.
 * e.g., "Computer" -> "cse", "CSE" -> "cse", "CSE with DS" -> "csewithds"
 */
const normalizeBranch = (branch) => {
  if (!branch) return "";
  const b = branch.toLowerCase().trim().replace(/[\s\-_]/g, "");
  if (b === "computer") return "cse";
  if (b === "csdatascience" || b === "csewithds") return "csewithds";
  if (b === "cscybersecurity" || b === "csewithcybersecurity") return "csewithcybersecurity";
  return b;
};

/**
 * Determines if a student is eligible for a specific job based on:
 * 1. NOC Status (hasNOC === true makes them not eligible for any drive)
 * 2. Backlog criteria (if job.noBacklog is true, liveKT must be 0)
 * 3. CGPA criteria (student's CGPA/calculated average must meet job.minCG)
 * 4. Batch filtering (graduationYear or admissionYear + 4 must match job.eligibleBatches)
 * 5. Branch selection (department must match job.eligibleBranches)
 * 6. Placement Hierarchy (division into Generic, Core, and Dream company eligibility)
 */
const checkStudentEligibility = (student, job, hiredCategories = []) => {
  // 1. NOC Check: If student has taken NOC, they are not eligible for any drive
  if (student.studentProfile && student.studentProfile.hasNOC === true) {
    return { eligible: false, reason: "Student has taken NOC and is not eligible for drives" };
  }

  // 2. Backlog Check: If job requires no backlogs, check student's liveKT (keep terms)
  if (job.noBacklog === true) {
    const liveKT = student.studentProfile ? student.studentProfile.liveKT : 0;
    if (liveKT > 0) {
      return { eligible: false, reason: `Student has active backlogs (${liveKT} live KT)` };
    }
  }

  // 3. CGPA Check: Compare student CGPA to minimum CG requirement
  if (job.minCG && job.minCG > 0) {
    // Retrieve cgpa directly, or compute average from SGPA sem1-8 if not set
    let studentCgpa = student.studentProfile ? student.studentProfile.cgpa : 0;
    if (!studentCgpa && student.studentProfile && student.studentProfile.SGPA) {
      const sgpas = [
        student.studentProfile.SGPA.sem1,
        student.studentProfile.SGPA.sem2,
        student.studentProfile.SGPA.sem3,
        student.studentProfile.SGPA.sem4,
        student.studentProfile.SGPA.sem5,
        student.studentProfile.SGPA.sem6,
        student.studentProfile.SGPA.sem7,
        student.studentProfile.SGPA.sem8
      ].filter(val => typeof val === "number" && val > 0);

      if (sgpas.length > 0) {
        studentCgpa = sgpas.reduce((sum, val) => sum + val, 0) / sgpas.length;
      }
    }

    if (studentCgpa < job.minCG) {
      return { eligible: false, reason: `Student CGPA (${studentCgpa.toFixed(2)}) is below the required minimum (${job.minCG})` };
    }
  }

  // 4. Batch Filtering: Check if student's graduationYear or admissionYear matches eligible batches
  if (job.eligibleBatches && job.eligibleBatches.length > 0) {
    const gradYear = student.studentProfile ? student.studentProfile.graduationYear : null;
    const adminYearGrad = student.studentProfile && student.studentProfile.addmissionYear
      ? student.studentProfile.addmissionYear + 4
      : null;

    const matchesBatch =
      (gradYear && job.eligibleBatches.includes(gradYear)) ||
      (adminYearGrad && job.eligibleBatches.includes(adminYearGrad));

    if (!matchesBatch) {
      return { eligible: false, reason: "Student's batch is not eligible for this job" };
    }
  }

  // 5. Branch Selection: Check if student's department/branch matches eligible branches
  if (job.eligibleBranches && job.eligibleBranches.length > 0) {
    const studentDept = student.studentProfile ? student.studentProfile.department : "";
    const matchesBranch = studentDept && job.eligibleBranches.some(
      branch => normalizeBranch(branch) === normalizeBranch(studentDept)
    );

    if (!matchesBranch) {
      return { eligible: false, reason: `Student's branch (${studentDept}) is not eligible` };
    }
  }

  // 6. Placement Hierarchy Check (Generic, Core, Dream)
  // Let's identify the highest category of company the student has been hired in
  let highestPlacedCategory = null;
  if (hiredCategories.includes("Dream")) {
    highestPlacedCategory = "Dream";
  } else if (hiredCategories.includes("Core")) {
    highestPlacedCategory = "Core";
  } else if (hiredCategories.includes("Generic")) {
    highestPlacedCategory = "Generic";
  }

  const jobCategory = job.companyCategory || (job.company && job.company.category) || "Generic";

  if (highestPlacedCategory === "Generic") {
    // Student placed in generic company can sit in core and generic
    if (jobCategory !== "Generic" && jobCategory !== "Core") {
      return { eligible: false, reason: "Placed in Generic: can only sit for Generic and Core jobs" };
    }
  } else if (highestPlacedCategory === "Core") {
    // Student placed in core can sit in core and dream
    if (jobCategory !== "Core" && jobCategory !== "Dream") {
      return { eligible: false, reason: "Placed in Core: can only sit for Core and Dream jobs" };
    }
  } else if (highestPlacedCategory === "Dream") {
    // Student placed in dream can sit only in dream (or done)
    if (jobCategory !== "Dream") {
      return { eligible: false, reason: "Placed in Dream: can only sit for Dream jobs" };
    }
  }

  return { eligible: true };
};

/**
 * Automatically emails all eligible students when a job is posted.
 */
const notifyEligibleStudentsForJob = async (jobId) => {
  try {
    const Job = mongoose.model("Job");
    const User = mongoose.model("Users");

    const job = await Job.findById(jobId).populate("company");
    if (!job) return;

    // Get all students
    const students = await User.find({ role: "student" });

    // For each student, check their placement category history
    const eligibleStudents = [];
    for (const student of students) {
      // Find what jobs they are hired in
      const hiredJobs = await Job.find({
        "applicants": {
          $elemMatch: {
            studentId: student._id,
            status: "hired"
          }
        }
      }).populate("company");

      const hiredCategories = hiredJobs.map(j => j.company && j.company.category).filter(Boolean);
      
      const check = checkStudentEligibility(student, job, hiredCategories);
      if (check.eligible) {
        eligibleStudents.push(student);
      }
    }

    if (eligibleStudents.length === 0) {
      console.log(`No eligible students found for job: ${job.jobTitle}`);
      return;
    }

    // Send emails
    const portalLink = process.env.FRONTEND_URL || "http://localhost:5173";
    const subject = `New Job Posting: ${job.jobTitle} at ${job.company.companyName}`;

    for (const student of eligibleStudents) {
      const studentName = student.first_name + (student.last_name ? ` ${student.last_name}` : "");
      const htmlContent = `
        <div style="background-color: #f4f7f6; padding: 30px; font-family: 'Segoe UI', Arial, sans-serif;">
          <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.08); border-top: 5px solid #0056b3;">
            <div style="background-color: #0056b3; color: #ffffff; padding: 25px; text-align: center;">
              <h2 style="margin: 0; font-size: 24px; font-weight: 600;">New Job Placement Opportunity</h2>
              <p style="margin: 5px 0 0; font-size: 14px; opacity: 0.9;">College Placement Management System</p>
            </div>
            
            <div style="padding: 30px; color: #333333; line-height: 1.6;">
              <p style="font-size: 16px; margin-top: 0;">Dear <strong>${studentName}</strong>,</p>
              
              <p style="font-size: 15px;">
                You are receiving this email because you satisfy all eligibility criteria for the newly posted drive:
              </p>
              
              <div style="background-color: #f8f9fa; border-left: 4px solid #0056b3; padding: 20px; border-radius: 4px; margin: 25px 0;">
                <h3 style="margin: 0 0 12px; color: #0056b3; font-size: 18px;">${job.jobTitle}</h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                  <tr>
                    <td style="padding: 5px 0; color: #666; width: 120px;"><strong>Company:</strong></td>
                    <td style="padding: 5px 0; color: #333;">${job.company.companyName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>Category:</strong></td>
                    <td style="padding: 5px 0; color: #333;"><span style="background: #e1ecf4; color: #0056b3; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">${job.company.category || "Generic"}</span></td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>CTC / Package:</strong></td>
                    <td style="padding: 5px 0; color: #333;">₹${job.salary ? job.salary.toLocaleString("en-IN") : "As per Industry Standard"} LPA</td>
                  </tr>
                  <tr>
                    <td style="padding: 5px 0; color: #666;"><strong>Deadline:</strong></td>
                    <td style="padding: 5px 0; color: #d9534f; font-weight: bold;">${job.applicationDeadline ? new Date(job.applicationDeadline).toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : "N/A"}</td>
                  </tr>
                </table>
              </div>
              
              <p style="font-size: 15px; margin-bottom: 25px;">
                Please review the job details and apply before the deadline by logging into the student portal.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${portalLink}" target="_blank"
                   style="background-color: #0056b3; color: #ffffff; padding: 14px 28px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block; box-shadow: 0 3px 8px rgba(0,86,179,0.3); transition: all 0.2s;">
                  View & Apply to Job
                </a>
              </div>
              
              <p style="font-size: 13px; color: #777777; margin-top: 30px;">
                This is an automated system notification. Please do not reply directly to this mail.
              </p>
              
              <p style="font-size: 14px; margin-top: 25px; border-top: 1px solid #eeeeee; padding-top: 15px;">
                Best regards,<br>
                <strong>Placement Cell Team</strong><br>
                College Placement Management System
              </p>
            </div>
            
            <div style="background-color: #f1f3f5; text-align: center; padding: 15px; font-size: 11px; color: #888888; border-top: 1px solid #e9ecef;">
              &copy; ${new Date().getFullYear()} CPMS. All rights reserved.
            </div>
          </div>
        </div>
      `;

      await sendMail(student.email, subject, htmlContent);
    }

    console.log(`Successfully notified ${eligibleStudents.length} eligible students for job: ${job.jobTitle}`);
  } catch (error) {
    console.error("Error in notifyEligibleStudentsForJob utility: ", error);
  }
};

module.exports = {
  normalizeBranch,
  checkStudentEligibility,
  notifyEligibleStudentsForJob
};
