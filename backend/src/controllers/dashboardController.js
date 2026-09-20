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
    const [totalCourses, totalStudents, totalEnrollments, courses, progressStats] =
      await Promise.all([
        Course.countDocuments(),
        User.countDocuments({ role: 'aluno' }),
        Progress.countDocuments(),
        Course.find().select('title modules'),
        Progress.aggregate([
          { $group: { _id: '$course', count: { $sum: 1 }, avgPercentage: { $avg: '$percentage' } } },
        ]),
      ]);

    const enrollmentsByCourse = new Map(
      progressStats.map((p) => [p._id.toString(), { count: p.count, avgPercentage: p.avgPercentage }])
    );

    const coursesWithoutModules = courses.filter((c) => c.modules.length === 0).length;

    const avgCompletionRate = progressStats.length
      ? progressStats.reduce((sum, p) => sum + p.avgPercentage, 0) / progressStats.length
      : 0;

    let mostPopularCourse = null;
    for (const course of courses) {
      const stats = enrollmentsByCourse.get(course._id.toString());
      if (stats && (!mostPopularCourse || stats.count > mostPopularCourse.enrollments)) {
        mostPopularCourse = { title: course.title, enrollments: stats.count };
      }
    }

    res.json({
      totalCourses,
      totalStudents,
      totalEnrollments,
      coursesWithoutModules,
      avgCompletionRate: Math.round(avgCompletionRate),
      mostPopularCourse,
    });
  } catch (err) {
    next(err);
  }
}

async function adminCourses(req, res, next) {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) filter.title = { $regex: search, $options: 'i' };
    if (category) filter.category = category;

    const [courses, progressStats] = await Promise.all([
      Course.find(filter).select('title category thumbnail modules createdAt').sort({ createdAt: -1 }),
      Progress.aggregate([{ $group: { _id: '$course', count: { $sum: 1 } } }]),
    ]);

    const enrollmentsByCourse = new Map(progressStats.map((p) => [p._id.toString(), p.count]));

    const result = courses.map((course) => {
      const lessonsCount = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      return {
        _id: course._id,
        title: course.title,
        category: course.category,
        thumbnail: course.thumbnail,
        createdAt: course.createdAt,
        modulesCount: course.modules.length,
        lessonsCount,
        enrollments: enrollmentsByCourse.get(course._id.toString()) ?? 0,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function adminStudents(req, res, next) {
  try {
    const { search } = req.query;
    const filter = { role: 'aluno' };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const [students, progressStats] = await Promise.all([
      User.find(filter).select('name email createdAt').sort({ createdAt: -1 }),
      Progress.aggregate([
        { $group: { _id: '$student', count: { $sum: 1 }, avgPercentage: { $avg: '$percentage' } } },
      ]),
    ]);

    const statsByStudent = new Map(
      progressStats.map((p) => [p._id.toString(), { count: p.count, avgPercentage: p.avgPercentage }])
    );

    const result = students.map((student) => {
      const stats = statsByStudent.get(student._id.toString());
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        createdAt: student.createdAt,
        enrolledCourses: stats?.count ?? 0,
        avgProgress: stats ? Math.round(stats.avgPercentage) : 0,
      };
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { studentDashboard, adminDashboard, adminCourses, adminStudents };
