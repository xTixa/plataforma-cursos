import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { CourseService } from '../../../core/services/course.service';
import { ProgressService } from '../../../core/services/progress.service';
import { AuthService } from '../../../core/services/auth.service';
import { Course } from '../../../core/models/course.model';
import { Progress } from '../../../core/models/progress.model';

@Component({
  selector: 'app-course-detail',
  imports: [
    RouterLink,
    MatExpansionModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatListModule,
  ],
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss',
})
export class CourseDetail implements OnInit {
  readonly id = input.required<string>();

  private readonly courseService = inject(CourseService);
  private readonly progressService = inject(ProgressService);
  protected readonly auth = inject(AuthService);

  readonly course = signal<Course | null>(null);
  readonly progress = signal<Progress | null>(null);
  readonly loading = signal(true);

  ngOnInit(): void {
    this.courseService.getById(this.id()).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    if (this.auth.isAuthenticated() && !this.auth.isAdmin()) {
      this.progressService.getCourseProgress(this.id()).subscribe({
        next: (progress) => this.progress.set(progress),
      });
    }
  }

  isLessonCompleted(lessonId: string): boolean {
    return this.progress()?.completedLessons.includes(lessonId) ?? false;
  }
}
