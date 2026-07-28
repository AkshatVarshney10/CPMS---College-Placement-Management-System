const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config();

const CompanySchema = require("./models/company.model");
const JobSchema = require("./models/job.model");
const UserSchema = require("./models/user.model");

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URL) {
      console.error("Error: MONGODB_URL environment variable is missing.");
      process.exit(1);
    }

    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected to MongoDB!");

    // Clean existing dummy data
    console.log("Cleaning database collections...");
    await CompanySchema.deleteMany({ companyName: { $in: ["TCS", "Cisco Systems", "Google LLC"] } });
    await JobSchema.deleteMany({ jobTitle: { $in: ["TCS Ninja", "Cisco Systems Engineer", "Google SDE", "Amazon SDE"] } });
    
    // Define a helper to upsert users without overwriting passwords
    const upsertUser = async (userData) => {
      let user = await UserSchema.findOne({ email: userData.email });
      if (user) {
        // If user exists, optionally update their profile, but NOT password
        console.log(`User ${userData.email} exists, preserving credentials.`);
        if (userData.studentProfile) {
           user.studentProfile = userData.studentProfile;
           await user.save();
        }
        return user;
      } else {
        return await UserSchema.create(userData);
      }
    };

    // 1. Create Companies with categories
    console.log("Seeding companies...");
    const tcs = await CompanySchema.create({
      companyName: "TCS",
      companyDescription: "Global IT services, consulting and business solutions organization.",
      companyWebsite: "https://tcs.com",
      companyLocation: "Mumbai",
      category: "Generic",
      hrName: "Nisha Sharma",
      hrPhone: "9876543201",
      hrEmail: "nisha.sharma@tcs.com",
      hrLinkedin: "https://linkedin.com/in/nisha-sharma-tcs"
    });

    const cisco = await CompanySchema.create({
      companyName: "Cisco Systems",
      companyDescription: "Worldwide leader in IT, networking, and cybersecurity solutions.",
      companyWebsite: "https://cisco.com",
      companyLocation: "Bangalore",
      category: "Core",
      hrName: "Rajeev Mehta",
      hrPhone: "9876543202",
      hrEmail: "rajeev.mehta@cisco.com",
      hrLinkedin: "https://linkedin.com/in/rajeev-mehta-cisco"
    });

    const google = await CompanySchema.create({
      companyName: "Google LLC",
      companyDescription: "Multi-national technology company focusing on search engine technology, cloud computing, and software.",
      companyWebsite: "https://google.com",
      companyLocation: "Hyderabad",
      category: "Dream",
      hrName: "Anjali Rao",
      hrPhone: "9876543203",
      hrEmail: "anjali.rao@google.com",
      hrLinkedin: "https://linkedin.com/in/anjali-rao-google"
    });

    // 2. Create Jobs with eligibility criteria
    console.log("Seeding jobs...");
    const tcsJob = await JobSchema.create({
      jobTitle: "TCS Ninja",
      jobDescription: "Entry level software engineering role at Tata Consultancy Services.",
      eligibility: "6.0+ CGPA, backlogs allowed.",
      salary: 3.6,
      stipend: 15000,
      expectedCTC: 3.6,
      howToApply: "Apply on the student portal.",
      applicationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      minCG: 6.0,
      noBacklog: false,
      eligibleBatches: [2027],
      eligibleBranches: ["CSE", "IT", "ECE"],
      companyCategory: "Generic",
      placementType: "On-Campus",
      company: tcs._id
    });

    const ciscoJob = await JobSchema.create({
      jobTitle: "Cisco Systems Engineer",
      jobDescription: "Technical software and networks role for core networking solutions.",
      eligibility: "7.5+ CGPA, zero backlogs.",
      salary: 15.0,
      stipend: 60000,
      expectedCTC: 15.0,
      howToApply: "Apply on the student portal. Assessment on HackerRank.",
      applicationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      minCG: 7.5,
      noBacklog: true,
      eligibleBatches: [2027],
      eligibleBranches: ["CSE", "IT", "ECE"],
      companyCategory: "Core",
      placementType: "On-Campus",
      company: cisco._id
    });

    const googleJob = await JobSchema.create({
      jobTitle: "Google SDE",
      jobDescription: "Software development engineer designing scalable infrastructure.",
      eligibility: "8.5+ CGPA, zero backlogs, CSE/IT only.",
      salary: 35.0,
      stipend: 100000,
      expectedCTC: 35.0,
      howToApply: "Apply on portal. Online coding test link will be mailed.",
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      minCG: 8.5,
      noBacklog: true,
      eligibleBatches: [2027, 2028],
      eligibleBranches: ["CSE", "IT"],
      companyCategory: "Dream",
      placementType: "On-Campus",
      company: google._id
    });

    const amazonJob = await JobSchema.create({
      jobTitle: "Amazon SDE",
      jobDescription: "Software development engineer off campus recruitment drive.",
      eligibility: "7.0+ CGPA, zero backlogs.",
      salary: 28.0,
      stipend: 80000,
      expectedCTC: 28.0,
      howToApply: "Apply directly on Amazon Careers Portal.",
      applicationDeadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      minCG: 7.0,
      noBacklog: true,
      eligibleBatches: [2027, 2028],
      eligibleBranches: ["CSE", "IT", "ECE"],
      companyCategory: "Dream",
      placementType: "Off-Campus",
      company: google._id
    });

    // 3. Create Users with different roles and attributes
    console.log("Seeding users...");
    const defaultPasswordHash = await bcrypt.hash("student123", 10);
    const tpoPasswordHash = await bcrypt.hash("Maximum8@!", 10);
    const studentPasswordHash = await bcrypt.hash("Anushka@0403", 10);
    const superuserPasswordHash = await bcrypt.hash("RNAC(54P", 10);
    const managementPasswordHash = await bcrypt.hash("management123", 10);

    // Seed the superuser
    const superuser = await upsertUser({
      first_name: "Priyam",
      last_name: "Superuser",
      email: "pinkipriyam8@gmail.com",
      number: "9999999999",
      password: superuserPasswordHash,
      role: "superuser",
      isPasswordChanged: false,
      gender: "Male"
    });

    // Seed the management
    const management = await upsertUser({
      first_name: "Management",
      last_name: "Admin",
      email: "23156@iiitu.ac.in",
      number: "8888888888",
      password: managementPasswordHash,
      role: "management_admin",
      isPasswordChanged: false,
      gender: "Male"
    });

    // Seed the TPO
    const tpo = await upsertUser({
      first_name: "Sneha",
      last_name: "TPO",
      email: "sneha001705@gmail.com",
      number: "7777777777",
      password: tpoPasswordHash,
      role: "tpo_admin",
      isPasswordChanged: false,
      gender: "Female"
    });

    // Seed student accounts with predefined placements/applications
    console.log("Seeding student accounts...");

    // Anushka: Placed in TCS (Generic) and Google (Dream, On-Campus) -> Multiple Offers!
    const anushka = await upsertUser({
      first_name: "Anushka",
      last_name: "Upadhyay",
      email: "23347@iiitu.ac.in",
      number: "6666666666",
      password: studentPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Female",
      studentProfile: {
        isApproved: true,
        rollNumber: 347,
        UIN: "23347",
        department: "CSE",
        graduationYear: 2027,
        cgpa: 8.5,
        liveKT: 0,
        hasNOC: false,
        appliedJobs: [
          { jobId: tcsJob._id, status: 'hired', package: 3.6 },
          { jobId: googleJob._id, status: 'hired', package: 35.0 }
        ]
      }
    });

    // Rahul: Placed in Cisco (Core, On-Campus)
    const rahul = await upsertUser({
      first_name: "Rahul",
      last_name: "Sharma",
      email: "rahul.sharma@example.com",
      number: "9876543210",
      password: defaultPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Male",
      studentProfile: {
        isApproved: true,
        rollNumber: 127,
        UIN: 123456,
        department: "CSE",
        graduationYear: 2027,
        cgpa: 8.2,
        liveKT: 0,
        hasNOC: false,
        appliedJobs: [
          { jobId: ciscoJob._id, status: 'hired', package: 15.0 }
        ]
      }
    });

    // Priyanshu: Placed in TCS (Generic, On-Campus)
    const priyanshu = await upsertUser({
      first_name: "Priyanshu",
      last_name: "Patel",
      email: "priyanshu.patel@example.com",
      number: "8765432109",
      password: defaultPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Male",
      studentProfile: {
        isApproved: true,
        rollNumber: 227,
        UIN: 234567,
        department: "ECE",
        graduationYear: 2027,
        cgpa: 7.2,
        liveKT: 1, // 1 backlog
        hasNOC: false,
        appliedJobs: [
          { jobId: tcsJob._id, status: 'hired', package: 3.6 }
        ]
      }
    });

    // Sneha: NOC = true (Ineligible/Unplaced)
    const snehaStudent = await upsertUser({
      first_name: "Sneha",
      last_name: "Kumari",
      email: "sneha.student@example.com",
      number: "7654321098",
      password: defaultPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Female",
      studentProfile: {
        isApproved: true,
        rollNumber: 328,
        UIN: 345678,
        department: "IT",
        graduationYear: 2028,
        cgpa: 9.1,
        liveKT: 0,
        hasNOC: true
      }
    });

    // Vikram: Placed in Amazon (Dream, Off-Campus)
    const vikram = await upsertUser({
      first_name: "Vikram",
      last_name: "Singh",
      email: "vikram.singh@example.com",
      number: "7543210987",
      password: defaultPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Male",
      studentProfile: {
        isApproved: true,
        rollNumber: 489,
        UIN: 456789,
        department: "IT",
        graduationYear: 2027,
        cgpa: 8.0,
        liveKT: 0,
        hasNOC: false,
        appliedJobs: [
          { jobId: amazonJob._id, status: 'hired', package: 28.0 }
        ]
      }
    });

    // Amit: Unplaced (applied, but not hired)
    const amit = await upsertUser({
      first_name: "Amit",
      last_name: "Verma",
      email: "amit.verma@example.com",
      number: "7432109876",
      password: defaultPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Male",
      studentProfile: {
        isApproved: true,
        rollNumber: 590,
        UIN: 567890,
        department: "ECE",
        graduationYear: 2027,
        cgpa: 6.5,
        liveKT: 0,
        hasNOC: false,
        appliedJobs: [
          { jobId: tcsJob._id, status: 'applied' }
        ]
      }
    });

    // Neha Gupta: Placed in TCS (Generic, On-Campus)
    const neha = await upsertUser({
      first_name: "Neha",
      last_name: "Gupta",
      email: "neha.gupta@example.com",
      number: "7321098765",
      password: defaultPasswordHash,
      role: "student",
      isPasswordChanged: false,
      gender: "Female",
      studentProfile: {
        isApproved: true,
        rollNumber: 601,
        UIN: 678901,
        department: "IT",
        graduationYear: 2027,
        cgpa: 7.8,
        liveKT: 0,
        hasNOC: false,
        appliedJobs: [
          { jobId: tcsJob._id, status: 'hired', package: 3.6 }
        ]
      }
    });

    // 4. Sync the applicants array in each Job document
    console.log("Syncing job applicants...");
    await JobSchema.findByIdAndUpdate(tcsJob._id, {
      $push: {
        applicants: [
          { studentId: anushka._id, status: 'hired', currentRound: 'HR Interview', roundStatus: 'passed' },
          { studentId: priyanshu._id, status: 'hired', currentRound: 'HR Interview', roundStatus: 'passed' },
          { studentId: amit._id, status: 'applied', currentRound: 'Aptitude Test', roundStatus: 'pending' },
          { studentId: neha._id, status: 'hired', currentRound: 'HR Interview', roundStatus: 'passed' }
        ]
      }
    });

    await JobSchema.findByIdAndUpdate(ciscoJob._id, {
      $push: {
        applicants: [
          { studentId: rahul._id, status: 'hired', currentRound: 'HR Interview', roundStatus: 'passed' }
        ]
      }
    });

    await JobSchema.findByIdAndUpdate(googleJob._id, {
      $push: {
        applicants: [
          { studentId: anushka._id, status: 'hired', currentRound: 'HR Interview', roundStatus: 'passed' }
        ]
      }
    });

    await JobSchema.findByIdAndUpdate(amazonJob._id, {
      $push: {
        applicants: [
          { studentId: vikram._id, status: 'hired', currentRound: 'HR Interview', roundStatus: 'passed' }
        ]
      }
    });

    console.log("------------------------------------------------------------------");
    console.log("Database Seeded Successfully!");
    console.log("------------------------------------------------------------------");
    console.log("Companies seeded:");
    console.log(`- ${tcs.companyName} (${tcs.category})`);
    console.log(`- ${cisco.companyName} (${cisco.category})`);
    console.log(`- ${google.companyName} (${google.category})`);
    console.log("------------------------------------------------------------------");
    console.log("Jobs seeded:");
    console.log(`- ${tcsJob.jobTitle} (Category: ${tcsJob.companyCategory}, Min CG: ${tcsJob.minCG}, Type: ${tcsJob.placementType})`);
    console.log(`- ${ciscoJob.jobTitle} (Category: ${ciscoJob.companyCategory}, Min CG: ${ciscoJob.minCG}, Type: ${ciscoJob.placementType})`);
    console.log(`- ${googleJob.jobTitle} (Category: ${googleJob.companyCategory}, Min CG: ${googleJob.minCG}, Type: ${googleJob.placementType})`);
    console.log(`- ${amazonJob.jobTitle} (Category: ${amazonJob.companyCategory}, Min CG: ${amazonJob.minCG}, Type: ${amazonJob.placementType})`);
    console.log("------------------------------------------------------------------");
    console.log("Students seeded (Default login password for all: student123):");
    console.log(`- Anushka Upadhyay: 23347@iiitu.ac.in (CSE, Placed in TCS & Google)`);
    console.log(`- Rahul Sharma: rahul.sharma@example.com (CSE, Placed in Cisco)`);
    console.log(`- Priyanshu Patel: priyanshu.patel@example.com (ECE, Placed in TCS)`);
    console.log(`- Sneha Kumari: sneha.student@example.com (IT, NOC = true, Unplaced)`);
    console.log(`- Vikram Singh: vikram.singh@example.com (IT, Placed in Amazon Off-Campus)`);
    console.log(`- Amit Verma: amit.verma@example.com (ECE, Applied to TCS)`);
    console.log(`- Neha Gupta: neha.gupta@example.com (IT, Placed in TCS)`);
    console.log("------------------------------------------------------------------");

    mongoose.disconnect();
  } catch (error) {
    console.error("Error seeding database: ", error);
    mongoose.disconnect();
  }
};

seedDatabase();
