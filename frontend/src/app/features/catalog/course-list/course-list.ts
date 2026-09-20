import { Component, OnInit, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../../../core/services/course.service';
import { CourseSummary } from '../../../core/models/course.model';

@Component({
  selector: 'app-course-list',
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './course-list.html',
  styleUrl: './course-list.scss',
})
export class CourseList implements OnInit {
  private readonly courseService = inject(CourseService);

  readonly search = new FormControl('', { nonNullable: true });
  readonly categoryFilter = new FormControl<string | null>(null);
  readonly categories = signal<string[]>([]);
  readonly courses = signal<CourseSummary[]>([]);
  readonly loading = signal(true);

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
    this.courseService
      .list({
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
}
