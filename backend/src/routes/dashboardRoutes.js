const express = require('express');
const { studentDashboard, adminDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middlewares/auth');

const router = express.Router();

router.get('/student', protect, authorize('aluno'), studentDashboard);
router.get('/admin', protect, authorize('admin'), adminDashboard);

module.exports = router;
