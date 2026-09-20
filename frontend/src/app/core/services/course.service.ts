import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Course, CoursePayload, CourseSummary, LessonPayload, ModulePayload } from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  list(params?: { search?: string; category?: string }): Observable<CourseSummary[]> {
    return this.http.get<CourseSummary[]>(this.apiUrl, { params: { ...params } });
  }

  getById(id: string): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/${id}`);
  }

  create(payload: CoursePayload): Observable<Course> {
    return this.http.post<Course>(this.apiUrl, this.toFormData(payload));
  }

  update(id: string, payload: CoursePayload): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/${id}`, this.toFormData(payload));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  addModule(courseId: string, payload: ModulePayload): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${courseId}/modules`, payload);
  }

  deleteModule(courseId: string, moduleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}/modules/${moduleId}`);
  }

  addLesson(courseId: string, moduleId: string, payload: LessonPayload): Observable<unknown> {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('order', String(payload.order));
    if (payload.duration !== undefined) formData.append('duration', String(payload.duration));
    if (payload.video) formData.append('video', payload.video);
    if (payload.pdf) formData.append('pdf', payload.pdf);

    return this.http.post(`${this.apiUrl}/${courseId}/modules/${moduleId}/lessons`, formData);
  }

  deleteLesson(courseId: string, moduleId: string, lessonId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${courseId}/modules/${moduleId}/lessons/${lessonId}`
    );
  }

  private toFormData(payload: CoursePayload): FormData {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('description', payload.description);
    formData.append('category', payload.category);
    if (payload.thumbnail) formData.append('thumbnail', payload.thumbnail);
    return formData;
  }
}
