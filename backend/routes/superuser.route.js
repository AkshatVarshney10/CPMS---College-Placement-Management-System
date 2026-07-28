const express = require('express');

// router after /admin/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');

const Login = require('../controllers/SuperUser/login.controller.js');

// management methods
const { managementUsers, managementAddUsers, managementDeleteUsers } = require('../controllers/SuperUser/user-management.controller.js');
// tpo methods
const { tpoUsers, tpoAddUsers, tpoDeleteUsers } = require('../controllers/SuperUser/user-tpo.controller.js');
// student methods
const { studentUsers, studentAddUsers, studentDeleteUsers, studentApprove, sendMassLoginEmails, studentMassUpload, getMassUploadHistory } = require('../controllers/SuperUser/user-student.controller.js');



router.post('/login', Login);

// management routes
router.get('/management-users', authenticateToken, managementUsers);
router.post('/management-add-user', authenticateToken, managementAddUsers);
router.post('/management-delete-user', authenticateToken, managementDeleteUsers);

// tpo routes
router.get('/tpo-users', authenticateToken, tpoUsers);
router.post('/tpo-add-user', authenticateToken, tpoAddUsers);
router.post('/tpo-delete-user', authenticateToken, tpoDeleteUsers);

// student routes
router.get('/student-users', authenticateToken, studentUsers);
router.post('/student-add-user', authenticateToken, studentAddUsers);
router.post('/student-delete-user', authenticateToken, studentDeleteUsers);
// approve student
router.post('/student-approve', authenticateToken, studentApprove);
// send mass login credentials mail to students
router.post('/student-send-mass-mail', authenticateToken, sendMassLoginEmails);
// mass upload and send mail
router.post('/student-mass-upload', authenticateToken, studentMassUpload);
// mass upload history
router.get('/student-mass-upload-history', authenticateToken, getMassUploadHistory);

// Job eligibility report endpoint
const { GetJobEligibilityReport } = require('../controllers/Management/job-eligibility.controller');
router.get('/job-eligibility-report', authenticateToken, GetJobEligibilityReport);

// Placement statistics endpoint
const { GetPlacementStats } = require('../controllers/Management/placement-stats.controller');
router.get('/placement-stats', authenticateToken, GetPlacementStats);

// Detailed placement statistics endpoint
const { GetDetailedPlacementStats } = require('../controllers/Management/detailed-placement-stats.controller');
router.get('/detailed-placement-stats', authenticateToken, GetDetailedPlacementStats);

module.exports = router;