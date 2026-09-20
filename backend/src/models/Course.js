const mongoose = require('mongoose');
const { COURSE_CATEGORIES } = require('../constants/categories');

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, default: null },
    pdfUrl: { type: String, default: null },
    duration: { type: Number, default: 0 },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    order: { type: Number, required: true },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'O título é obrigatório'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'A descrição é obrigatória'],
    },
    category: {
      type: String,
      required: [true, 'A categoria é obrigatória'],
      trim: true,
      enum: {
        values: COURSE_CATEGORIES,
        message: 'Categoria inválida',
      },
    },
    thumbnail: {
      type: String,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    modules: [moduleSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
