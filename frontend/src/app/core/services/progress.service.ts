import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MyProgressEntry, Progress } from '../models/progress.model';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCourseProgress(courseId: string): Observable<Progress> {
    return this.http.get<Progress>(`${this.apiUrl}/courses/${courseId}/progress`);
  }

  completeLesson(courseId: string, lessonId: string): Observable<Progress> {
    return this.http.post<Progress>(
      `${this.apiUrl}/courses/${courseId}/progress/lessons/${lessonId}/complete`,
      {}
    );
  }

  getMyProgress(): Observable<MyProgressEntry[]> {
    return this.http.get<MyProgressEntry[]>(`${this.apiUrl}/progress/me`);
  }
}
