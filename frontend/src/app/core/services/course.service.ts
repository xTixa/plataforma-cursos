import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Course,
  CourseModule,
  CoursePayload,
  CourseSummary,
  Lesson,
  LessonPayload,
  ModulePayload,
} from '../models/course.model';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly apiUrl = `${environment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  list(params?: { search?: string; category?: string }): Observable<CourseSummary[]> {
    let httpParams = new HttpParams();
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.category) httpParams = httpParams.set('category', params.category);

    return this.http.get<CourseSummary[]>(this.apiUrl, { params: httpParams });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`);
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

  addModule(courseId: string, payload: ModulePayload): Observable<CourseModule> {
    return this.http.post<CourseModule>(`${this.apiUrl}/${courseId}/modules`, payload);
  }

  updateModule(
    courseId: string,
    moduleId: string,
    payload: { title: string }
  ): Observable<CourseModule> {
    return this.http.put<CourseModule>(`${this.apiUrl}/${courseId}/modules/${moduleId}`, payload);
  }

  deleteModule(courseId: string, moduleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${courseId}/modules/${moduleId}`);
  }

  reorderModules(courseId: string, moduleIds: string[]): Observable<CourseModule[]> {
    return this.http.patch<CourseModule[]>(`${this.apiUrl}/${courseId}/modules/reorder`, {
      moduleIds,
    });
  }

  addLesson(courseId: string, moduleId: string, payload: LessonPayload): Observable<Lesson> {
    return this.http.post<Lesson>(
      `${this.apiUrl}/${courseId}/modules/${moduleId}/lessons`,
      this.lessonToFormData(payload)
    );
  }

  updateLesson(
    courseId: string,
    moduleId: string,
    lessonId: string,
    payload: LessonPayload
  ): Observable<Lesson> {
    return this.http.put<Lesson>(
      `${this.apiUrl}/${courseId}/modules/${moduleId}/lessons/${lessonId}`,
      this.lessonToFormData(payload)
    );
  }

  deleteLesson(courseId: string, moduleId: string, lessonId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${courseId}/modules/${moduleId}/lessons/${lessonId}`
    );
  }

  reorderLessons(courseId: string, moduleId: string, lessonIds: string[]): Observable<Lesson[]> {
    return this.http.patch<Lesson[]>(
      `${this.apiUrl}/${courseId}/modules/${moduleId}/lessons/reorder`,
      { lessonIds }
    );
  }

  private lessonToFormData(payload: LessonPayload): FormData {
    const formData = new FormData();
    formData.append('title', payload.title);
    formData.append('order', String(payload.order));
    if (payload.duration !== undefined) formData.append('duration', String(payload.duration));
    if (payload.video) formData.append('video', payload.video);
    if (payload.pdf) formData.append('pdf', payload.pdf);
    return formData;
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
