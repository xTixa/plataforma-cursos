import { Component, OnInit, computed, inject, input, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';
import { ProgressService } from '../../../core/services/progress.service';
import { Course, CourseModule, Lesson } from '../../../core/models/course.model';
import { Progress } from '../../../core/models/progress.model';

@Component({
  selector: 'app-lesson-viewer',
  imports: [RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './lesson-viewer.html',
  styleUrl: './lesson-viewer.scss',
})
export class LessonViewer implements OnInit {
  readonly id = input.required<string>();
  readonly lessonId = input.required<string>();

  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);
  private readonly progressService = inject(ProgressService);
  private readonly snackBar = inject(MatSnackBar);

  readonly course = signal<Course | null>(null);
  readonly progress = signal<Progress | null>(null);
  readonly loading = signal(true);
  readonly completing = signal(false);

  readonly currentModule = computed<CourseModule | null>(() => {
    const moduleId = this.route.snapshot.queryParamMap.get('module');
    return this.course()?.modules.find((m) => m._id === moduleId) ?? null;
  });

  readonly currentLesson = computed<Lesson | null>(() => {
    return this.currentModule()?.lessons.find((l) => l._id === this.lessonId()) ?? null;
  });

  readonly isCompleted = computed(() => {
    return this.progress()?.completedLessons.includes(this.lessonId()) ?? false;
  });

  ngOnInit(): void {
    this.courseService.getById(this.id()).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.progressService.getCourseProgress(this.id()).subscribe({
      next: (progress) => this.progress.set(progress),
    });
  }

  markAsCompleted(): void {
    this.completing.set(true);
    this.progressService.completeLesson(this.id(), this.lessonId()).subscribe({
      next: (progress) => {
        this.progress.set(progress);
        this.completing.set(false);
        this.snackBar.open('Aula marcada como concluída', 'Fechar', { duration: 3000 });
      },
      error: () => {
        this.completing.set(false);
        this.snackBar.open('Não foi possível atualizar o progresso', 'Fechar', { duration: 3000 });
      },
    });
  }
}
