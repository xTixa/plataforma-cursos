const express = require('express');
const { completeLesson, getCourseProgress } = require('../controllers/progressController');
const { protect } = require('../middlewares/auth');

const router = express.Router({ mergeParams: true });

router.get('/', protect, getCourseProgress);
router.post('/lessons/:lessonId/complete', protect, completeLesson);

module.exports = router;
