const User = require("../../models/user.model");
const JobSchema = require("../../models/job.model");
const bcrypt = require("bcrypt");


const studentUsers = async (req, res) => {
  const studentUsers = await User.find({ role: "student" });
  return res.json({ studentUsers })
}

const studentAddUsers = async (req, res) => {
  const email = req.body.email;

  try {
    if (await User.findOne({ email }))
      return res.json({ msg: "User Already Exists!" });

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      first_name: req.body.first_name,
      email: req.body.email,
      number: req.body.number,
      password: hashPassword,
      role: "student",
      studentProfile: {
        isApproved: true
      }
    });

    await newUser.save();
    return res.json({ msg: "User Created!" });
  } catch (error) {
    console.log("user-student.controller => ", error);
    return res.status(500).json({ msg: 'Server error' });
  }
}

const studentDeleteUsers = async (req, res) => {
  // const user = await Users.find({email: req.body.email});
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(user);
    // delete user and releted data
    await user.deleteOne();
    return res.json({ msg: "User Deleted Successfully!" });
  } catch (error) {
    console.log("user-delete-student.controller => ", error)
    return res.status(500).json({ msg: 'Server error' });
  }
}

const studentApprove = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    // console.log(req.body)
    // console.log(user)

    if (!user)
      return res.status(404).json({ msg: 'Student not found' });

    user.studentProfile.isApproved = true;
    await user.save();
    return res.json({ msg: "Student Successfully Approved!" });
  } catch (error) {
    console.error('Error approving student user:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
}


const sendMassLoginEmails = async (req, res) => {
  const sendMail = require("../../config/Nodemailer");
  const generatePassword = require("../../utlis/generatePassword");
  const emailTemplate = require("../../utlis/emailTemplates");

  try {
    const query = { role: "student" };
    // If specific student IDs are provided, target only them; otherwise target all students who haven't changed password
    if (req.body.studentIds && Array.isArray(req.body.studentIds)) {
      query._id = { $in: req.body.studentIds };
    } else {
      query.isPasswordChanged = false;
    }

    const students = await User.find(query);

    if (students.length === 0) {
      return res.status(200).json({ msg: "No students found requiring credential emails." });
    }

    const portalLink = process.env.FRONTEND_URL || "http://localhost:5173";

    // Generate random password, hash it, update user, and email the credentials
    const emailPromises = students.map(async (student) => {
      const rawPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      student.password = hashedPassword;
      student.isPasswordChanged = false; // Reset to false to enforce password change on first login
      await student.save();

      const studentName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
      const htmlContent = emailTemplate.loginCredentialsTemplate({
        name: studentName,
        email: student.email,
        password: rawPassword,
        portalLink
      });

      const subject = "Login Credentials: CPMS - College Placement Management System";
      return sendMail(student.email, subject, htmlContent);
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ msg: `Successfully sent credentials to ${students.length} students!` });
  } catch (error) {
    console.error("Error in sendMassLoginEmails: ", error);
    return res.status(500).json({ msg: "Server error while sending emails" });
  }
};


const studentMassUpload = async (req, res) => {
  const sendMail = require("../../config/Nodemailer");
  const generatePassword = require("../../utlis/generatePassword");
  const emailTemplate = require("../../utlis/emailTemplates");

  const MassUploadHistory = require("../../models/massUploadHistory.model");
  const { studentsList } = req.body;

  if (!studentsList || !Array.isArray(studentsList)) {
    return res.status(400).json({ msg: "Invalid student list data" });
  }

  const createdStudents = [];
  const existingStudents = [];
  const errors = [];
  const records = [];

  const portalLink = process.env.FRONTEND_URL || "http://localhost:5173";

  for (const student of studentsList) {
    const email = student.email ? student.email.trim() : null;
    if (!email) {
      errors.push({ student, reason: "Missing email" });
      records.push({ srNo: student.srNo || '', email: 'N/A', name: student.name || '', status: 'Wrong Email' });
      continue;
    }

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        existingStudents.push(email);
        records.push({ srNo: student.srNo || '', email, name: student.name || '', status: 'Already Exists' });
        continue;
      }

      const rawPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(rawPassword, 10);

      let firstName = 'Student';
      let lastName = '';
      if (student.name) {
        const nameParts = student.name.trim().split(' ');
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      } else if (student.first_name) {
        firstName = student.first_name;
        lastName = student.last_name || '';
      }

      // Create new user account with default values or spreadsheet parsed values
      const newUser = new User({
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: hashedPassword,
        role: "student",
        isPasswordChanged: false,
        studentProfile: {
          isApproved: true,
          rollNumber: student.rollNumber || undefined,
          UIN: student.UIN || undefined,
          department: student.department || student.branch || undefined,
          graduationYear: student.graduationYear || student.batch || undefined,
          cgpa: student.cgpa || 0,
          liveKT: student.liveKT || 0,
          hasNOC: student.hasNOC || false
        }
      });

      await newUser.save();
      createdStudents.push(email);

      // Send credential email
      const studentName = `${newUser.first_name} ${newUser.last_name}`.trim();
      const htmlContent = emailTemplate.loginCredentialsTemplate({
        name: studentName,
        email: email,
        password: rawPassword,
        portalLink
      });

      const subject = "Welcome to CPMS - Your Login Credentials";
      await sendMail(email, subject, htmlContent);
      records.push({ srNo: student.srNo || '', email, name: student.name || '', status: 'Sent' });
    } catch (err) {
      console.error(`Error mass uploading student ${email}:`, err);
      errors.push({ email, reason: err.message });
      records.push({ srNo: student.srNo || '', email, name: student.name || '', status: 'Failed' });
    }
  }

  const historyRecord = new MassUploadHistory({
    totalRecords: studentsList.length,
    successful: createdStudents.length,
    existing: existingStudents.length,
    failed: errors.length,
    records
  });
  await historyRecord.save();

  return res.status(200).json({
    msg: `Successfully processed student list. Accounts created and credentials emailed to: ${createdStudents.length} students. Skipped ${existingStudents.length} existing student accounts.`,
    createdCount: createdStudents.length,
    existingCount: existingStudents.length,
    errorCount: errors.length,
    records
  });
};

const getMassUploadHistory = async (req, res) => {
  try {
    const MassUploadHistory = require("../../models/massUploadHistory.model");
    const history = await MassUploadHistory.find().sort({ uploadDate: -1 });
    return res.json(history);
  } catch (error) {
    console.error("Error fetching history: ", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  studentUsers,
  studentAddUsers,
  studentDeleteUsers,
  studentApprove,
  sendMassLoginEmails,
  studentMassUpload,
  getMassUploadHistory
};