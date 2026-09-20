const express = require('express');
const { body } = require('express-validator');
const {
  createCourse,
  listCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { upload } = require('../middlewares/upload');
const moduleRoutes = require('./moduleRoutes');
const progressRoutes = require('./progressRoutes');

const router = express.Router();

const courseValidation = [
  body('title').trim().notEmpty().withMessage('O título é obrigatório'),
  body('description').trim().notEmpty().withMessage('A descrição é obrigatória'),
  body('category').trim().notEmpty().withMessage('A categoria é obrigatória'),
];

router.get('/', listCourses);
router.get('/:id', getCourse);

router.post(
  '/',
  protect,
  authorize('admin'),
  upload.single('thumbnail'),
  courseValidation,
  validate,
  createCourse
);

router.put(
  '/:id',
  protect,
  authorize('admin'),
  upload.single('thumbnail'),
  courseValidation,
  validate,
  updateCourse
);

router.delete('/:id', protect, authorize('admin'), deleteCourse);

router.use('/:courseId/modules', moduleRoutes);
router.use('/:courseId/progress', progressRoutes);

module.exports = router;
