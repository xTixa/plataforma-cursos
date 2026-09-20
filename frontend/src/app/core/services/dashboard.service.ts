import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface StudentDashboard {
  enrolledCourses: number;
  courses: {
    course: { _id: string; title: string; thumbnail: string | null; category: string };
    percentage: number;
    completedLessons: number;
  }[];
}

export interface AdminDashboard {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  coursesWithoutModules: number;
  avgCompletionRate: number;
  mostPopularCourse: { title: string; enrollments: number } | null;
}

export interface AdminCourseRow {
  _id: string;
  title: string;
  category: string;
  thumbnail: string | null;
  createdAt: string;
  modulesCount: number;
  lessonsCount: number;
  enrollments: number;
}

export interface AdminStudentRow {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  enrolledCourses: number;
  avgProgress: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apiUrl = `${environment.apiUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getStudentDashboard(): Observable<StudentDashboard> {
    return this.http.get<StudentDashboard>(`${this.apiUrl}/student`);
  }

  getAdminDashboard(): Observable<AdminDashboard> {
    return this.http.get<AdminDashboard>(`${this.apiUrl}/admin`);
  }

  getAdminCourses(params?: { search?: string; category?: string }): Observable<AdminCourseRow[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.category) httpParams = httpParams.set('category', params.category);

    return this.http.get<AdminCourseRow[]>(`${this.apiUrl}/admin/courses`, { params: httpParams });
  }

  getAdminStudents(params?: { search?: string }): Observable<AdminStudentRow[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);

    return this.http.get<AdminStudentRow[]>(`${this.apiUrl}/admin/students`, { params: httpParams });
  }
}
