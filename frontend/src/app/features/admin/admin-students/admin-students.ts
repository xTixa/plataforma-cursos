import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DashboardService, AdminStudentRow } from '../../../core/services/dashboard.service';

@Component({
  selector: 'app-admin-students',
  imports: [
    DatePipe,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin-students.html',
  styleUrl: './admin-students.scss',
})
export class AdminStudents implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  readonly search = new FormControl('', { nonNullable: true });
  readonly students = signal<AdminStudentRow[]>([]);
  readonly loading = signal(true);

  readonly displayedColumns = ['name', 'email', 'enrolledCourses', 'avgProgress', 'createdAt'];

  ngOnInit(): void {
    this.fetchStudents();

    this.search.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => this.fetchStudents());
  }

  private fetchStudents(): void {
    this.loading.set(true);
    this.dashboardService.getAdminStudents({ search: this.search.value }).subscribe({
      next: (students) => {
        this.students.set(students);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
