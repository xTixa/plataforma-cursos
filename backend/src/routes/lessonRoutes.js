const express = require('express');
const { body } = require('express-validator');
const { addLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { upload, enforceFieldSizeLimits } = require('../middlewares/upload');

const router = express.Router({ mergeParams: true });

const lessonValidation = [
  body('title').trim().notEmpty().withMessage('O título da aula é obrigatório'),
  body('order').isInt({ min: 0 }).withMessage('A ordem deve ser um número inteiro'),
];

const lessonFiles = upload.fields([
  { name: 'video', maxCount: 1 },
  { name: 'pdf', maxCount: 1 },
]);

router.post(
  '/',
  protect,
  authorize('admin'),
  lessonFiles,
  enforceFieldSizeLimits,
  lessonValidation,
  validate,
  addLesson
);

router.put(
  '/:lessonId',
  protect,
  authorize('admin'),
  lessonFiles,
  enforceFieldSizeLimits,
  updateLesson
);

router.delete('/:lessonId', protect, authorize('admin'), deleteLesson);

module.exports = router;
