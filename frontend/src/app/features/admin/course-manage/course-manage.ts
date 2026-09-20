import { Component, OnInit, inject, input, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';
import { Course } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-manage',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatListModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './course-manage.html',
  styleUrl: './course-manage.scss',
})
export class CourseManage implements OnInit {
  readonly id = input.required<string>();

  private readonly fb = inject(FormBuilder);
  private readonly courseService = inject(CourseService);
  private readonly snackBar = inject(MatSnackBar);

  readonly course = signal<Course | null>(null);
  readonly loading = signal(true);
  readonly savingModule = signal(false);
  readonly savingLessonFor = signal<string | null>(null);

  readonly moduleForm = this.fb.nonNullable.group({
    title: ['', [Validators.required]],
    order: [0, [Validators.required, Validators.min(0)]],
  });

  readonly lessonForms = new Map<string, ReturnType<CourseManage['createLessonForm']>>();
  readonly lessonFiles = new Map<string, { video: File | null; pdf: File | null }>();

  ngOnInit(): void {
    this.loadCourse();
  }

  private loadCourse(): void {
    this.loading.set(true);
    this.courseService.getById(this.id()).subscribe({
      next: (course) => {
        this.course.set(course);
        this.ensureLessonForms(course);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private createLessonForm() {
    return this.fb.nonNullable.group({
      title: ['', [Validators.required]],
      order: [0, [Validators.required, Validators.min(0)]],
      duration: [0],
    });
  }

  private ensureLessonForms(course: Course): void {
    for (const module of course.modules) {
      if (!this.lessonForms.has(module._id)) {
        this.lessonForms.set(module._id, this.createLessonForm());
        this.lessonFiles.set(module._id, { video: null, pdf: null });
      }
    }
  }

  getLessonForm(moduleId: string) {
    return this.lessonForms.get(moduleId)!;
  }

  onVideoSelected(moduleId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = this.lessonFiles.get(moduleId)!;
    files.video = target.files?.[0] ?? null;
  }

  onPdfSelected(moduleId: string, event: Event): void {
    const target = event.target as HTMLInputElement;
    const files = this.lessonFiles.get(moduleId)!;
    files.pdf = target.files?.[0] ?? null;
  }

  addModule(): void {
    if (this.moduleForm.invalid) {
      this.moduleForm.markAllAsTouched();
      return;
    }

    this.savingModule.set(true);
    this.courseService.addModule(this.id(), this.moduleForm.getRawValue()).subscribe({
      next: () => {
        this.savingModule.set(false);
        this.moduleForm.reset({ title: '', order: 0 });
        this.snackBar.open('Módulo adicionado', 'Fechar', { duration: 3000 });
        this.loadCourse();
      },
      error: (err) => {
        this.savingModule.set(false);
        this.snackBar.open(err.error?.error ?? 'Erro ao adicionar módulo', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  deleteModule(moduleId: string): void {
    if (!confirm('Eliminar este módulo e todas as suas aulas?')) return;

    this.courseService.deleteModule(this.id(), moduleId).subscribe({
      next: () => {
        this.snackBar.open('Módulo eliminado', 'Fechar', { duration: 3000 });
        this.loadCourse();
      },
      error: (err) => {
        this.snackBar.open(err.error?.error ?? 'Erro ao eliminar módulo', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  addLesson(moduleId: string): void {
    const form = this.getLessonForm(moduleId);
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.savingLessonFor.set(moduleId);
    const files = this.lessonFiles.get(moduleId)!;
    const payload = { ...form.getRawValue(), video: files.video, pdf: files.pdf };

    this.courseService.addLesson(this.id(), moduleId, payload).subscribe({
      next: () => {
        this.savingLessonFor.set(null);
        form.reset({ title: '', order: 0, duration: 0 });
        this.lessonFiles.set(moduleId, { video: null, pdf: null });
        this.snackBar.open('Aula adicionada', 'Fechar', { duration: 3000 });
        this.loadCourse();
      },
      error: (err) => {
        this.savingLessonFor.set(null);
        this.snackBar.open(err.error?.error ?? 'Erro ao adicionar aula', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }

  deleteLesson(moduleId: string, lessonId: string): void {
    if (!confirm('Eliminar esta aula?')) return;

    this.courseService.deleteLesson(this.id(), moduleId, lessonId).subscribe({
      next: () => {
        this.snackBar.open('Aula eliminada', 'Fechar', { duration: 3000 });
        this.loadCourse();
      },
      error: (err) => {
        this.snackBar.open(err.error?.error ?? 'Erro ao eliminar aula', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
