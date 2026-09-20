import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      {
        path: 'auth/login',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
      },
      {
        path: 'auth/register',
        canActivate: [guestGuard],
        loadComponent: () => import('./features/auth/register/register').then((m) => m.Register),
      },
      {
        path: 'courses',
        loadComponent: () =>
          import('./features/catalog/course-list/course-list').then((m) => m.CourseList),
      },
      {
        path: 'courses/:id',
        loadComponent: () =>
          import('./features/catalog/course-detail/course-detail').then((m) => m.CourseDetail),
      },
      {
        path: 'courses/:id/lessons/:lessonId',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/lesson/lesson-viewer/lesson-viewer').then((m) => m.LessonViewer),
      },
      {
        path: 'dashboard',
        canActivate: [authGuard],
        loadComponent: () =>
          import('./features/dashboard/student-dashboard/student-dashboard').then(
            (m) => m.StudentDashboard
          ),
      },
      {
        path: 'admin/dashboard',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/dashboard/admin-dashboard/admin-dashboard').then(
            (m) => m.AdminDashboard
          ),
      },
      {
        path: 'admin/courses',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-courses/admin-courses').then((m) => m.AdminCourses),
      },
      {
        path: 'admin/students',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/admin-students/admin-students').then((m) => m.AdminStudents),
      },
      {
        path: 'admin/courses/new',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/course-form/course-form').then((m) => m.CourseForm),
      },
      {
        path: 'admin/courses/:id/edit',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/course-form/course-form').then((m) => m.CourseForm),
      },
      {
        path: 'admin/courses/:id/manage',
        canActivate: [adminGuard],
        loadComponent: () =>
          import('./features/admin/course-manage/course-manage').then((m) => m.CourseManage),
      },
      {
        path: '**',
        loadComponent: () =>
          import('./shared/components/not-found/not-found').then((m) => m.NotFound),
      },
    ],
  },
];
