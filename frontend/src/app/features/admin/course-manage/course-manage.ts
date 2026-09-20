import { Component, OnInit, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';
import { Course, CourseModule as CourseModuleType, Lesson } from '../../../core/models/course.model';
import { ModuleDialog, ModuleDialogData, ModuleDialogResult } from './module-dialog/module-dialog';
import { LessonDialog, LessonDialogData, LessonDialogResult } from './lesson-dialog/lesson-dialog';

@Component({
  selector: 'app-course-manage',
  imports: [
    RouterLink,
    DragDropModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './course-manage.html',
  styleUrl: './course-manage.scss',
})
export class CourseManage implements OnInit {
  readonly id = input.required<string>();

  private readonly courseService = inject(CourseService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly course = signal<Course | null>(null);
  readonly loading = signal(true);
  readonly reordering = signal(false);

  ngOnInit(): void {
    this.loadCourse();
  }

  private loadCourse(): void {
    this.loading.set(true);
    this.courseService.getById(this.id()).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  private notifyError(err: unknown, fallback: string): void {
    const message =
      err && typeof err === 'object' && 'error' in err
        ? (err as { error?: { error?: string } }).error?.error
        : undefined;
    this.snackBar.open(message ?? fallback, 'Fechar', { duration: 3000 });
  }

  openModuleDialog(module: CourseModuleType | null): void {
    const ref = this.dialog.open<ModuleDialog, ModuleDialogData, ModuleDialogResult>(ModuleDialog, {
      data: { module },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const request = module
        ? this.courseService.updateModule(this.id(), module._id, result)
        : this.courseService.addModule(this.id(), {
            title: result.title,
            order: this.course()?.modules.length ?? 0,
          });

      request.subscribe({
        next: () => {
          this.snackBar.open(module ? 'Módulo atualizado' : 'Módulo adicionado', 'Fechar', {
            duration: 3000,
          });
          this.loadCourse();
        },
        error: (err) => this.notifyError(err, 'Erro ao guardar o módulo'),
      });
    });
  }

  deleteModule(module: CourseModuleType): void {
    if (!confirm(`Eliminar o módulo "${module.title}" e todas as suas aulas?`)) return;

    this.courseService.deleteModule(this.id(), module._id).subscribe({
      next: () => {
        this.snackBar.open('Módulo eliminado', 'Fechar', { duration: 3000 });
        this.loadCourse();
      },
      error: (err) => this.notifyError(err, 'Erro ao eliminar o módulo'),
    });
  }

  dropModule(event: CdkDragDrop<CourseModuleType[]>): void {
    const course = this.course();
    if (!course || event.previousIndex === event.currentIndex) return;

    const modules = [...course.modules];
    moveItemInArray(modules, event.previousIndex, event.currentIndex);
    this.course.set({ ...course, modules });

    this.reordering.set(true);
    this.courseService.reorderModules(this.id(), modules.map((m) => m._id)).subscribe({
      next: () => this.reordering.set(false),
      error: (err) => {
        this.reordering.set(false);
        this.notifyError(err, 'Erro ao reordenar módulos');
        this.loadCourse();
      },
    });
  }

  openLessonDialog(module: CourseModuleType, lesson: Lesson | null): void {
    const ref = this.dialog.open<LessonDialog, LessonDialogData, LessonDialogResult>(LessonDialog, {
      data: { lesson },
    });

    ref.afterClosed().subscribe((result) => {
      if (!result) return;

      const payload = {
        title: result.title,
        duration: result.duration,
        order: lesson?.order ?? module.lessons.length,
        video: result.video,
        pdf: result.pdf,
      };

      const request = lesson
        ? this.courseService.updateLesson(this.id(), module._id, lesson._id, payload)
        : this.courseService.addLesson(this.id(), module._id, payload);

      request.subscribe({
        next: () => {
          this.snackBar.open(lesson ? 'Aula atualizada' : 'Aula adicionada', 'Fechar', {
            duration: 3000,
          });
          this.loadCourse();
        },
        error: (err) => this.notifyError(err, 'Erro ao guardar a aula'),
      });
    });
  }

  deleteLesson(module: CourseModuleType, lesson: Lesson): void {
    if (!confirm(`Eliminar a aula "${lesson.title}"?`)) return;

    this.courseService.deleteLesson(this.id(), module._id, lesson._id).subscribe({
      next: () => {
        this.snackBar.open('Aula eliminada', 'Fechar', { duration: 3000 });
        this.loadCourse();
      },
      error: (err) => this.notifyError(err, 'Erro ao eliminar a aula'),
    });
  }

  dropLesson(module: CourseModuleType, event: CdkDragDrop<Lesson[]>): void {
    const course = this.course();
    if (!course || event.previousIndex === event.currentIndex) return;

    const lessons = [...module.lessons];
    moveItemInArray(lessons, event.previousIndex, event.currentIndex);

    const modules = course.modules.map((m) => (m._id === module._id ? { ...m, lessons } : m));
    this.course.set({ ...course, modules });

    this.reordering.set(true);
    this.courseService
      .reorderLessons(this.id(), module._id, lessons.map((l) => l._id))
      .subscribe({
        next: () => this.reordering.set(false),
        error: (err) => {
          this.reordering.set(false);
          this.notifyError(err, 'Erro ao reordenar aulas');
          this.loadCourse();
        },
      });
  }
}
