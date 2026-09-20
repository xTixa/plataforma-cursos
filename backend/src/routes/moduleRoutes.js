const express = require('express');
const { body } = require('express-validator');
const { addModule, updateModule, deleteModule } = require('../controllers/moduleController');
const { protect, authorize } = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const lessonRoutes = require('./lessonRoutes');

const router = express.Router({ mergeParams: true });

const moduleValidation = [
  body('title').trim().notEmpty().withMessage('O título do módulo é obrigatório'),
  body('order').isInt({ min: 0 }).withMessage('A ordem deve ser um número inteiro'),
];

router.post('/', protect, authorize('admin'), moduleValidation, validate, addModule);
router.put('/:moduleId', protect, authorize('admin'), updateModule);
router.delete('/:moduleId', protect, authorize('admin'), deleteModule);

router.use('/:moduleId/lessons', lessonRoutes);

module.exports = router;
