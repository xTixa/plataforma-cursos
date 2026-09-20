const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');

function findModule(course, moduleId) {
  const module = course.modules.id(moduleId);
  if (!module) throw new ApiError(404, 'Módulo não encontrado');
  return module;
}

async function addLesson(req, res, next) {
  try {
    const { title, duration, order } = req.body;
    const videoUrl = req.files?.video?.[0]?.path || null;
    const pdfUrl = req.files?.pdf?.[0]?.path || null;

    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const module = findModule(course, req.params.moduleId);
    module.lessons.push({ title, duration, order, videoUrl, pdfUrl });
    await course.save();

    res.status(201).json(module.lessons[module.lessons.length - 1]);
  } catch (err) {
    next(err);
  }
}

async function updateLesson(req, res, next) {
  try {
    const { title, duration, order } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const module = findModule(course, req.params.moduleId);
    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) throw new ApiError(404, 'Aula não encontrada');

    if (title !== undefined) lesson.title = title;
    if (duration !== undefined) lesson.duration = duration;
    if (order !== undefined) lesson.order = order;
    if (req.files?.video?.[0]?.path) lesson.videoUrl = req.files.video[0].path;
    if (req.files?.pdf?.[0]?.path) lesson.pdfUrl = req.files.pdf[0].path;

    await course.save();
    res.json(lesson);
  } catch (err) {
    next(err);
  }
}

async function deleteLesson(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const module = findModule(course, req.params.moduleId);
    const lesson = module.lessons.id(req.params.lessonId);
    if (!lesson) throw new ApiError(404, 'Aula não encontrada');

    lesson.deleteOne();
    await course.save();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function reorderLessons(req, res, next) {
  try {
    const { lessonIds } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const module = findModule(course, req.params.moduleId);

    if (!Array.isArray(lessonIds) || lessonIds.length !== module.lessons.length) {
      throw new ApiError(400, 'A lista de aulas é inválida');
    }

    const validIds = new Set(module.lessons.map((l) => l._id.toString()));
    if (!lessonIds.every((id) => validIds.has(id))) {
      throw new ApiError(400, 'A lista de aulas contém IDs desconhecidos');
    }

    lessonIds.forEach((id, index) => {
      module.lessons.id(id).order = index;
    });
    module.lessons.sort((a, b) => a.order - b.order);

    await course.save();
    res.json(module.lessons);
  } catch (err) {
    next(err);
  }
}

module.exports = { addLesson, updateLesson, deleteLesson, reorderLessons };
