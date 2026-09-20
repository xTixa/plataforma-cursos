const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');

async function studentDashboard(req, res, next) {
  try {
    const enrollments = await Progress.find({ student: req.user._id }).populate(
      'course',
      'title thumbnail category'
    );

    res.json({
      enrolledCourses: enrollments.length,
      courses: enrollments.map((p) => ({
        course: p.course,
        percentage: p.percentage,
        completedLessons: p.completedLessons.length,
      })),
    });
  } catch (err) {
    next(err);
  }
}

async function adminDashboard(req, res, next) {
  try {
    const [totalCourses, totalStudents, totalEnrollments] = await Promise.all([
      Course.countDocuments(),
      User.countDocuments({ role: 'aluno' }),
      Progress.countDocuments(),
    ]);

    res.json({ totalCourses, totalStudents, totalEnrollments });
  } catch (err) {
    next(err);
  }
}

module.exports = { studentDashboard, adminDashboard };
