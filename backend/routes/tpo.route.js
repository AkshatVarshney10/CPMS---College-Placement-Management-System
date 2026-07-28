const express = require('express');

// router after /tpo/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');


// tpo login controller
const Login = require('../controllers/TPO/tpo.login.controller');

const PostJob = require('../controllers/TPO/tpo.post-job.controller');

const { AllJobs, DeleteJob, JobData, JobWithApplicants, StudentJobsApplied, DownloadApplicantsCSV } = require('../controllers/user/user.all-jobs.controller');

// login post request for student
router.post('/login', Login);


// post job listing data
router.post('/post-job', authenticateToken, PostJob);

// all jobs 
router.get('/jobs',authenticateToken, AllJobs);

// delete job 
router.post('/delete-job',authenticateToken, DeleteJob);

// view a job 
router.get('/job/:jobId', authenticateToken, JobData);

// job with its applicants 
router.get('/job/applicants/:jobId', authenticateToken, JobWithApplicants)

// download job applicants list as CSV
router.get('/job/applicants/:jobId/download', authenticateToken, DownloadApplicantsCSV);

// student jobs applied 
router.get('/myjob/:studentId', authenticateToken, StudentJobsApplied)

// Placement statistics endpoint
const { GetPlacementStats } = require('../controllers/Management/placement-stats.controller');
router.get('/placement-stats', authenticateToken, GetPlacementStats);

// Detailed placement statistics endpoint
const { GetDetailedPlacementStats } = require('../controllers/Management/detailed-placement-stats.controller');
router.get('/detailed-placement-stats', authenticateToken, GetDetailedPlacementStats);

module.exports = router;