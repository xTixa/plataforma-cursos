const Course = require('../models/Course');
const Progress = require('../models/Progress');
const ApiError = require('../utils/ApiError');

function countLessons(course) {
  return course.modules.reduce((total, module) => total + module.lessons.length, 0);
}

async function completeLesson(req, res, next) {
  try {
    const { courseId, lessonId } = req.params;

    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, 'Curso não encontrado');

    const totalLessons = countLessons(course);
    if (totalLessons === 0) throw new ApiError(400, 'O curso ainda não tem aulas');

    let progress = await Progress.findOne({ student: req.user._id, course: courseId });
    if (!progress) {
      progress = await Progress.create({
        student: req.user._id,
        course: courseId,
        completedLessons: [],
      });
    }

    const alreadyCompleted = progress.completedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyCompleted) {
      progress.completedLessons.push(lessonId);
      progress.percentage = Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      );
      await progress.save();
    }

    res.json(progress);
  } catch (err) {
    next(err);
  }
}

async function getCourseProgress(req, res, next) {
  try {
    const progress = await Progress.findOne({
      student: req.user._id,
      course: req.params.courseId,
    });

    res.json(progress || { completedLessons: [], percentage: 0 });
  } catch (err) {
    next(err);
  }
}

async function getMyProgress(req, res, next) {
  try {
    const progressList = await Progress.find({ student: req.user._id }).populate(
      'course',
      'title thumbnail category'
    );

    res.json(progressList);
  } catch (err) {
    next(err);
  }
}

module.exports = { completeLesson, getCourseProgress, getMyProgress };
