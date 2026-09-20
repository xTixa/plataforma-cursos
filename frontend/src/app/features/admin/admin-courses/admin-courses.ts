import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CourseService } from '../../../core/services/course.service';
import { DashboardService, AdminCourseRow } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-courses',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    RouterLink,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-courses.html',
  styleUrl: './admin-courses.scss',
})
export class AdminCourses implements OnInit {
  private readonly dashboardService = inject(DashboardService);
  private readonly courseService = inject(CourseService);
  private readonly snackBar = inject(MatSnackBar);

  readonly search = new FormControl('', { nonNullable: true });
  readonly categoryFilter = new FormControl<string | null>(null);
  readonly categories = signal<string[]>([]);
  readonly courses = signal<AdminCourseRow[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = [
    'title',
    'category',
    'modules',
    'enrollments',
    'createdAt',
    'actions',
  ];

  ngOnInit(): void {
    this.courseService.getCategories().subscribe({
      next: (categories) => this.categories.set(categories),
    });

    this.fetchCourses();

    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.fetchCourses());

    this.categoryFilter.valueChanges.subscribe(() => this.fetchCourses());
  }

  private fetchCourses(): void {
    this.loading.set(true);
    this.dashboardService
      .getAdminCourses({
        search: this.search.value,
        category: this.categoryFilter.value ?? undefined,
      })
      .subscribe({
        next: (courses) => {
          this.courses.set(courses);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
  }

  deleteCourse(course: AdminCourseRow): void {
    if (!confirm(`Eliminar o curso "${course.title}"? Esta ação não pode ser desfeita.`)) return;

    this.courseService.delete(course._id).subscribe({
      next: () => {
        this.snackBar.open('Curso eliminado', 'Fechar', { duration: 3000 });
        this.fetchCourses();
      },
      error: (err) => {
        this.snackBar.open(err.error?.error ?? 'Erro ao eliminar o curso', 'Fechar', {
          duration: 3000,
        });
      },
    });
  }
}
