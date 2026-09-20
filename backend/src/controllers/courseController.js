const Course = require('../models/Course');
const Progress = require('../models/Progress');
const ApiError = require('../utils/ApiError');

async function createCourse(req, res, next) {
  try {
    const { title, description, category } = req.body;
    const thumbnail = req.file?.path || null;

    const course = await Course.create({
      title,
      description,
      category,
      thumbnail,
      createdBy: req.user._id,
    });

    res.status(201).json(course);
  } catch (err) {
    next(err);
  }
}

async function listCourses(req, res, next) {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      filter.category = category;
    }

    const courses = await Course.find(filter)
      .select('title description category thumbnail createdAt')
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    next(err);
  }
}

async function getCourse(req, res, next) {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) throw new ApiError(404, 'Curso não encontrado');
    res.json(course);
  } catch (err) {
    next(err);
  }
}

async function updateCourse(req, res, next) {
  try {
    const { title, description, category } = req.body;
    const update = { title, description, category };

    if (req.file?.path) {
      update.thumbnail = req.file.path;
    }

    const course = await Course.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!course) throw new ApiError(404, 'Curso não encontrado');
    res.json(course);
  } catch (err) {
    next(err);
  }
}

async function deleteCourse(req, res, next) {
  try {
    const hasEnrollments = await Progress.exists({ course: req.params.id });
    if (hasEnrollments) {
      throw new ApiError(409, 'Não é possível eliminar um curso com alunos inscritos');
    }

    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createCourse, listCourses, getCourse, updateCourse, deleteCourse };
