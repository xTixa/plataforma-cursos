const express = require('express');
const {
  studentDashboard,
  adminDashboard,
  adminCourses,
  adminStudents,
} = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/student', protect, authorize('aluno'), studentDashboard);
router.get('/admin', protect, authorize('admin'), adminDashboard);
router.get('/admin/courses', protect, authorize('admin'), adminCourses);
router.get('/admin/students', protect, authorize('admin'), adminStudents);

module.exports = router;
