const Course = require('../models/Course');
const ApiError = require('../utils/ApiError');

async function addModule(req, res, next) {
  try {
    const { title, order } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    course.modules.push({ title, order, lessons: [] });
    await course.save();

    res.status(201).json(course.modules[course.modules.length - 1]);
  } catch (err) {
    next(err);
  }
}

async function updateModule(req, res, next) {
  try {
    const { title, order } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const module = course.modules.id(req.params.moduleId);
    if (!module) throw new ApiError(404, 'Módulo não encontrado');

    if (title !== undefined) module.title = title;
    if (order !== undefined) module.order = order;

    await course.save();
    res.json(module);
  } catch (err) {
    next(err);
  }
}

async function deleteModule(req, res, next) {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const module = course.modules.id(req.params.moduleId);
    if (!module) throw new ApiError(404, 'Módulo não encontrado');

    module.deleteOne();
    await course.save();

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function reorderModules(req, res, next) {
  try {
    const { moduleIds } = req.body;

    const course = await Course.findById(req.params.courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    if (!Array.isArray(moduleIds) || moduleIds.length !== course.modules.length) {
      throw new ApiError(400, 'A lista de módulos é inválida');
    }

    const validIds = new Set(course.modules.map((m) => m._id.toString()));
    if (!moduleIds.every((id) => validIds.has(id))) {
      throw new ApiError(400, 'A lista de módulos contém IDs desconhecidos');
    }

    moduleIds.forEach((id, index) => {
      course.modules.id(id).order = index;
    });
    course.modules.sort((a, b) => a.order - b.order);

    await course.save();
    res.json(course.modules);
  } catch (err) {
    next(err);
  }
}

module.exports = { addModule, updateModule, deleteModule, reorderModules };
