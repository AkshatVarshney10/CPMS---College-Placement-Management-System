const express = require('express');

// router after /management/
const router = express.Router();

const authenticateToken = require('../middleware/auth.middleware');


// management login controller
const Login = require('../controllers/Management/login.controller');
// management UsersTPO controller
const UsersTPO = require('../controllers/Management/tpo-users.controller');
// management DeleteTPO controller
const DeleteTPO = require('../controllers/Management/delete-tpo.controller');
// management AddTPO controller
const { AddTPO, AddManagement, AddStudent } = require('../controllers/Management/add-user.controller');

// all notice related here
const { SendNotice, GetAllNotice, DeleteNotice, GetNotice } = require('../controllers/Management/notice.controller');




router.post('/login', Login);

router.get('/tpo-users', authenticateToken, UsersTPO);

router.post('/deletetpo', authenticateToken, DeleteTPO);

// add management, tpo and student
router.post('/addtpo', authenticateToken, AddTPO);
// router.post('/add-management', authenticateToken, AddManagement);
router.post('/add-management', AddManagement);
router.post('/add-student', authenticateToken, AddStudent);

// notices all route here 
router.post('/send-notice', authenticateToken, SendNotice);

router.get('/get-all-notices', authenticateToken, GetAllNotice);

router.get('/get-notice', authenticateToken, GetNotice);

router.post('/delete-notice', authenticateToken, DeleteNotice);

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