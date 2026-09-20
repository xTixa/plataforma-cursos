import { HttpClient } from '@angular/common/http';
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
}
